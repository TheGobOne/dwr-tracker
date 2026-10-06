import { MONSTERS } from './monster-data'

const dl2 = MONSTERS.find((m) => m.name === 'Dragonlord 2')
const stat = (key: string) => dl2?.stats.find(([k]) => k === key)?.[1] ?? ''
const [hpMin, hpMax] = stat('HP Range').split('-').map(Number)
const fairyMatch = dl2?.notes.match(/Fairy Water will do (\d+)-(\d+)/)

export const DL2 = {
  hpMin: hpMin || 150,
  hpMax: hpMax || 165,
  str: Number(stat('STR')) || 140,
  agi: Number(stat('AGI')) || 200,
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
  dlFirst: boolean
  rounds: number
  hpLeft: number
  outOfHealing: boolean
  log: string[]
}

export type SimSummary = {
  trials: number
  winRate: number
  dlFirstRate: number
  winWhenFirst: number | null
  winWhenDlFirst: number | null
  avgRounds: number
  avgHpLeftOnWin: number
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
const byte = (rng: Rng) => randInt(rng, 0, 255)

export function effectiveStats(input: SimInput) {
  return {
    maxHp: Math.max(1, input.deathNecklace ? Math.floor((input.maxHp * 3) / 4) : input.maxHp),
    attack: input.attack + (input.deathNecklace ? DEATH_NECKLACE_AP : 0),
  }
}

export function dl2AmbushChance(agility: number) {
  return Math.min(1, 50 / Math.max(1, agility) / 2)
}

function heroAttackDamage(rng: Rng, attack: number) {
  const base = attack - Math.floor(DL2.agi / 2)
  if (base < 1) return byte(rng) < 128 ? 0 : 1
  return Math.floor((base * (byte(rng) + 256)) / 1024)
}

function enemyAttackDamage(rng: Rng, defense: number) {
  const base = DL2.str - Math.floor(defense / 2)
  if (base < Math.floor(DL2.str / 2) + 1) return Math.floor((byte(rng) * Math.floor((DL2.str + 4) / 6)) / 256)
  return Math.floor((base * (byte(rng) + 256)) / 1024)
}

export function simulateFight(input: SimInput, rng: Rng, withLog = false): FightResult {
  const { maxHp, attack } = effectiveStats(input)
  const log: string[] = []
  const say = (line: string) => withLog && log.push(line)

  let hp = maxHp
  let mp = input.mp
  let herbs = input.herbs
  let fairy = input.fairyWater
  let dlHp = randInt(rng, DL2.hpMin, DL2.hpMax)
  let outOfHealing = false
  const fairyAvg = (DL2.fairyMin + DL2.fairyMax) / 2
  const attackAvg = (Math.max(0, attack - DL2.agi / 2) * 3) / 8

  const dlFirst =
    input.initiative === 'dlFirst' ||
    (input.initiative === 'random' && rng() < dl2AmbushChance(input.agility))

  say(`Dragonlord 2 appears with ${dlHp} HP.`)
  if (dlFirst) say('The Dragonlord moves first!')

  const dragonTurn = () => {
    if (rng() < DL2.breathChance) {
      let dmg = randInt(rng, DL2.breathMin, DL2.breathMax)
      if (input.erdrickArmor) dmg = Math.floor((dmg * 2) / 3)
      hp -= dmg
      say(`The Dragonlord breathes fire! ${dmg} damage. (HP ${Math.max(0, hp)})`)
    } else {
      const dmg = enemyAttackDamage(rng, input.defense)
      hp -= dmg
      say(`The Dragonlord attacks! ${dmg} damage. (HP ${Math.max(0, hp)})`)
    }
  }

  const heroTurn = () => {
    if (hp <= input.healAt && hp < maxHp) {
      if (mp >= HEALMORE.cost) {
        mp -= HEALMORE.cost
        const gain = Math.min(maxHp - hp, randInt(rng, HEALMORE.min, HEALMORE.max))
        hp += gain
        say(`You cast Healmore. +${gain} HP. (HP ${hp}, MP ${mp})`)
        return
      }
      if (herbs > 0) {
        herbs -= 1
        const gain = Math.min(maxHp - hp, randInt(rng, HERB.min, HERB.max))
        hp += gain
        say(`You use an Herb. +${gain} HP. (HP ${hp}, ${herbs} left)`)
        return
      }
      outOfHealing = true
    }
    if (fairy > 0 && fairyAvg > attackAvg) {
      fairy -= 1
      const dmg = randInt(rng, DL2.fairyMin, DL2.fairyMax)
      dlHp -= dmg
      say(`You throw Fairy Water. ${dmg} damage. (${fairy} left)`)
      return
    }
    const dmg = heroAttackDamage(rng, attack)
    dlHp -= dmg
    say(`You attack! ${dmg} damage.`)
  }

  let rounds = 0
  if (dlFirst) dragonTurn()
  while (hp > 0 && dlHp > 0 && rounds < MAX_ROUNDS) {
    rounds += 1
    heroTurn()
    if (dlHp <= 0) break
    dragonTurn()
  }

  const won = dlHp <= 0 && hp > 0
  say(won ? `You defeated the Dragonlord with ${hp} HP left!` : hp <= 0 ? 'Thou art dead.' : 'The fight dragged on too long.')

  return { won, dlFirst, rounds, hpLeft: Math.max(0, hp), outOfHealing, log }
}

export function runSimulation(input: SimInput, trials: number, seed: number): SimSummary {
  const rng = mulberry32(seed)
  let wins = 0
  let dlFirsts = 0
  let dlFirstWins = 0
  let roundsTotal = 0
  let hpLeftOnWin = 0
  let outOfHealing = 0

  for (let i = 0; i < trials; i++) {
    const r = simulateFight(input, rng)
    roundsTotal += r.rounds
    if (r.outOfHealing) outOfHealing += 1
    if (r.dlFirst) dlFirsts += 1
    if (r.won) {
      wins += 1
      hpLeftOnWin += r.hpLeft
      if (r.dlFirst) dlFirstWins += 1
    }
  }

  const firsts = trials - dlFirsts
  const { maxHp, attack } = effectiveStats(input)
  return {
    trials,
    winRate: wins / trials,
    dlFirstRate: dlFirsts / trials,
    winWhenFirst: firsts ? (wins - dlFirstWins) / firsts : null,
    winWhenDlFirst: dlFirsts ? dlFirstWins / dlFirsts : null,
    avgRounds: roundsTotal / trials,
    avgHpLeftOnWin: wins ? hpLeftOnWin / wins : 0,
    outOfHealingRate: outOfHealing / trials,
    effectiveMaxHp: maxHp,
    effectiveAttack: attack,
  }
}
