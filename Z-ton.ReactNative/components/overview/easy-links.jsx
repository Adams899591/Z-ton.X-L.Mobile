import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
};


const EasyLinks = ({styles}) => {
    
      const router = useRouter();

  return (
    <>
            {/* Easy Links Section */}
            <Text style={styles.sectionTitle}>Easy Links</Text>
            <View style={styles.easyLinksGrid}>
              <TouchableOpacity style={styles.easyLinkButton}>
                <Ionicons name="wallet-outline" size={24} color={COLORS.gold} />
                <Text style={styles.easyLinkText}>Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.easyLinkButton} onPress={() => router.push("pages/navigate/transfer-history")}>
                <Ionicons name="swap-horizontal-outline" size={24} color={COLORS.gold} />
                <Text style={styles.easyLinkText}>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.easyLinkButton}>
                <Ionicons name="tv-outline" size={24} color={COLORS.gold} />
                <Text style={styles.easyLinkText}>Cable TV</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.easyLinkButton} onPress={() => router.push("(drawer)/cards")}>
                <Ionicons name="card-outline" size={24} color={COLORS.gold} />
                <Text style={styles.easyLinkText}>Cards</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.easyLinkButton} onPress={() => router.push("(drawer)/account-details")}>
                <Ionicons name="finger-print-outline" size={24} color={COLORS.gold} />
                <Text style={styles.easyLinkText}>My BVN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.easyLinkButton}  onPress={() => router.push("(drawer)/profile&security")}>
                <Ionicons name="settings-outline" size={24} color={COLORS.gold} />
                <Text style={styles.easyLinkText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.easyLinkButton} onPress={() => router.push("(drawer)/live-chat")}>
                <Ionicons name="help-circle-outline" size={24} color={COLORS.gold} />
                <Text style={styles.easyLinkText}>Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.easyLinkButton}>
                <Ionicons name="document-text-outline" size={24} color={COLORS.gold} />
                <Text style={styles.easyLinkText}>Statements</Text>
              </TouchableOpacity>
            </View>
    </>
  )
}

export default EasyLinks