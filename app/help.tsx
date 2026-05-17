import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelpCircle, Search, MessageSquare, Phone, Mail, ChevronRight } from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function HelpScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{ 
          headerTitle: 'Assistance',
          headerTitleStyle: { fontWeight: '900', fontSize: 18 },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTintColor: '#0001bc',
        }} 
      />
      <ScrollView className="flex-1 px-6 pt-4">
        <Text className="text-3xl font-black tracking-tighter text-slate-900 mb-8">Comment pouvons-nous vous aider ?</Text>

        <View className="bg-slate-50 flex-row items-center px-6 py-5 rounded-[25px] border border-slate-100 mb-10 shadow-sm">
            <Search size={20} color="#94a3b8" />
            <TextInput 
                placeholder="Rechercher un sujet..." 
                className="ml-3 flex-1 text-sm font-bold text-slate-900"
                placeholderTextColor="#94a3b8"
            />
        </View>

        <Section title="Sujets Populaires">
            <HelpItem title="Comment réserver une résidence ?" />
            <HelpItem title="Politique d'annulation PC" />
            <HelpItem title="Gérer mes moyens de paiement" />
            <HelpItem title="Devenir un hôte Résidence PC" />
        </Section>

        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 mt-8">Nous Contacter</Text>
        <View className="flex-row space-x-4 mb-12">
            <ContactCard icon={<MessageSquare size={24} color="#0001bc" />} label="Chat live" />
            <ContactCard icon={<Phone size={24} color="#0001bc" />} label="Appel" />
            <ContactCard icon={<Mail size={24} color="#0001bc" />} label="Email" />
        </View>

        <TouchableOpacity className="bg-primary p-6 rounded-[30px] flex-row items-center justify-between shadow-xl shadow-primary/20 mb-12">
            <View className="flex-row items-center">
                <View className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <HelpCircle size={20} color="white" />
                </View>
                <View className="ml-4">
                    <Text className="text-white font-black text-base">Guide Complet PC</Text>
                    <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-0.5">Tout savoir sur l'expérience</Text>
                </View>
            </View>
            <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: any) {
    return (
        <View>
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{title}</Text>
            {children}
        </View>
    )
}

function HelpItem({ title }: any) {
    return (
        <TouchableOpacity className="flex-row items-center justify-between py-5 border-b border-slate-50">
            <Text className="text-sm font-bold text-slate-900">{title}</Text>
            <ChevronRight size={16} color="#cbd5e1" />
        </TouchableOpacity>
    )
}

function ContactCard({ icon, label }: any) {
    return (
        <TouchableOpacity className="flex-1 bg-slate-50 p-6 rounded-[30px] items-center border border-slate-100 shadow-sm">
            <View className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                {icon}
            </View>
            <Text className="text-slate-900 text-[10px] font-black mt-4 uppercase tracking-tighter">{label}</Text>
        </TouchableOpacity>
    )
}
