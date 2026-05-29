import React from 'react';
import {
  Text,
  View,
  TextInput,
  Animated,
} from 'react-native';
 
function TextInputContainer({styles, recording, inputText, setInputText, recordingTime, waveAnims,}) {



  return (
    <>
                {/* Text input container that switches to recording status when recording is active */}
                 <View style={styles.textInputContainer}>

                   {recording ? (
                     <View style={styles.recordingStatusContainer}>
                       <View style={styles.redDot} />
                       <Text style={styles.recordingTimer}>{Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}</Text>
                       <View style={styles.waveContainer}>
                         {waveAnims.map((anim, i) => (
                           <Animated.View 
                             key={i} 
                             style={[styles.waveBarAnimated, { transform: [{ scaleY: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) }] }]} 
                           />
                         ))}
                       </View>
                       {/* Display recording time and status */}
                       <Text style={styles.swipeText}>Recording...</Text>
                     </View>
                   ) : (
                     <TextInput
                       style={styles.input}
                       placeholder="Ask about your finances..."
                       value={inputText}
                       onChangeText={setInputText}
                       multiline
                     />
                   )}

                 </View>
    </>
  )
}

export default TextInputContainer