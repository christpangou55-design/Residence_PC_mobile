import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  Heart, Star, CreditCard, Bell, MapPin, Trash2, Edit3,
  Home, ChevronRight
} from 'lucide-react-native';
import api, { BASE_URL } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const TABS = ['Réservations', 'Favoris', 'Mes Avis', 'Paiements'];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  confirmee:  { label: 'Confirmée',  color: '#059669', bg: '#ecfdf5' },
  en_attente: { label: 'En attente', color: '#d97706', bg: '#fffbeb' },
  annulee:    { label: 'Annulée',    color: '#dc2626', bg: '#fef2f2' },
};

export default function ClientDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab]           = useState('Réservations');
  const [resFilter, setResFilter]           = useState<'avenir'|'passes'|'en_attente'>('avenir');
  const [reservations, setReservations]     = useState<any[]>([]);
  const [favoris, setFavoris]               = useState<Record<string, any[]>>({});
  const [avis, setAvis]                     = useState<any[]>([]);
  const [notifications, setNotifications]   = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [editingAvis, setEditingAvis]       = useState<number|null>(null);
  const [editNote, setEditNote]             = useState(5);

  const fetchData = async () => {
    try {
      const [resRes, favRes, avisRes] = await Promise.all([
        api.get('/reservations/mes'),
        api.get('/client/favoris'),
        api.get('/client/avis'),
      ]);
      setReservations(resRes.data);
      setFavoris(favRes.data);
      setAvis(avisRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const today = new Date();
  const filteredReservations = reservations.filter(r => {
    const arrival   = new Date(r.date_arrivee);
    const departure = new Date(r.date_depart);
    if (resFilter === 'avenir')     return arrival >= today && r.statut !== 'annulee';
    if (resFilter === 'passes')     return departure < today;
    if (resFilter === 'en_attente') return r.statut === 'en_attente';
    return true;
  });

  const handleRemoveFavori = async (logementId: number, collection: string) => {
    Alert.alert('Supprimer', 'Retirer ce logement de vos favoris ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/client/favoris/${logementId}`);
          setFavoris(prev => {
            const updated = { ...prev };
            if (updated[collection]) {
              updated[collection] = updated[collection].filter(f => f.logement_id !== logementId);
              if (updated[collection].length === 0) delete updated[collection];
            }
            return updated;
          });
        } catch (e) { Alert.alert('Erreur', 'Impossible de supprimer ce favori.'); }
      }}
    ]);
  };

  const handleDeleteAvis = async (avisId: number) => {
    Alert.alert('Supprimer', 'Supprimer cet avis ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/avis/${avisId}`);
          setAvis(prev => prev.filter(a => a.id !== avisId));
        } catch (e: any) {
          Alert.alert('Erreur', e.response?.data?.message || 'Erreur lors de la suppression');
        }
      }}
    ]);
  };

  const upcomingCount = reservations.filter(r => new Date(r.date_arrivee) >= today && r.statut !== 'annulee').length;
  const favorisTotalCount = Object.values(favoris).flat().length;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#0001bc" />
        <Text style={{ marginTop: 12, fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase' }}>
          Chargement...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0001bc" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ backgroundColor: '#0001bc', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginRight: 14, overflow: 'hidden' }}>
              {user?.profile_photo_url
                ? <Image source={{ uri: user.profile_photo_url }} style={{ width: '100%', height: '100%' }} />
                : <Text style={{ fontSize: 22, fontWeight: '900', color: 'white' }}>{user?.nom?.charAt(0)}</Text>}
            </View>
            <View>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>Bienvenue,</Text>
              <Text style={{ fontSize: 22, fontWeight: '900', color: 'white', letterSpacing: -0.5 }}>{user?.nom}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: 'Séjours à venir', value: upcomingCount, icon: Calendar },
              { label: 'Favoris', value: favorisTotalCount, icon: Heart },
              { label: 'Avis laissés', value: avis.length, icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <View key={label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                <Icon size={16} color="rgba(255,255,255,0.7)" />
                <Text style={{ fontSize: 22, fontWeight: '900', color: 'white', marginTop: 4 }}>{value}</Text>
                <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={{ marginHorizontal: 16, marginTop: -24, backgroundColor: 'white', borderRadius: 24, shadowColor: '#0001bc', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 8, overflow: 'hidden' }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 2, borderBottomColor: activeTab === tab ? '#0001bc' : 'transparent' }}
              >
                <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', color: activeTab === tab ? '#0001bc' : '#94a3b8' }}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ padding: 20 }}>

            {/* === RESERVATIONS === */}
            {activeTab === 'Réservations' && (
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {([['avenir','À venir'],['passes','Passés'],['en_attente','En attente']] as [string,string][]).map(([key,label]) => (
                      <TouchableOpacity key={key} onPress={() => setResFilter(key as any)}
                        style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: resFilter === key ? '#0001bc' : '#f1f5f9' }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', color: resFilter === key ? 'white' : '#64748b' }}>{label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {filteredReservations.length === 0
                  ? <EmptyState icon={Calendar} message="Aucune réservation" />
                  : filteredReservations.map(r => {
                    const cfg = statusConfig[r.statut] || statusConfig.en_attente;
                    const nights = Math.ceil((new Date(r.date_depart).getTime() - new Date(r.date_arrivee).getTime()) / 86400000);
                    const photo = r.logement?.photos?.[0];
                    return (
                      <View key={r.id} style={{ backgroundColor: '#f8fafc', borderRadius: 20, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' }}>
                        {photo && <Image source={{ uri: `${BASE_URL}/storage/${photo.chemin}` }} style={{ width: '100%', height: 140 }} resizeMode="cover" />}
                        <View style={{ padding: 14 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <Text style={{ fontSize: 15, fontWeight: '900', color: '#0001bc', flex: 1, marginRight: 8 }}>{r.logement?.titre}</Text>
                            <View style={{ backgroundColor: cfg.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                              <Text style={{ fontSize: 9, fontWeight: '800', color: cfg.color, textTransform: 'uppercase', letterSpacing: 1 }}>{cfg.label}</Text>
                            </View>
                          </View>
                          {r.logement?.ville && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                              <MapPin size={12} color="#94a3b8" />
                              <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '700' }}>{r.logement.ville}</Text>
                            </View>
                          )}
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                            <Calendar size={12} color="#64748b" />
                            <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '700' }}>
                              {new Date(r.date_arrivee).toLocaleDateString('fr-FR')} → {new Date(r.date_depart).toLocaleDateString('fr-FR')}
                            </Text>
                            <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '600' }}>• {nights} nuit{nights > 1 ? 's' : ''}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#0001bc' }}>{parseFloat(r.prix_total).toLocaleString('fr-FR')} €</Text>
                            <TouchableOpacity onPress={() => router.push(`/logement/${r.logement_id}`)}
                              style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                              <Text style={{ fontSize: 10, fontWeight: '800', color: '#0001bc', textTransform: 'uppercase', letterSpacing: 1 }}>Voir</Text>
                              <ChevronRight size={12} color="#0001bc" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            )}

            {/* === FAVORIS === */}
            {activeTab === 'Favoris' && (
              <View>
                {Object.keys(favoris).length === 0
                  ? <EmptyState icon={Heart} message="Aucun favori sauvegardé" />
                  : Object.entries(favoris).map(([collection, items]) => (
                    <View key={collection} style={{ marginBottom: 24 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Heart size={14} color="#0001bc" />
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5 }}>{collection}</Text>
                        <View style={{ backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#0001bc' }}>{items.length}</Text>
                        </View>
                      </View>
                      {items.map((f: any) => {
                        const log = f.logement;
                        if (!log) return null;
                        const photo = log.photos?.[0];
                        return (
                          <View key={f.id} style={{ backgroundColor: '#f8fafc', borderRadius: 20, overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9' }}>
                            <View style={{ position: 'relative' }}>
                              {photo && <Image source={{ uri: `${BASE_URL}/storage/${photo.chemin}` }} style={{ width: '100%', height: 120 }} resizeMode="cover" />}
                              <TouchableOpacity onPress={() => handleRemoveFavori(log.id, collection)}
                                style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 6 }}>
                                <Trash2 size={14} color="#ef4444" />
                              </TouchableOpacity>
                            </View>
                            <View style={{ padding: 12 }}>
                              <Text style={{ fontSize: 14, fontWeight: '900', color: '#0001bc', marginBottom: 4 }}>{log.titre}</Text>
                              {log.ville && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                                  <MapPin size={11} color="#94a3b8" />
                                  <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '700' }}>{log.ville}</Text>
                                </View>
                              )}
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#0001bc' }}>{parseFloat(log.prix_nuit).toLocaleString('fr-FR')} €</Text>
                                  <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '600' }}>/nuit</Text>
                                  {log.en_promotion && (
                                    <View style={{ backgroundColor: '#fef2f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                      <Text style={{ fontSize: 9, fontWeight: '800', color: '#dc2626' }}>PROMO</Text>
                                    </View>
                                  )}
                                </View>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ))}
              </View>
            )}

            {/* === MES AVIS === */}
            {activeTab === 'Mes Avis' && (
              <View>
                {avis.length === 0
                  ? <EmptyState icon={Star} message="Aucun avis laissé" />
                  : avis.map((a: any) => {
                    const daysSince = Math.floor((Date.now() - new Date(a.created_at).getTime()) / 86400000);
                    const canDelete = daysSince <= 7;
                    return (
                      <View key={a.id} style={{ backgroundColor: '#f8fafc', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '900', color: '#0001bc' }}>{a.logement?.titre}</Text>
                            {a.logement?.ville && (
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                <MapPin size={11} color="#94a3b8" />
                                <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '700' }}>{a.logement.ville}</Text>
                              </View>
                            )}
                          </View>
                          {canDelete && (
                            <TouchableOpacity onPress={() => handleDeleteAvis(a.id)} style={{ backgroundColor: '#fef2f2', padding: 8, borderRadius: 10 }}>
                              <Trash2 size={14} color="#ef4444" />
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={{ flexDirection: 'row', gap: 2, marginBottom: 8 }}>
                          {[1,2,3,4,5].map(s => (
                            <Text key={s} style={{ fontSize: 18, color: s <= a.note ? '#f59e0b' : '#e2e8f0' }}>★</Text>
                          ))}
                        </View>
                        {a.commentaire && <Text style={{ fontSize: 13, color: '#475569', fontWeight: '500', fontStyle: 'italic' }}>"{a.commentaire}"</Text>}
                        <Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 }}>
                          {new Date(a.created_at).toLocaleDateString('fr-FR')}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            )}

            {/* === PAIEMENTS === */}
            {activeTab === 'Paiements' && (
              <View>
                {reservations.filter(r => r.paiement).length === 0
                  ? <EmptyState icon={CreditCard} message="Aucun paiement enregistré" />
                  : reservations.filter(r => r.paiement).map(r => (
                    <View key={r.id} style={{ backgroundColor: '#f8fafc', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#f1f5f9' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 13, fontWeight: '800', color: '#0001bc', marginBottom: 2 }}>{r.logement?.titre}</Text>
                          <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '600' }}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ fontSize: 16, fontWeight: '900', color: '#0001bc' }}>{parseFloat(r.paiement.montant).toLocaleString('fr-FR')} €</Text>
                          <View style={{ backgroundColor: r.paiement.statut === 'reussi' ? '#ecfdf5' : '#fef2f2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4 }}>
                            <Text style={{ fontSize: 9, fontWeight: '800', color: r.paiement.statut === 'reussi' ? '#059669' : '#dc2626', textTransform: 'uppercase' }}>{r.paiement.statut}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            )}

          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48 }}>
      <View style={{ width: 56, height: 56, backgroundColor: '#eff6ff', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
        <Icon size={24} color="rgba(0,1,188,0.3)" />
      </View>
      <Text style={{ fontSize: 11, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>{message}</Text>
    </View>
  );
}
