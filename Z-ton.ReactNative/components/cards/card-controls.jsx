import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function CardControls({ styles, COLORS, isPinVisible, setIsPinVisible, setLimitModalVisible }) {
  return (
      <>
                {/* Card Controls */}
                 <Text style={styles.sectionTitle}>Card Controls</Text>
                 
                 <View style={styles.actionGrid}>
         
                   {/* Freeze Card */}
                   <TouchableOpacity style={styles.actionButton}>
                     <Ionicons name="lock-closed" size={24} color={COLORS.gold} />
                     <Text style={styles.actionText}>Freeze Card</Text>
                   </TouchableOpacity>
         
                   {/* Hide PIN" && "Show PIN */}
                   <TouchableOpacity 
                     style={styles.actionButton}
                     onPress={() => setIsPinVisible(!isPinVisible)}
                   >
                     <Ionicons name={isPinVisible ? "eye" : "eye-off"} size={24} color={COLORS.gold} />
                     <Text style={styles.actionText}>{isPinVisible ? "Hide PIN" : "Show PIN"}</Text>
                   </TouchableOpacity>
                   
                   {/* Manage Limits */}
                   <TouchableOpacity 
                     style={styles.actionButton}
                     onPress={() => setLimitModalVisible(true)}
                   >
                     <Ionicons name="infinite" size={24} color={COLORS.gold} />
                     <Text style={styles.actionText}>Manage Limits</Text>
                   </TouchableOpacity>
         
                   {/* Replace Card */}
                   <TouchableOpacity style={styles.actionButton}>
                     <Ionicons name="refresh" size={24} color={COLORS.gold} />
                     <Text style={styles.actionText}>Replace Card</Text>
                   </TouchableOpacity>
         
                 </View>
      </>
  )
}

export default CardControls
