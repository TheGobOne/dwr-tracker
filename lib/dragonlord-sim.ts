import { MONSTERS } from './monster-data'

const monsterStat = (name: string) => {
  const m = MONSTERS.find((x) => x.name === name)
  return (key: string) => m?.stats.find(([k]) => k === key)?.[1] ?? ''
}

const dl1Stat = monsterStat('Dragonlord')
const [dl1HpMin, dl1HpMax] = dl1Stat('HP Range').split('-').map(Number)

export const DL1 = {
  hpMin: dl1HpMin || 75,
  hpMax: dl1HpMax || 100,
  str: Number(dl1Stat('STR')) || 90,
  agi: Number(dl1Stat('AGI')) || 75,
  backAttackAgi: parseInt(dl1Stat('25% Back Attack')) || 38,
  stopspellChance: 0.25,
  hurtmoreShare: 0.75,
  hurtmoreMin: 30,
  hurtmoreMax: 45,
}

const dl2 = MONSTERS.find((m) => m.name === 'Dragonlord 2')
const stat = monsterStat('Dragonlord 2')
const [hpMin, hpMax] = stat('HP Range').split('-').map(Number)
const fairyMatch = dl2?.notes.match(/Fairy Water will do (\d+)-(\d+)/)

export const DL2 = {
  hpMin: hpMin || 150,
  hpMax: hpMax || 165,
  str: Number(stat('STR')) || 140,
  agi: Number(stat('AGI')) || 200,
  backAttackAgi: parseInt(stat('25% Back Attack')) || 100,
  breathChance: 0.5,
  breathMin: 65,
  breathMax: 72,
  fairyMin: fairyMatch ? Number(fairyMatch[1]) : 9,
  fairyMax: fairyMatch ? Number(fairyMatch[2]) : 16,
}

export const HEALMORE = { cost: 8, min: 85, max: 100 }
export const HERB = { min: 23, max: 30 }
export const DEATH_NECKLACE_AP = 10
const MAX_ROUNDS = 300

export type Initiative = 'random' | 'first' | 'dlFirst'

export type SimInput = {
  maxHp: number
  /** When set, DL2 starts at exactly this HP instead of whatever DL1 left. */
  dl2Hp?: number | null
  mp: number
  attack: number
  defense: number
  agility: number
  herbs: number
  fairyWater: number
  healAt: number
  deathNecklace: boolean
  erdrickArmor: boolean
  initiative: Initiative
}

export type FightResult = {
  won: boolean
  beatDl1: boolean
  dl1First: boolean
  dlFirst: boolean
  rounds: number
  hpLeft: number
  dl1DamageTaken: number
  hpAfterDl1: number
  outOfHealing: boolean
  log: string[]
}

export type SimSummary = {
  trials: number
  winRate: number
  dl1WinRate: number
  dl1FirstRate: number
  dlFirstRate: number
  winWhenFirst: number | null
  winWhenDlFirst: number | null
  avgRounds: number
  avgHpLeftOnWin: number
  avgDl1DamageTaken: number
  avgHpAfterDl1: number
  outOfHealingRate: number
  effectiveMaxHp: number
  effectiveAttack: number
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Rng = () => number
const randInt = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))

export function effectiveStats(input: SimInput) {
  return {
    maxHp: Math.max(1, input.deathNecklace ? Math.floor(input.maxHp * 0.75) : input.maxHp),
    attack: input.attack + (input.deathNecklace ? DEATH_NECKLACE_AP : 0),
  }
}

// Scaled so the chance is 25% at the monster's listed "25% Back Attack" agility.
function ambushChance(agility: number, backAttackAgi: number) {
  return Math.min(1, (0.25 * backAttackAgi) / Math.max(1, agility))
}

export function dl2AmbushChance(agility: number) {
  return ambushChance(agility, DL2.backAttackAgi)
}

export function heroDamageRange(attack: number, enemyAgi = DL2.agi) {
  const base = attack - enemyAgi / 2
  return { min: Math.max(0, Math.floor(base / 4)), max: Math.max(1, Math.floor(base / 2)) }
}

export function enemyDamageRange(defense: number, enemyStr = DL2.str) {
  const base = enemyStr - defense / 2
  return { min: Math.max(0, Math.floor(base / 4)), max: Math.max(1, Math.floor(base / 2)) }
}

// Erdrick's Armor cuts Hurtmore damage by a third.
function hurtmoreRange(erdrickArmor: boolean) {
  return erdrickArmor
    ? { min: Math.floor((DL1.hurtmoreMin * 2) / 3), max: Math.floor((DL1.hurtmoreMax * 2) / 3) }
    : { min: DL1.hurtmoreMin, max: DL1.hurtmoreMax }
}

// Weighted 1:3:3:1 to favor the middle values, matching dwrguide.com/dragonlordfight.
const ARMORED_BREATH = [42, 44, 44, 44, 46, 46, 46, 48]

function breathDamage(rng: Rng, erdrickArmor: boolean) {
  if (erdrickArmor) return ARMORED_BREATH[randInt(rng, 0, ARMORED_BREATH.length - 1)]
  return randInt(rng, DL2.breathMin, DL2.breathMax)
}

export function simulateFight(input: SimInput, rng: Rng, withLog = false): FightResult {
  const { maxHp: dl2MaxHp, attack } = effectiveStats(input)
  const log: string[] = []
  const say = (line: string) => withLog && log.push(line)

  // The Death Necklace's max HP penalty doesn't apply until DL1 dies, so DL1 is fought at full max HP.
  let maxHp = Math.max(1, input.maxHp)
  let hp = maxHp
  let mp = input.mp
  let herbs = input.herbs
  let fairy = input.fairyWater
  let outOfHealing = false

  const heal = () => {
    if (mp >= HEALMORE.cost) {
      mp -= HEALMORE.cost
      const gain = Math.max(0, Math.min(maxHp - hp, randInt(rng, HEALMORE.min, HEALMORE.max)))
      hp += gain
      say(`You cast Healmore. +${gain} HP. (HP ${hp}, MP ${mp})`)
      return true
    }
    if (herbs > 0) {
      herbs -= 1
      const gain = Math.max(0, Math.min(maxHp - hp, randInt(rng, HERB.min, HERB.max)))
      hp += gain
      say(`You use an Herb. +${gain} HP. (HP ${hp}, ${herbs} left)`)
      return true
    }
    outOfHealing = true
    return false
  }

  let rounds = 0

  // Dragonlord 1: no dodge, no crits. 25% Stopspell (harmless), else 75% Hurtmore / 25% attack.
  let dl1Hp = randInt(rng, DL1.hpMin, DL1.hpMax)
  const dl1Hero = heroDamageRange(attack, DL1.agi)
  const dl1Melee = enemyDamageRange(input.defense, DL1.str)
  const dl1Hurtmore = hurtmoreRange(input.erdrickArmor)
  const dl1MaxHit = Math.max(dl1Melee.max, dl1Hurtmore.max)
  const dl1First = rng() < ambushChance(input.agility, DL1.backAttackAgi)
  let dl1DamageTaken = 0

  say(`The Dragonlord appears with ${dl1Hp} HP.`)
  if (dl1First) say('The Dragonlord moves first!')

  const dl1Turn = () => {
    const roll = rng()
    if (roll < DL1.stopspellChance) {
      say('The Dragonlord casts Stopspell. Nothing happens.')
      return
    }
    const hurtmore = rng() < DL1.hurtmoreShare
    const dmg = hurtmore
      ? randInt(rng, dl1Hurtmore.min, dl1Hurtmore.max)
      : randInt(rng, dl1Melee.min, dl1Melee.max)
    hp -= dmg
    dl1DamageTaken += dmg
    say(`The Dragonlord ${hurtmore ? 'casts Hurtmore' : 'attacks'}! ${dmg} damage. (HP ${Math.max(0, hp)})`)
  }

  const dl1HeroTurn = () => {
    if (hp <= dl1MaxHit && heal()) return
    const dmg = randInt(rng, dl1Hero.min, dl1Hero.max)
    dl1Hp -= dmg
    say(`You attack! ${dmg} damage.`)
  }

  if (dl1First) dl1Turn()
  while (hp > 0 && dl1Hp > 0 && rounds < MAX_ROUNDS) {
    rounds += 1
    dl1HeroTurn()
    if (dl1Hp <= 0) break
    dl1Turn()
  }

  const beatDl1 = dl1Hp <= 0 && hp > 0
  if (!beatDl1) {
    say(hp <= 0 ? 'Thou art dead.' : 'The fight dragged on too long.')
    const hpLeft = Math.max(0, hp)
    return { won: false, beatDl1, dl1First, dlFirst: false, rounds, hpLeft, dl1DamageTaken, hpAfterDl1: hpLeft, outOfHealing, log }
  }
  if (dl2MaxHp < maxHp) {
    // Current HP isn't clamped: any HP above the new max carries into DL2 until it drops below.
    maxHp = dl2MaxHp
    say(`The Death Necklace's curse takes hold. Max HP drops to ${maxHp}. (HP ${hp}/${maxHp})`)
  }
  if (input.dl2Hp != null) {
    hp = Math.max(1, input.dl2Hp)
    say(`Entering DL2 with your entered HP. (HP ${hp}/${maxHp})`)
  }
  const hpAfterDl1 = hp

  let dlHp = randInt(rng, DL2.hpMin, DL2.hpMax)
  const hero = heroDamageRange(attack)
  const enemy = enemyDamageRange(input.defense)
  const throwFairy = hero.max <= DL2.fairyMax

  const dlFirst =
    input.initiative === 'dlFirst' ||
    (input.initiative === 'random' && rng() < dl2AmbushChance(input.agility))

  say(`The Dragonlord reveals his true form! Dragonlord 2 has ${dlHp} HP. (You: HP ${hp}, MP ${mp})`)
  if (dlFirst) say('The Dragonlord moves first!')

  const dragonTurn = () => {
    if (rng() < DL2.breathChance) {
      const dmg = breathDamage(rng, input.erdrickArmor)
      hp -= dmg
      say(`The Dragonlord breathes fire! ${dmg} damage. (HP ${Math.max(0, hp)})`)
    } else {
      const dmg = randInt(rng, enemy.min, enemy.max)
      hp -= dmg
      say(`The Dragonlord attacks! ${dmg} damage. (HP ${Math.max(0, hp)})`)
    }
  }

  const heroTurn = () => {
    if ((hp <= input.healAt || hp < enemy.max) && heal()) return
    if (fairy > 0 && throwFairy) {
      fairy -= 1
      const dmg = randInt(rng, DL2.fairyMin, DL2.fairyMax)
      dlHp -= dmg
      say(`You throw Fairy Water. ${dmg} damage. (${fairy} left)`)
      return
    }
    const dmg = randInt(rng, hero.min, hero.max)
    dlHp -= dmg
    say(`You attack! ${dmg} damage.`)
  }

  if (dlFirst) dragonTurn()
  while (hp > 0 && dlHp > 0 && rounds < MAX_ROUNDS) {
    rounds += 1
    heroTurn()
    if (dlHp <= 0) break
    dragonTurn()
  }

  const won = dlHp <= 0 && hp > 0
  say(won ? `You defeated the Dragonlord with ${hp} HP left!` : hp <= 0 ? 'Thou art dead.' : 'The fight dragged on too long.')

  return { won, beatDl1, dl1First, dlFirst, rounds, hpLeft: Math.max(0, hp), dl1DamageTaken, hpAfterDl1, outOfHealing, log }
}

export function runSimulation(input: SimInput, trials: number, seed: number): SimSummary {
  const rng = mulberry32(seed)
  let wins = 0
  let dl1Wins = 0
  let dl1Firsts = 0
  let dlFirsts = 0
  let dlFirstWins = 0
  let roundsTotal = 0
  let hpLeftOnWin = 0
  let outOfHealing = 0
  let dl1DamageTotal = 0
  let hpAfterDl1Total = 0

  for (let i = 0; i < trials; i++) {
    const r = simulateFight(input, rng)
    roundsTotal += r.rounds
    dl1DamageTotal += r.dl1DamageTaken
    if (r.outOfHealing) outOfHealing += 1
    if (r.dl1First) dl1Firsts += 1
    if (r.beatDl1) {
      dl1Wins += 1
      hpAfterDl1Total += r.hpAfterDl1
    }
    if (r.dlFirst) dlFirsts += 1
    if (r.won) {
      wins += 1
      hpLeftOnWin += r.hpLeft
      if (r.dlFirst) dlFirstWins += 1
    }
  }

  // DL2 stats are measured only over fights that reached DL2.
  const firsts = dl1Wins - dlFirsts
  const { maxHp, attack } = effectiveStats(input)
  return {
    trials,
    winRate: wins / trials,
    dl1WinRate: dl1Wins / trials,
    dl1FirstRate: ambushChance(input.agility, DL1.backAttackAgi),
    dlFirstRate: dl2AmbushChance(input.agility),
    winWhenFirst: firsts ? (wins - dlFirstWins) / firsts : null,
    winWhenDlFirst: dlFirsts ? dlFirstWins / dlFirsts : null,
    avgRounds: roundsTotal / trials,
    avgHpLeftOnWin: wins ? hpLeftOnWin / wins : 0,
    avgDl1DamageTaken: dl1DamageTotal / trials,
    avgHpAfterDl1: dl1Wins ? hpAfterDl1Total / dl1Wins : 0,
    outOfHealingRate: outOfHealing / trials,
    effectiveMaxHp: maxHp,
    effectiveAttack: attack,
  }
}
