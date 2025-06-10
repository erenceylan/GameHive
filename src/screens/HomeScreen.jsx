import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Play, Star } from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'
import * as Constants from '../constants/Constants'
import AnimatedHeader from '../components/AnimatedHeader'

const HomeScreen = () => {
  const navigate = useNavigate()
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [games, setGames] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [lastPage, setLastPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  const fetchGames = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${Constants.GAMES_URL}?page=${page}`)
      const json = await response.json()
      
      if (page === 1) {
        setGames(json.data || [])
      } else {
        setGames(prev => [...prev, ...(json.data || [])])
      }
      setLastPage(json.last_page || 1)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchGames(currentPage)
  }, [currentPage])

  const onRefresh = () => {
    setRefreshing(true)
    setCurrentPage(1)
    fetchGames(1)
  }

  const loadMore = () => {
    if (currentPage < lastPage && !isLoading) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handleFavoriteToggle = (game) => {
    if (isFavorite(game.id)) {
      removeFromFavorites(game.id)
    } else {
      addToFavorites(game)
    }
  }

  const getCategoryName = (game) => {
    const title = game.title ? game.title.toLowerCase() : ''
    const description = game.description ? game.description.toLowerCase() : ''
    
    const categoryKeywords = {
      'action': ['action', 'battle', 'fight', 'shooter', 'gun', 'warrior', 'combat'],
      'puzzle': ['puzzle', 'match', 'brain', 'logic', 'solve', 'connect', 'tetris'],
      'racing': ['racing', 'race', 'car', 'drive', 'speed', 'drift', 'track'],
      'skill': ['skill', 'throw', 'jump', 'balance', 'precision', 'aim'],
      'arcade': ['arcade', 'retro', 'classic', 'score', 'coin', 'pac-man', 'platform'],
      'educational': ['learn', 'educational', 'math', 'words', 'science', 'knowledge'],
      'sport': ['sport', 'football', 'soccer', 'basketball', 'baseball', 'golf', 'tennis'],
      'quiz': ['quiz', 'question', 'trivia', 'knowledge', 'answer']
    }
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (title.includes(keyword) || description.includes(keyword)) {
          return category.charAt(0).toUpperCase() + category.slice(1)
        }
      }
    }
    
    const fallbacks = ['Arcade', 'Action', 'Puzzle', 'Skill', 'Sport']
    return fallbacks[game.id % fallbacks.length]
  }

  const renderGameCard = (game) => {
    const hasImage = game.thumbnail && game.thumbnail.length > 0
    const hue = (game.id * 10) % 360
    const categoryName = getCategoryName(game)
    const isGameFavorite = isFavorite(game.id)

    return (
      <div key={game.id} style={styles.gameCard} className="card-hover">
        <div 
          style={styles.imageContainer}
          onClick={() => navigate(`/game/${game.id}`)}
        >
          {hasImage ? (
            <img 
              src={game.thumbnail}
              alt={game.title}
              style={styles.gameImage}
            />
          ) : (
            <div style={{
              ...styles.gamePlaceholder,
              backgroundColor: `hsl(${hue}, 80%, 70%)`
            }}>
              <span style={styles.gamePlaceholderText}>
                {game.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div style={styles.gameInfo}>
          <h3 style={styles.gameTitle}>{game.title}</h3>
          
          <div style={styles.gameBottomRow}>
            <div style={styles.categoryBadge}>
              <span style={styles.categoryText}>{categoryName}</span>
            </div>
            
            <div style={styles.actionButtons}>
              <button 
                style={styles.playButton}
                onClick={() => navigate(`/play/${game.id}`)}
                className="btn-hover"
              >
                <Play size={12} />
                <span style={styles.playButtonText}>Play</span>
              </button>
              
              <button 
                style={{
                  ...styles.favoriteButton,
                  ...(isGameFavorite ? styles.favoriteButtonActive : {})
                }}
                onClick={() => handleFavoriteToggle(game)}
                className="btn-hover"
              >
                <Star 
                  size={14} 
                  fill={isGameFavorite ? '#FF9F43' : 'none'}
                  color={isGameFavorite ? '#FF9F43' : '#666'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Children's Games</h1>
          <p style={styles.headerSubtitle}>The best games are here!</p>
          
          <button 
            style={styles.settingsButton}
            onClick={() => navigate('/settings')}
            className="btn-hover"
          >
            <Settings size={24} color="#FFFFFF" />
          </button>
          
          <div style={styles.headerDecoration}>
            <div style={styles.decorCircle1} />
            <div style={styles.decorCircle2} />
            <div style={styles.decorCircle3} />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {isLoading && games.length === 0 ? (
          <div style={styles.loadingContainer}>
            <div className="loading-spinner" />
            <p style={styles.loadingText}>Loading games...</p>
          </div>
        ) : (
          <>
            <div style={styles.gameGrid}>
              {games.map(renderGameCard)}
            </div>
            
            {currentPage < lastPage && (
              <div style={styles.loadMoreContainer}>
                <button 
                  style={styles.loadMoreButton}
                  onClick={loadMore}
                  disabled={isLoading}
                  className="btn-hover"
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                      <span>Loading...</span>
                    </>
                  ) : (
                    'Load More Games'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  header: {
    width: '100%',
    height: '150px',
    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
    boxShadow: '0 4px 8px rgba(108, 92, 231, 0.3)',
    overflow: 'hidden',
    marginBottom: '20px'
  },
  headerContent: {
    height: '100%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '10px',
    textShadow: '0 2px 3px rgba(0,0,0,0.15)',
    zIndex: 2,
    margin: 0
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#fff',
    marginBottom: '15px',
    zIndex: 2,
    margin: 0
  },
  settingsButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 10
  },
  headerDecoration: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  decorCircle1: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: '-40px',
    right: '-30px'
  },
  decorCircle2: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: '-20px',
    left: '20px'
  },
  decorCircle3: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: '20px',
    left: '-20px'
  },
  content: {
    padding: '0 16px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  },
  gameCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0,0,0,0.05)',
    height: '280px',
    display: 'flex',
    flexDirection: 'column'
  },
  imageContainer: {
    width: '100%',
    height: '180px',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  gameImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  gamePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gamePlaceholderText: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
  },
  gameInfo: {
    padding: '12px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  gameTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  gameBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryBadge: {
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '12px'
  },
  categoryText: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#666'
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  playButton: {
    backgroundColor: '#FF9F43',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  playButtonText: {
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  favoriteButton: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoriteButtonActive: {
    backgroundColor: '#FFE0E0',
    borderColor: '#FF9F43'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    minHeight: '300px'
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#666'
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px'
  },
  loadMoreButton: {
    backgroundColor: '#6C5CE7',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
}

// Responsive styles
const mediaQuery = window.matchMedia('(max-width: 768px)')
if (mediaQuery.matches) {
  styles.gameGrid.gridTemplateColumns = 'repeat(auto-fill, minmax(160px, 1fr))'
  styles.gameCard.height = '220px'
  styles.imageContainer.height = '140px'
}

export default HomeScreen