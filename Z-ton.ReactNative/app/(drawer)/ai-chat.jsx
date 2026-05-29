import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
  ActivityIndicator,
  Animated,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import AudioRecording from '../../components/ai-chat/audio';
import ImagePickerAttachment from '../../components/ai-chat/image';
import TextInputContainer from '../../components/ai-chat/text-input-container';
import SendTextButton from '../../components/ai-chat/send-text-button';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { API_URL } from '../server/config';

// Define a consistent color palette for the app
const COLORS = {
  black: "#000000",
  gold: "#B8860B",
  gray: "#9CA3AF",
  white: "#FFFFFF",
  darkGray: "#1F2937",
  lightGray: "#F3F4F6",
  aiBubble: "#F3F4F6",
  userBubble: "#1F2937",
};

// message the user get to see once they enter the page 
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: "Hello! I'm Z-ton AI. I can help you analyze your spending, manage your cards, or answer banking questions. How can I assist you today?",
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'text',
  },
];

 
// Main AI Chat Screen Component
const AIChatScreen = () => {

  // Access user data and updater function from context
  const { user, setUser } = useContext(UserContext); 

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const flatListRef = useRef(null);

  // Audio States
  const [recording, setRecording] = useState(null);
  const recordingInstance = useRef(null);
  const isHoldingMic = useRef(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);
  const soundInstance = useRef(null);

  // Animations
  const pulseAnim = useRef(new Animated.Value(0)).current; // For the mic button pulse effect
  const waveAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current; // For the audio waveform animation





  // Effect to request audio and image picker permissions and set audio mode on component mount
  useEffect(() => {
    // Request necessary permissions for audio recording and image selection
    (async () => {
      await Audio.requestPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    })();
    return () => {
      if (soundInstance.current) soundInstance.current.unloadAsync();
      if (timerRef.current) clearInterval(timerRef.current); // Clear recording timer on unmount
    };
  }, []);


  // Function to simulate AI's response based on user input
  const simulateAIResponse = async (userText) => {
    console.log(userText);
    
    setIsTyping(true);  // Artificial delay to simulate "thinking"
    


      try {

              // Send response to laravel
              const response =  await axios.post(`${API_URL}/aiChat/send-user-request/${user?.id}`, {
                prompt: userText, // this hold the user message
              });


              const responseData = response.data;

              if (responseData.status === "success") {
                console.log(responseData.aiResponse);  //  Note this now hold the Ai reply
              }
              
              // Create a new message object for the AI response
              const newAiMessage = {
                id: Date.now().toString(),
                text: responseData.aiResponse,  // this now will display the ai response to users 
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Current time for timestamp
                type: 'text',
              };

              setMessages(prev => [...prev, newAiMessage]);
              setIsTyping(false);
              // Scroll to the end of the chat to show the new message
              flatListRef.current?.scrollToEnd({ animated: true });
        

        } catch (error) {
            console.log('Axios error:', error.response?.data || error.message);
        }finally{
          setIsTyping(false);
        }
      








    // // Artificial delay to simulate "thinking"
    // setTimeout(() => {
    //   // Determine AI response based on keywords in user's text
    //   let aiResponse = "I'm analyzing your request. As an AI assistant, I can help you with balance inquiries or transaction history.";

    //   const text = userText?.toLowerCase() || "";
      
    //   if (text.includes('balance')) {
    //     aiResponse = "Your current account balance across all linked Z-ton accounts is $12,450.50.";
    //   } else if (text.includes('card')) {
    //     aiResponse = "I can see you have one active Visa card ending in 4582. Would you like to view its limits or freeze it?";
    //   } else if (text.includes('hello') || text.includes('hi')) {
    //     aiResponse = "Hello! I'm here and ready to help you with your Z-ton X-L banking needs.";
    //   }

    //   // Create a new message object for the AI response
    //   const newAiMessage = {
    //     id: Date.now().toString(),
    //     text: aiResponse,
    //     sender: 'ai',
    //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Current time for timestamp
    //     type: 'text',
    //   };

    //   setMessages(prev => [...prev, newAiMessage]);
    //   setIsTyping(false);
    //   // Scroll to the end of the chat to show the new message
    //   flatListRef.current?.scrollToEnd({ animated: true });
    // }, 1500);
  };





  // Function to play audio messages which is passed as a component to the  render function
  const playAudio = async (item) => {
      if (soundInstance.current) {
        await soundInstance.current.stopAsync();
        await soundInstance.current.unloadAsync(); // Unload previous sound
        soundInstance.current = null;
        if (playingId === item.id) { setPlayingId(null); return; }
      } // If the same audio is clicked again, stop it
      const { sound } = await Audio.Sound.createAsync({ uri: item.uri }, { shouldPlay: true });
      soundInstance.current = sound;
      setPlayingId(item.id);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) { setPlayingId(null); sound.unloadAsync(); soundInstance.current = null; }
      });
  };

  // Function to render the audio waveform animation during playback passed as a component to the audio player in the message render function
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
                height: 6 + i * 2,
                backgroundColor: isUser ? COLORS.gold : COLORS.darkGray, // Changed to gold for user messages
                transform: [{ scaleY: isPlaying ? anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] }) : 1 }], // Animate height for waveform effect
              },
            ]}
          />
        ))}
      </View>
    );
  };

  // Render function for each message item in the chat used in FlatList
  const renderMessage = ({ item }) => {
    const isAi = item.sender === 'ai';
    return (
      <View style={[styles.messageRow, isAi ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]}>
        <View style={[styles.messageBubble, isAi ? styles.aiBubble : styles.userBubble]}>
          
          {isAi && (
            <View style={styles.aiIconBadge}>
              <Ionicons name="sparkles" size={12} color={COLORS.white} />
            </View>
          )}

          {/* Render image message if type is 'image' */}
          {item.type === 'image' && <Image source={{ uri: item.uri }} style={styles.messageImage} />}
          
          {/* Render audio player if type is 'audio' */}
          {item.type === 'audio' && (
            <TouchableOpacity onPress={() => playAudio(item)} style={styles.audioPlayer}>
              <Ionicons name={playingId === item.id ? "pause-circle" : "play-circle"} size={32} color={isAi ? COLORS.darkGray : COLORS.gold} />
              <PlaybackWaveform isPlaying={playingId === item.id} isUser={!isAi} />
            </TouchableOpacity>
          )}


          {/* Render text message if text exists */}
          {!!item.text && <Text style={[styles.messageText, isAi ? styles.aiText : styles.userText]}>{item.text}</Text>}
          
          {/* Status container for timestamp and checkmark */}
          <View style={styles.statusContainer}>
            <Text style={[styles.timestamp, isAi ? styles.aiTimestamp : styles.userTimestamp]}>
              {item.timestamp}
            </Text>
            {/* Display checkmark for user-sent messages */}
            {!isAi && (
              <Ionicons name="checkmark-done" size={14} color={COLORS.gold} style={styles.checkIcon} />
            )}
          </View>


        </View>
      </View>
    );
  };



  return (
    <SafeAreaView style={styles.container}>
    
      {/* Chat Background with pattern */}
      <ImageBackground 
        source={{ uri: 'https://www.transparenttextures.com/patterns/diagmonds-light.png' }} 
        style={styles.chatBackground}
        // Adjusted opacity to match live chat
        imageStyle={{ opacity: 0.4, tintColor: COLORS.gold }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* AI Typing Indicator */}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={COLORS.gold} />
            <Text style={styles.typingText}>Z-ton AI is thinking...</Text>
          </View>
        )}
        {isTranscribing && (
          <View style={styles.typingIndicator}>
            {/* Audio Transcription Indicator */}
            <ActivityIndicator size="small" color={COLORS.gold} />
            <Text style={styles.typingText}>Transcribing audio...</Text>
          </View>
        )}
      </ImageBackground>


      {/*  Keyboard Avoiding View to ensure input is not hidden by the keyboard on both iOS and Android
        which consists of the text input, image picker attachment button, and audio recording button components */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >


        <View style={styles.inputWrapper}>

            {/* Attachment Button for Image Picker (disabled during recording) .props*/}
              <ImagePickerAttachment
                  styles={styles}
                  COLORS={COLORS}
                  recording={recording}
                  setMessages={setMessages}
                  simulateAIResponse={simulateAIResponse}
              />


           {/* Text input container that switches to recording status when recording is active .props */}
            <TextInputContainer
                styles={styles}
                COLORS={COLORS}
                recording={recording}
                pulseAnim={pulseAnim}
                inputText={inputText}
                setInputText={setInputText}
                recordingTime={recordingTime}
                setRecordingTime={setRecordingTime}
                waveAnims={waveAnims}
            />


            {/* Microphone Button for Audio Recording  .props*/}
            <AudioRecording
                styles={styles}
                COLORS={COLORS}
                recording={recording}
                pulseAnim={pulseAnim}
                recordingInstance={recordingInstance}
                timerRef={timerRef}
                setRecording={setRecording}
                setRecordingTime={setRecordingTime}
                waveAnims={waveAnims}
                soundInstance={soundInstance}
                setPlayingId={setPlayingId}
                playingId={playingId}
                setMessages={setMessages}
                isTranscribing={isTranscribing}
                setIsTranscribing={setIsTranscribing}
                simulateAIResponse={simulateAIResponse}
                isHoldingMic={isHoldingMic}
            />

            {/* Send Button for text messages, disabled when input is empty .props*/}
            <SendTextButton
              styles={styles}
              COLORS={COLORS}
              inputText={inputText}
              setInputText={setInputText}
              setMessages={setMessages}
              simulateAIResponse={simulateAIResponse}
              recording={recording}
            />
    

        </View>


      </KeyboardAvoidingView>


    </SafeAreaView>
  );
};

export default AIChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  backButton: { padding: 5 },
  headerInfo: { flex: 1, marginLeft: 15 },
  headerTitle: { fontWeight: 'bold', fontSize: 18, color: COLORS.darkGray },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  headerStatus: { fontSize: 12, color: COLORS.gray },
  headerIcon: { padding: 5 },
  
  chatBackground: { flex: 1, backgroundColor: COLORS.lightGray },
  messageList: { padding: 20, paddingBottom: 10 },
  messageRow: { width: '100%', marginBottom: 15 },
  messageBubble: { 
    padding: 15, 
    borderRadius: 20, 
    maxWidth: '85%',
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  aiBubble: { backgroundColor: COLORS.aiBubble, borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: COLORS.userBubble, borderTopRightRadius: 4 },
  
  aiIconBadge: {
    position: 'absolute',
    top: -10,
    left: -10,
    backgroundColor: COLORS.gold,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: COLORS.darkGray },
  userText: { color: COLORS.white },
  
  messageImage: { width: 200, height: 200, borderRadius: 10, marginBottom: 5 },
  audioPlayer: { flexDirection: 'row', alignItems: 'center', width: 200, paddingVertical: 5 },
  audioWaveformPlaceholder: { flexDirection: 'row', alignItems: 'center', marginLeft: 10, flex: 1, justifyContent: 'space-between' },
  waveBar: { width: 3, borderRadius: 2 },

  statusContainer: { // Added to group timestamp and checkmark
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  recordingStatusContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 40 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 8 },
  recordingTimer: { fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray, marginRight: 15 },
  waveContainer: { flexDirection: 'row', alignItems: 'center', width: 40, justifyContent: 'space-between', marginRight: 10 },
  waveBarAnimated: { width: 3, height: 15, backgroundColor: COLORS.gold, borderRadius: 2 },
  swipeText: { fontSize: 13, color: COLORS.gray },

  micButtonWrapper: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  micButtonCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray }, // Added mic button circle style
  pulseCircle: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: '#EF4444' }, // Changed to red for recording pulse
  
  checkIcon: { marginLeft: 4 }, // Moved color to component for consistency

  attachButton: { marginRight: 10, padding: 5 },

  timestamp: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  aiTimestamp: { color: COLORS.gray },
  userTimestamp: { color: 'rgba(255,255,255,0.6)' },

  typingIndicator: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingVertical: 10 
  },
  typingText: { marginLeft: 10, fontSize: 13, color: COLORS.gray, fontStyle: 'italic' },

  inputWrapper: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 15, color: COLORS.black, maxHeight: 100 },
  sendButton: {
    backgroundColor: COLORS.gold,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sendButtonDisabled: { backgroundColor: COLORS.gray, elevation: 0 },
});
