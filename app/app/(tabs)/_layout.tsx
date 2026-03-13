
import { router, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false
    }}>
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
                backgroundColor: 'lightgrey',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontSize: 32, lineHeight: 36 }}>+</Text>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}