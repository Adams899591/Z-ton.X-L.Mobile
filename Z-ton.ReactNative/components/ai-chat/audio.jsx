import React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../../app/server/config';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Animated,
  Vibration,
} from 'react-native';

// Audio Recording Component
function  AudioRecording({styles, COLORS, recording, pulseAnim, recordingInstance, timerRef, setRecording, setRecordingTime,  waveAnims, setMessages, setIsTranscribing, simulateAIResponse, isHoldingMic}) {

      const BUCKET_NAME = 'Z-ton-Mobile-App'; // Supabase storage bucket name

      // Helper function to convert base64 string to Uint8Array for file upload
      const base64ToUint8Array = (base64) => {
        const binaryString = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      };

      // Function to upload audio to Supabase storage and return the public URL
      const uploadAudioToSupabase = async (uri) => {
        try {
          const extension = uri.split('.').pop().split('?')[0] || 'm4a';
          const filename = `audio_${Date.now()}.${extension}`; // Generate a unique filename
          const filePath = `ai_chat/${filename}`;

          // Read audio file as base64 and convert to bytes
          const base64Data = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
          });
          const bytes = base64ToUint8Array(base64Data);

          // Upload file to Supabase Storage
          const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, bytes, {
            contentType: `audio/${extension}`,
            upsert: false,
          });

          if (error) throw error;

          const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
          return publicUrlData.publicUrl;
        } catch (err) {
          console.error('Audio upload error:', err.message || err);
          return null;
        }
      };

      // Callback to start the waveform animation for audio recording
      const startWaveAnimation = useCallback(() => {
        const animations = waveAnims.map((anim, i) =>
          Animated.loop(Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 300 + (i * 100), useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 300 + (i * 100), useNativeDriver: true })
          ]))
        );
        Animated.parallel(animations).start();
      }, [waveAnims]);

      // Function to start audio recording
      const startRecording = async () => {
        // Check if an instance already exists to prevent the "Only one Recording object" error
        if (recordingInstance.current) return;
        
        isHoldingMic.current = true; // Indicate that the mic button is being held
        try {
          const { recording: newRecording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
          );
          recordingInstance.current = newRecording;
          setRecording(true);
          setRecordingTime(0); // Reset recording timer
          Animated.loop(Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }), // Pulse animation for mic button
            Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }), // Pulse animation for mic button
          ])).start();
          startWaveAnimation();
          if (Platform.OS !== 'web') Vibration.vibrate(50);
          timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
          if (!isHoldingMic.current) await stopRecording();
        } catch (err) { console.error(err); }
      };
    
      // Function to stop audio recording
      const stopRecording = async () => {
        isHoldingMic.current = false; // Indicate that the mic button is released
        const rInstance = recordingInstance.current;
        if (!rInstance) { setRecording(null); return; } // If no recording instance, do nothing
        if (timerRef.current) clearInterval(timerRef.current); // Stop the recording timer
        pulseAnim.setValue(0);
        waveAnims.forEach(a => a.setValue(0));
    
        try {
          recordingInstance.current = null;
          setRecording(null);
          await rInstance.stopAndUnloadAsync();
          const uri = rInstance.getURI();
          console.log('Audio Device Path (URI):', uri); // Log the audio URI
          
          // Add Audio Message to UI
          const audioMsg = {
            id: Date.now().toString(),
            uri: uri,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'audio',
          };
          setMessages(prev => [...prev, audioMsg]);
    
          // Trigger Transcription Simulation for the recorded audio
          handleTranscription(uri);
        } catch (error) { console.error(error); setRecording(null); }
      };
    
      // Function to handle audio transcription (simulated)
      const handleTranscription = async (uri) => {
        setIsTranscribing(true);

        // Upload the audio file to Supabase first
        const publicUrl = await uploadAudioToSupabase(uri);

        if (publicUrl) {
          // Send the actual Supabase URL of the audio to your simulateAIResponse function
          simulateAIResponse(publicUrl, 'audio');
        }

        setIsTranscribing(false);
      };
    

  

  return (
    <>

              {/* Microphone Button for Audio Recording */}
              <View style={styles.micButtonWrapper}>
                {recording && (
                  <Animated.View style={[styles.pulseCircle, { 
                    transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }], 
                    opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }) 
                  }]} />
                )}
                <TouchableOpacity 
                  onPressIn={startRecording} 
                  onPressOut={stopRecording}
                  style={styles.micButtonCircle}
                >
                  <Ionicons name="mic" size={24} color={recording ? COLORS.white : COLORS.gray} />
                </TouchableOpacity>
              </View>

    </>
  )
}

export default  AudioRecording