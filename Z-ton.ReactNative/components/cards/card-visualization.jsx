import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function CardVisualization({ styles, user, COLORS, isPinVisible }) {
  return (
    <>
               {/* Card Visualization */}
                <View style={styles.creditCard}> 
        
                  <View style={styles.cardHeader}>
                    <Text style={styles.bankName}>Z-TON X-L BANK</Text>
                    <Ionicons name="wifi" size={24} color={COLORS.white} style={{ transform: [{ rotate: '90deg' }] }} />
                  </View>
                  
                  <Text style={styles.chip}>══</Text>
                  
                  <Text style={styles.cardNumber}>
                    {isPinVisible 
                      ? user?.card_number?.toString().replace(/(\d{4})(?=\d)/g, '$1 ') 
                      : `**** **** **** ${user?.card_number?.toString().slice(-4)}`}
                  </Text>
                  
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardLabel}>CARD HOLDER</Text>
                      <Text style={styles.cardValue}>Z-TON USER</Text>
                    </View>
                    <View>
                      <Text style={styles.cardLabel}>EXPIRES</Text>
                      <Text style={styles.cardValue}>12/28</Text>
                    </View>
                  </View>
                  
                </View>
    </>
  )
}

export default CardVisualization