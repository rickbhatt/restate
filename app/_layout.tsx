import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import "./global.css";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "Missing Clerk Publishable Key. Please set the EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable."
  );
}

LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys."]);

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  fade: true,
  duration: 400,
});

const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isSignedIn as boolean}>
          <Stack.Screen name="(public)" />
        </Stack.Protected>
        <Stack.Protected guard={isSignedIn as boolean}>
          <Stack.Screen name="(auth)/(tabs)" />
        </Stack.Protected>
      </Stack>
    </>
  );
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
