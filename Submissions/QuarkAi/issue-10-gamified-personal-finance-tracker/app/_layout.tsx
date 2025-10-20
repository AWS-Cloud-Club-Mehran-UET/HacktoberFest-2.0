import { CurrencyProvider } from '@/context/currencyContext'
import { DataProvider } from '@/context/dataContext'
import { ThemeProvider } from '@/context/themeContext'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import '../global.css'

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ThemeProvider>
        <CurrencyProvider>
          <DataProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }} />
          </DataProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}