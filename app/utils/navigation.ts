import { router } from "expo-router";
import { Href } from "expo-router";

export const safeBack = (fallback: Href = "/") => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
};