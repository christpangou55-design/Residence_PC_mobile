import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Star } from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function ProximiteScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{ 
          headerTitle: 'Autour de moi',
          headerTitleStyle: { fontWeight: '900', fontSize: 18 },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#0056A4',
        }} 
      />
      <View className="flex-1">
        {/* Simuler une carte avec un design premium */}
        <View className="h-2/5 bg-slate-100 relative">
            <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
                className="w-full h-full opacity-60"
                resizeMode="cover"
            />
            <View className="absolute inset-0 items-center justify-center">
                <View className="bg-primary p-4 rounded-full shadow-2xl border-4 border-white">
                    <MapPin size={24} color="white" />
                </View>
                <View className="bg-white px-4 py-2 rounded-2xl shadow-xl mt-4 border border-slate-100">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-primary">Votre position actuelle</Text>
                </View>
            </View>
        </View>

        <View className="flex-1 bg-white rounded-t-[50px] -mt-12 px-6 pt-8 shadow-2xl border-t border-slate-100">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-black tracking-tighter text-slate-900">À proximité</Text>
                <View className="bg-slate-50 px-3 py-1.5 rounded-xl flex-row items-center border border-slate-100">
                    <Navigation size={12} color="#0056A4" />
                    <Text className="text-[10px] font-bold ml-1.5 text-slate-900">Rayon 5km</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <NearbyItem 
                    title="Villa Horizon PC" 
                    distance="800m" 
                    price="120€" 
                    rating="4.9"
                    image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                />
                <NearbyItem 
                    title="Pavillon de Luxe" 
                    distance="1.2km" 
                    price="250€" 
                    rating="5.0"
                    image="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                />
            </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function NearbyItem({ title, distance, price, rating, image }: any) {
    return (
        <TouchableOpacity className="flex-row items-center bg-slate-50 p-4 rounded-[30px] border border-slate-100 mb-4 shadow-sm">
            <Image source={{ uri: image }} className="w-20 h-20 rounded-2xl" />
            <View className="flex-1 ml-4">
                <Text className="text-sm font-black text-slate-900 leading-tight">{title}</Text>
                <View className="flex-row items-center mt-1">
                    <MapPin size={10} color="#94a3b8" />
                    <Text className="text-[10px] font-bold text-slate-400 ml-1">{distance}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-primary font-black text-base">{price}</Text>
                    <View className="flex-row items-center bg-white px-2 py-1 rounded-lg border border-slate-50">
                        <Star size={8} color="#f59e0b" fill="#f59e0b" />
                        <Text className="text-[8px] font-black ml-1 uppercase">{rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
