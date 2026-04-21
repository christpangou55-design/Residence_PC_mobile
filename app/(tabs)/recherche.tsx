import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Calendar, Users, MapPin, SlidersHorizontal, History, Star, ArrowRight } from 'lucide-react-native';
import api, { BASE_URL } from '@/api/api';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function RechercheScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const [logements, setLogements] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState((q as string) || '');

  useEffect(() => {
    fetchLogements();
  }, []);

  const fetchLogements = async () => {
    try {
      const res = await api.get('/logements');
      const data = res.data.data || res.data;
      setLogements(data);
      
      // Apply initial filter if query exists
      if (q) {
        const initialQuery = q as string;
        const filteredData = data.filter((l: any) => 
          l.titre.toLowerCase().includes(initialQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(initialQuery.toLowerCase())
        );
        setFiltered(filteredData);
      } else {
        setFiltered(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filteredData = logements.filter(l => 
        l.titre.toLowerCase().includes(text.toLowerCase()) ||
        l.description.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(filteredData);
    } else {
      setFiltered(logements);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Premium Header */}
        <View className="mb-10">
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Résidence PC</Text>
              <Text className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Trouver <Text className="text-primary italic">L'Exception</Text></Text>
            </View>
            <TouchableOpacity className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <SlidersHorizontal size={20} color="#0056A4" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Inputs */}
        <View className="space-y-6">
          <View className="bg-slate-50 rounded-[30px] p-2 border border-slate-100 shadow-sm">
            <View className="flex-row items-center px-4 py-4">
              <MapPin size={22} color="#0056A4" />
              <TextInput 
                placeholder="Quelle est votre destination ?" 
                className="flex-1 ml-4 text-sm font-black text-slate-900"
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
          </View>

          <View className="flex-row space-x-4">
            <TouchableOpacity className="flex-1 flex-row items-center bg-slate-50 rounded-[25px] p-5 border border-slate-100">
              <Calendar size={18} color="#0056A4" />
              <View className="ml-3">
                <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Séjour</Text>
                <Text className="text-xs font-black text-slate-900 mt-0.5">Ajouter dates</Text>
              </View>
            </TouchableOpacity> 
            <TouchableOpacity className="flex-1 flex-row items-center bg-slate-50 rounded-[25px] p-5 border border-slate-100">
              <Users size={18} color="#0056A4" />
              <View className="ml-3">
                <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Personnes</Text>
                <Text className="text-xs font-black text-slate-900 mt-0.5">Ajouter</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results / Suggestions */}
        <View className="mt-14 mb-10">
          <View className="flex-row items-center mb-8 justify-between">
            <View className="flex-row items-center">
                <View className="bg-primary/5 p-2 rounded-lg">
                    <SearchIcon size={16} color="#0056A4" />
                </View>
                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">
                  {searchQuery ? 'Résultats de recherche' : 'Suggestions Privilège'}
                </Text>
            </View>
            <Text className="text-[10px] font-black text-primary uppercase tracking-widest">{filtered.length} Propriétés</Text>
          </View>
          
          {loading ? (
            <ActivityIndicator color="#0056A4" />
          ) : (
            <View className="space-y-6">
                {filtered.map(item => (
                    <SearchResultCard 
                        key={item.id}
                        item={item}
                        onPress={() => router.push(`/logements/${item.id}`)}
                    />
                ))}
                {filtered.length === 0 && (
                    <View className="py-20 items-center">
                        <Text className="text-slate-300 font-black text-lg text-center uppercase tracking-tighter">Aucun résultat trouvé pour "{searchQuery}"</Text>
                    </View>
                )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SearchResultCard({ item, onPress }: { item: any, onPress: () => void }) {
    const photo = item.photos && item.photos.length > 0 ? item.photos[0] : null;
    const photoUrl = photo ? `${BASE_URL}/storage/${photo.chemin}` : null;

    return (
        <TouchableOpacity onPress={onPress} className="bg-slate-50 p-4 rounded-[40px] border border-slate-100 shadow-sm flex-row items-center group">
            <View className="w-24 h-24 rounded-[25px] overflow-hidden bg-slate-200">
                {photoUrl ? (
                    <Image source={{ uri: photoUrl }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <View className="w-full h-full items-center justify-center">
                        <Star size={20} color="#cbd5e1" />
                    </View>
                )}
            </View>
            <View className="flex-1 ml-5">
                <View className="flex-row justify-between items-start">
                    <Text className="text-base font-black text-slate-900 tracking-tight flex-1" numberOfLines={1}>{item.titre}</Text>
                    <View className="flex-row items-center bg-white px-2 py-1 rounded-lg border border-slate-50">
                        <Star size={8} color="#f59e0b" fill="#f59e0b" />
                        <Text className="text-[8px] font-black ml-1 uppercase">4.9</Text>
                    </View>
                </View>
                <View className="flex-row items-center mt-2">
                    <MapPin size={10} color="#0056A4" />
                    <Text className="text-[10px] font-bold text-slate-400 ml-1.5 uppercase tracking-tighter">France</Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-lg font-black text-primary tracking-tighter">{Math.round(item.prix_nuit)}€<Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/nuit</Text></Text>
                    <View className="bg-primary/10 p-2 rounded-xl">
                        <ArrowRight size={14} color="#0056A4" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
