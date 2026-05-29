import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
// import { useRoute } from "@react-navigation/native";
// Defining the color palette based on your dashboard snippet
const COLORS = {
  black: "#000000",   
  gold: "#B8860B",    // text-bank-gold equivalent
  gray: "#9CA3AF",    // gray-400/500
  white: "#FFFFFF",
};

// Defining the slides for the carousel with local images and remote URLs
const SLIDES = [
  {
    image: require("../assets/images/z-ton-lady1.png"),
    headline: "Easy banking experience",
    subheadline: "A whole world of possibilities at your fingertips.",
  },
  {
    image: require("../assets/images/z-ton-lady2.png"), 
    headline: "Secure & Fast Payments",
    subheadline: "Transfer funds across the globe in just a few taps.",
  },
  {
    image: require("../assets/images/z-ton-lady1.png"),
    headline: "Manage Your Wealth",
    subheadline: "Smart tools to help you save and grow your money.",
  }
];

export default function Index() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carousel effect: Automatically change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, 5000); // Changes every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const activeSlide = SLIDES[currentIndex]; // Get the current active slide based on the index
  
  return (
    <ImageBackground
      source={activeSlide.image} 
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover" 
    >
      {/* Top Gradient for Header Visibility */}
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']} 
        style={styles.topGradient}
      />

      <SafeAreaView style={styles.container}>
        
        {/* Header with Logo at the Right */}
        <View style={styles.header}>
          <Image 
            source={require("../assets/images/app-icon.jpg")}  
            style={styles.logoImage} 
          />
        </View>

        <View style={styles.bottomContent}>
          {/* Welcome Section moved down */}
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.headline}>{activeSlide.headline}</Text>
              <Text style={styles.subheadline}>{activeSlide.subheadline}</Text>
              
              {/* Pagination Dots */}
              <View style={styles.paginationContainer}>
                {SLIDES.map((_, index) => (
                  <View
                    key={index}
                    style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]}
                  />
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton} onPress={() => router.push("/pages/views/global-notification")}>
              <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
 
          {/* Buttons Section at the bottom */}
          <View style={styles.buttonContainer}>  
            <TouchableOpacity style={styles.loginButton} onPress={() => router.push("./pages/views/login")}>
              <Text style={styles.loginButtonTextWhite}>LOG IN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton}  onPress={() => router.push("./pages/views/register")}>
              <Text style={styles.registerButtonText}>REGISTER</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Line before links */}
          <View style={styles.horizontalLine} />

          {/* Links Section moved down */}
          <View style={styles.linksContainer}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Internet Banking</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity>
              <Text style={styles.linkText}>Open Account</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={() => router.push("/pages/views/help")}>
              <Text style={styles.linkText}>Help</Text>
            </TouchableOpacity>
          </View>

          {/* Footer at the absolute bottom */}
          <View style={styles.footer}>
            <Text style={styles.footerSubText}>Z-ton X-L Bank PLC Licensed by Central Bank of Nigeria (CBN)</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom Gradient for Content Visibility */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.bottomGradient}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  backgroundImage: {
    opacity: 0.6, // Lowering this value (e.g., to 0.4) will make the image even darker
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  container: {
    flex: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    height: 80,
  },
  logoImage: {
    width: 130,
    height: 70,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  bottomContent: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  headline: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subheadline: {
    color: '#E5E7EB',
    fontSize: 15,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: COLORS.gold,
    width: 20, // Slightly wider to show it's active
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  notificationButton: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 25,
    marginLeft: 15,
  },
  buttonContainer: {
    paddingHorizontal: 25,
    marginTop: 30,
  },
  loginButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonTextWhite: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 25,
    marginTop: 30,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10, 
  },
  linkText: {
    color: COLORS.white,
    fontSize: 14,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 15,
    backgroundColor: '#BDC3C7',
  },
  footer: {
    left: 0,
    right: 0,
    paddingBottom: 60, // Increased padding to clear the system buttons/tab bar
    alignItems: 'center',
  },
  footerSubText: {
    color: '#D1D5DB',
    fontSize: 10,
    marginTop: 4,
  },
});
