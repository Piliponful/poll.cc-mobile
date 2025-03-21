import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Logo from '../assets/logo.svg';

import styles from './styles';

console.log('Logo: ', Logo)

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.authBackground}>
        <Image source={require('../assets/bg-poll.jpg')} style={styles.logo} />
      </View>
      <View style={styles.authCard}>
        <Logo width={100} height={100} />
        <Text style={styles.title}>Be first to beta version</Text>
        <Text style={styles.subtitle}>Public online voting on social and political issues.</Text>
        
        <View style={styles.authOptions}>
          <TouchableOpacity style={styles.authButton}>
            <AntDesign name="google" size={20} color="white" />
            <Text style={styles.authButtonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authButton}>
            <AntDesign name="XOutlined" size={20} color="white" />
            <Text style={styles.authButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
