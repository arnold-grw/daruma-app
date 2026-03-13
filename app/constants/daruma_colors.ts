
export interface DarumaColorConfig {
  id: DarumaColor
  hex: string
  labelKey: string        // key for translations
  meaningKey: string      // key for translations   
  label: string
  meaning: string
}

import { DarumaColor } from '@/types/daruma'

export const DARUMA_COLORS: DarumaColorConfig[] = [
  {
    id: 'red',
    hex: '#CC0000',
    labelKey: 'colors.red.label',
    meaningKey: 'colors.red.meaning',
    label: 'Red',
    meaning: 'Good luck & success',
  },
  {
    id: 'white',
    hex: '#F5F5F5',
    labelKey: 'colors.white.label',
    meaningKey: 'colors.white.meaning',
    label: 'White',
    meaning: 'Purity & clarity of mind',
  },
  {
    id: 'blue',
    hex: '#2255AA',
    labelKey: 'colors.blue.label',
    meaningKey: 'colors.blue.meaning',
    label: 'Blue',
    meaning: 'Focus & productivity',
  },
  {
    id: 'green',
    hex: '#2D6A4F',
    labelKey: 'colors.green.label',
    meaningKey: 'colors.green.meaning',
    label: 'Green',
    meaning: 'Health & wellbeing',
  },
  {
    id: 'yellow',
    hex: '#F4C430',
    labelKey: 'colors.yellow.label',
    meaningKey: 'colors.yellow.meaning',
    label: 'Yellow',
    meaning: 'Wealth & prosperity',
  },
  {
    id: 'pink',
    hex: '#E8829A',
    labelKey: 'colors.pink.label',
    meaningKey: 'colors.pink.meaning',
    label: 'Pink',
    meaning: 'Love & relationships',
  },
]

// find color config by id, default to first color if not found
export const getDarumaColor = (id: DarumaColor): DarumaColorConfig => {
  return DARUMA_COLORS.find(c => c.id === id) ?? DARUMA_COLORS[0]
}