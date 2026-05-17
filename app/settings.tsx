import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Lock, Globe, Shield, CreditCard, ChevronRight } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [biometrics, setBiometrics] = React.useState(false);

  const handleSave = () => {
    Alert.alert(
        "Paramètres enregistrés",
        "Vos préférences ont été mises à jour avec succès.",
        [{ text: "Excellent", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen 
        options={{ 
          headerTitle: 'Paramètres',
          headerTitleStyle: { fontWeight: '900', fontSize: 18 },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTintColor: '#0001bc',
        }} 
      />
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-black tracking-tighter text-slate-900 mb-8">Compte</Text>

        <Section title="Profil & Sécurité">
            <SettingItem icon={<User size={18} color="#0001bc" />} title="Informations Personnelles" />
            <SettingItem icon={<Lock size={18} color="#0001bc" />} title="Mot de passe" />
            <SettingItem icon={<Shield size={18} color="#0001bc" />} title="Confidentialité" />
        </Section>

        <Section title="Préférences">
            <View className="flex-row items-center justify-between py-5 border-b border-slate-50">
                <View className="flex-row items-center">
                    <View className="bg-slate-50 p-2 rounded-xl">
                        <Bell size={18} color="#0001bc" />
                    </View>
                    <Text className="ml-4 text-sm font-bold text-slate-900">Notifications Push</Text>
                </View>
                <Switch 
                    value={notifications} 
                    onValueChange={setNotifications}
                    trackColor={{ false: '#f1f5f9', true: '#0001bc' }}
                />
            </View>
            <View className="flex-row items-center justify-between py-5 border-b border-slate-50">
                <View className="flex-row items-center">
                    <View className="bg-slate-50 p-2 rounded-xl">
                        <Lock size={18} color="#0001bc" />
                    </View>
                    <Text className="ml-4 text-sm font-bold text-slate-900">Face ID / Touch ID</Text>
                </View>
                <Switch 
                    value={biometrics} 
                    onValueChange={setBiometrics}
                    trackColor={{ false: '#f1f5f9', true: '#0001bc' }}
                />
            </View>
            <SettingItem icon={<Globe size={18} color="#0001bc" />} title="Langue & Région" value="Français (FR)" />
        </Section>

        <Section title="Paiement">
            <SettingItem icon={<CreditCard size={18} color="#0001bc" />} title="Modes de paiement" />
        </Section>

        <View className="mt-8 mb-20 space-y-4">
            <TouchableOpacity 
                onPress={handleSave}
                className="bg-primary py-6 rounded-[25px] items-center shadow-xl shadow-primary/20"
            >
                <Text className="text-white font-black text-xs uppercase tracking-[0.2em]">Sauvegarder les modifications</Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-5 bg-red-50 rounded-[25px] items-center border border-red-100">
                <Text className="text-red-500 font-black text-[10px] uppercase tracking-widest">Supprimer le compte</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: any) {
    return (
        <View className="mb-8">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{title}</Text>
            <View className="bg-white rounded-[30px]">{children}</View>
        </View>
    )
}

function SettingItem({ icon, title, value }: any) {
    return (
        <TouchableOpacity className="flex-row items-center justify-between py-5 border-b border-slate-50">
            <View className="flex-row items-center">
                <View className="bg-slate-50 p-2 rounded-xl">
                    {icon}
                </View>
                <Text className="ml-4 text-sm font-bold text-slate-900">{title}</Text>
            </View>
            <View className="flex-row items-center">
                {value && <Text className="mr-2 text-xs font-bold text-slate-400 capitalize">{value}</Text>}
                <ChevronRight size={16} color="#cbd5e1" />
            </View>
        </TouchableOpacity>
    )
}
