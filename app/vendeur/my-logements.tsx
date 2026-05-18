import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Edit2, Trash2, Home, MapPin, Star } from 'lucide-react-native';
import api, { BASE_URL } from '@/api/api';

export default function MyLogementsScreen() {
  const router = useRouter();
  const [logements, setLogements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyLogements = async () => {
    try {
      const res = await api.get('/vendeur/logements');
      setLogements(res.data.data || res.data || []);
    } catch (err) {
      console.error('Fetch my logements error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLogements();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette annonce ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/logements/${id}`);
              setLogements(logements.filter(l => l.id !== id));
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Erreur', 'Impossible de supprimer le logement.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const mainPhoto = item.photos && item.photos.length > 0 ? item.photos[0] : null;
    const photoUrl = mainPhoto ? `${BASE_URL}/storage/${mainPhoto.chemin}` : null;

    return (
      <View className="bg-white mx-6 mb-6 rounded-[30px] border border-slate-100 shadow-xl shadow-slate-200 overflow-hidden">
        <View className="flex-row">
          <View className="w-1/3 h-32 bg-slate-100">
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Home size={24} color="#cbd5e1" />
              </View>
            )}
          </View>
          <View className="p-4 flex-1 justify-between">
            <View>
              <Text className="font-black text-lg text-slate-900 tracking-tight" numberOfLines={1}>{item.titre}</Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={10} color="#94a3b8" />
                <Text className="text-[10px] font-bold text-slate-400 ml-1 uppercase">{item.ville || 'Destination'}</Text>
              </View>
              <Text className="text-primary font-black mt-2">{item.prix_nuit} € <Text className="text-[10px] text-slate-400">/ nuit</Text></Text>
            </View>
            <View className="flex-row justify-end mt-2 space-x-3">
              <TouchableOpacity 
                onPress={() => router.push(`/vendeur/logement-form?id=${item.id}`)}
                className="bg-slate-100 p-2 rounded-xl"
              >
                <Edit2 size={16} color="#0001bc" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDelete(item.id)}
                className="bg-rose-50 p-2 rounded-xl"
              >
                <Trash2 size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#0001bc" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-6 flex-row items-center justify-between">
        <View>
          <Text className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Espace Vendeur</Text>
          <Text className="text-3xl font-black tracking-tighter text-slate-900">Mes <Text className="text-primary italic">Annonces</Text></Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/vendeur/logement-form')}
          className="bg-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {logements.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="bg-slate-50 p-8 rounded-full mb-6">
            <Home size={64} color="#cbd5e1" />
          </View>
          <Text className="text-xl font-black text-slate-900 mb-2">Aucune annonce</Text>
          <Text className="text-center text-slate-400 mb-8">Vous n'avez pas encore publié de logement. Commencez dès maintenant !</Text>
          <TouchableOpacity 
            onPress={() => router.push('/vendeur/logement-form')}
            className="bg-primary px-8 py-4 rounded-full shadow-lg shadow-primary/30"
          >
            <Text className="text-white font-black uppercase text-xs">Créer une annonce</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={logements}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  );
}
