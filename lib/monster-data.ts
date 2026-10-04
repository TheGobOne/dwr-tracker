// Source: https://docs.google.com/spreadsheets/d/1OteX_JIR8e7o2QexuIA_bwI1Bk_JAFP0NX6092aUqDg

export type Monster = { name: string; stats: [string, string][]; notes: string }

export const MONSTERS: Monster[] = [
  {
    "name": "Slime",
    "stats": [
      [
        "HP Range",
        "2"
      ],
      [
        "STR",
        "5"
      ],
      [
        "AGI",
        "3"
      ],
      [
        "XP",
        "1"
      ],
      [
        "Gold",
        "2"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "10"
      ],
      [
        "Hero 50% Run",
        "N/A"
      ],
      [
        "Hero 75% Run",
        "N/A"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "100%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "0"
      ],
      [
        "3-shot",
        "4 AP"
      ],
      [
        "2-shot",
        "5-9 AP"
      ],
      [
        "1-shot",
        "9 AP"
      ],
      [
        "25% Back Attack",
        "-"
      ],
      [
        "MHP/XP Ratio",
        "2 (37 of 38)"
      ],
      [
        "Broken Cap",
        "1"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "Just kill 'em."
  },
  {
    "name": "Red Slime",
    "stats": [
      [
        "HP Range",
        "3"
      ],
      [
        "STR",
        "7"
      ],
      [
        "AGI",
        "3"
      ],
      [
        "XP",
        "2"
      ],
      [
        "Gold",
        "4"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "14"
      ],
      [
        "Hero 50% Run",
        "N/A"
      ],
      [
        "Hero 75% Run",
        "N/A"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "100%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "0"
      ],
      [
        "3-shot",
        "4-8 AP"
      ],
      [
        "2-shot",
        "9-12 AP"
      ],
      [
        "1-shot",
        "13 AP"
      ],
      [
        "25% Back Attack",
        "-"
      ],
      [
        "MHP/XP Ratio",
        "1.5 (34/38)"
      ],
      [
        "Broken Cap",
        "1"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "It’s not a guarantee to hit a Red Slime on 4 AP, but if all three swings land, the Red Slime will die 100% of the time. A Torch (6-9 dmg) will always kill a Red Slime."
  },
  {
    "name": "Drakee",
    "stats": [
      [
        "HP Range",
        "4-5"
      ],
      [
        "STR",
        "9"
      ],
      [
        "AGI",
        "6"
      ],
      [
        "XP",
        "3"
      ],
      [
        "Gold",
        "6"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "18"
      ],
      [
        "Hero 50% Run",
        "N/A"
      ],
      [
        "Hero 75% Run",
        "N/A"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "100%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "0"
      ],
      [
        "3-shot",
        "7-10 AP"
      ],
      [
        "2-shot",
        "7-15 AP"
      ],
      [
        "1-shot",
        "13-23 AP"
      ],
      [
        "25% Back Attack",
        "-"
      ],
      [
        "MHP/XP Ratio",
        "1.5 (34/38)"
      ],
      [
        "Broken Cap",
        "2"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "At 5 AP, you'll only be 33% to land one damage. One Torch will always kill a Drakee"
  },
  {
    "name": "Ghost",
    "stats": [
      [
        "HP Range",
        "6-7"
      ],
      [
        "STR",
        "11"
      ],
      [
        "AGI",
        "8"
      ],
      [
        "XP",
        "4"
      ],
      [
        "Gold",
        "8"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/16"
      ],
      [
        "25% Run STR",
        "22"
      ],
      [
        "Hero 50% Run",
        "N/A"
      ],
      [
        "Hero 75% Run",
        "4 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "100%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "0"
      ],
      [
        "3-shot",
        "8-16 AP"
      ],
      [
        "2-shot",
        "10-20 AP"
      ],
      [
        "1-shot",
        "16-32 AP"
      ],
      [
        "25% Back Attack",
        "4 AGI"
      ],
      [
        "MHP/XP Ratio",
        "1.625 (36/38)"
      ],
      [
        "Broken Cap",
        "2"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "At 6 AP, you’ll only be 33% to land one damage against a Ghost. On 8 AP, you’ll be guaranteed to land at least one damage every swing (barring dodges). Keep in mind that 1/16 evasion is rather high. A Torch (6-9 dmg) will kill a Ghost about 88% of the time."
  },
  {
    "name": "Magician",
    "stats": [
      [
        "HP Range",
        "9-12"
      ],
      [
        "STR",
        "11"
      ],
      [
        "AGI",
        "12"
      ],
      [
        "XP",
        "8"
      ],
      [
        "Gold",
        "16"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "22"
      ],
      [
        "Hero 50% Run",
        "N/A"
      ],
      [
        "Hero 75% Run",
        "6 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "81%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "40"
      ],
      [
        "Stopspell Cap",
        "1/16"
      ],
      [
        "3-shot",
        "12-22 AP"
      ],
      [
        "2-shot",
        "16-30 AP"
      ],
      [
        "1-shot",
        "24-54 AP"
      ],
      [
        "25% Back Attack",
        "6 AGI"
      ],
      [
        "MHP/XP Ratio",
        "1.313 (31/38)"
      ],
      [
        "Broken Cap",
        "2"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "At 8 AP, you’ll only be 33% to land one damage against a Magician. A single Torch will kill a Magician only 6.25% of the time, but two Torches will always kill a Magician.  Likewise, two Hurts/Fairy Waters will always kill a Magician."
  },
  {
    "name": "Magidrakee",
    "stats": [
      [
        "HP Range",
        "10-13"
      ],
      [
        "STR",
        "14"
      ],
      [
        "AGI",
        "14"
      ],
      [
        "XP",
        "12"
      ],
      [
        "Gold",
        "20"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "28"
      ],
      [
        "Hero 50% Run",
        "N/A"
      ],
      [
        "Hero 75% Run",
        "7 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "68.8%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "41"
      ],
      [
        "Stopspell Cap",
        "1/16"
      ],
      [
        "3-shot",
        "15-27 AP"
      ],
      [
        "2-shot",
        "17-35 AP"
      ],
      [
        "1-shot",
        "27-59 AP"
      ],
      [
        "25% Back Attack",
        "7 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.9583 (29/38)"
      ],
      [
        "Broken Cap",
        "3"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "At 9 AP, you’ll only be 33% to land one damage against a Magidrakee using a physical attack. A single Torch (6-9 dmg) will never kill a Magidrakee, but two Torches will kill it about 96.4% of the time."
  },
  {
    "name": "Scorpion",
    "stats": [
      [
        "HP Range",
        "10-13"
      ],
      [
        "STR",
        "18"
      ],
      [
        "AGI",
        "16"
      ],
      [
        "XP",
        "16"
      ],
      [
        "Gold",
        "25"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "36"
      ],
      [
        "Hero 50% Run",
        "4 AGI"
      ],
      [
        "Hero 75% Run",
        "8 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "68.8%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "42"
      ],
      [
        "Stopspell Cap",
        "1/16"
      ],
      [
        "3-shot",
        "16-28 AP"
      ],
      [
        "2-shot",
        "18-36 AP"
      ],
      [
        "1-shot",
        "28-60 AP"
      ],
      [
        "25% Back Attack",
        "8 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.788 (23/38)"
      ],
      [
        "Broken Cap",
        "3"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "At 10 AP, you’ll only be 33% to land one damage against a Scorpion. A single Torch (6-9 dmg) will never kill a Scorpion, but two Torches will kill it about 96.4% of the time."
  },
  {
    "name": "Druin",
    "stats": [
      [
        "HP Range",
        "17-22"
      ],
      [
        "STR",
        "20"
      ],
      [
        "AGI",
        "18"
      ],
      [
        "XP",
        "14"
      ],
      [
        "Gold",
        "21"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "40"
      ],
      [
        "Hero 50% Run",
        "~5 AGI"
      ],
      [
        "Hero 75% Run",
        "~9 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "43"
      ],
      [
        "Stopspell Cap",
        "1/16"
      ],
      [
        "3-shot",
        "21-41 AP"
      ],
      [
        "2-shot",
        "27-53 AP"
      ],
      [
        "1-shot",
        "43-97 AP"
      ],
      [
        "25% Back Attack",
        "~9 AGI"
      ],
      [
        "MHP/XP Ratio",
        "1.392 (33/38)"
      ],
      [
        "Broken Cap",
        "4"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "Neither Hurt nor Fairy Water will ever kill them in one shot, and even two are 85%."
  },
  {
    "name": "Poltergeist",
    "stats": [
      [
        "HP Range",
        "18-23"
      ],
      [
        "STR",
        "18"
      ],
      [
        "AGI",
        "20"
      ],
      [
        "XP",
        "15"
      ],
      [
        "Gold",
        "19"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "3/32"
      ],
      [
        "25% Run STR",
        "36"
      ],
      [
        "Hero 50% Run",
        "5 AGI"
      ],
      [
        "Hero 75% Run",
        "10 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "44"
      ],
      [
        "Stopspell Cap",
        "2/16"
      ],
      [
        "3-shot",
        "22-42 AP"
      ],
      [
        "2-shot",
        "28-53 AP"
      ],
      [
        "1-shot",
        "46-102 AP"
      ],
      [
        "25% Back Attack",
        "9 AGI"
      ],
      [
        "MHP/XP Ratio",
        "1.367 (32/38)"
      ],
      [
        "Broken Cap",
        "3"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "If you thought Druins were bad, Polts downright stink. Lower run threshold, third highest evasion, high HP for XP return, 75% to fall to two Hurts/Fairy Water, and they're deeply smug about it."
  },
  {
    "name": "Droll",
    "stats": [
      [
        "HP Range",
        "15-20"
      ],
      [
        "STR",
        "24"
      ],
      [
        "AGI",
        "24"
      ],
      [
        "XP",
        "18"
      ],
      [
        "Gold",
        "30"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "48"
      ],
      [
        "Hero 50% Run",
        "6 AGI"
      ],
      [
        "Hero 75% Run",
        "12 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "9%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "46"
      ],
      [
        "Stopspell Cap",
        "2/16"
      ],
      [
        "3-shot",
        "22-40 AP"
      ],
      [
        "2-shot",
        "28-52 AP"
      ],
      [
        "1-shot",
        "42-92 AP"
      ],
      [
        "25% Back Attack",
        "12 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.9722 (30/38)"
      ],
      [
        "Broken Cap",
        "4"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "Drolls can be affected by Sleep; you can kill them rarely with one Hurt/Fairy Water (9%), almost all of the time (98%) with two Hurts/Fairy Waters, and even sometimes with two torches."
  },
  {
    "name": "Drakeema",
    "stats": [
      [
        "HP Range",
        "12-16"
      ],
      [
        "STR",
        "22"
      ],
      [
        "AGI",
        "26"
      ],
      [
        "XP",
        "20"
      ],
      [
        "Gold",
        "25"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "1/8"
      ],
      [
        "Evasion",
        "3/32"
      ],
      [
        "25% Run STR",
        "44"
      ],
      [
        "Hero 50% Run",
        "~7 AGI"
      ],
      [
        "Hero 75% Run",
        "13 AGI"
      ],
      [
        "SIR",
        "30 AGI"
      ],
      [
        "Hurt Shot",
        "37.5%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "47"
      ],
      [
        "Stopspell Cap",
        "2/16"
      ],
      [
        "3-shot",
        "21-30 AP"
      ],
      [
        "2-shot",
        "25-45 AP"
      ],
      [
        "1-shot",
        "37-77 AP"
      ],
      [
        "25% Back Attack",
        "13 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.7000 (22/38)"
      ],
      [
        "Broken Cap",
        "4"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "It will fall to a single Hurt/Fairy Water over 1/3 of the time and to two Hurts/Fairy Waters 100% of the time."
  },
  {
    "name": "Skeleton",
    "stats": [
      [
        "HP Range",
        "18-24"
      ],
      [
        "STR",
        "28"
      ],
      [
        "AGI",
        "22"
      ],
      [
        "XP",
        "25"
      ],
      [
        "Gold",
        "42"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/16"
      ],
      [
        "25% Run STR",
        "56"
      ],
      [
        "Hero 50% Run",
        "~6 AGI"
      ],
      [
        "Hero 75% Run",
        "~11 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "45"
      ],
      [
        "Stopspell Cap",
        "2/16"
      ],
      [
        "3-shot",
        "23-43 AP"
      ],
      [
        "2-shot",
        "29-59 AP"
      ],
      [
        "1-shot",
        "47-107 AP"
      ],
      [
        "25% Back Attack",
        "11 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.8400 (27/32)"
      ],
      [
        "Broken Cap",
        "5"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "Roughly a coinflip to kill a Skeleton by using two Hurts and/or Fairy Water."
  },
  {
    "name": "Warlock",
    "stats": [
      [
        "HP Range",
        "21-28"
      ],
      [
        "STR",
        "28"
      ],
      [
        "AGI",
        "22"
      ],
      [
        "XP",
        "28"
      ],
      [
        "Gold",
        "50"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "3/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "56"
      ],
      [
        "Hero 50% Run",
        "~6 AGI"
      ],
      [
        "Hero 75% Run",
        "~11 AGI"
      ],
      [
        "SIR",
        "< 16 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "45"
      ],
      [
        "Stopspell Cap",
        "3/16"
      ],
      [
        "3-shot",
        "25-51 AP"
      ],
      [
        "2-shot",
        "33-67 AP"
      ],
      [
        "1-shot",
        "53-123 AP"
      ],
      [
        "25% Back Attack",
        "11 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.8750 (28/38)"
      ],
      [
        "Broken Cap",
        "5"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "The Warlock is very similar to the Skeleton only with less evasion and more HP."
  },
  {
    "name": "Metal Scorpion",
    "stats": [
      [
        "HP Range",
        "14-18"
      ],
      [
        "STR",
        "36"
      ],
      [
        "AGI",
        "42"
      ],
      [
        "XP",
        "31"
      ],
      [
        "Gold",
        "48"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "0"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "72"
      ],
      [
        "Hero 50% Run",
        "11 AGI"
      ],
      [
        "Hero 75% Run",
        "~22 AGI"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "15%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "55"
      ],
      [
        "Stopspell Cap",
        "3/16"
      ],
      [
        "3-shot",
        "31-45 AP"
      ],
      [
        "2-shot",
        "35-57 AP"
      ],
      [
        "1-shot",
        "47-93 AP"
      ],
      [
        "25% Back Attack",
        "21 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.5161 (14/38)"
      ],
      [
        "Broken Cap",
        "6"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "It will fall to a single Hurt/Fairy Water only 15% of the time but to two Hurts/Fairy Waters 100% of the time."
  },
  {
    "name": "Wolf",
    "stats": [
      [
        "HP Range",
        "25-33"
      ],
      [
        "STR",
        "40"
      ],
      [
        "AGI",
        "30"
      ],
      [
        "XP",
        "40"
      ],
      [
        "Gold",
        "60"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "1/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "80"
      ],
      [
        "Hero 50% Run",
        "~7 AGI"
      ],
      [
        "Hero 75% Run",
        "15 AGI"
      ],
      [
        "SIR",
        "60 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "49"
      ],
      [
        "Stopspell Cap",
        "3/16"
      ],
      [
        "3-shot",
        "33-59 AP"
      ],
      [
        "2-shot",
        "41-83 AP"
      ],
      [
        "1-shot",
        "65-147 AP"
      ],
      [
        "25% Back Attack",
        "15 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.725 (24/38)"
      ],
      [
        "Broken Cap",
        "7"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "Two Hurts and/or Fairy Waters can kill it (about 42% of the time), but it will frequently take three (and very rarely, four.)"
  },
  {
    "name": "Wraith",
    "stats": [
      [
        "HP Range",
        "30-39"
      ],
      [
        "STR",
        "44"
      ],
      [
        "AGI",
        "34"
      ],
      [
        "XP",
        "42"
      ],
      [
        "Gold",
        "62"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "7/16"
      ],
      [
        "Evasion",
        "1/16"
      ],
      [
        "25% Run STR",
        "68"
      ],
      [
        "Hero 50% Run",
        "~9 AGI"
      ],
      [
        "Hero 75% Run",
        "17 AGI"
      ],
      [
        "SIR",
        "< 9 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "51"
      ],
      [
        "Stopspell Cap",
        "3/16"
      ],
      [
        "3-shot",
        "37-69 AP"
      ],
      [
        "2-shot",
        "47-97 AP"
      ],
      [
        "1-shot",
        "77-110 AP"
      ],
      [
        "25% Back Attack",
        "17 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.8214 (26/38)"
      ],
      [
        "Broken Cap",
        "8"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "Significant Sleep resist; it carries an HP pool big enough to virtually require at least three Hurts and/or Fairy Waters to kill it; and it dodges melee strikes about 6% of the time."
  },
  {
    "name": "Metal Slime",
    "stats": [
      [
        "HP Range",
        "3"
      ],
      [
        "STR",
        "10"
      ],
      [
        "AGI",
        "255"
      ],
      [
        "XP",
        "255"
      ],
      [
        "Gold",
        "6"
      ],
      [
        "Hurt Resist",
        "15/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "20"
      ],
      [
        "Hero 50% Run",
        "~65 AGI"
      ],
      [
        "Hero 75% Run",
        "130 AGI"
      ],
      [
        "SIR",
        "7 AGI"
      ],
      [
        "Hurt Shot",
        "6.3%"
      ],
      [
        "Hurtmore shot",
        "6.3%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "4/16"
      ],
      [
        "3-shot",
        "130-131 AP"
      ],
      [
        "2-shot",
        "131-135 AP"
      ],
      [
        "1-shot",
        "133-139 AP"
      ],
      [
        "25% Back Attack",
        "128 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.0118 (1/38)"
      ],
      [
        "Broken Cap",
        "2"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "If your STR is less than 20, the Metal Slime will not run. Torches and Fairy Water will do 1 damage against a Metal Slime 50% of the time."
  },
  {
    "name": "Specter",
    "stats": [
      [
        "HP Range",
        "25-33"
      ],
      [
        "STR",
        "40"
      ],
      [
        "AGI",
        "38"
      ],
      [
        "XP",
        "47"
      ],
      [
        "Gold",
        "75"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "3/16"
      ],
      [
        "Evasion",
        "1/16"
      ],
      [
        "25% Run STR",
        "80"
      ],
      [
        "Hero 50% Run",
        "~9 AGI"
      ],
      [
        "Hero 75% Run",
        "~19 AGI"
      ],
      [
        "SIR",
        "25 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "4/16"
      ],
      [
        "3-shot",
        "37-63 AP"
      ],
      [
        "2-shot",
        "45-87 AP"
      ],
      [
        "1-shot",
        "69-98 AP"
      ],
      [
        "25% Back Attack",
        "17 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.6170 (17/38)"
      ],
      [
        "Broken Cap",
        "7"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "It has a lower HP range, lower defense, and is worth almost 50 XP, so getting a good run of Sleep against it even when you’re only chipping away with AP in the 40’s can be worth the effort."
  },
  {
    "name": "Wolflord",
    "stats": [
      [
        "HP Range",
        "28-37"
      ],
      [
        "STR",
        "50"
      ],
      [
        "AGI",
        "36"
      ],
      [
        "XP",
        "52"
      ],
      [
        "Gold",
        "80"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "1/4"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "100"
      ],
      [
        "Hero 50% Run",
        "9 AGI"
      ],
      [
        "Hero 75% Run",
        "18 AGI"
      ],
      [
        "SIR",
        "18 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "52"
      ],
      [
        "Stopspell Cap",
        "4/16"
      ],
      [
        "3-shot",
        "38-70 AP"
      ],
      [
        "2-shot",
        "46-94 AP"
      ],
      [
        "1-shot",
        "74-105 AP"
      ],
      [
        "25% Back Attack",
        "18 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.6250 (19/38)"
      ],
      [
        "Broken Cap",
        "9"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "They’re almost all good value for Hurtmore, and they can almost all be put to sleep routinely."
  },
  {
    "name": "Druinlord",
    "stats": [
      [
        "HP Range",
        "27-35"
      ],
      [
        "STR",
        "47"
      ],
      [
        "AGI",
        "40"
      ],
      [
        "XP",
        "58"
      ],
      [
        "Gold",
        "95"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "1/16"
      ],
      [
        "25% Run STR",
        "94"
      ],
      [
        "Hero 50% Run",
        "10 AGI"
      ],
      [
        "Hero 75% Run",
        "20 AGI"
      ],
      [
        "SIR",
        "N/A"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "54"
      ],
      [
        "Stopspell Cap",
        "4/16"
      ],
      [
        "3-shot",
        "38-68 AP"
      ],
      [
        "2-shot",
        "48-92 AP"
      ],
      [
        "1-shot",
        "74-104 AP"
      ],
      [
        "25% Back Attack",
        "20 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.5345 (16/38)"
      ],
      [
        "Broken Cap",
        "8"
      ],
      [
        "Run Group",
        "1"
      ]
    ],
    "notes": "The Druinlord has max Sleep resistance and a higher evasion rate, but it’s otherwise rather weak for its XP return."
  },
  {
    "name": "Goldman",
    "stats": [
      [
        "HP Range",
        "38-50"
      ],
      [
        "STR",
        "48"
      ],
      [
        "AGI",
        "40"
      ],
      [
        "XP",
        "6"
      ],
      [
        "Gold",
        "650"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "13/16"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "96"
      ],
      [
        "Hero 50% Run",
        "~15 AGI"
      ],
      [
        "Hero 75% Run",
        "30 AGI"
      ],
      [
        "SIR",
        "5 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "54"
      ],
      [
        "Stopspell Cap",
        "6/16"
      ],
      [
        "3-shot",
        "38-68 AP"
      ],
      [
        "2-shot",
        "48-92 AP"
      ],
      [
        "1-shot",
        "74-102 AP"
      ],
      [
        "25% Back Attack",
        "20 AGI"
      ],
      [
        "MHP/XP Ratio",
        "7.333 (38/38)"
      ],
      [
        "Broken Cap",
        "8"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "If you’re cash-strapped, these guys are great. If you’ve got Hurtmore you can convert 5 MP to 650 G."
  },
  {
    "name": "Drollmagi",
    "stats": [
      [
        "HP Range",
        "33-44"
      ],
      [
        "STR",
        "52"
      ],
      [
        "AGI",
        "50"
      ],
      [
        "XP",
        "58"
      ],
      [
        "Gold",
        "110"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "1/8"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "104"
      ],
      [
        "Hero 50% Run",
        "~19 AGI"
      ],
      [
        "Hero 75% Run",
        "~39 AGI"
      ],
      [
        "SIR",
        "78 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "59"
      ],
      [
        "Stopspell Cap",
        "5/16"
      ],
      [
        "3-shot",
        "47-85 AP"
      ],
      [
        "2-shot",
        "59-113 AP"
      ],
      [
        "1-shot",
        "91-129 AP"
      ],
      [
        "25% Back Attack",
        "25 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.6638 (21/38)"
      ],
      [
        "Broken Cap",
        "9"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "It’s worth a Hurtmore, but on account of its huge HP, it fares somewhat poorly by most measures of melee efficiency.  You can pick it off with Sleep strats, but it’ll likely take more swings or Hurts than other similar foes."
  },
  {
    "name": "Wyvern",
    "stats": [
      [
        "HP Range",
        "28-37"
      ],
      [
        "STR",
        "56"
      ],
      [
        "AGI",
        "48"
      ],
      [
        "XP",
        "64"
      ],
      [
        "Gold",
        "105"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "1/4"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "112"
      ],
      [
        "Hero 50% Run",
        "18 AGI"
      ],
      [
        "Hero 75% Run",
        "36 AGI"
      ],
      [
        "SIR",
        "36 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "58"
      ],
      [
        "Stopspell Cap",
        "5/16"
      ],
      [
        "3-shot",
        "44-76 AP"
      ],
      [
        "2-shot",
        "52-110 AP"
      ],
      [
        "1-shot",
        "80-111 AP"
      ],
      [
        "25% Back Attack",
        "24 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.5078 (13/38)"
      ],
      [
        "Broken Cap",
        "10"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "Sleep/Hurt can be an effective combo in the early game for taking out a Wyvern, which has no Hurt resist and merely okay Sleep resist.  It will die to two Hurts 10% of the time, and to three over 50% of the time."
  },
  {
    "name": "Rogue Scorpion",
    "stats": [
      [
        "HP Range",
        "30-40"
      ],
      [
        "STR",
        "60"
      ],
      [
        "AGI",
        "90"
      ],
      [
        "XP",
        "70"
      ],
      [
        "Gold",
        "110"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "7/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "120"
      ],
      [
        "Hero 50% Run",
        "~34 AGI"
      ],
      [
        "Hero 75% Run",
        "~68 AGI"
      ],
      [
        "SIR",
        "~39 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "79"
      ],
      [
        "Stopspell Cap",
        "5/16"
      ],
      [
        "3-shot",
        "65-110 AP"
      ],
      [
        "2-shot",
        "75-125 AP"
      ],
      [
        "1-shot",
        "105-139 AP"
      ],
      [
        "25% Back Attack",
        "45 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.5000 (10/38)"
      ],
      [
        "Broken Cap",
        "10"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "It has huge defense and not much HP, which makes it one of the most optimal enemies in the game to race with the Hurt spell. Three Hurts will kill a Rogue Scorpion 45% of the time, and four Hurts are virtually guaranteed. Naturally, Hurtmore is also well worth it."
  },
  {
    "name": "Wraith Knight",
    "stats": [
      [
        "HP Range",
        "30-40"
      ],
      [
        "STR",
        "68"
      ],
      [
        "AGI",
        "56"
      ],
      [
        "XP",
        "72"
      ],
      [
        "Gold",
        "120"
      ],
      [
        "Hurt Resist",
        "3/16"
      ],
      [
        "Sleep Resist",
        "5/16"
      ],
      [
        "Evasion",
        "1/16"
      ],
      [
        "25% Run STR",
        "136"
      ],
      [
        "Hero 50% Run",
        "21 AGI"
      ],
      [
        "Hero 75% Run",
        "49 AGI"
      ],
      [
        "SIR",
        "26 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "81.25%"
      ],
      [
        "Hurt B/E AP",
        "62"
      ],
      [
        "Stopspell Cap",
        "5/16"
      ],
      [
        "3-shot",
        "48-84 AP"
      ],
      [
        "2-shot",
        "58-108 AP"
      ],
      [
        "1-shot",
        "88-122 AP"
      ],
      [
        "25% Back Attack",
        "28 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.4861 (9/38)"
      ],
      [
        "Broken Cap",
        "12"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "The most effective method pre-Hurtmore is usually still just Sleep/melee or just plain damage racing plus healing, but it’s still an expected 58.5 XP per Hurtmore. Note that while Hurtmore will kill a Wraith Knight 100% of the time when it lands, it is only 81.25% to hit against its 3/16 resist."
  },
  {
    "name": "Knight",
    "stats": [
      [
        "HP Range",
        "36-47"
      ],
      [
        "STR",
        "76"
      ],
      [
        "AGI",
        "78"
      ],
      [
        "XP",
        "78"
      ],
      [
        "Gold",
        "150"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "3/8"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "152"
      ],
      [
        "Hero 50% Run",
        "29 AGI"
      ],
      [
        "Hero 75% Run",
        "60 AGI"
      ],
      [
        "SIR",
        "~39 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "73"
      ],
      [
        "Stopspell Cap",
        "6/16"
      ],
      [
        "3-shot",
        "63-103 AP"
      ],
      [
        "2-shot",
        "75-135 AP"
      ],
      [
        "1-shot",
        "111-150 AP"
      ],
      [
        "25% Back Attack",
        "39 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.5321 (15/38)"
      ],
      [
        "Broken Cap",
        "13"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "Knights are some of the best value for your Hurtmore MP in the entire game. Even the guaranteed 2-shot and 50% 1-shot melee ranges are pushing well into implausibility."
  },
  {
    "name": "Magiwyvern",
    "stats": [
      [
        "HP Range",
        "36-48"
      ],
      [
        "STR",
        "78"
      ],
      [
        "AGI",
        "68"
      ],
      [
        "XP",
        "83"
      ],
      [
        "Gold",
        "135"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "1/8"
      ],
      [
        "Evasion",
        "3/32"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "26 AGI"
      ],
      [
        "Hero 75% Run",
        "52 AGI"
      ],
      [
        "SIR",
        "100 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "100%"
      ],
      [
        "Hurt B/E AP",
        "68"
      ],
      [
        "Stopspell Cap",
        "6/16"
      ],
      [
        "3-shot",
        "58-98 AP"
      ],
      [
        "2-shot",
        "70-130 AP"
      ],
      [
        "1-shot",
        "106-146 AP"
      ],
      [
        "25% Back Attack",
        "34 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.5060 (12/38)"
      ],
      [
        "Broken Cap",
        "13"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "It provides the highest XP available for any enemy that is guaranteed to die in one Hurtmore.  At 1/8 Sleep resist, it’s not out of the question to use Sleep/Hurt or Sleep/melee strats."
  },
  {
    "name": "Demon Knight",
    "stats": [
      [
        "HP Range",
        "29-38"
      ],
      [
        "STR",
        "79"
      ],
      [
        "AGI",
        "64"
      ],
      [
        "XP",
        "90"
      ],
      [
        "Gold",
        "148"
      ],
      [
        "Hurt Resist",
        "15/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "15/64"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "24 AGI"
      ],
      [
        "Hero 75% Run",
        "50 AGI"
      ],
      [
        "SIR",
        "N/A"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "6.25%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "7/16"
      ],
      [
        "3-shot",
        "52-84 AP"
      ],
      [
        "2-shot",
        "62-108 AP"
      ],
      [
        "1-shot",
        "90-124 AP"
      ],
      [
        "25% Back Attack",
        "32 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.3722 (3/38)"
      ],
      [
        "Broken Cap",
        "13"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "It is best known for going on protracted evasion runs with its highest-in-the-game 15/64 (23%) evade rate.  This is exacerbated by maximum Sleep and Hurt resist, so the only way to kill one is to swing away and suffer the dodges. It has subpar HP and defense, so if you have healing and/or high DP plus reasonable AP, they can be an excellent enemy to fight. They’re not especially difficult to run from."
  },
  {
    "name": "Werewolf",
    "stats": [
      [
        "HP Range",
        "53-70"
      ],
      [
        "STR",
        "86"
      ],
      [
        "AGI",
        "70"
      ],
      [
        "XP",
        "95"
      ],
      [
        "Gold",
        "155"
      ],
      [
        "Hurt Resist",
        "0"
      ],
      [
        "Sleep Resist",
        "7/16"
      ],
      [
        "Evasion",
        "7/64"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "26 AGI"
      ],
      [
        "Hero 75% Run",
        "52 AGI"
      ],
      [
        "SIR",
        "30 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "53%"
      ],
      [
        "Hurt B/E AP",
        "69"
      ],
      [
        "Stopspell Cap",
        "7/16"
      ],
      [
        "3-shot",
        "71-131 AP"
      ],
      [
        "2-shot",
        "89-155 AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "35 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.6250 (20/38)"
      ],
      [
        "Broken Cap",
        "15"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "It is essentially always out of guaranteed 2-shot range, let alone feasible 1-shot range, barring a critical hit. Hurtmore will kill it a little over half the time, and if you’re interested in saving some MP, following up a Hurtmore with a Hurt will kill it about 82% of the time (and 100% of the time if the Hurtmore lands for at least 61 or the Hurt lands for at least 12.)"
  },
  {
    "name": "Starwyvern",
    "stats": [
      [
        "HP Range",
        "56-74"
      ],
      [
        "STR",
        "86"
      ],
      [
        "AGI",
        "80"
      ],
      [
        "XP",
        "105"
      ],
      [
        "Gold",
        "169"
      ],
      [
        "Hurt Resist",
        "1/16"
      ],
      [
        "Sleep Resist",
        "1/2"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "40 AGI"
      ],
      [
        "Hero 75% Run",
        "80 AGI"
      ],
      [
        "SIR",
        "40 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "34%"
      ],
      [
        "Hurt B/E AP",
        "74"
      ],
      [
        "Stopspell Cap",
        "7/16"
      ],
      [
        "3-shot",
        "78-140 AP"
      ],
      [
        "2-shot",
        "96- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "40 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.6190 (18/38)"
      ],
      [
        "Broken Cap",
        "15"
      ],
      [
        "Run Group",
        "3"
      ]
    ],
    "notes": "It can be challenging to run from consistently on lower agility, and their increased HP shaves off substantial Hurtmore equity. It is a merely okay grind in the late game."
  },
  {
    "name": "Wizard",
    "stats": [
      [
        "HP Range",
        "49-65"
      ],
      [
        "STR",
        "80"
      ],
      [
        "AGI",
        "70"
      ],
      [
        "XP",
        "120"
      ],
      [
        "Gold",
        "185"
      ],
      [
        "Hurt Resist",
        "15/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "80"
      ],
      [
        "Hero 50% Run",
        "35 AGI"
      ],
      [
        "Hero 75% Run",
        "70 AGI"
      ],
      [
        "SIR",
        "N/A"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "4.6%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "8/16"
      ],
      [
        "3-shot",
        "69-123 AP"
      ],
      [
        "2-shot",
        "86- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "35 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.4750 (7/38)"
      ],
      [
        "Broken Cap",
        "14"
      ],
      [
        "Run Group",
        "3"
      ]
    ],
    "notes": "A Wizard hindered by poor abilities or low Stopspell resist can be an incredibly valuable melee target even in the midgame."
  },
  {
    "name": "Axe Knight",
    "stats": [
      [
        "HP Range",
        "51-67"
      ],
      [
        "STR",
        "94"
      ],
      [
        "AGI",
        "82"
      ],
      [
        "XP",
        "130"
      ],
      [
        "Gold",
        "165"
      ],
      [
        "Hurt Resist",
        "1/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "41 AGI"
      ],
      [
        "Hero 75% Run",
        "82 AGI"
      ],
      [
        "SIR",
        "N/A"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "61%"
      ],
      [
        "Hurt B/E AP",
        "75"
      ],
      [
        "Stopspell Cap",
        "8/16"
      ],
      [
        "3-shot",
        "75-133 AP"
      ],
      [
        "2-shot",
        "93- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "41 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.4538 (5/38)"
      ],
      [
        "Broken Cap",
        "16"
      ],
      [
        "Run Group",
        "3"
      ]
    ],
    "notes": "Axe Knights are highly valued for their late-game grind potential. They can be killed with Hurtmore about 60% of the time (and the rest of the time a follow with Hurt or a swing even on nominal AP will do the trick). They are the most efficient spike tile XP grind in the game by some distance if using Hurtmore. Even in melee, they can be above-average (provided you have enough healing, HP, etc.) starting around 72 AP."
  },
  {
    "name": "Green Dragon",
    "stats": [
      [
        "HP Range",
        "54-72"
      ],
      [
        "STR",
        "88"
      ],
      [
        "AGI",
        "74"
      ],
      [
        "XP",
        "135"
      ],
      [
        "Gold",
        "160"
      ],
      [
        "Hurt Resist",
        "1/8"
      ],
      [
        "Sleep Resist",
        "7/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "37 AGI"
      ],
      [
        "Hero 75% Run",
        "74 AGI"
      ],
      [
        "SIR",
        "43 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "38%"
      ],
      [
        "Hurt B/E AP",
        "71"
      ],
      [
        "Stopspell Cap",
        "7/16"
      ],
      [
        "3-shot",
        "73-133 AP"
      ],
      [
        "2-shot",
        "91- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "37 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.4667 (6/38)"
      ],
      [
        "Broken Cap",
        "15"
      ],
      [
        "Run Group",
        "3"
      ]
    ],
    "notes": "Factoring in their 1/8 Hurt resistance, a Hurtmore can defeat them better than one-third of the time. They’re less optimal than Axe Knights as a Hurtmore grind due to their higher resistance, but they’ll take slightly more melee damage and deal slightly less melee damage due to their lesser statistics, though they do have slightly more HP."
  },
  {
    "name": "Stoneman",
    "stats": [
      [
        "HP Range",
        "102-135"
      ],
      [
        "STR",
        "100"
      ],
      [
        "AGI",
        "40"
      ],
      [
        "XP",
        "155"
      ],
      [
        "Gold",
        "148"
      ],
      [
        "Hurt Resist",
        "7/16"
      ],
      [
        "Sleep Resist",
        "1/8"
      ],
      [
        "Evasion",
        "1/64"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "40 AGI"
      ],
      [
        "Hero 75% Run",
        "80 AGI"
      ],
      [
        "SIR",
        "∞"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "0%"
      ],
      [
        "Hurt B/E AP",
        "54"
      ],
      [
        "Stopspell Cap",
        "8/16"
      ],
      [
        "3-shot",
        "88- AP"
      ],
      [
        "2-shot",
        "122- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "20 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.7645 (25/38)"
      ],
      [
        "Broken Cap",
        "17"
      ],
      [
        "Run Group",
        "4"
      ]
    ],
    "notes": "Though it has only 40 AGI, it is in the most difficult run group, which means escaping from it can be trying, even at higher agility. The odds of running from a Stoneman are about 85% even at 130 AGI. Because they have a Sleep resist of 1/8 (Sleep will land 87.5% of the time), putting a Stoneman to sleep then running away is virtually always the mathematically superior option. The Stoneman’s low defense can make it a pushover if you have Sleep and even a modicum of AP.  Don’t sleep on Hurtmore strats to clear a Stoneman spike tile, either.  At 7/16 Hurt resist, it’s not advisable to grind Stonemen using Hurtmore, but it can serve as a one-time method for clearing the way to the Hauksness search spot or Princess Gwaelin. As an XP grind, Sleep can help save some resources, but the Stoneman is otherwise less efficient than some other potential foes.  At 155 XP with an HP range that makes it difficult to drive into a somewhat consistent three-swing range until your AP is in the high 120’s, virtually any other spike tile could be a better choice, assuming all monster abilities are equal."
  },
  {
    "name": "Blue Dragon",
    "stats": [
      [
        "HP Range",
        "74-98"
      ],
      [
        "STR",
        "98"
      ],
      [
        "AGI",
        "84"
      ],
      [
        "XP",
        "180"
      ],
      [
        "Gold",
        "150"
      ],
      [
        "Hurt Resist",
        "7/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "42 AGI"
      ],
      [
        "Hero 75% Run",
        "84 AGI"
      ],
      [
        "SIR",
        "N/A"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "0%"
      ],
      [
        "Hurt B/E AP",
        "76"
      ],
      [
        "Stopspell Cap",
        "8/16"
      ],
      [
        "3-shot",
        "92 -AP"
      ],
      [
        "2-shot",
        "116- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "42 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.4778 (8/38)"
      ],
      [
        "Broken Cap",
        "17"
      ],
      [
        "Run Group",
        "3"
      ]
    ],
    "notes": "Blue Dragons become one of the most efficient melee battles in the game around 86 AP, and they don’t look back. If your DP is even in the 70’s, they’re not going to do a terrifying amount of damage.  If you have healing and their abilities are not prohibitive, fighting Blue Dragons is a prudent option. As a spike tile eligible enemy, they’re in a reasonable middle spot  ̶  not the best, but not the worst, either. Grinding them with Hurtmore is not at all efficient, but flinging a few Hurtmores to clear the Haukness spike or to get through the Swamp tile is a reasonable way to make progress."
  },
  {
    "name": "Golem",
    "stats": [
      [
        "HP Range",
        "115-153"
      ],
      [
        "STR",
        "120"
      ],
      [
        "AGI",
        "60"
      ],
      [
        "XP",
        "350"
      ],
      [
        "Gold",
        "10"
      ],
      [
        "Hurt Resist",
        "15/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "0"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "~23 AGI"
      ],
      [
        "Hero 75% Run",
        "46 AGI"
      ],
      [
        "SIR",
        "Fairy Flute"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "0%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "6/16"
      ],
      [
        "3-shot",
        "108- AP"
      ],
      [
        "2-shot",
        "146- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "30 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.3829 (4/38)"
      ],
      [
        "Broken Cap",
        "20"
      ],
      [
        "Run Group",
        "2"
      ]
    ],
    "notes": "Golems are the only overworld enemy in the game with zero evasion, meaning your melee strikes will always land. Golems have max Hurt and Sleep resistances, but they will fall asleep 100% of the time when the Fairy Flute is played in battle. Golems have the most HP of any overworld enemy. Golems are in the group 2 run tier, which means that even though they are a Charlock enemy, they’re by far the easiest enemy to run from in the group, or you can use the Flute then run for a guaranteed escape. Golems have a Stopspell cap of less than one-half, meaning that even if they roll good spells, you can land Stopspell on them with some regularity. The elevated HP will cause a Golem to take about half a swing more to kill than a Red Dragon, on average. They’re a solid endgame grind – and an absolute godsend in early Fairy Flute seeds, particularly when you have subpar HP and/or AP."
  },
  {
    "name": "Armored Knight",
    "stats": [
      [
        "HP Range",
        "75-99"
      ],
      [
        "STR",
        "105"
      ],
      [
        "AGI",
        "86"
      ],
      [
        "XP",
        "172"
      ],
      [
        "Gold",
        "152"
      ],
      [
        "Hurt Resist",
        "1/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "86 AGI"
      ],
      [
        "Hero 75% Run",
        "N/A"
      ],
      [
        "SIR",
        "N/A"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "0%"
      ],
      [
        "Hurt B/E AP",
        "77"
      ],
      [
        "Stopspell Cap",
        "9/16"
      ],
      [
        "3-shot",
        "93- AP"
      ],
      [
        "2-shot",
        "119- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "43 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.5058 (11/38)"
      ],
      [
        "Broken Cap",
        "18"
      ],
      [
        "Run Group",
        "4"
      ]
    ],
    "notes": "They occupy the most difficult run tier; even on 130 AGI, you’ll only escape on about two-thirds of attempts. Their stats are well-above-average across the board, so when you have high AP, it’s often better to hack through them than attempt to run. As a grind option, Armored Knights (so long as they don’t have Healmore) will always fall to two Hurtmores that land. Starting around 110 attack power, a melee attack followed by a Hurtmore gives you roughly a 50% chance to kill an Armored Knight."
  },
  {
    "name": "Red Dragon",
    "stats": [
      [
        "HP Range",
        "80-106"
      ],
      [
        "STR",
        "120"
      ],
      [
        "AGI",
        "90"
      ],
      [
        "XP",
        "350"
      ],
      [
        "Gold",
        "143"
      ],
      [
        "Hurt Resist",
        "15/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "1/32"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "90 AGI"
      ],
      [
        "Hero 75% Run",
        "N/A"
      ],
      [
        "SIR",
        "0 AGI"
      ],
      [
        "Hurt Shot",
        "0%"
      ],
      [
        "Hurtmore shot",
        "0%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "9/16"
      ],
      [
        "3-shot",
        "99- AP"
      ],
      [
        "2-shot",
        "125- AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "45 AGI"
      ],
      [
        "MHP/XP Ratio",
        "0.2657 (2/38)"
      ],
      [
        "Broken Cap",
        "20"
      ],
      [
        "Run Group",
        "4"
      ]
    ],
    "notes": "If you have the requisite stats and healing to fight one, doing so is almost always a better option than running, and the max XP gain is very worthwhile. If you need a grind to bridge the gap from very-nearly-go to go, it’s difficult to go wrong with a Red Dragon."
  },
  {
    "name": "Dragonlord",
    "stats": [
      [
        "HP Range",
        "75-100"
      ],
      [
        "STR",
        "90"
      ],
      [
        "AGI",
        "75"
      ],
      [
        "XP",
        "N/A"
      ],
      [
        "Gold",
        "N/A"
      ],
      [
        "Hurt Resist",
        "15/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "0"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "75 AGI"
      ],
      [
        "Hero 75% Run",
        "N/A"
      ],
      [
        "SIR",
        "N/A"
      ],
      [
        "Hurt Shot",
        "N/A"
      ],
      [
        "Hurtmore shot",
        "0%"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "15/16"
      ],
      [
        "3-shot",
        "117 AP"
      ],
      [
        "2-shot",
        "155 AP"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "38 AGI"
      ],
      [
        "MHP/XP Ratio",
        "N/A"
      ],
      [
        "Broken Cap",
        "15"
      ],
      [
        "Run Group",
        "4"
      ]
    ],
    "notes": "25% Stopspell, 75% Hurtmore. DL1 will not dodge, but you can’t land critical hits against him, either."
  },
  {
    "name": "Dragonlord 2",
    "stats": [
      [
        "HP Range",
        "150-165"
      ],
      [
        "STR",
        "140"
      ],
      [
        "AGI",
        "200"
      ],
      [
        "XP",
        "N/A"
      ],
      [
        "Gold",
        "N/A"
      ],
      [
        "Hurt Resist",
        "15/16"
      ],
      [
        "Sleep Resist",
        "15/16"
      ],
      [
        "Evasion",
        "0"
      ],
      [
        "25% Run STR",
        "N/A"
      ],
      [
        "Hero 50% Run",
        "200 AGI"
      ],
      [
        "Hero 75% Run",
        "N/A"
      ],
      [
        "SIR",
        "N/A"
      ],
      [
        "Hurt Shot",
        "N/A"
      ],
      [
        "Hurtmore shot",
        "N/A"
      ],
      [
        "Hurt B/E AP",
        "N/A"
      ],
      [
        "Stopspell Cap",
        "12/16"
      ],
      [
        "3-shot",
        "N/A"
      ],
      [
        "2-shot",
        "N/A"
      ],
      [
        "1-shot",
        "N/A"
      ],
      [
        "25% Back Attack",
        "100 AGI"
      ],
      [
        "MHP/XP Ratio",
        "N/A"
      ],
      [
        "Broken Cap",
        "N/A"
      ],
      [
        "Run Group",
        "4"
      ]
    ],
    "notes": "50% DL2 Breath. With Erdrick’s Armor, DL2 Breath maxes out at 48, so healing at or below this number is advisable, circumstances permitting. Fairy Water will do 9-16 damage (average 12.5 damage), which is more than 134 AP."
  }
]

export const MONSTER_STAT_DEFINITIONS: Record<string, string> = {
  "HP Range": "The possible HP with which the monster will spawn.",
  "STR": "The enemy’s strength. Keep in mind when your DP equals this number, the monster is defense-broken.",
  "XP": "The amount of XP the enemy awards when it is defeated.",
  "Gold": "The amount of Gold the enemy awards when it is defeated.",
  "Hurt Resist": "The fraction of the time Hurt or Hurtmore will fail against this enemy.",
  "Sleep Resist": "The fraction of the time Sleep will fail against this enemy.",
  "Evasion": "The odds that the enemy will dodge a melee attack.",
  "25% Run STR": "is the Hero STR value at which the enemy will begin to have a 25% chance to run on every turn of combat.",
  "Hero 50% Run": "The Hero AGI at which you will be a coinflip to run from this enemy.  If “N/a,” the player is always guaranteed to be better than 50% to run away from this enemy.",
  "Hero 75% Run": "The Hero's AGI at which you will be 75% to run from this enemy.  If “N/A,” the player is always guaranteed to be better than 75% to run away from this enemy.",
  "SIR (Sleep-Instead-of-Run)": "The break-even AGI point at which it is better to put this enemy to Sleep to try to get away, or just straight run. Any AGI greater than this should be a run; any AGI less should be a Sleep. If the enemy has no Sleep resist, this will say “0,” meaning that Sleep will guarantee a run.",
  "3-shot": "The STR range at which this enemy could be killed in three attacks. The first number of this range is the first time that the 3-shot is possible. The last number of the range is the number at which the 3-shot is guaranteed. This measure excludes the chance of evasion.",
  "2-shot": "The STR range at which this enemy could be killed in two attacks. The first number of this range is the first time that the 2-shot is possible. The last number of the range is the number at which the 2-shot is guaranteed. This measure excludes the chance of evasion.",
  "1-shot": "The STR range at which this enemy could be killed in one attack. The first number of this range is the first time that the 1-shot is possible. The last number of the range is the number at which the 1-shot is guaranteed. This measure excludes the chance of evasion.",
  "Back attack = 25%": "The AGI point at which you are going to be ambushed by this monster 25% of the time. This can be slightly useful for determining when you should go Hurtmore-hunting for higher XP monsters at earlier levels.",
  "Stopspell Cap": "This is the enemy’s maximum Stopspell resistance. While Stopspell resistance is randomized, it will never be higher than this figure.",
  "MHP/XP Ratio": "This is a very simple metric that gives the monster’s median possible HP to its XP.  It is a very rough measure of how efficient the enemy is on a per-swing basis in melee combat.  It is given “N (x/y)”, where N is the ratio and x/y is the rank (x) among the total overworld monster set (y).",
  "Hurt Shot": "The percentage of the time that a Hurt spell will kill this enemy.  This also applies to Fairy Water when “Enable Torches as Weapons” applies, keeping in mind that Fairy Water will never miss, (except against Metal Slimes.)",
  "Hurtmore Shot": "The percentage of the time that a single Hurtmore spell will kill this enemy.",
  "Hurt B/E": "The AP break-even point for physical attacks doing roughly the same damage against this enemy as the HURT spell does.  It can help you figure out whether you should be using melee attacks or casting.  When HURT is guaranteed to always kill the monster in question, this will be “N/A” (not applicable). This does not factor in evasion, Hurt resist, or the melee damage distribution, so the decision to use melee attacks vs. Hurt is not always cut and dry.",
  "Broken Cap": "When the monster is defense broken, its damage range against you will be zero to the number listed in this box."
}
