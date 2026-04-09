import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { Text } from '@/components/typography';
import useTheme from "@/constants/theme";
import { HomeIcon, ProfileIcon } from "@/components/icons/tabs";

SplashScreen.preventAutoHideAsync();

export default function TabsLayout() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("index"); // Standardmäßig "index" aktiv

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          height: 85,
        },
        tabBarItemStyle: {
          height: 85,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: { fontFamily: 'MyFont' },
        //tabBarActiveTintColor: colors.primary,
        //tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarButton: () => (
            <Pressable
              onPress={() => {
                setActiveTab("index");
                router.push('/');
              }}
              style={{
                width: 70,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <HomeIcon color={activeTab === "index" ? colors.text : colors.textSecondary} />
            </Pressable>
          ),
        }}
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
                //borderWidth: 4,
                //borderColor: colors.textSecondary,
                backgroundColor: colors.text,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.card, fontSize: 40}}>+</Text>
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarButton: () => (
            <Pressable
              onPress={() => {
                setActiveTab("profile");
                router.push('/profile');
              }}
              style={{
                width: 70,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ProfileIcon color={activeTab === "profile" ? colors.text : colors.textSecondary} />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}