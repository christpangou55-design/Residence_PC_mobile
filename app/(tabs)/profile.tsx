import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { LogOut, User, ChevronRight, Settings, HelpCircle, ShieldCheck, CreditCard, Bell } from 'lucide-react-native';
import api from '@/api/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Check user error:', err);
      await SecureStore.deleteItemAsync('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkUser();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    }
    await SecureStore.deleteItemAsync('token');
    setUser(null);
    router.replace('/(tabs)');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#0001bc" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-8 pt-8" showsVerticalScrollIndicator={false}>
        <View className="mb-10">
          <Text className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Espace Membre</Text>
          <Text className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Votre <Text className="text-primary italic">Profil Privilège</Text></Text>
        </View>

        {!user ? (
          <View className="bg-slate-50 p-10 rounded-[50px] border border-slate-100 items-center justify-center shadow-sm">
            <View className="bg-white p-6 rounded-3xl mb-6 shadow-sm border border-slate-50">
                <User size={32} color="#0001bc" />
            </View>
            <Text className="text-2xl font-black text-slate-900 tracking-tighter text-center">Accès Réservé</Text>
            <Text className="text-slate-400 mt-3 text-center font-medium leading-relaxed mb-10">Connectez-vous pour accéder à vos services exclusifs et gérer vos séjours.</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              className="bg-primary px-10 py-5 rounded-[25px] shadow-xl shadow-primary/20 w-full items-center"
            >
              <Text className="text-white font-black text-xs uppercase tracking-[0.3em]">Se Connecter</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* User Header Card */}
            <View className="bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-slate-300 relative overflow-hidden mb-12">
               <View className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16" />
               <View className="flex-row items-center mb-10">
                  <View className="bg-white p-1 rounded-2xl shadow-sm">
                    <View className="bg-primary w-16 h-16 rounded-[14px] items-center justify-center">
                        <Text className="text-white text-3xl font-black">
                        {(user.nom || user.name || '?').charAt(0).toUpperCase()}
                        </Text>
                    </View>
                  </View>
                  <View className="ml-5">
                    <Text className="text-2xl font-black text-white tracking-tighter">{user.nom || user.name}</Text>
                    <View className="flex-row items-center mt-1">
                        <ShieldCheck size={12} color="#3b82f6" />
                        <Text className="text-primary-light text-[10px] font-black uppercase tracking-widest ml-1">Membre Platinum</Text>
                    </View>
                  </View>
               </View>

               <View className="flex-row justify-between pt-6 border-t border-white/10">
                  <StatItem label="Séjours" value="12" />
                  <StatItem label="Points PC" value="2.4k" />
                  <StatItem label="Crédits" value="450€" />
               </View>
            </View>

            {/* Menu Items */}
            <View className="space-y-4 mb-20">
              <ProfileMenuItem 
                onPress={() => router.push('/settings')} 
                icon={<Settings size={18} color="#0001bc" />} 
                title="Configuration du Compte" 
                subtitle="Sécurité et préférences"
              />
              <ProfileMenuItem 
                onPress={() => router.push('/reservations')} 
                icon={<CreditCard size={18} color="#0001bc" />} 
                title="Paiements & Factures" 
                subtitle="Gérer vos modes de paiement"
              />
              <ProfileMenuItem 
                onPress={() => router.push('/notifications')} 
                icon={<Bell size={18} color="#0001bc" />} 
                title="Alertes & Rappels" 
                subtitle="Paramètres de notification"
              />
              <ProfileMenuItem 
                onPress={() => router.push('/help')} 
                icon={<HelpCircle size={18} color="#0001bc" />} 
                title="Centre d'Assistance" 
                subtitle="Vous aider à chaque étape"
              />

              {user.role === 'vendeur' || user.role === 'admin' ? (
                <ProfileMenuItem 
                  onPress={() => router.push('/vendeur/my-logements')} 
                  icon={<ShieldCheck size={18} color="#0001bc" />} 
                  title="Espace Vendeur" 
                  subtitle="Gérer vos annonces et logements"
                />
              ) : null}



              
              <TouchableOpacity 
                onPress={handleLogout}
                className="flex-row items-center justify-between p-6 bg-rose-50 rounded-[30px] border border-rose-100 mt-8"
              >
                <View className="flex-row items-center">
                  <LogOut size={18} color="#ef4444" />
                  <Text className="ml-4 text-xs font-black text-rose-500 uppercase tracking-widest">Déconnexion</Text>
                </View>
                <ChevronRight size={16} color="#fda4af" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <View className="items-center">
            <Text className="text-white text-lg font-black tracking-tight">{value}</Text>
            <Text className="text-white/40 text-[8px] font-black uppercase tracking-widest mt-1">{label}</Text>
        </View>
    )
}

function ProfileMenuItem({ icon, title, subtitle, onPress }: { icon: any, title: string, subtitle: string, onPress?: () => void }) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between p-6 bg-slate-50 rounded-[30px] border border-slate-100"
    >
      <View className="flex-row items-center">
        <View className="bg-white p-3 rounded-xl shadow-sm border border-slate-50">
            {icon}
        </View>
        <View className="ml-4">
            <Text className="text-sm font-black text-slate-900 tracking-tight">{title}</Text>
            <Text className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={16} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

