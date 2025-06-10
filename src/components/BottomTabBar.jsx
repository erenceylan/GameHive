import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Grid3X3, Search, Star, Settings } from 'lucide-react'

const BottomTabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { id: 'home', path: '/', icon: Home, label: 'Home', color: '#6C5CE7' },
    { id: 'categories', path: '/categories', icon: Grid3X3, label: 'Categories', color: '#e75cc4' },
    { id: 'search', path: '/search', icon: Search, label: 'Search', color: '#FF7979' },
    { id: 'favorites', path: '/favorites', icon: Star, label: 'Favorites', color: '#FF9F43' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings', color: '#00b894' }
  ]

  const getActiveTab = () => {
    const currentPath = location.pathname
    return tabs.find(tab => tab.path === currentPath)?.id || 'home'
  }

  const activeTab = getActiveTab()

  return (
    <div style={styles.container}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            style={{
              ...styles.tabItem,
              ...(isActive ? { ...styles.activeTab, borderTopColor: tab.color, backgroundColor: `${tab.color}15` } : {})
            }}
            onClick={() => navigate(tab.path)}
          >
            <div style={styles.iconContainer}>
              <Icon 
                size={22} 
                color={isActive ? tab.color : '#555'} 
              />
            </div>
            <span style={{
              ...styles.tabText,
              color: isActive ? tab.color : '#555',
              fontWeight: isActive ? 'bold' : '500'
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 -3px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000
  },
  tabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderTop: '3px solid transparent'
  },
  activeTab: {
    borderTopWidth: '3px',
    borderTopStyle: 'solid'
  },
  iconContainer: {
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabText: {
    fontSize: '12px',
    marginTop: '3px',
    transition: 'all 0.3s ease'
  }
}

export default BottomTabBar