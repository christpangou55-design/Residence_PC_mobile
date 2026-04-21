import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function PlanningScreen() {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{ 
          headerTitle: 'Planning',
          headerTitleStyle: { fontWeight: '900', fontSize: 18 },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#0056A4',
        }} 
      />
      <ScrollView className="flex-1 px-6 pt-4">
        <View className="flex-row items-center justify-between mb-8">
            <View>
                <Text className="text-3xl font-black tracking-tighter text-slate-900">Calendrier</Text>
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Avril 2026</Text>
            </View>
            <View className="flex-row space-x-2">
                <TouchableOpacity className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <ChevronLeft size={20} color="#0056A4" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <ChevronRight size={20} color="#0056A4" />
                </TouchableOpacity>
            </View>
        </View>

        {/* Days of week */}
        <View className="flex-row justify-between mb-4">
            {days.map((day, i) => (
                <Text key={i} className="text-slate-400 text-[10px] font-black w-10 text-center uppercase tracking-widest">{day}</Text>
            ))}
        </View>

        {/* Grid dots simulation for planning */}
        <View className="flex-row flex-wrap justify-between">
            {dates.map((date) => {
                const isSelected = date === 17;
                const isBooked = [12, 13, 14, 25, 26].includes(date);
                
                return (
                    <TouchableOpacity 
                        key={date} 
                        className={`w-10 h-10 items-center justify-center rounded-2xl mb-4 border ${
                            isSelected ? 'bg-primary border-primary shadow-lg shadow-primary/30' : 
                            isBooked ? 'bg-slate-50 border-slate-100' : 'bg-white border-white'
                        }`}
                    >
                        <Text className={`font-black text-sm ${isSelected ? 'text-white' : isBooked ? 'text-slate-200 line-through' : 'text-slate-900'}`}>{date}</Text>
                        {isBooked && !isSelected && <View className="w-1 h-1 bg-red-400 rounded-full mt-0.5" />}
                    </TouchableOpacity>
                );
            })}
        </View>

        <View className="mt-10">
            <Text className="text-xl font-black tracking-tighter text-slate-900 mb-6">Prochains Séjours</Text>
            
            <View className="bg-slate-900 p-6 rounded-[35px] shadow-2xl overflow-hidden relative">
                <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <View className="flex-row items-center mb-4">
                    <View className="bg-white/10 p-3 rounded-2xl border border-white/10">
                        <Clock size={20} color="white" />
                    </View>
                    <View className="ml-4">
                        <Text className="text-white font-black text-lg tracking-tight">Villa PC Horizon</Text>
                        <Text className="text-white/50 text-[10px] font-bold uppercase tracking-widest">12 - 15 Avril 2026</Text>
                    </View>
                </View>
                <View className="h-px bg-white/10 w-full mb-4" />
                <TouchableOpacity className="bg-white py-4 rounded-2xl items-center shadow-xl">
                    <Text className="text-primary font-black text-[10px] uppercase tracking-wider">Détails de la réservation</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
