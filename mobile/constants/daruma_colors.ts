//constants/daruma_colors

export interface DarumaColorConfig {
  id: DarumaColor
  hex: string
  labelKey: string        // key for translations
  meaningKey: string      // key for translations
}

import { DarumaColor } from '@/types/daruma'

// completed darumas needed to unlock a color; colors not listed here can be chosen from the start
export const COLOR_UNLOCKS: Partial<Record<DarumaColor, number>> = {
  pink: 1,
  black: 2,
  gold: 3,
}
// a locked color shows "???" instead of its name while at least this many darumas are still missing
export const HIDE_NAME_FROM_REMAINING = 2
// shown instead of the name, the same in every language (full-width question marks)
export const HIDDEN_COLOR_LABEL = '？？？'

// also the order of the color carousel: the free colors first, then the locked ones in the order they unlock
export const DARUMA_COLORS: DarumaColorConfig[] = [
  {
    id: 'red',
    hex: '#d54848',
    labelKey: 'colors.red.label',
    meaningKey: 'colors.red.meaning'
  },
  {
    id: 'blue',
    hex: '#4d73b4',
    labelKey: 'colors.blue.label',
    meaningKey: 'colors.blue.meaning'
  },
  {
    id: 'green',
    hex: '#408b69',
    labelKey: 'colors.green.label',
    meaningKey: 'colors.green.meaning'
  },
  {
    id: 'pink',
    hex: '#dc758d',
    labelKey: 'colors.pink.label',
    meaningKey: 'colors.pink.meaning'
  },
  {
    id: 'black',
    hex: '#474747',
    labelKey: 'colors.black.label',
    meaningKey: 'colors.black.meaning'
  },
  {
    id: 'gold',
    hex: '#d3af42',
    labelKey: 'colors.gold.label',
    meaningKey: 'colors.gold.meaning'
  },
]
// find color config by id, default to first color if not found
export const getDarumaColor = (id: DarumaColor): DarumaColorConfig => {
  return DARUMA_COLORS.find(c => c.id === id) ?? DARUMA_COLORS[0]
}

// how many more darumas have to be completed before the color can be chosen (0 = unlocked)
export const getRemainingUnlocks = (id: DarumaColor, completedCount: number): number => {
  return Math.max(0, (COLOR_UNLOCKS[id] ?? 0) - completedCount)
}

export const isColorUnlocked = (id: DarumaColor, completedCount: number): boolean => {
  return getRemainingUnlocks(id, completedCount) === 0
}

export const eyeColor = '#302925'
