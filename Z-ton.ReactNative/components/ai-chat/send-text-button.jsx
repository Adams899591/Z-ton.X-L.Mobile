import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
 
function SendTextButton({ styles, COLORS, inputText, setInputText, setMessages, simulateAIResponse, recording }) {

  // Function to handle sending text messages
  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text', // Message type is text
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText; // Store current input before clearing
    setInputText(''); // Clear input field
    simulateAIResponse(currentInput); // Simulate AI response to the sent message
  };


  return (
       <>
          {/* Send Button for text messages, disabled when input is empty*/}
          <TouchableOpacity 
            onPress={handleSend} 
            style={[styles.sendButton, (!inputText.trim() || !!recording) && styles.sendButtonDisabled]}
            disabled={!inputText.trim() || !!recording}
          >
            <Ionicons name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
       </>
  )
}

export default SendTextButton
