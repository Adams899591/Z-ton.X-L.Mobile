import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
  Modal,
  Alert,
  ActivityIndicator,
  Animated,
  Vibration,
} from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  userBubble: "#1F2937",
  supportBubble: "#F3F4F6",
};

const MOCK_MESSAGES = [
  {
    id: '1',
    text: "Hello! Welcome to Z-ton X-L Support. How can we assist you today?",
    sender: 'support',
    timestamp: '09:00 AM',
    type: 'text',
  },
  {
    id: '2',
    text: "I'm having trouble with my recent card transaction.",
    sender: 'user',
    timestamp: '09:01 AM',
    type: 'text',
  },
];

const PlaybackWaveform = ({ isPlaying, isUser }) => {
  const anims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (isPlaying) {
      const animations = anims.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 400 + i * 100, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 400 + i * 100, useNativeDriver: true }),
          ])
        )
      );
      Animated.parallel(animations).start();
    } else {
      anims.forEach((anim) => anim.stopAnimation(() => anim.setValue(0)));
    }
  }, [isPlaying]);

  return (
    <View style={styles.audioWaveformPlaceholder}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.waveBar,
            {
              height: 10 + i * 3,
              backgroundColor: isUser ? COLORS.gold : COLORS.darkGray,
              transform: [{ scaleY: isPlaying ? anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] }) : 1 }],
            },
          ]}
        />
      ))}
    </View>
  );
};

const LiveChatScreen = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();
  
  // Audio & Video States
  const [recording, setRecording] = useState(null); // Used purely for UI feedback (red mic)
  const recordingInstance = useRef(null); // Synchronous ref for the hardware object
  const isHoldingMic = useRef(false); // Synchronous ref to track press state
  const timerRef = useRef(null); // Timer reference for recording duration
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);

  // Call management states
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  const [playingId, setPlayingId] = useState(null);
  const soundInstance = useRef(null);

  // Animation & Timer States
  const [recordingTime, setRecordingTime] = useState(0);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const waveAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  // Pre-initialize permissions and audio mode on mount for instant response
  useEffect(() => {
    (async () => {
      try {
        await Audio.requestPermissionsAsync();
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        // Setup audio mode once so it doesn't delay the first recording
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      } catch (err) {
        console.error("Initialization error:", err);
      }
    })();

    return () => {
      if (soundInstance.current) {
        soundInstance.current.unloadAsync();
      }
    };
  }, []);

  // Simulation effect for both Voice and Video calls to simulate "Connecting" -> "Connected"
  useEffect(() => {
    let connectionTimeout;
    const isActive = isVoiceCallActive || isVideoCallActive;

    if (isActive) {
      setCallStatus(isVoiceCallActive ? 'Ringing...' : 'Connecting...');
      setCallDuration(0);
      
      connectionTimeout = setTimeout(() => {
        setCallStatus('Connected');
        callTimerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
      }, 2500);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setIsMuted(false);
      setIsSpeakerOn(true);
      setIsVideoMuted(false);
    }

    return () => {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isVoiceCallActive, isVideoCallActive]);

  // Helper to format recording time (00:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Starts the "boom boom" wave animation
  const startWaveAnimation = useCallback(() => {
    const animations = waveAnims.map((anim, i) => 
      Animated.loop(Animated.sequence([Animated.timing(anim, { toValue: 1, duration: 300 + (i * 100), useNativeDriver: true }), Animated.timing(anim, { toValue: 0, duration: 300 + (i * 100), useNativeDriver: true })]))
    );
    Animated.parallel(animations).start();
  }, [waveAnims]);

  // Handles sending standard text messages
  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  // Opens the professional video call overlay
  const handleVideoCall = () => {
    setIsVideoCallActive(true);
  };

  // Opens the voice call overlay
  const handleVoiceCall = () => {
    setIsVoiceCallActive(true);
  };

  // Handles image selection from the device gallery
  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newMessage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'image',
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (err) {
      Alert.alert("Error", "Could not access gallery.");
    }
  };

  // Starts the audio recording process
  const startRecording = async () => {
    isHoldingMic.current = true; // Mark that user is holding the button
    try {
      // Ensure we only start if the user is still holding (prevents ghost recordings)
      if (!isHoldingMic.current) return;

      // Create and start the recording immediately
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      // Save to Ref so stopRecording can access it even if state hasn't updated
      recordingInstance.current = newRecording;
      setRecording(true); // UI feedback
      setRecordingTime(0);
      
      // Start Pulse Animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();

      // Start Waveform Animation
      startWaveAnimation();

      // Vibration feedback
      if (Platform.OS !== 'web') Vibration.vibrate(50);

      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);

      // Double-check: if user released during the async setup, stop it now
      if (!isHoldingMic.current) {
        await stopRecording();
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Stops the audio recording and adds it to the chat
  const stopRecording = async () => {
    isHoldingMic.current = false; // Mark that user has released
    
    // If initialization hasn't finished, we can't stop yet
    if (!recordingInstance.current) {
      setRecording(null);
      return;
    }

    // Stop UI and animations
    if (timerRef.current) clearInterval(timerRef.current);
    pulseAnim.setValue(0);
    waveAnims.forEach(a => a.setValue(0));

    try {
      const rInstance = recordingInstance.current;
      recordingInstance.current = null; // Clear ref immediately to prevent race conditions
      setRecording(null); // Reset UI
      
      // Stop hardware and get URI
      await rInstance.stopAndUnloadAsync();
      const uri = rInstance.getURI();

      const newMessage = {
        id: Date.now().toString(),
        uri: uri,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'audio',
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setRecording(null);
    }
  };
  
  // Helper to play back audio messages in the chat
  const playAudio = async (item) => {
    try {
      // If we are already playing a sound
      if (soundInstance.current) {
        await soundInstance.current.stopAsync();
        await soundInstance.current.unloadAsync();
        soundInstance.current = null;
        
        // If the user clicked the one that was already playing, just stop it
        if (playingId === item.id) {
          setPlayingId(null);
          return;
        }
      }

      // Start playing the new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: item.uri },
        { shouldPlay: true }
      );
      
      soundInstance.current = sound;
      setPlayingId(item.id);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
          sound.unloadAsync();
          soundInstance.current = null;
        }
      });
    } catch (err) {
      Alert.alert("Error", "Could not play audio.");
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageWrapper, isUser ? styles.userWrapper : styles.supportWrapper]}>
        {!isUser && (
          <View style={styles.supportAvatar}>
            <Ionicons name="headset" size={16} color={COLORS.white} />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.supportBubble]}>
          {item.type === 'text' && (
            <Text style={[styles.messageText, isUser ? styles.userText : styles.supportText]}>
              {item.text}
            </Text>
          )}
          
          {item.type === 'image' && (
            <Image source={{ uri: item.uri }} style={styles.messageImage} resizeMode="cover" />
          )}

          {item.type === 'audio' && (
            <TouchableOpacity onPress={() => playAudio(item)} style={styles.audioPlayer}>
              <Ionicons 
                name={playingId === item.id ? "pause-circle" : "play-circle"} 
                size={32} 
                color={isUser ? COLORS.gold : COLORS.darkGray} 
              />
              <PlaybackWaveform isPlaying={playingId === item.id} isUser={isUser} />
            </TouchableOpacity>
          )}

          <View style={styles.statusContainer}>
            <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.supportTimestamp]}>
              {item.timestamp}
            </Text>
            {isUser && (
              <Ionicons 
                name="checkmark-done" 
                size={15} 
                color={COLORS.gold} 
                style={styles.checkIcon} 
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Support Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.statusDot} />
          <View>
            <Text style={styles.supportName}>Core Support Team</Text>
            <Text style={styles.supportStatus}>Always active for you</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleVideoCall} style={styles.actionIcon}>
            <Ionicons name="videocam" size={24} color={COLORS.gold} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVoiceCall} style={styles.actionIcon}>
            <Ionicons name="call" size={24} color={COLORS.gold} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={90}
      >
        {/* Added a subtle geometric pattern background like WhatsApp */}
        <ImageBackground 
          source={{ uri: 'https://www.transparenttextures.com/patterns/diagmonds-light.png' }} 
          style={styles.chatBackground}
          imageStyle={{ opacity: 0.4, tintColor: COLORS.gold }}
          resizeMode="repeat"
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current.scrollToEnd()}
          />
        </ImageBackground>

        {/* Input Area */}
        <View style={styles.inputWrapper}>
          <TouchableOpacity onPress={handleImagePicker} style={styles.attachButton} disabled={!!recording}>
            <Ionicons name="add-circle" size={30} color={COLORS.gold} />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            {recording ? (
              <View style={styles.recordingStatusContainer}>
                <View style={styles.redDot} />
                <Text style={styles.recordingTimer}>{formatTime(recordingTime)}</Text>
                <View style={styles.waveContainer}>
                  {waveAnims.map((anim, i) => (
                    <Animated.View 
                      key={i} 
                      style={[styles.waveBarAnimated, { transform: [{ scaleY: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) }] }]} 
                    />
                  ))}
                </View>
                <Text style={styles.swipeText}>Recording...</Text>
              </View>
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
            )}
          </View>

          <View style={styles.micButtonWrapper}>
            {/* Pulse effect behind the mic */}
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

          <TouchableOpacity 
            onPress={sendMessage} 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim() || !!recording}
          >
            <Ionicons name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Professional Video Call Modal Overlay */}
      <Modal visible={isVideoCallActive} animationType="slide" transparent={false}>
        <View style={styles.videoCallContainer}>
          <View style={styles.remoteVideo}>
            {callStatus !== 'Connected' && <ActivityIndicator size="large" color={COLORS.gold} />}
            <Text style={styles.videoStatusText}>
              {callStatus === 'Connected' ? `Connected • ${formatTime(callDuration)}` : 'Connecting to Core Supporter...'}
            </Text>
          </View>
          <View style={styles.localVideoSmall}>
            {isVideoMuted ? (
              <Ionicons name="videocam-off" size={40} color={COLORS.gray} />
            ) : (
              <Ionicons name="person" size={40} color={COLORS.gray} />
            )}
          </View>
          <View style={styles.videoControls}>
            <TouchableOpacity 
              onPress={() => setIsMuted(!isMuted)}
              style={[styles.videoActionBtn, isMuted && { backgroundColor: COLORS.gold }]}
            >
              <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsVideoCallActive(false)} 
              style={[styles.videoActionBtn, { backgroundColor: '#EF4444' }]}
            >
              <Ionicons name="call" size={28} color={COLORS.white} style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsVideoMuted(!isVideoMuted)}
              style={[styles.videoActionBtn, isVideoMuted && { backgroundColor: COLORS.gold }]}
            >
              <Ionicons name={isVideoMuted ? "videocam-off" : "videocam"} size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Professional Voice Call Modal Overlay */}
      <Modal visible={isVoiceCallActive} animationType="slide" transparent={false}>
        <View style={styles.voiceCallContainer}>
           <View style={styles.voiceCallHeader}>
             <Ionicons name="shield-checkmark" size={18} color={COLORS.gold} />
             <Text style={styles.secureText}>End-to-end encrypted</Text>
           </View>
           
           <View style={styles.callerInfo}>
             <View style={styles.avatarLarge}>
                <Ionicons name="headset" size={60} color={COLORS.white} />
             </View>
             {callStatus !== 'Connected' && <ActivityIndicator size="large" color={COLORS.gold} style={{ marginBottom: 15 }} />}
             <Text style={styles.callerName}>Core Support Team</Text>
             <Text style={styles.callStatusText}>
               {callStatus === 'Connected' ? formatTime(callDuration) : callStatus}
             </Text>
           </View>

           <View style={styles.videoControls}>
            <TouchableOpacity 
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
              style={[styles.videoActionBtn, !isSpeakerOn && { opacity: 0.5 }]}
            >
              <Ionicons name={isSpeakerOn ? "volume-high" : "volume-mute"} size={28} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsVoiceCallActive(false)} 
              style={[styles.videoActionBtn, { backgroundColor: '#EF4444' }]}
            >
              <Ionicons name="call" size={28} color={COLORS.white} style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsMuted(!isMuted)}
              style={[styles.videoActionBtn, isMuted && { backgroundColor: COLORS.gold }]}
            >
              <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LiveChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },
  headerInfo: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', marginRight: 10 },
  supportName: { fontWeight: 'bold', fontSize: 16, color: COLORS.darkGray },
  supportStatus: { fontSize: 12, color: COLORS.gray },
  headerActions: { flexDirection: 'row' },
  actionIcon: { marginLeft: 20 },
  
  chatContainer: { flex: 1 },
  chatBackground: { flex: 1, backgroundColor: COLORS.lightGray },
  messageList: { padding: 20 },
  
  messageWrapper: { flexDirection: 'row', marginBottom: 20, maxWidth: '80%' },
  userWrapper: { alignSelf: 'flex-end' },
  supportWrapper: { alignSelf: 'flex-start' },
  
  supportAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 5,
  },
  
  messageBubble: { padding: 12, borderRadius: 18 },
  userBubble: { backgroundColor: COLORS.userBubble, borderBottomRightRadius: 2 },
  supportBubble: { backgroundColor: COLORS.supportBubble, borderBottomLeftRadius: 2 },
  
  messageImage: { width: 200, height: 200, borderRadius: 10, marginBottom: 5 },
  
  messageText: { fontSize: 15, lineHeight: 20 },
  userText: { color: COLORS.white },
  supportText: { color: COLORS.darkGray },
  
  statusContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-end', 
    marginTop: 4 
  },
  checkIcon: { marginLeft: 4 },

  timestamp: { fontSize: 10 },
  userTimestamp: { color: 'rgba(255,255,255,0.6)' },
  supportTimestamp: { color: COLORS.gray },

  audioPlayer: { flexDirection: 'row', alignItems: 'center', width: 150 },
  audioWaveformPlaceholder: { flexDirection: 'row', alignItems: 'center', marginLeft: 10, flex: 1, justifyContent: 'space-between' },
  waveBar: { width: 3, backgroundColor: COLORS.gold, borderRadius: 2 },

  inputWrapper: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  attachButton: { marginRight: 10 },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 15, color: COLORS.black, maxHeight: 100 },
  
  // Recording UI
  recordingStatusContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 45 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 8 },
  recordingTimer: { fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray, marginRight: 15 },
  waveContainer: { flexDirection: 'row', alignItems: 'center', width: 40, justifyContent: 'space-between', marginRight: 10 },
  waveBarAnimated: { width: 3, height: 15, backgroundColor: COLORS.gold, borderRadius: 2 },
  swipeText: { fontSize: 13, color: COLORS.gray },

  micButtonWrapper: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  micButtonCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray },
  pulseCircle: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: '#EF4444' },

  sendButton: {
    backgroundColor: COLORS.gold,
    width: 40,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: COLORS.gray },

  // Video Call Styles
  videoCallContainer: { flex: 1, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center' },
  remoteVideo: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  videoStatusText: { color: COLORS.white, marginTop: 20, fontSize: 16 },
  localVideoSmall: { position: 'absolute', top: 50, right: 20, width: 100, height: 150, backgroundColor: COLORS.darkGray, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.gold },
  videoControls: { position: 'absolute', bottom: 50, flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' },
  videoActionBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  // Voice Call Styles
  voiceCallContainer: { flex: 1, backgroundColor: COLORS.userBubble, alignItems: 'center', paddingTop: 100 },
  voiceCallHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 50 },
  secureText: { color: COLORS.gray, marginLeft: 8, fontSize: 12 },
  callerInfo: { alignItems: 'center' },
  avatarLarge: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  callerName: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  callStatusText: { color: COLORS.gold, fontSize: 16, marginTop: 10 },
});