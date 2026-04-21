import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Shield, Gem, Crown, ChevronRight } from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function PremiumScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{ 
          headerTitle: 'Premium PC',
          headerTitleStyle: { fontWeight: '900', fontSize: 18 },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: '#0056A4',
        }} 
      />
      <ScrollView className="flex-1">
        {/* Banner Hero */}
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1628592102751-ba83b03dadc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' }}
            className="h-80 w-full overflow-hidden"
            resizeMode="cover"
        >
            <View className="absolute inset-0 bg-black/40 p-8 justify-end">
                <View className="bg-primary self-start px-4 py-1.5 rounded-full mb-4 border border-white/20">
                    <Text className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Excellence</Text>
                </View>
                <Text className="text-white text-5xl font-black tracking-tighter leading-[0.9]">Privilège <Text className="text-primary italic">Signature</Text></Text>
                <Text className="text-white/70 text-sm font-bold mt-4 max-w-xs uppercase tracking-widest">L'art de vivre d'exception par Résidence PC</Text>
            </View>
        </ImageBackground>

        <View className="px-6 -mt-10 mb-12">
            <View className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-50">
                <View className="flex-row items-center mb-8">
                    <View className="bg-primary/5 p-4 rounded-3xl border border-primary/10">
                        <Gem size={28} color="#0056A4" />
                    </View>
                    <View className="ml-5">
                        <Text className="text-2xl font-black tracking-tighter text-slate-900">Avantages</Text>
                        <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Statut Membre OR</Text>
                    </View>
                </View>

                <PremiumFeature 
                    icon={<Shield size={20} color="#0056A4" />} 
                    title="Assurance Totale" 
                    desc="Protection complète pour tous vos séjours PC." 
                />
                <PremiumFeature 
                    icon={<Crown size={20} color="#0056A4" />} 
                    title="Conciergerie 24/7" 
                    desc="Un assistant dédié pour toutes vos demandes." 
                />
                <PremiumFeature 
                    icon={<Star size={20} color="#0056A4" />} 
                    title="Accès Prioritaire" 
                    desc="Libérez les nouvelles résidences avant tout le monde." 
                />

                <TouchableOpacity className="bg-slate-900 w-full py-6 rounded-[25px] mt-8 flex-row items-center justify-center shadow-xl shadow-slate-900/20">
                    <Text className="text-white font-black text-xs uppercase tracking-[0.2em]">Devenir Membre Signature</Text>
                    <ChevronRight size={16} color="white" className="ml-2" />
                </TouchableOpacity>
            </View>

            <View className="mt-12">
                <Text className="text-2xl font-black tracking-tighter text-slate-900 mb-6">Sélection Signature</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                    <PremiumCard 
                        image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        title="Château PC Royale"
                        price="1,200€"
                    />
                    <PremiumCard 
                        image="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        title="Penthouse Azure"
                        price="850€"
                    />
                </ScrollView>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PremiumFeature({ icon, title, desc }: any) {
    return (
        <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 items-center justify-center bg-slate-50 rounded-2xl">
                {icon}
            </View>
            <View className="ml-4 flex-1">
                <Text className="text-sm font-black text-slate-900">{title}</Text>
                <Text className="text-xs text-slate-400 font-bold mt-0.5">{desc}</Text>
            </View>
        </View>
    )
}

function PremiumCard({ image, title, price }: any) {
    return (
        <TouchableOpacity className="mr-6 w-64">
            <Image source={{ uri: image }} className="w-full h-80 rounded-[35px]" resizeMode="cover" />
            <View className="absolute bottom-6 left-6 right-6 bg-white/95 p-5 rounded-3xl shadow-xl border border-white">
                <Text className="text-sm font-black text-slate-900 tracking-tight" numberOfLines={1}>{title}</Text>
                <Text className="text-primary font-black text-lg mt-1">{price}<Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest"> / nuit</Text></Text>
            </View>
        </TouchableOpacity>
    )
}
