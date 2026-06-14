import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import Constants from "expo-constants";
import { registerForPushNotificationsAsync } from "@/notifications/registerForPushNotificationsAsync";

// This allows notifications to be shown even when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // 
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// This context provides the expo push token, the notification object, and any error that occurs during the registration process for push notifications. It also sets up listeners for incoming notifications and notification responses, and cleans them up when the component unmounts. The context can be used throughout the app to access the push token, notification data, and any errors related to push notifications.
interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

// Create the NotificationContext with the defined type, and initialize it with undefined. This context will be used to provide the expo push token, notification data, and any errors related to push notifications to the components that consume this context.
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Custom hook to use the NotificationContext. This hook checks if the context is undefined (which means it is being used outside of a NotificationProvider) and throws an error if that's the case. Otherwise, it returns the context value, which includes the expo push token, notification data, and any errors related to push notifications.
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  // This useEffect hook is responsible for registering the device for push notifications, setting up listeners for incoming notifications and notification responses, and cleaning up those listeners when the component unmounts. It calls the registerForPushNotificationsAsync function to get the expo push token and sets it in the state. It also sets up listeners for incoming notifications and notification responses, and logs the received notifications and responses to the console. Finally, it returns a cleanup function that removes the notification listeners when the component unmounts.
  useEffect(() => {
    // Check if we are running in Expo Go (SDK 53+ does not support remote push in Expo Go)
    if (Constants.appOwnership === 'expo') {
      console.warn("Push notifications are not supported in Expo Go on SDK 53+. Please use a Development Build.");
      setError(new Error("Push notifications not supported in Expo Go."));
      return;
    }

    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token))
      .catch((error) => setError(error));

      
      // Set up listeners for incoming notifications and notification responses, and log the received notifications and responses to the console. The notification listener listens for incoming notifications and updates the notification state with the received notification data. The response listener listens for notification responses (when a user interacts with a notification) and logs the response data to the console. These listeners are essential for handling push notifications in the app and providing feedback to the user based on their interactions with notifications.
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received whenever a notification is received while the app is running.: ", notification);
        setNotification(notification);
      });

      // Set up a listener for notification responses, which are triggered when a user interacts with a notification (e.g., tapping on it). This listener logs the notification response data to the console, allowing developers to handle user interactions with notifications and provide appropriate feedback or navigation within the app based on the user's actions.
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response:whenever a user interacts with a notification ",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        // Handle the notification response here
      });


      // Clean up the notification listeners when the component unmounts to prevent memory leaks and ensure that the listeners are not active when they are no longer needed. This is done by removing the notification subscriptions using the removeNotificationSubscription method provided by the Notifications API, which takes the subscription object returned when adding the listeners. This cleanup is crucial for maintaining optimal performance and preventing unintended behavior in the app related to notifications.
    return () => {
      if (notificationListener.current) { // Check if the notification listener subscription exists before attempting to remove it, to avoid potential errors if the listener was not set up successfully.
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) { // Check if the response listener subscription exists before attempting to remove it, to avoid potential errors if the listener was not set up successfully.
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
 

  return (
    // Provide the expo push token, notification data, and any errors related to push notifications to the components that consume this context. This allows other components in the app to access the push token for sending notifications, display received notification data, and handle any errors that may occur during the registration process for push notifications.
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};