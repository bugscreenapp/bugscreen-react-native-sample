import { useColorScheme } from "react-native";

const light = {
  primary: "#0F766E",
  onPrimary: "#FFFFFF",
  primaryContainer: "#A7F3E9",
  onPrimaryContainer: "#00201C",
  secondary: "#E05D3C",
  tertiaryContainer: "#FCE6BF",
  onTertiaryContainer: "#291800",
  background: "#FBF8F3",
  text: "#1B1C18",
  surface: "#FFFFFF",
  muted: "#4B4740",
  outline: "#D5CFC4",
  error: "#BA1A1A",
};
const dark: typeof light = {
  primary: "#6FD8CC",
  onPrimary: "#003731",
  primaryContainer: "#005047",
  onPrimaryContainer: "#A7F3E9",
  secondary: "#FFB59D",
  tertiaryContainer: "#614000",
  onTertiaryContainer: "#FCE6BF",
  background: "#0F1311",
  text: "#E3E3DC",
  surface: "#171B18",
  muted: "#C7C7BB",
  outline: "#43483F",
  error: "#FFB4AB",
};

export function useTheme() {
  const isDark = useColorScheme() === "dark";
  return { colors: isDark ? dark : light, isDark };
}
