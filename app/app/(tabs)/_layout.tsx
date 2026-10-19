import { HomeIcon, HourglassIcon, ProfileIcon } from "@/components/icons/tab_icons";
import { Text } from '@/components/typography';
import useTheme from "@/constants/theme";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { router, Tabs } from "expo-router";
import { ComponentType } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Uses the navigator's own onPress, so switching tabs jumps to the tab instead of pushing a new screen
function TabButton({ Icon, onPress, 'aria-selected': selected }: BottomTabBarButtonProps & { Icon: ComponentType<{ color: string }> }) {
  const { colors } = useTheme();
  const isSelected = !!selected;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      style={{
        width: 70,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon color={isSelected ? colors.text : colors.textSecondary} />
    </Pressable>
  );
}

export default function TabsLayout() {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          height: 85 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          shadowColor: shadows.color, shadowOffset: { width: shadows.x_offset, height: shadows.y_offset }, shadowOpacity: shadows.opacity, shadowRadius: shadows.radius, elevation: shadows.elevation
        },
        tabBarItemStyle: {
          height: 85,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: { fontFamily: 'MyFont' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: '', tabBarButton: (props) => <TabButton {...props} Icon={HomeIcon} /> }}
      />

      <Tabs.Screen
        name="archive"
        options={{ title: '', tabBarButton: (props) => <TabButton {...props} Icon={HourglassIcon} /> }}
      />

      <Tabs.Screen
        name="profile"
        options={{ title: '', tabBarButton: (props) => <TabButton {...props} Icon={ProfileIcon} /> }}
      />

      <Tabs.Screen
        name="plus"
        options={{
          title: '',
          tabBarButton: () => (
            <Pressable
              onPress={() => router.push('/daruma/new')}
              style={{
                width: 50,
                height: 50,
                borderRadius: 15,
                backgroundColor: colors.text,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.card, fontSize: 32}}>+</Text>
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
