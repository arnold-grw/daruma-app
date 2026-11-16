# Project: Daruma App (React Native / Expo)

I am building a Daruma app: you pick a color, write a goal, optionally set a deadline and paint the left eye; when the goal is reached, you paint the second eye.

The app lives in `mobile/`; all paths below are relative to it. Open tasks are in `todo.txt`.

## Way of working
- Never commit in my repo yourself. I run `npm install` and `expo start` myself.
- When I say "just explain" or "don't write any files yet": only explain, change nothing.
- Code comments in English, short, in the style of the existing files. Values I want to tune myself go in named constants at the top of the file.
- Keep the files' line endings (most are CRLF, `package.json` is LF).
- If you change values I adjusted myself before, tell me.

## Stack
- Expo SDK 58 (just upgraded from 57), React Native 0.88, React 19.3, expo-router, zustand, AsyncStorage, i18next.
- Reanimated 4 with the React Compiler: shared values via `get()`/`set()`, not `.value`. `scheduleOnRN` from react-native-worklets.
- RN 0.88: `View` is a function component, refs as `useRef<ComponentRef<typeof View>>`.
- 3D: three + @react-three/fiber/native + expo-gl. Since the SDK 58 upgrade only tested on web; Gesture Handler jumped from 2 to 3, so check gestures on the phone.
- Goal: local only at first, later Play Store with 3D and home screen widgets (dev build instead of Expo Go).

## Design rules
- All text in exactly one bold font: M PLUS Rounded 1c Bold (`FONT` in `components/typography.tsx`). Never map `fontWeight` to other weights.
- Shadows via `shadowStyle()` from `constants/theme.ts`, animation durations in `constants/animations.ts`.
- Navigation per OS in `constants/navigation.ts` (swipe back, back arrow, ✕ to cancel, Android back goes one step back in a flow). Swipe back is intentionally off in the painting flows.
- In a flow you deliberately go back one step at a time (bottom left), which fits the zen feel. Top left only has a ✕ to cancel.
- Layouts should be dynamic, no fixed spacing: in the view and the confirm step the elements are distributed evenly and the Daruma takes the remaining height. The painting title always sits centered between the progress bar and the canvas. Always keep small devices (iPhone SE) in mind.

## Technical pitfalls (already solved, don't undo)
- `metro.config.js` redirects every `three` import to `three/build/three.module.js`: `three.cjs` calls `process.emitWarning` and crashes on iOS.
- R3F native marks loaded textures as `isDataTexture`; `clone()` loses the flag, so `prepareTexture` copies it (otherwise the textures are missing on iOS).
- Eyes: `components/3d/eye_texture.ts` rasterizes the drawings on the CPU into a DataTexture (R = left eye, G = right eye). In the shader always sample first, then mask, otherwise you get dark edges.
- `useWiggle` clamps `dt` to 1/30, otherwise the Daruma spins out to one side after returning to the screen.
- The canvas uses `locationX/Y` instead of `measure()` (was offset under transforms), children with `pointerEvents: "none"`.
- Web: images in swipe areas need `pointerEvents: "none"`; custom worklet layout animations don't work on web (presets only).

## Translations
- Languages (`i18n/locales`): en, de, fr, es, it, ja, zh. it/ja/zh were translated by Claude and not checked by native speakers. Chinese is hidden in the language picker until a suitable font is added.
- "Delete" is called "burn" in the texts (tradition of Daruma burning); the keys are still named `delete`.
