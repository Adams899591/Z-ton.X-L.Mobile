import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import RegisterStep1 from '../../../components/register/register-step-1';
import RegisterStep2 from '../../../components/register/register-step-2';
import { API_URL } from '../../server/config';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  red: "#EF4444",
};

const RegisterScreen = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nin: '',
    bvn: '',
    dateOfBirth: '',
    password: '',
    password_confirmation: '',
    
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [accountNumber, setAccountNumber] = useState()
  const [errorAccountNumber, setErrorAccountNumber] = useState(null)
  const [agreeTerms, setAgreeTerms] = useState(false);

  
 const handleUserRegistration = async () => {
        if (!agreeTerms) {
          Alert.alert('Terms Required', 'You must agree to the terms before registering.');
          return;
        }
        setErrors({}); // Clear previous errors
        setErrorAccountNumber(null)
        setIsLoading(true);
        
   
        try {
                if (step === 1) {
                          // Step 1: Initial Registration
                          const response = await axios.post(`${API_URL}/auth/register`, {
                                name: formData.fullName,
                                email: formData.email,
                                phone: formData.phone,
                                nin: formData.nin,
                                bvn: formData.bvn,
                                date_of_birth: formData.dateOfBirth,
                                password: formData.password,
                                password_confirmation: formData.password_confirmation,
                          });

                          const responseData = response.data;
                          
                          // Improved check: handles both 'success' boolean and 'status' string
                          if (responseData.success || responseData.status === 'success') {
                            setStep(2);
                            console.log("Step 1 Success:", responseData.message);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          } else {
                            Alert.alert("Registration Failed", responseData.message || "Could not complete registration.");
                          }
                } else {
                          // Step 2 Logic: Activation & Credit
                          const response = await axios.post(`${API_URL}/auth/verify-account`,{
                             account_number: accountNumber,
                          })
                            const responseData = response.data;

                          if(responseData.status === "success"){
                              console.log("Finalizing Step 2 Activation:", formData);
                              
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                              router.replace("/pages/views/register.success");
                          } else {
                              // Handle logical errors (e.g. account not found)
                              setErrorAccountNumber(responseData.message || "Invalid account number");
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                          }

                }
        }catch (error) { // handle errors from the API or network issues
                   const data = error.response?.data; // Safely extract response data if it exists
                  console.log(error)
                  
                    // validation error from Laravel
                    if (data?.errors) { // check if there are validation errors in the response
                          const serverErrors = { ...data.errors };
                          if (serverErrors.name) serverErrors.fullName = serverErrors.name;
                          if (serverErrors.password_confirmation) serverErrors.password_confirmation = serverErrors.password_confirmation;
                          if (serverErrors.date_of_birth) serverErrors.dateOfBirth = serverErrors.date_of_birth;
                          // Map the account_number error to your state
                          if (serverErrors.account_number) setErrorAccountNumber(serverErrors.account_number[0]);
                         
                          
                          setErrors(serverErrors);
                          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

                    } else {
                          // other errors (e.g. connection issues)
                          const message = data?.message || "Connection failed. Please check if the server is running.";
                          Alert.alert("Registration Failed", message);
                    } 
        
        
           } finally { // reset loading state after the login process is complete, regardless of success or failure
             setIsLoading(false);
           }
  }







  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkGray} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 2 ? setStep(1) : router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{step === 1 ? 'Create Account' : 'Activate Account'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <>
              {/* Register Step1  .props */}
                <RegisterStep1
                    styles={styles}
                    COLORS={COLORS}
                    formData={formData}
                    setFormData={setFormData}
                    showDatePicker={showDatePicker}
                    setShowDatePicker={setShowDatePicker}
                    date={date}
                    setDate={setDate}
                    agreeTerms={agreeTerms}
                    setAgreeTerms={setAgreeTerms}
                    errors={errors}
                    setErrors={setErrors}
                />
          </>
        ) : (
          <>
               {/*  Register Step 2 .props */}
               <RegisterStep2
                  styles={styles}
                  COLORS={COLORS}
                  accountNumber={accountNumber}
                  setAccountNumber={setAccountNumber}
                  errorAccountNumber={errorAccountNumber}
               />

          </>
        )}

        {/* Button that is visible on both 'REGISTER' : 'ACTIVATE & CREDIT' but text changes */}
        <TouchableOpacity 
          style={[styles.registerButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleUserRegistration}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.registerButtonText}>{step === 1 ? 'REGISTER' : 'ACTIVATE & CREDIT'}</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.noAccountText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/pages/views/login')}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        
        {/* Activate Account Link */} 
        {step === 1 && (
          <>
              <View style={styles.loginLinkContainer}>
                  <Text style={styles.noAccountText}>Already registered? </Text>
                  <TouchableOpacity onPress={() => { setStep(2); setAgreeTerms(true); }}>
                    <Text style={styles.loginLinkText}>Activate Account</Text>
                  </TouchableOpacity>
                </View>
          </>
        ) }

      </ScrollView>

  
      
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 70,
    backgroundColor: COLORS.darkGray,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  backButton: { padding: 5 },
  scrollContent: { padding: 25, paddingBottom: 40 },
  introSection: { marginBottom: 30 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: COLORS.black, marginBottom: 10 },
  subText: { fontSize: 14, color: COLORS.gray, lineHeight: 20 },
  inputGroup: { marginBottom: 20 },
  label: { color: COLORS.darkGray, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    color: COLORS.black,
    fontSize: 16,
  },
  dateInputContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: { fontSize: 16, color: COLORS.black },
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  termsText: { color: COLORS.black, marginLeft: 10, fontSize: 13, flex: 1 },
  linkText: { color: COLORS.gold, fontWeight: 'bold' },
  registerButton: {
    backgroundColor: COLORS.black,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  registerButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  noAccountText: { color: COLORS.gray, fontSize: 14 },
  loginLinkText: { color: COLORS.gold, fontSize: 14, fontWeight: 'bold' },
  errorText: { color: COLORS.red, fontSize: 12, marginTop: 5 },
});