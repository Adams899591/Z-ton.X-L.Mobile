import React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
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
      const handleTranscription = (uri) => {
        setIsTranscribing(true);
        // Simulate API call to a Speech-to-Text service (e.g., OpenAI Whisper)
        setTimeout(() => {
          const transcribedText = "What is my current account balance?"; // Mock transcribed text
          setIsTranscribing(false);
          simulateAIResponse(transcribedText, 'audio');
        }, 2000);
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