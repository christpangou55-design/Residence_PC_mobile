import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag, Sparkles, ChevronRight, Clock } from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function OffresScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{ 
          headerTitle: 'Offres Spéciales',
          headerTitleStyle: { fontWeight: '900', fontSize: 18 },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#0056A4',
        }} 
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
            <Text className="text-3xl font-black tracking-tighter text-slate-900 mb-2">Promotions de Saison</Text>
            <View className="flex-row items-center mb-8">
                <Sparkles size={14} color="#0056A4" />
                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] ml-2">Mise à jour quotidiennement</Text>
            </View>

            <OfferLarge 
                title="Printemps Azure" 
                subtitle="-30% sur les séjours de +4 nuits" 
                image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                tag="Offre Limitée"
            />

            <Text className="text-xl font-black tracking-tighter text-slate-900 mb-6 mt-12">Dernière Minute</Text>
            
            <OfferMedium 
                title="Weekend Spa & Détente" 
                discount="-150€" 
                image="https://images.unsplash.com/photo-1544161515-4ae6ce6ca8b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            
            <OfferMedium 
                title="Evasion Urbaine" 
                discount="-20%" 
                image="https://images.unsplash.com/photo-1512918728675-ed5a9ecde9d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />

            <View className="bg-slate-900 p-8 rounded-[40px] mt-8 mb-12 flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                    <Text className="text-white text-xl font-black tracking-tighter">Parrainez un ami</Text>
                    <Text className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Gagnez 50€ de crédit voyage</Text>
                </View>
                <TouchableOpacity className="bg-primary p-4 rounded-2xl">
                    <ChevronRight size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OfferLarge({ title, subtitle, image, tag }: any) {
    return (
        <TouchableOpacity className="w-full h-96 rounded-[45px] overflow-hidden shadow-2xl relative">
            <ImageBackground source={{ uri: image }} className="w-full h-full">
                <View className="absolute inset-0 bg-black/30 p-8 justify-between">
                    <View className="bg-white self-start px-4 py-2 rounded-2xl flex-row items-center">
                        <Tag size={12} color="#0056A4" />
                        <Text className="text-primary text-[10px] font-black uppercase tracking-widest ml-2">{tag}</Text>
                    </View>
                    <View>
                        <Text className="text-white text-4xl font-black tracking-tighter leading-none">{title}</Text>
                        <Text className="text-white/80 text-sm font-bold mt-2">{subtitle}</Text>
                        <View className="bg-primary self-start px-6 py-3 rounded-2xl mt-6">
                            <Text className="text-white font-black text-[10px] uppercase tracking-widest">En profiter</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

function OfferMedium({ title, discount, image }: any) {
    return (
        <TouchableOpacity className="w-full bg-slate-50 flex-row items-center p-4 rounded-[35px] border border-slate-100 mb-6 font-bold">
            <Image source={{ uri: image }} className="w-24 h-24 rounded-3xl" />
            <View className="flex-1 ml-5">
                <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1.5">Expire bientôt</Text>
                </View>
                <Text className="text-base font-black text-slate-900 mt-1 leading-tighter">{title}</Text>
                <View className="bg-white self-start px-3 py-1 rounded-xl mt-2 border border-slate-50">
                    <Text className="text-primary font-black text-xs">{discount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
