import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save, MapPin, Euro, Users, Key } from 'lucide-react-native';
import api from '@/api/api';

export default function LogementFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix_nuit: '',
    capacite: '',
    type_logement: 'Appartement',
    adresse: '',
    ville: '',
    pays: '',
    latitude: '',
    longitude: '',
    est_actif: true,
  });

  useEffect(() => {
    if (isEditing) {
      fetchLogement();
    }
  }, [id]);

  const fetchLogement = async () => {
    try {
      const res = await api.get(`/logements/${id}`);
      const data = res.data.data || res.data;
      setFormData({
        titre: data.titre,
        description: data.description,
        prix_nuit: data.prix_nuit.toString(),
        capacite: data.capacite.toString(),
        type_logement: data.type_logement || 'Appartement',
        adresse: data.adresse,
        ville: data.ville,
        pays: data.pays,
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        est_actif: data.est_actif !== undefined ? data.est_actif : true,
      });
    } catch (err) {
      console.error('Fetch logement error:', err);
      Alert.alert('Erreur', 'Impossible de charger les données du logement.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.titre || !formData.prix_nuit || !formData.ville) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires (Titre, Prix, Ville).');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await api.put(`/logements/${id}`, formData);
        Alert.alert('Succès', 'Logement mis à jour avec succès.');
      } else {
        await api.post('/logements', formData);
        Alert.alert('Succès', 'Logement créé avec succès.');
      }
      router.back();
    } catch (err) {
      console.error('Save logement error:', err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
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
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-slate-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-lg font-black tracking-tighter text-slate-900">
          {isEditing ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="space-y-6 mb-10">
          
          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Titre de l'annonce *</Text>
            <TextInput
              value={formData.titre}
              onChangeText={(t) => setFormData({ ...formData, titre: t })}
              placeholder="Ex: Superbe appartement au centre-ville"
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-900 font-medium"
            />
          </View>

          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</Text>
            <TextInput
              value={formData.description}
              onChangeText={(t) => setFormData({ ...formData, description: t })}
              placeholder="Décrivez votre logement..."
              multiline
              numberOfLines={4}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-900 font-medium min-h-[100px]"
              textAlignVertical="top"
            />
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Prix par nuit (€) *</Text>
              <View className="flex-row items-center bg-slate-50 rounded-2xl border border-slate-100 px-4">
                <Euro size={16} color="#94a3b8" />
                <TextInput
                  value={formData.prix_nuit}
                  onChangeText={(t) => setFormData({ ...formData, prix_nuit: t })}
                  placeholder="0"
                  keyboardType="numeric"
                  className="flex-1 p-4 ml-2 text-slate-900 font-black"
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Capacité</Text>
              <View className="flex-row items-center bg-slate-50 rounded-2xl border border-slate-100 px-4">
                <Users size={16} color="#94a3b8" />
                <TextInput
                  value={formData.capacite}
                  onChangeText={(t) => setFormData({ ...formData, capacite: t })}
                  placeholder="1"
                  keyboardType="numeric"
                  className="flex-1 p-4 ml-2 text-slate-900 font-black"
                />
              </View>
            </View>
          </View>

          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Ville *</Text>
            <View className="flex-row items-center bg-slate-50 rounded-2xl border border-slate-100 px-4">
              <MapPin size={16} color="#94a3b8" />
              <TextInput
                value={formData.ville}
                onChangeText={(t) => setFormData({ ...formData, ville: t })}
                placeholder="Ex: Paris"
                className="flex-1 p-4 ml-2 text-slate-900 font-medium"
              />
            </View>
          </View>

          <View>
            <Text className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Adresse complète</Text>
            <TextInput
              value={formData.adresse}
              onChangeText={(t) => setFormData({ ...formData, adresse: t })}
              placeholder="Numéro, Rue..."
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-900 font-medium"
            />
          </View>

          <View className="flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <View>
              <Text className="text-sm font-black text-slate-900">Annonce Active</Text>
              <Text className="text-[10px] font-medium text-slate-400 mt-1">Les utilisateurs pourront la réserver</Text>
            </View>
            <Switch
              value={formData.est_actif}
              onValueChange={(val) => setFormData({ ...formData, est_actif: val })}
              trackColor={{ false: '#e2e8f0', true: '#0001bc' }}
              thumbColor="white"
            />
          </View>

        </View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-slate-100">
        <TouchableOpacity 
          onPress={handleSave}
          disabled={saving}
          className={`bg-primary p-4 rounded-full flex-row justify-center items-center shadow-xl shadow-primary/30 ${saving ? 'opacity-50' : ''}`}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Save size={20} color="white" />
              <Text className="text-white font-black uppercase tracking-widest text-xs ml-2">Enregistrer l'annonce</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
