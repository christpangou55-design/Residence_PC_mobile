import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '@/api/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      
      if (token) {
        await SecureStore.setItemAsync('token', token);
        Alert.alert('Succès', 'Connexion réussie !');
        router.replace('/(tabs)/profile');
      }
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Identifiants incorrects.';
      Alert.alert('Échec de connexion', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1 p-8 justify-center"
      >
        <View className="mb-12">
          <View className="bg-primary w-16 h-16 rounded-2xl items-center justify-center mb-6">
            <Text className="text-white text-2xl font-black">PC</Text>
          </View>
          <Text className="text-5xl font-bold tracking-tighter text-black">Connexion</Text>
          <Text className="text-gray-400 mt-2 text-lg">Bon retour parmi nous.</Text>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Adresse Email</Text>
            <TextInput 
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border-b border-gray-200 pb-3 text-lg focus:border-primary"
            />
          </View>

          <View className="mt-8">
            <Text className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Mot de passe</Text>
            <View className="relative">
              <TextInput 
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                className="border-b border-gray-200 pb-3 text-lg focus:border-primary pr-12"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3"
              >
                {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="mt-4 self-end">
              <Text className="text-[10px] font-black text-primary uppercase tracking-widest">Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogin}
          disabled={loading}
          className={`bg-primary py-5 rounded-2xl items-center mt-12 shadow-lg shadow-blue-200 ${loading ? 'opacity-50' : 'opacity-100'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/(auth)/register')}
          className="mt-10 items-center"
        >
          <Text className="text-gray-500">Pas encore de compte ? <Text className="text-black font-bold">Inscrivez-vous</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-6 items-center"
        >
          <Text className="text-gray-400 underline">Retour à l'accueil</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
