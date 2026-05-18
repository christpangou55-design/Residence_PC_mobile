import React from 'react';
import { Tabs, Link } from 'expo-router';
import { Home, Search, Briefcase, User, Bell } from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0001bc',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0001bc',
          height: 100,
        },
        headerTitle: () => (
          <View className="flex-row items-center">
            <Text className="text-white text-xl font-bold tracking-tighter">Résidence PC</Text>
          </View>
        ),
        headerRight: () => (
          <Link href="/notifications" asChild>
            <TouchableOpacity className="mr-6">
              <Bell size={22} color="white" />
            </TouchableOpacity>
          </Link>
        ),
        tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
            paddingTop: 8,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
            backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recherche"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: 'Réservations',
          tabBarIcon: ({ color }) => <Briefcase size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
