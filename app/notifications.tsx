import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronRight, Info, CheckCircle, Clock } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      title: 'Réservation confirmée',
      message: 'Votre séjour à la Villa des Alizés est confirmé pour le 12 Mai.',
      time: 'Il y a 2 heures',
      type: 'success',
      icon: <CheckCircle size={20} color="#22c55e" />,
    },
    {
      id: 2,
      title: 'Offre spéciale PC',
      message: 'Profitez de -20% sur votre prochaine réservation ce weekend.',
      time: 'Il y a 5 heures',
      type: 'info',
      icon: <Info size={20} color="#0001bc" />,
    },
    {
      id: 3,
      title: 'Rappel de check-in',
      message: 'N\'oubliez pas de remplir vos informations de check-in.',
      time: 'Hier',
      type: 'warning',
      icon: <Clock size={20} color="#f59e0b" />,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{ 
          headerTitle: 'Notifications',
          headerTitleStyle: { fontWeight: '900', fontSize: 18 },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTintColor: '#0001bc',
        }} 
      />
      <ScrollView className="flex-1 px-6 pt-4">
        <View className="flex-row items-center justify-between mb-8">
            <Text className="text-3xl font-black tracking-tighter text-slate-900">Activités</Text>
            <TouchableOpacity>
                <Text className="text-primary font-bold text-xs uppercase tracking-widest">Tout marquer</Text>
            </TouchableOpacity>
        </View>

        {notifications.map((notif) => (
          <TouchableOpacity 
            key={notif.id} 
            className="flex-row items-start bg-slate-50 p-5 rounded-[25px] border border-slate-100 mb-4 shadow-sm"
          >
            <View className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50 font-bold">
              {notif.icon}
            </View>
            <View className="flex-1 ml-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-black text-slate-900">{notif.title}</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase">{notif.time}</Text>
              </View>
              <Text className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View className="items-center py-12">
            <View className="bg-slate-50 p-6 rounded-full">
                <Bell size={24} color="#94a3b8" />
            </View>
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Vous êtes à jour</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
