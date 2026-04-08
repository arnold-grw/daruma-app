
import { router, Tabs } from "expo-router";
import { Pressable} from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { Text } from '@/components/typography';
import useTheme from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
    screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontFamily: 'MyFont' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Shrine' }} />
      <Tabs.Screen
        name="plus"
        options={{
          title: '',
          tabBarButton: () => (
            <Pressable
              onPress={() => router.push('/daruma/new')}
              style={{
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.card,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.text, fontSize: 32, lineHeight: 36 }}>+</Text>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}