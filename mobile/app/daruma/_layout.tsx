import { NAVIGATION } from "@/constants/navigation";
import { Stack } from "expo-router";

export default function DarumaLayout() {
  return (
    // iOS swipe back: see constants/navigation.ts (the painting flows switch it with useSwipeBack)
    <Stack screenOptions={{ headerShown: false, gestureEnabled: NAVIGATION.swipeBack }}>
    </Stack>
    )
}