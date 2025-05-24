import Constants from "expo-constants";
import { useMemo } from "react";

interface AppInfoTypes {
  appVersion: string;
  appName: string;
  currentYear: number;
}

export const useAppInfo = (): AppInfoTypes => {
  const { expoConfig } = Constants;

  return {
    appName: expoConfig?.name || "Unknown",
    appVersion: expoConfig?.version || "Unknown",
    currentYear: new Date().getFullYear(),
  };
};
