import React, { useEffect, useMemo, useRef , useState} from 'react';
import { View, Text, Modal, Pressable, TouchableOpacity, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../app/server/config';

function ManageLimitsModal({user, isLimitModalVisible, setLimitModalVisible, COLORS, styles }) {


   const [dailyLimit, setDailyLimit] = useState(user.transection_limit !== null ? user.transection_limit : 100000); // Initial daily limit
   const [trackWidth, setTrackWidth] = useState(0); // Width of the slider track
   const [currentSliderPosition, setCurrentSliderPosition] = useState(0); // Position of the thumb in pixels
   const startPos = useRef(0); // Store the position where the drag started
   


 const handleSubmition =  async () => {
    
    

     try {
            const response = await axios.post(`${API_URL}/card/set-transection-limit/${user.id}`,{
                transection_limit: dailyLimit,
            });
console.log("uuuuuuuuuuuuuuuuuu");
            const responseData = response.data;

            if (responseData.status === "success") {
                  setLimitModalVisible(false);
            }
     } catch (error) {
         console.log(error);
         
     }


     
  }




  // We use a Ref to keep track of the current position to avoid stale closures in PanResponder
  const posRef = useRef(0);
  useEffect(() => {
    posRef.current = currentSliderPosition;
  }, [currentSliderPosition]);

  const minLimit = 0;
  const maxLimit = 100000; // Maximum possible limit 
  const thumbWidth = 24; // Width defined in styles.rangeThumb 

  // When track width is measured, set the initial position based on the $2500 default
  useEffect(() => {
    if (trackWidth > 0) {
      const initialPosition = (dailyLimit / maxLimit) * trackWidth;
      setCurrentSliderPosition(initialPosition);
    }
  }, [trackWidth, isLimitModalVisible]);

  const panResponder = useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        // Use the ref value to get the absolutely latest position
        startPos.current = posRef.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (trackWidth <= 0) return;

        // Calculate new position using the delta (change) in X
        let newPosition = startPos.current + gestureState.dx;

        // Boundary checks: don't let the thumb go off the track
        if (newPosition < 0) {
          newPosition = 0;
        } else if (newPosition > trackWidth) {
          newPosition = trackWidth;
        }

        // Update the visual position of the thumb
        setCurrentSliderPosition(newPosition);

        // Calculate the limit value based on the thumb percentage
        const percentage = newPosition / trackWidth;
        const newLimit = Math.round(percentage * (maxLimit - minLimit) + minLimit);
        
        // Round to nearest 50 for a smoother feel
        setDailyLimit(Math.round(newLimit / 50) * 50);
      },
      onPanResponderRelease: () => {}
    })
  , [trackWidth]); // Re-create PanResponder if trackWidth changes so the closure isn't stale


  
  return (
      <>

        {/* Manage Limits Bottom Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={isLimitModalVisible}
            onRequestClose={() => setLimitModalVisible(false)}
        >
            <Pressable style={styles.modalOverlay} onPress={() => setLimitModalVisible(false)}>
            {/*           
                Wrapping modalContent in a Pressable with a dummy onPress 
                prevents touches inside from closing the modal via the overlay.
            */}

            <Pressable style={styles.modalContent} onPress={() => {}}>
                <View style={styles.modalHeader}>
                {/* Card Transaction Limi */}
                <Text style={styles.modalTitle}>Card Transaction Limit</Text>
                <TouchableOpacity onPress={() => setLimitModalVisible(false)}>
                    <Ionicons name="close-circle" size={28} color={COLORS.gray} />
                </TouchableOpacity>
                </View>

                <Text style={styles.limitAmount}>${dailyLimit.toLocaleString('en-US')}</Text>
                <Text style={styles.limitSubtext}>Adjust your daily spending limit</Text>

                <View style={styles.rangeContainer}>
                <View 
                    onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
                    style={styles.rangeTrack}
                >
                    <View style={[styles.rangeFill, { width: currentSliderPosition }]} />
                    <View 
                    style={[
                        styles.rangeThumb, 
                        { left: currentSliderPosition }
                    ]} 
                    {...panResponder.panHandlers} // Attach pan handlers to the thumb
                    />
                </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmition() }>
                <Text style={styles.saveButtonText}>Set New Limit</Text>
                </TouchableOpacity>
            </Pressable>
            </Pressable>
        </Modal>
      
      </>
  )
}

export default ManageLimitsModal