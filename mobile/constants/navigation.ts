import { Platform } from "react-native";

/**
 * How the user gets back, per operating system. Change the values here to switch things on or off.
 * (The Android system back is always there; on Android the swipe values do nothing.)
 */
interface NavigationSettings {
  // iOS: swipe from the left edge goes back (on all pages except the painting flows)
  swipeBack: boolean;
  // iOS: swipe back also in the painting flows (new daruma, second eye), where it easily happens while painting
  swipeBackWhilePainting: boolean;
  // back arrow at the top left of the daruma view, at the height of the "⋯"
  backButtonTop: boolean;
  // ✕ left of the progress bar in the new daruma steps: cancels the whole flow (the draft is discarded)
  cancelButtonTop: boolean;
  // Android system back (gesture or button) in the flows: one step back instead of leaving the flow
  systemBackStepsBack: boolean;
}

const SETTINGS: { ios: NavigationSettings; android: NavigationSettings; default: NavigationSettings } = {
  ios: {
    swipeBack: true,
    swipeBackWhilePainting: false,
    backButtonTop: true,
    cancelButtonTop: true,
    systemBackStepsBack: true,
  },
  android: {
    swipeBack: true,
    swipeBackWhilePainting: false,
    backButtonTop: true,
    cancelButtonTop: true,
    systemBackStepsBack: true,
  },
  // web
  default: {
    swipeBack: true,
    swipeBackWhilePainting: false,
    backButtonTop: true,
    cancelButtonTop: true,
    systemBackStepsBack: true,
  },
};

export const NAVIGATION = Platform.select(SETTINGS);
