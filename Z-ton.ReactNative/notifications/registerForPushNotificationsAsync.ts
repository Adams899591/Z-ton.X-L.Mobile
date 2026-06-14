import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

 
// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {   // this set the notification channel for android devices, which is required for push notifications to work on android
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250], // this is the vibration pattern for the notification, which is required for push notifications to work on android
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) { // this checks if the app is running on a physical device, which is required for push notifications to work
    const { status: existingStatus } = 
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {  // this checks if the user has granted permission for push notifications, which is required for push notifications to work
      throw new Error(
        "Permission not granted to get push token for push notification!"
      );
    }

    // this gets the project ID from the app.json file, which is required for push notifications to work on Android and iOS devices. The project ID is used to identify the app when sending push notifications.
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }
    
    try { // 
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString); // this is the push token that is used to send push notifications to the device, which is required for push notifications to work
      return pushTokenString;
    } catch (e: unknown) {
      throw new Error(`${e}`);
    }
  } else {
    throw new Error("Must use physical device for push notifications");
  }
}