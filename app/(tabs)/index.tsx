import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, SafeAreaView, TextInput } from 'react-native';
import { Link, useRouter } from 'expo-router';
import api, { BASE_URL } from '@/api/api';
import { Calendar, Star, ChevronRight, Search, MapPin, Bell } from 'lucide-react-native';

interface Logement {
  id: number;
  titre: string;
  prix_nuit: number;
  capacite: number;
  photos: { chemin: string }[];
}

export default function HomeScreen() {
  const [logements, setLogements] = useState<Logement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/(tabs)/recherche',
        params: { q: searchQuery.trim() }
      });
    } else {
      router.push('/(tabs)/recherche');
    }
  };

  useEffect(() => {
    fetchLogements();
  }, []);

  const fetchLogements = async () => {
    try {
      const res = await api.get('/logements');
      const data = res.data.data || res.data || [];
      setLogements(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0056A4" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement PC...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header & Premium Search */}
        <View className="bg-primary pt-4 pb-10 px-6 rounded-b-[50px] shadow-2xl overflow-hidden">
            {/* Background decorative elements */}
            <View className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
            
            <View className="flex-row justify-between items-center mb-8">
                <View>
                    <Text className="text-white/60 text-xs font-black uppercase tracking-[0.3em]">Résidence PC</Text>
                    <Text className="text-white text-3xl font-black mt-1 tracking-tighter">Bienvenue</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => router.push('/notifications')}
                    className="bg-white/10 p-3 rounded-2xl border border-white/10"
                >
                    <Bell size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View className="bg-white rounded-3xl p-2 shadow-2xl shadow-primary/20">
                <View className="flex-row items-center bg-slate-50 rounded-2xl px-4 py-3">
                    <Search size={20} color="#64748b" />
                    <TextInput 
                        placeholder="Où allez-vous ?" 
                        className="flex-1 ml-3 text-sm font-semibold text-slate-900" 
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity onPress={handleSearch} className="bg-primary px-4 py-2 rounded-xl">
                        <Text className="text-white font-black text-[10px] uppercase">Rechercher</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* Categories / Quick Actions */}
        <View className="flex-row px-6 mt-8 space-x-4">
            <QuickAction onPress={() => router.push('/proximite')} icon={<MapPin size={18} color="#0056A4" />} label="Proximité" />
            <QuickAction onPress={() => router.push('/planning')} icon={<Calendar size={18} color="#0056A4" />} label="Planning" />
            <QuickAction onPress={() => router.push('/premium')} icon={<Star size={18} color="#0056A4" />} label="Premium" />
        </View>

        {/* Logements populaires */}
        <View className="px-6 mt-10">
          <View className="flex-row justify-between items-end mb-6">
            <View>
                <Text className="text-2xl font-black tracking-tighter text-slate-900">Collections</Text>
                <View className="h-1 w-8 bg-primary mt-1 rounded-full" />
            </View>
            <TouchableOpacity onPress={() => router.push('/recherche')} className="flex-row items-center">
                <Text className="text-primary font-bold text-xs mr-1 uppercase tracking-tighter">Tout voir</Text>
                <ChevronRight size={14} color="#0056A4" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            className="-mx-6 px-6"
          >
            {logements.map((item) => {
              const mainPhoto = item.photos && item.photos.length > 0 ? item.photos[0] : null;
              const photoUrl = mainPhoto
                ? `${BASE_URL}/storage/${mainPhoto.chemin}`
                : null;

              return (
                <Link key={item.id} href={`/logements/${item.id}`} asChild>
                  <TouchableOpacity className="mr-6 w-72">
                    <View className="bg-slate-100 aspect-[16/11] w-full mb-4 overflow-hidden rounded-[30px] shadow-lg border border-slate-100 relative">
                      {photoUrl ? (
                        <Image
                          source={{ uri: photoUrl }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-full items-center justify-center bg-slate-50">
                          <Star size={30} color="#e2e8f0" strokeWidth={1} />
                          <Text className="text-slate-300 text-[8px] font-black uppercase tracking-[0.5em] mt-3">RÉSIDENCE PC</Text>
                        </View>
                      )}
                      <View className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-2xl flex-row items-center shadow-sm border border-slate-50">
                        <Star size={10} color="#f59e0b" fill="#f59e0b" />
                        <Text className="text-[10px] font-black ml-1.5 text-slate-900">4.9</Text>
                      </View>
                    </View>
                    <View className="px-1">
                      <Text className="font-black text-lg text-slate-900 tracking-tight" numberOfLines={1}>{item.titre}</Text>
                      <View className="flex-row items-center mt-2">
                        <View className="bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                          <Text className="text-green-700 text-[8px] font-black uppercase tracking-widest">Disponible</Text>
                        </View>
                        <View className="flex-1" />
                        <View className="flex-row items-baseline">
                            <Text className="font-black text-xl text-primary">{item.prix_nuit}€</Text>
                            <Text className="text-[8px] font-bold text-slate-400 uppercase ml-1">/ nuit</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              );
            })}
          </ScrollView>
        </View>

        {/* Offres spéciales */}
        <View className="px-6 mt-8 mb-12">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-black tracking-tighter text-slate-900">Offres de Saison</Text>
          </View>

          <TouchableOpacity className="w-full h-48 rounded-[35px] overflow-hidden relative shadow-xl shadow-primary/10">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 justify-end">
              <Text className="text-white text-3xl font-black leading-none drop-shadow-lg">Avril d'Exception <Text className="text-primary">-25%</Text></Text>
              <Text className="text-white/80 text-xs font-bold mt-2 uppercase tracking-widest">Réservez votre évasion printanière</Text>
              <TouchableOpacity 
                onPress={() => router.push('/offres')}
                className="bg-white self-start px-6 py-3 rounded-2xl mt-4 shadow-xl"
              >
                <Text className="text-primary font-black text-[10px] uppercase tracking-wider">Découvrir</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress?: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} className="flex-1 items-center bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
            {icon}
            <Text className="text-slate-900 text-[10px] font-black mt-2 uppercase tracking-tighter">{label}</Text>
        </TouchableOpacity>
    )
}

