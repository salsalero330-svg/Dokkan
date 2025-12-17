import { Character, DokkanType } from './types';

export const TYPE_COLORS: Record<DokkanType, string> = {
  AGL: 'bg-blue-600 border-blue-400 text-blue-100',
  TEQ: 'bg-green-600 border-green-400 text-green-100',
  INT: 'bg-purple-600 border-purple-400 text-purple-100',
  STR: 'bg-red-600 border-red-400 text-red-100',
  PHY: 'bg-orange-600 border-orange-400 text-orange-100',
};

export const TYPE_BG_HEX: Record<DokkanType, string> = {
    AGL: '#2563eb',
    TEQ: '#16a34a',
    INT: '#9333ea',
    STR: '#dc2626',
    PHY: '#ea580c',
};

// Expanded mock data with top tier meta units including 10th Anni & WWC 2025
export const INITIAL_CHARACTERS: Character[] = [
  // --- 10th Anniversary (The Big Fusions) ---
  {
    id: '10th-vegito',
    name: 'Super Vegito (Angel)',
    subtitle: '10th Anniversary: Ultimate Fusion',
    type: 'INT',
    class: 'Super',
    rarity: 'LR',
    categories: ['Potara', 'Final Trump Card', 'Majin Buu Saga', 'Battle of Wits', 'Accelerated Battle', 'Time Limit'],
    links: ['Super Saiyan', 'Fused Fighter', 'Power Bestowed by God', 'Prepared for Battle', 'Fierce Battle', 'Legendary Power', 'Saiyan Lineage'],
    leaderSkill: '"Potara" or "Final Trump Card" Ki +3, stats +200%; plus an additional stats +50% for "Time Limit"',
    passiveSkill: 'ATK & DEF +250%; counters normal attacks with tremendous power; foresees enemy Super Attack for 10 turns; launches 2 additional Super Attacks.',
    stats: { hp: 28500, atk: 27000, def: 19500 }
  },
  {
    id: '10th-gogeta',
    name: 'Super Gogeta (Angel)',
    subtitle: '10th Anniversary: Miracle Fusion',
    type: 'PHY',
    class: 'Super',
    rarity: 'LR',
    categories: ['Fusion', 'Movie Heroes', 'Otherworld Warriors', 'Connected Hope', 'Time Limit', 'Final Trump Card'],
    links: ['Super Saiyan', 'Fused Fighter', 'Over in a Flash', 'Golden Warrior', 'Fierce Battle', 'Legendary Power', 'Experienced Fighters'],
    leaderSkill: '"Fusion" or "Movie Heroes" Ki +3, stats +200%; plus an additional stats +50% for "Otherworld Warriors"',
    passiveSkill: 'ATK & DEF +250%; effective against all Types; performs a critical hit when activating Active Skill; nullifies Unarmed Super Attacks.',
    stats: { hp: 28000, atk: 28500, def: 18000 }
  },

  // --- WWC 2025 (Worldwide Campaign) ---
  {
    id: 'wwc-kidbuu',
    name: 'Kid Buu (Origin of Evil)',
    subtitle: 'WWC 2025: Universal Destruction',
    type: 'TEQ',
    class: 'Extreme',
    rarity: 'LR',
    categories: ['Majin Buu Saga', 'Artificial Life Forms', 'Majin Power', 'Sworn Enemies', 'Transformation Boost', 'Chaotic Future'],
    links: ['Majin', 'Big Bad Bosses', 'Infinite Regeneration', 'The Wall Standing Tall', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Majin Power" or "Sworn Enemies" Ki +3, stats +200%',
    passiveSkill: 'Recovers 20% HP at start of turn; ATK & DEF +300%; reduces damage received by 40%; high chance to stun all enemies.',
    stats: { hp: 31000, atk: 25000, def: 21000 }
  },
  {
    id: 'wwc-goku3',
    name: 'Super Saiyan 3 Goku',
    subtitle: 'WWC 2025: Power to Save the Universe',
    type: 'AGL',
    class: 'Super',
    rarity: 'LR',
    categories: ['Majin Buu Saga', 'Super Saiyan 3', 'Pure Saiyans', 'Full Power', 'Accelerated Battle', 'Resurrected Warriors'],
    links: ['Super Saiyan', 'Golden Warrior', 'Over in a Flash', 'Limit-Breaking Form', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Majin Buu Saga" or "Super Saiyan 3" Ki +3, stats +200%',
    passiveSkill: 'Massive ATK raise on Super Attack; great chance to evade enemy attack; guards all attacks for 5 turns.',
    stats: { hp: 26500, atk: 29000, def: 16000 }
  },

  // --- 9th Anniversary & 2024 Meta ---
  {
    id: '1',
    name: 'Gohan (Beast)',
    subtitle: 'Awakened Super Hero',
    type: 'STR',
    class: 'Super',
    rarity: 'LR',
    categories: ['Hybrid Saiyans', 'Movie Heroes', 'Miraculous Awakening', 'Super Heroes', 'Entrusted Will'],
    links: ['Super Saiyan', 'Experienced Fighters', 'Prepared for Battle', 'Shocking Speed', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Super Heroes" Ki +3, stats +170%; +30% to "Hybrid Saiyans" or "Movie Heroes"',
    passiveSkill: 'Guard all attacks; massive ATK & DEF stack...',
    stats: { hp: 26000, atk: 24000, def: 18000 }
  },
  {
    id: '4',
    name: 'Broly (Super)',
    subtitle: 'Uncontrollable Rage',
    type: 'AGL',
    class: 'Extreme',
    rarity: 'LR',
    categories: ['Movie Bosses', 'Pure Saiyans', 'Exploding Rage', 'Full Power', 'Transformation Boost'],
    links: ['Saiyan Warrior Race', 'The Saiyan Lineage', 'Berserker', 'Shocking Speed', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Movie Bosses" Category Ki +3, HP, ATK & DEF +170%',
    passiveSkill: 'ATK & DEF +200%; launches multiple supers...',
    stats: { hp: 26000, atk: 25000, def: 10000 }
  },
  {
    id: 'broly-phy',
    name: 'Super Saiyan Broly',
    subtitle: 'Unlimited Power',
    type: 'PHY',
    class: 'Extreme',
    rarity: 'LR',
    categories: ['Movie Bosses', 'Pure Saiyans', 'Super Saiyans', 'Planetary Destruction'],
    links: ['Super Saiyan', 'Saiyan Warrior Race', 'Prepared for Battle', 'Berserker', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Movie Bosses" or "Pure Saiyans" Ki +3, stats +170%',
    passiveSkill: 'Massive damage reduction and critical hits...',
    stats: { hp: 24500, atk: 23000, def: 14000 }
  },
   {
    id: 'gogeta-phy',
    name: 'Gogeta (Super Saiyan)',
    subtitle: 'Fusion Reborn',
    type: 'PHY',
    class: 'Super',
    rarity: 'LR',
    categories: ['Fusion', 'Movie Heroes', 'Final Trump Card', 'Super Saiyans', 'Otherworld Warriors'],
    links: ['Super Saiyan', 'Fused Fighter', 'Over in a Flash', 'Kamehameha', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Fusion" Category Ki +3 and HP, ATK & DEF +170%',
    passiveSkill: 'Effective against all types; heals on transformation...',
    stats: { hp: 21000, atk: 23000, def: 13000 }
  },
  {
    id: 'gammas-int',
    name: 'Gamma 1 & Gamma 2',
    subtitle: 'Super Heroes of Justice',
    type: 'INT',
    class: 'Super',
    rarity: 'LR',
    categories: ['Joined Forces', 'Movie Heroes', 'Artificial Life Forms', 'Special Pose', 'Defenders of Justice'],
    links: ['Android Assault', 'Hero of Justice', 'Signature Pose', 'Shocking Speed', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Joined Forces" Ki +3, stats +170%',
    passiveSkill: 'High chance to crit; standby into core breaker...',
    stats: { hp: 22000, atk: 21500, def: 16000 }
  },
  
  // --- Universe Survival Saga ---
  {
    id: '2',
    name: 'Goku (Ultra Instinct)',
    subtitle: 'Mastery of Divine Technique',
    type: 'TEQ',
    class: 'Super',
    rarity: 'LR',
    categories: ['Realm of Gods', 'Universe Survival Saga', 'Representatives of Universe 7', 'Miraculous Awakening'],
    links: ['Godly Power', 'Tournament of Power', 'Over in a Flash', 'Kamehameha', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Universe Survival Saga" Category Ki +3 and HP, ATK & DEF +170%',
    passiveSkill: 'Great chance of evading enemy attack...',
    stats: { hp: 22500, atk: 24000, def: 12000 }
  },
  {
    id: '3',
    name: 'Vegeta (SS God SS Evolved)',
    subtitle: 'Pride of the Warrior Race',
    type: 'INT',
    class: 'Super',
    rarity: 'LR',
    categories: ['Universe Survival Saga', 'Representatives of Universe 7', 'Pure Saiyans', 'Vegeta\'s Family'],
    links: ['Super Saiyan', 'Warrior Gods', 'Prodigies', 'Tournament of Power', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Pure Saiyans" Category Ki +3, HP, ATK & DEF +170%',
    passiveSkill: 'Reduces damage received by 10%...',
    stats: { hp: 23000, atk: 21000, def: 18000 }
  },
   {
    id: 'u7-phy',
    name: 'Android #17 & #18',
    subtitle: 'Team Universe 7',
    type: 'PHY',
    class: 'Super',
    rarity: 'LR',
    categories: ['Universe Survival Saga', 'Joined Forces', 'Androids', 'Siblings\' Bond'],
    links: ['Android Assault', 'Twin Terrors', 'Tournament of Power', 'Shocking Speed', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Universe Survival Saga" Ki +3, stats +170%',
    passiveSkill: 'Support all allies; creates orbs...',
    stats: { hp: 20000, atk: 18000, def: 14000 }
  },

  // --- 8th Anniversary & Buu Saga ---
  {
    id: 'gt-duo',
    name: 'Goku (GT) & SSJ4 Vegeta',
    subtitle: 'Galaxy-Crossing Warriors',
    type: 'PHY',
    class: 'Super',
    rarity: 'LR',
    categories: ['GT Heroes', 'Joined Forces', 'Pure Saiyans', 'Battle of Fate', 'Shadow Dragon Saga'],
    links: ['Saiyan Warrior Race', 'GT', 'Prepared for Battle', 'Shocking Speed', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"GT Heroes" Ki +3, stats +170%',
    passiveSkill: 'Revive counter; builds up damage reduction...',
    stats: { hp: 24000, atk: 23500, def: 15000 }
  },
  {
    id: 'z-duo',
    name: 'SSJ3 Goku & SSJ2 Vegeta',
    subtitle: 'Hope of the Universe',
    type: 'STR',
    class: 'Super',
    rarity: 'LR',
    categories: ['Majin Buu Saga', 'Pure Saiyans', 'Joined Forces', 'Final Trump Card'],
    links: ['Super Saiyan', 'Saiyan Warrior Race', 'Golden Warrior', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Majin Buu Saga" Ki +3, stats +170%',
    passiveSkill: 'Standby skill to Spirit Bomb...',
    stats: { hp: 25000, atk: 24000, def: 14500 }
  },
  {
    id: 'buu-int',
    name: 'Majin Buu (Good)',
    subtitle: 'Innocent Destroyer',
    type: 'INT',
    class: 'Extreme',
    rarity: 'TUR',
    categories: ['Majin Buu Saga', 'Majin Power', 'Artificial Life Forms', 'Sworn Enemies'],
    links: ['Majin', 'Infinite Regeneration', 'The Innocents', 'Revival', 'Fierce Battle'],
    leaderSkill: '"Majin Power" Ki +3, stats +170%',
    passiveSkill: 'Heals HP; revives upon KO...',
    stats: { hp: 19000, atk: 17000, def: 12000 }
  },

  // --- Future Saga & Villains ---
  {
    id: 'zamasu-teq',
    name: 'Fusion Zamasu',
    subtitle: 'Infinite Sanctuary',
    type: 'TEQ',
    class: 'Extreme',
    rarity: 'LR',
    categories: ['Realm of Gods', 'Potara', 'Future Saga', 'Time Travelers', 'Worldwide Chaos'],
    links: ['Big Bad Bosses', 'Dismal Future', 'Godly Power', 'Fused Fighter', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Worldwide Chaos" Ki +3, stats +170%',
    passiveSkill: 'Reduces damage significantly; domain expansion...',
    stats: { hp: 23500, atk: 22000, def: 16500 }
  },
  {
    id: 'future-gohan-str',
    name: 'Future Gohan',
    subtitle: 'Protector of the Future',
    type: 'STR',
    class: 'Super',
    rarity: 'LR',
    categories: ['Future Saga', 'Hybrid Saiyans', 'Bond of Master and Disciple', 'Connected Hope'],
    links: ['Golden Warrior', 'Super Saiyan', 'Dismal Future', 'Prepared for Battle', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Future Saga" Ki +3, stats +170%',
    passiveSkill: 'Damage reduction; domain support...',
    stats: { hp: 22000, atk: 20000, def: 19000 }
  },
  {
    id: 'cell-max-str',
    name: 'Cell Max',
    subtitle: 'Ultimate Bio-Android',
    type: 'STR',
    class: 'Extreme',
    rarity: 'LR',
    categories: ['Artificial Life Forms', 'Movie Bosses', 'Target: Goku', 'Androids'],
    links: ['Android Assault', 'Nightmare', 'Big Bad Bosses', 'Shocking Speed', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Artificial Life Forms" Ki +3, stats +170%',
    passiveSkill: 'Active Skill creates massive damage; taunt mechanic...',
    stats: { hp: 28000, atk: 26000, def: 15000 }
  },

  // --- Supports & Utility ---
  {
    id: 'bulma-str',
    name: 'Bulma (Youth)',
    subtitle: 'Adventure Begins',
    type: 'STR',
    class: 'Super',
    rarity: 'LR',
    categories: ['Dragon Ball Seekers', 'Earthlings', 'Youth', 'Peppy Gals'],
    links: ['Brainiacs', 'Money Money Money', 'The Incredible Adventure', 'Guidance of the Dragon Balls', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Dragon Ball Seekers" Ki +3, stats +170%',
    passiveSkill: 'Best support in the game; creates rainbow orbs; damage reduction...',
    stats: { hp: 21000, atk: 15000, def: 16000 }
  },
  {
    id: 'op-teq',
    name: 'Orange Piccolo',
    subtitle: 'Namekian Pride',
    type: 'TEQ',
    class: 'Super',
    rarity: 'LR',
    categories: ['Namekians', 'Movie Heroes', 'Super Heroes', 'Battle of Wits', 'Bond of Master and Disciple'],
    links: ['Namekians', 'Brainiacs', 'Gaze of Respect', 'Shocking Speed', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Super Heroes" Ki +3, stats +170%',
    passiveSkill: 'Reduces damage received by 20%; giant form...',
    stats: { hp: 28000, atk: 19000, def: 20000 }
  },
  
  // --- 7th Anniversary (Still solid) ---
  {
    id: 'gods-teq',
    name: 'SSG Goku & SSG Vegeta',
    subtitle: 'Limitless Power',
    type: 'TEQ',
    class: 'Super',
    rarity: 'LR',
    categories: ['Power Beyond Super Saiyan', 'Movie Heroes', 'Realm of Gods', 'Pure Saiyans'],
    links: ['Super Saiyan', 'Warrior Gods', 'Prepared for Battle', 'Kamehameha', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Power Beyond Super Saiyan" Ki +3, stats +170%',
    passiveSkill: 'Stacks ATK & DEF; transformation into Blue...',
    stats: { hp: 21500, atk: 20500, def: 13000 }
  },
  {
    id: 'ssj4s-phy',
    name: 'SSJ4 Goku & SSJ4 Vegeta',
    subtitle: 'Fused Super Power',
    type: 'PHY',
    class: 'Super',
    rarity: 'LR',
    categories: ['GT Heroes', 'Fused Fighters', 'Pure Saiyans', 'Kamehameha'],
    links: ['Super Saiyan', 'Saiyan Roar', 'GT', 'Prepared for Battle', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"GT Heroes" Ki +3, stats +170%',
    passiveSkill: 'Fuses into SSJ4 Gogeta; counters supers...',
    stats: { hp: 22500, atk: 21000, def: 13500 }
  },
  {
    id: 'cooler-str',
    name: 'Cooler (Final Form)',
    subtitle: 'Strongest in the Universe',
    type: 'STR',
    class: 'Extreme',
    rarity: 'LR',
    categories: ['Movie Bosses', 'Terrifying Conquerors', 'Wicked Bloodline', 'Transformation Boost'],
    links: ['Big Bad Bosses', 'Thirst for Conquest', 'Metamorphosis', 'Universe\'s Most Malevolent', 'Fierce Battle', 'Legendary Power'],
    leaderSkill: '"Terrifying Conquerors" Ki +3, stats +170%',
    passiveSkill: 'Launches additional Super Attacks...',
    stats: { hp: 20000, atk: 22000, def: 11000 }
  }
];