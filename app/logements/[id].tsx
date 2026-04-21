import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, Heart, Waves, Wifi, Wind, MapPin, ShieldCheck, User, MessageCircle, Calendar } from 'lucide-react-native';
import api, { BASE_URL } from '@/api/api';

interface Logement {
  id: number;
  titre: string;
  description: string;
  prix_nuit: number;
  capacite: number;
  photos: { chemin: string }[];
  equipements?: any;
}

export default function LogementDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [logement, setLogement] = useState<Logement | null>(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({ date_arrivee: '', date_depart: '', nb_personnes: '1' });
  const [checkResult, setCheckResult] = useState<any>(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchLogement();
  }, [id]);

  const fetchLogement = async () => {
    try {
      const res = await api.get(`/logements/${id}`);
      setLogement(res.data.data || res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (!dates.date_arrivee || !dates.date_depart) {
      Alert.alert('Erreur', 'Veuillez remplir les dates.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/logements/${id}/check`, {
        date_arrivee: dates.date_arrivee,
        date_depart: dates.date_depart,
      });
      setCheckResult(res.data);
      if (!res.data.disponible) {
        Alert.alert('Indisponible', 'Ces dates ne sont pas disponibles.');
      }
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || 'Impossible de vérifier la disponibilité.';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async () => {
    setBooking(true);
    try {
      const res = await api.post('/reservations', {
        logement_id: id,
        date_arrivee: dates.date_arrivee,
        date_depart: dates.date_depart,
        nb_personnes: parseInt(dates.nb_personnes, 10) || 1,
      });
      if (res.data.url) {
        Alert.alert('Redirection', 'Vous allez être redirigé vers le paiement.');
      } else {
        Alert.alert('Succès', 'Réservation effectuée avec succès !');
        router.push('/(tabs)/reservations');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la réservation.';
      Alert.alert('Erreur', message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#0056A4" />
      </View>
    );
  }

  if (!logement) return null;

  const mainPhoto = logement.photos && logement.photos.length > 0 ? logement.photos[0] : null;
  const photoUrl = mainPhoto ? `${BASE_URL}/storage/${mainPhoto.chemin}` : null;

  return (
    <View className="flex-1 bg-white">
      {/* Header Overly */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between px-6">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/90 p-3 rounded-2xl shadow-xl">
          <ChevronLeft size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-white/90 p-3 rounded-2xl shadow-xl">
          <Heart size={20} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Photo Gallery Hero */}
        <View className="h-100 w-full">
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-slate-100 items-center justify-center">
              <Star size={40} color="#cbd5e1" />
            </View>
          )}
          <View className="absolute bottom-16 left-6 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20">
             <Text className="text-white text-[10px] font-black uppercase tracking-[0.2em]">1 / {logement.photos?.length || 1} Photos</Text>
          </View>
        </View>

        <View className="px-6 py-10 -mt-12 bg-white rounded-t-[50px] shadow-2xl">
          {/* Header Info */}
          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <View className="bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                <Text className="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Édition Prestige</Text>
              </View>
              <View className="flex-row items-center ml-4">
                <Star size={10} color="#f59e0b" fill="#f59e0b" />
                <Text className="text-[10px] font-black text-slate-900 ml-1">4.98</Text>
                <Text className="text-[10px] text-slate-400 font-bold ml-1">(124 avis)</Text>
              </View>
            </View>
            <Text className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{logement.titre}</Text>
            <View className="flex-row items-center mt-4">
                <MapPin size={14} color="#0056A4" />
                <Text className="text-sm font-bold text-slate-400 ml-2">Côte d'Azur, France</Text>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View className="flex-row bg-slate-50 p-6 rounded-[30px] border border-slate-100 mb-10">
            <StatItem icon={<User size={18} color="#0056A4" />} value={logement.capacite} label="Voyageurs" />
            <View className="w-px h-10 bg-slate-200 mx-4" />
            <StatItem icon={<ShieldCheck size={18} color="#0056A4" />} value="Vérifié" label="Statut PC" />
            <View className="w-px h-10 bg-slate-200 mx-4" />
            <StatItem icon={<Star size={18} color="#0056A4" />} value="Elite" label="Catégorie" />
          </View>

          {/* Host Info */}
          <View className="flex-row items-center justify-between py-8 border-y border-slate-50 mb-10">
            <View className="flex-row items-center">
                <View className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm">
                    <User size={24} color="#94a3b8" />
                </View>
                <View className="ml-4">
                    <Text className="text-sm font-black text-slate-900">Hébergé par Résidence PC</Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Conciergerie Privée</Text>
                </View>
            </View>
            <TouchableOpacity className="bg-slate-50 p-3 rounded-xl">
                <MessageCircle size={20} color="#0056A4" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View className="mb-12">
            <Text className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4">La Résidence</Text>
            <Text className="text-slate-500 text-lg leading-7 font-medium">
              {logement.description || "Une expérience immersive au cœur du luxe. Cette propriété a été sélectionnée pour son design exceptionnel et sa qualité de service incomparable."}
            </Text>
          </View>

          {/* Availability System */}
          <View className="bg-slate-50 rounded-[40px] p-8 border border-slate-100">
            <Text className="text-xl font-black text-slate-900 tracking-tighter mb-6">Planifier votre séjour</Text>
            
            <View className="space-y-4">
                <View className="flex-row space-x-4">
                    <DateInput label="Arrivée" value={dates.date_arrivee} onChange={(t) => { setDates({...dates, date_arrivee: t}); setCheckResult(null); }} />
                    <DateInput label="Départ" value={dates.date_depart} onChange={(t) => { setDates({...dates, date_depart: t}); setCheckResult(null); }} />
                </View>

                {!checkResult?.disponible ? (
                    <TouchableOpacity
                        onPress={handleCheckAvailability}
                        className="bg-primary py-5 rounded-[25px] items-center mt-2 shadow-xl shadow-primary/20"
                    >
                        <Text className="text-white font-black text-xs uppercase tracking-[0.3em]">Vérifier Disponibilité</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mt-2 flex-row items-center justify-center">
                        <View className="bg-emerald-500 w-2 h-2 rounded-full mr-3" />
                        <Text className="text-emerald-700 font-black text-xs uppercase tracking-widest">Disponible ({checkResult.nuits} nuits)</Text>
                    </View>
                )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Premium Floating Footer */}
      <View className="absolute bottom-10 left-6 right-6 bg-slate-900 p-6 flex-row items-center justify-between rounded-[35px] shadow-2xl border border-white/5">
        <View className="ml-2">
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Séjour Total</Text>
          <Text className="text-white text-3xl font-black tracking-tighter mt-1">
            {checkResult ? Math.round(checkResult.prix_total) : logement.prix_nuit} €
          </Text>
        </View>
        <TouchableOpacity
          disabled={!checkResult?.disponible || booking}
          onPress={handleReservation}
          className={`bg-primary px-10 py-5 rounded-3xl shadow-xl ${(!checkResult?.disponible || booking) ? 'opacity-30' : 'opacity-100'}`}
        >
          {booking ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-black text-xs uppercase tracking-[0.3em]">Réserver</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatItem({ icon, value, label }: { icon: any, value: any, label: string }) {
    return (
        <View className="items-center flex-1">
            <View className="bg-white p-3 rounded-2xl mb-2 shadow-sm border border-slate-50">
                {icon}
            </View>
            <Text className="text-xs font-black text-slate-900">{value}</Text>
            <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</Text>
        </View>
    );
}

function DateInput({ label, value, onChange }: { label: string, value: string, onChange: (t: string) => void }) {
    return (
        <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-1">
                <Calendar size={10} color="#0056A4" />
                <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</Text>
            </View>
            <TextInput
                placeholder="AAAA-MM-JJ"
                className="text-xs font-black text-slate-900"
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#cbd5e1"
            />
        </View>
    );
}
