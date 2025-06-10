import React, { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorite_games')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorite_games', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (game) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === game.id)
      if (!isAlreadyFavorite) {
        return [...prev, game]
      }
      return prev
    })
  }

  const removeFromFavorites = (gameId) => {
    setFavorites(prev => prev.filter(game => game.id !== gameId))
  }

  const isFavorite = (gameId) => {
    return favorites.some(game => game.id === gameId)
  }

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}