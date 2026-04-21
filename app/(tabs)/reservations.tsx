import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import api, { BASE_URL } from '@/api/api';
import { ChevronRight, Briefcase, Calendar, MapPin, Star } from 'lucide-react-native';

interface Reservation {
  id: number;
  date_arrivee: string;
  date_depart: string;
  statut: string;
  prix_total: number;
  logement: {
    titre: string;
    photos: { chemin: string }[];
  };
}

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations/mes');
      setReservations(res.data.data || res.data || []);
    } catch (err) {
      console.error('Fetch reservations error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getStatusConfig = (status: string): { bg: string; text: string; label: string; dot: string } => {
    switch (status.toLowerCase()) {
      case 'confirmee':
      case 'payee':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Confirmée', dot: 'bg-emerald-500' };
      case 'en_attente':
        return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente', dot: 'bg-amber-500' };
      case 'annulee':
        return { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Annulée', dot: 'bg-rose-500' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', label: status, dot: 'bg-slate-500' };
    }
  };

  const renderItem = ({ item }: { item: Reservation }) => {
    const mainPhoto = item.logement?.photos && item.logement.photos.length > 0
      ? item.logement.photos[0]
      : null;
    const photoUrl = mainPhoto ? `${BASE_URL}/storage/${mainPhoto.chemin}` : null;
    const status = getStatusConfig(item.statut);

    return (
      <TouchableOpacity className="bg-white mx-6 mb-8 rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200">
        <View className="relative h-48 w-full">
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-slate-100 items-center justify-center">
              <Star size={32} color="#cbd5e1" />
            </View>
          )}
          <View className={`absolute top-4 right-4 ${status.bg} px-4 py-2 rounded-full border border-white/20 flex-row items-center`}>
            <View className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-2`} />
            <Text className={`text-[10px] font-black uppercase tracking-widest ${status.text}`}>
              {status.label}
            </Text>
          </View>
          <View className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl">
             <Text className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Réservation #{item.id}</Text>
          </View>
        </View>

        <View className="p-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-black text-slate-900 tracking-tighter" numberOfLines={1}>
                {item.logement?.titre}
              </Text>
              <View className="flex-row items-center mt-2">
                <MapPin size={12} color="#94a3b8" />
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Destination Privilège</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-black text-primary tracking-tighter">{item.prix_total} €</Text>
              <Text className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Total Séjour</Text>
            </View>
          </View>

          <View className="flex-row items-center bg-slate-50 p-4 rounded-2xl mb-6">
            <Calendar size={16} color="#0056A4" />
            <View className="flex-row items-center ml-3">
              <Text className="text-xs font-black text-slate-900 uppercase tracking-tighter">{formatDate(item.date_arrivee)}</Text>
              <View className="w-4 h-px bg-slate-200 mx-3" />
              <Text className="text-xs font-black text-slate-900 uppercase tracking-tighter">{formatDate(item.date_depart)}</Text>
            </View>
          </View>

          <TouchableOpacity className="flex-row items-center justify-center bg-primary py-4 rounded-[20px] shadow-lg shadow-primary/20">
            <Text className="text-white font-black text-xs uppercase tracking-[0.3em] mr-2">Consulter les détails</Text>
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#0056A4" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-8">
        <Text className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Espace Membre</Text>
        <Text className="text-4xl font-black tracking-tighter text-slate-900 leading-none">Mes <Text className="text-primary italic">Réservations</Text></Text>
      </View>

      {reservations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="bg-slate-50 p-10 rounded-[50px] mb-8 border border-slate-100">
            <Briefcase size={80} color="#cbd5e1" />
          </View>
          <Text className="text-2xl font-black text-slate-900 tracking-tighter text-center">Aucune Escapade</Text>
          <Text className="text-slate-400 mt-3 text-center font-medium leading-relaxed">Commencez votre voyage en explorant notre catalogue de résidences prestigieuses.</Text>
          <TouchableOpacity className="mt-10 bg-primary px-10 py-5 rounded-3xl shadow-xl shadow-primary/20">
            <Text className="text-white font-black text-xs uppercase tracking-[0.3em]">Découvrir</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0056A4" />
          }
        />
      )}
    </SafeAreaView>
  );
}
