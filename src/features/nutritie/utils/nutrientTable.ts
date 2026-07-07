export const DZR: Record<string, { label: string; unit: string; dzr: number }> = {
  vitaminA_mcg:   { label: 'Vitamina A',   unit: 'mcg', dzr: 800 },
  vitaminC_mg:    { label: 'Vitamina C',   unit: 'mg',  dzr: 80 },
  vitaminD_mcg:   { label: 'Vitamina D',   unit: 'mcg', dzr: 5 },
  vitaminE_mg:    { label: 'Vitamina E',   unit: 'mg',  dzr: 12 },
  vitaminK_mcg:   { label: 'Vitamina K',   unit: 'mcg', dzr: 75 },
  vitaminB1_mg:   { label: 'Vitamina B1',  unit: 'mg',  dzr: 1.1 },
  vitaminB2_mg:   { label: 'Vitamina B2',  unit: 'mg',  dzr: 1.4 },
  vitaminB3_mg:   { label: 'Vitamina B3',  unit: 'mg',  dzr: 16 },
  vitaminB6_mg:   { label: 'Vitamina B6',  unit: 'mg',  dzr: 1.4 },
  vitaminB9_mcg:  { label: 'Acid folic',   unit: 'mcg', dzr: 200 },
  vitaminB12_mcg: { label: 'Vitamina B12', unit: 'mcg', dzr: 2.5 },
  calcium_mg:     { label: 'Calciu',       unit: 'mg',  dzr: 800 },
  iron_mg:        { label: 'Fier',         unit: 'mg',  dzr: 14 },
  magnesium_mg:   { label: 'Magneziu',     unit: 'mg',  dzr: 375 },
  potassium_mg:   { label: 'Potasiu',      unit: 'mg',  dzr: 2000 },
  zinc_mg:        { label: 'Zinc',         unit: 'mg',  dzr: 10 },
  selenium_mcg:   { label: 'Seleniu',      unit: 'mcg', dzr: 55 },
  phosphorus_mg:  { label: 'Fosfor',       unit: 'mg',  dzr: 700 },
}

export const VITAMIN_KEYS = [
  'vitaminA_mcg', 'vitaminC_mg', 'vitaminD_mcg', 'vitaminE_mg', 'vitaminK_mcg',
  'vitaminB1_mg', 'vitaminB2_mg', 'vitaminB3_mg', 'vitaminB6_mg', 'vitaminB9_mcg', 'vitaminB12_mcg',
]

export const MINERAL_KEYS = [
  'calcium_mg', 'iron_mg', 'magnesium_mg', 'potassium_mg', 'zinc_mg', 'selenium_mcg', 'phosphorus_mg',
]
