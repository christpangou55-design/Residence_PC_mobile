import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '@/api/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      // L'API attend "nom" (pas "name") et "password_confirmation"
      const res = await api.post('/auth/register', { 
        nom: name, 
        email, 
        password,
        password_confirmation: passwordConfirmation
      });
      const token = res.data.token;
      
      if (token) {
        await SecureStore.setItemAsync('token', token);
        Alert.alert('Succès', 'Compte créé avec succès !');
        router.replace('/(tabs)/profile');
      }
    } catch (err: any) {
      console.error(err);
      // Gérer les erreurs de validation Laravel
      const errors = err.response?.data?.errors;
      let message = err.response?.data?.message || "Erreur lors de l'inscription.";
      if (errors) {
        // Concaténer toutes les erreurs de validation
        message = Object.values(errors).flat().join('\n');
      }
      Alert.alert('Échec de l\'inscription', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView className="flex-1 p-8" contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
            <View className="mb-12">
            <Text className="text-5xl font-bold tracking-tighter text-black">Créer un compte</Text>
            <Text className="text-gray-400 mt-2 text-lg">Rejoignez-nous dès maintenant.</Text>
            </View>

            <View className="space-y-6">
                <View>
                    <Text className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Nom complet</Text>
                    <TextInput 
                    value={name}
                    onChangeText={setName}
                    placeholder="John Doe"
                    className="border-b border-gray-200 pb-3 text-lg"
                    />
                </View>

                <View className="mt-8">
                    <Text className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Adresse Email</Text>
                    <TextInput 
                    value={email}
                    onChangeText={setEmail}
                    placeholder="votre@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="border-b border-gray-200 pb-3 text-lg"
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
                        className="border-b border-gray-200 pb-3 text-lg pr-12 focus:border-primary"
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-0 bottom-3"
                        >
                            {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-8">
                    <Text className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-widest">Confirmer le mot de passe</Text>
                    <View className="relative">
                        <TextInput 
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        placeholder="••••••••"
                        secureTextEntry={!showConfirmPassword}
                        className="border-b border-gray-200 pb-3 text-lg pr-12 focus:border-primary"
                        />
                        <TouchableOpacity 
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-0 bottom-3"
                        >
                            {showConfirmPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity 
            onPress={handleRegister}
            disabled={loading}
            className={`bg-primary py-5 rounded-xl items-center mt-12 ${loading ? 'opacity-50' : 'opacity-100'}`}
            >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white font-bold text-lg">S'inscrire</Text>
            )}
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={() => router.back()}
            className="mt-6 items-center"
            >
            <Text className="text-gray-400 underline">Déjà un compte ? Connectez-vous</Text>
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
