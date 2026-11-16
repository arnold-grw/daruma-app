import { Easing, WithTimingConfig } from "react-native-reanimated";

// Durations (ms) of the custom UI animations. Change them here to tune them everywhere.
export const ANIMATION_DURATION = {
  modalIn: 260,
  modalOut: 200,
  dropdown: 220,
  toggle: 180,
  stepChange: 250,     // new daruma flow: old step fades out, new step fades in
  progressFill: 300,   // new daruma flow: a progress bar segment fills or empties
  newCardDelay: 250,   // home: wait until the screen change is over before the new card slides in
  newCardSlide: 250,   // home: new card slides in from the left
  textSwapOut: 150,    // profile: old text fades out after a language change
  textSwapIn: 200,     // profile: new text fades in
  textSwapStagger: 60, // profile: delay between two lines, so the texts change from top to bottom
  themeFade: 350,      // dark/light switch: the picture of the old colors fades out
  splashRise: 1400,    // intro title screen: the 3D daruma rises from below and turns to the front
  splashTitle: 900,    // intro title screen: "Daruma" and the Japanese name glide in
  splashButton: 500,   // intro title screen: the start button fades in
  splashOut: 300,      // intro title screen fades out after "Start"
  splashPagesIn: 400,  // then the first intro page fades in and the action bar slides up
};

// Starts fast and slows down at the end: for things that appear or open
export const EASE_OUT = Easing.out(Easing.cubic);
// Starts slow and speeds up: for things that disappear or close
export const EASE_IN = Easing.in(Easing.cubic);

export const timing = (duration: number, easing = EASE_OUT): WithTimingConfig => ({ duration, easing });
