import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the tabs main menu
  return <Redirect href="/(tabs)/mainMenu" />;
}