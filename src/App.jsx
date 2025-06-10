import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './contexts/FavoritesContext'
import Layout from './components/Layout'
import HomeScreen from './screens/HomeScreen'
import CategoriesScreen from './screens/CategoriesScreen'
import SearchScreen from './screens/SearchScreen'
import FavoritesScreen from './screens/FavoritesScreen'
import GameScreen from './screens/GameScreen'
import PlayScreen from './screens/PlayScreen'
import SettingsScreen from './screens/SettingsScreen'
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen'
import TermsOfServiceScreen from './screens/TermsOfServiceScreen'
import ContactUsScreen from './screens/ContactUsScreen'
import FeedbackScreen from './screens/FeedbackScreen'

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeScreen />} />
            <Route path="categories" element={<CategoriesScreen />} />
            <Route path="search" element={<SearchScreen />} />
            <Route path="favorites" element={<FavoritesScreen />} />
            <Route path="game/:gameId" element={<GameScreen />} />
            <Route path="play/:gameId" element={<PlayScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
            <Route path="privacy-policy" element={<PrivacyPolicyScreen />} />
            <Route path="terms-of-service" element={<TermsOfServiceScreen />} />
            <Route path="contact-us" element={<ContactUsScreen />} />
            <Route path="feedback" element={<FeedbackScreen />} />
          </Route>
        </Routes>
      </Router>
    </FavoritesProvider>
  )
}

export default App