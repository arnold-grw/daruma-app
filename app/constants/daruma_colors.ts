//constants/daruma_colors

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
    hex: '#cd4949',
    labelKey: 'colors.red.label',
    meaningKey: 'colors.red.meaning',
    label: 'Red',
    meaning: 'Good luck & success',
  },
  {
    id: 'black',
    hex: '#313131',
    labelKey: 'colors.black.label',
    meaningKey: 'colors.black.meaning',
    label: 'Black',
    meaning: 'Secret & business',
  },
  {
    id: 'blue',
    hex: '#5679b6',
    labelKey: 'colors.blue.label',
    meaningKey: 'colors.blue.meaning',
    label: 'Blue',
    meaning: 'Focus & productivity',
  },
  {
    id: 'green',
    hex: '#3c785d',
    labelKey: 'colors.green.label',
    meaningKey: 'colors.green.meaning',
    label: 'Green',
    meaning: 'Health & wellbeing',
  },
  {
    id: 'yellow',
    hex: '#e9c454',
    labelKey: 'colors.yellow.label',
    meaningKey: 'colors.yellow.meaning',
    label: 'Yellow',
    meaning: 'Wealth & prosperity',
  },
  {
    id: 'pink',
    hex: '#db7d93',
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