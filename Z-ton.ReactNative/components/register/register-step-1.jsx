import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from '@react-native-community/datetimepicker'

function RegisterStep1({ styles, COLORS, formData, setFormData, showDatePicker, setShowDatePicker, date, setDate, agreeTerms, setAgreeTerms, errors, setErrors   }) {
  

        // this function handles our change
        const onDateChange = (event, selectedDate) => {
          // Close picker for Android immediately
          if (Platform.OS === 'android') setShowDatePicker(false);
          
          if (selectedDate) {
            setDate(selectedDate);
            
            // Format the date as DD/MM/YYYY
            const day = selectedDate.getDate().toString().padStart(2, '0');
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = selectedDate.getFullYear();
            const formattedDate = `${year}/${month}/${day}`;
            
            setFormData({ ...formData, dateOfBirth: formattedDate });
          }
        };
  
    return (
      <>

                  <View style={styles.introSection}>
                    <Text style={styles.welcomeText}>Join Z-ton Bank</Text>
                    <Text style={styles.subText}>Enter your details and identification to get started.</Text>
                  </View>
      
                  {/* Full Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={COLORS.gray}
                      onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                    />
                    {errors.fullName && <Text style={styles.errorText}>{errors.fullName[0]}</Text>}
                  </View>
      
                  {/* Email Address */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={COLORS.gray}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}
                  </View>
      
                  {/* Phone Number */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter phone number"
                      placeholderTextColor={COLORS.gray}
                      keyboardType="phone-pad"
                      onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    />
                    {errors.phone && <Text style={styles.errorText}>{errors.phone[0]}</Text>}
                  </View>
      
                  {/* NIN (National Identity Number) */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>NIN (National Identity Number)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="11-digit NIN"
                      placeholderTextColor={COLORS.gray}
                      keyboardType="numeric"
                      maxLength={11}
                      onChangeText={(text) => setFormData({ ...formData, nin: text })}
                    />
                    {errors.nin && <Text style={styles.errorText}>{errors.nin[0]}</Text>}
                  </View>
      
                  {/* BVN (Bank Verification Number) */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>BVN (Bank Verification Number)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="11-digit BVN"
                      placeholderTextColor={COLORS.gray}
                      keyboardType="numeric"
                      maxLength={11}
                      onChangeText={(text) => setFormData({ ...formData, bvn: text })}
                    />
                    {errors.bvn && <Text style={styles.errorText}>{errors.bvn[0]}</Text>}
                  </View>
      
                  {/* Date of Birth */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date of Birth</Text>
      
                      {/* this hold the icon on date of birth */}
                    <TouchableOpacity 
                      style={styles.dateInputContainer} 
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={[styles.inputText, !formData.dateOfBirth && { color: COLORS.gray }]}>
                        {formData.dateOfBirth || "Select Date of Birth"}
                      </Text>
                      <Ionicons name="calendar-outline" size={20} color={COLORS.gold} />
                    </TouchableOpacity>
      
                    {showDatePicker && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                        onChange={onDateChange}
                        maximumDate={new Date()} // Prevent selecting future dates
                      /> 
                    )}
                      {errors.date_of_birth && <Text style={styles.errorText}>{errors.date_of_birth[0]}</Text>} 
                  </View>
      
                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor={COLORS.gray}
                      secureTextEntry
                      onChangeText={(text) => setFormData({ ...formData, password: text })}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}
                  </View>
      
                  {/* Confirm Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Repeat your password"
                      placeholderTextColor={COLORS.gray}
                      secureTextEntry
                      onChangeText={(text) => setFormData({ ...formData, password_confirmation: text })}
                    />
                    {(errors.password_confirmation || errors.password_confirmed) && (
                      <Text style={styles.errorText}>{(errors.password_confirmation || errors.password_confirmed)[0]}</Text>
                    )}
                  </View>
      
                  {/* Terms and Services */}
                  <TouchableOpacity 
                    style={styles.termsContainer} 
                    onPress={() => setAgreeTerms(!agreeTerms)}
                  >
                    <Ionicons 
                      name={agreeTerms ? "checkbox" : "square-outline"} 
                      size={24} 
                      color={COLORS.gold} 
                    />
                    <Text style={styles.termsText}>
                      I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                    </Text>
                  </TouchableOpacity>
      </>
  )
}

export default RegisterStep1
