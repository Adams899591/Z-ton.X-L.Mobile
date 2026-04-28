<?php

use Illuminate\Support\Facades\Route;
// use ipconfig to check ur IP address and use it in the command line to start the server with that IP and port 8000
// php artisan serve --host=10.174.235.166 --port=8000        used to start the server with the specified IP and port
//php artisan route:list --path=api         used to list all the routes in the application, filtering by those that start with "api"
// php artisan install:api          used to install the API routes and controllers for authentication and user management in the application



// break down of all the package used 
    //  1. // this 
// npx expo install @react-native-async-storage/async-storage

/*
|--------------------------------------------------------------------------
| ProfilePoint Project - Mobile Packages Overview
|--------------------------------------------------------------------------
|
| This section outlines the key packages installed and utilized in the 
| React Native frontend to handle API communication, security, and UI.
|
| #1 axios
|    Installation: npx expo install axios
|    Purpose: Handles all HTTP requests. It is used to communicate with 
|    the Laravel backend for user registration, login, and data fetching.
|
| #2 expo-haptics
|    Installation: npx expo install expo-haptics
|    Purpose: Provides physical feedback. It triggers vibrations on the 
|    device to confirm successful actions like logging in or refreshing 
|    the task list.
|
| #3 expo-local-authentication
|    Installation: npx expo install expo-local-authentication
|    Purpose: Biometric security. This allows the "Fingerprint" login 
|    feature to work by accessing the device's native biometric hardware.
|
| #4 @react-native-async-storage/async-storage
|    Installation: npx expo install @react-native-async-storage/async-storage
|    Purpose: Persistent storage. It stores the user's data locally on 
|    the phone so that they remain logged in even after refreshing or 
|    closing the app.
|
| #5 expo-router
|    Installation: npx expo install expo-router
|    Purpose: Navigation. It manages the app's routing structure, 
|    allowing for smooth transitions between the login, signup, and 
|    dashboard screens.
|
| #6 expo-linear-gradient
|    Installation: npx expo install expo-linear-gradient
|    Purpose: Professional UI styling. Used to create the smooth color 
|    gradients in the headers of the Home and Explore screens.
|
| #7 react-native-gesture-handler
|    Installation: npx expo install react-native-gesture-handler
|    Purpose: Advanced touch interaction. Specifically used to enable 
|    the "Swipe-to-Delete" gesture found in the Tasks screen.
|
| #8 react-native-safe-area-context
|    Installation: npx expo install react-native-safe-area-context
|    Purpose: Layout consistency. It ensures the app UI stays within 
|    visible boundaries, avoiding overlaps with the phone's notch or 
|    bottom indicator bars.
|
| #9 @expo/vector-icons
|    Installation: npx expo install @expo/vector-icons
|    Purpose: Iconography. Provides the MaterialIcons used for input 
|    fields, navigation tabs, and action buttons.
|
| #10 react-native-keychain
|    Installation: npx expo install react-native-keychain
|    Purpose: Secure Hardware Storage. It stores sensitive biometric 
|    tokens in the device's secure enclave (Keychain/Keystore). This 
|    ensures the fingerprint token persists even after a user logs out 
|     and AsyncStorage is cleared.

| #11 expo-secure-store
|    Installation: npx expo install expo-secure-store
|    Purpose: Secure Storage. It stores sensitive biometric 
|    tokens securely on the device. This ensures the fingerprint 
|    token persists even after a user logs out and AsyncStorage 
|    is cleared, and it works perfectly within Expo Go.
*/

/*
| #12 laravel/socialite
|    Installation: composer require laravel/socialite
|    Purpose: While we handle the handshake on the mobile app, Socialite 
|    is the standard Laravel library for managing Google/Facebook OAuth data.
*/


    // "expo-secure-store": "~15.0.8",