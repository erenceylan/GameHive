import React from 'react'
import { 
  Gamepad2, Zap, Puzzle, Target, Heart, HelpCircle, 
  Calculator, Brain, Trophy, Crown, Car, Type, 
  Users, Paintbrush, Mountain, Music 
} from 'lucide-react'

const CategoryCard = ({ category, onPress, isSelected = false }) => {
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return Gamepad2
    
    const iconMap = {
      'arcade': Gamepad2,
      'action': Zap,
      'puzzle': Puzzle,
      'skill': Target,
      'girls': Heart,
      'quiz': HelpCircle,
      'math': Calculator,
      'brain': Brain,
      'sports': Trophy,
      'strategy': Crown,
      'racing': Car,
      'words': Type,
      'multiplayer': Users,
      'drawing': Paintbrush,
      'adventure': Mountain,
      'music': Music
    }
    
    return iconMap[categoryName.toLowerCase()] || Gamepad2
  }

  const getCategoryColor = (id) => {
    const colors = [
      '#FF6B6B', '#FF9F43', '#54A0FF', '#5F27CD', '#FF78C5',
      '#1DD1A1', '#FECA57', '#FF5252', '#00B0FF', '#9C27B0', '#2ECC71'
    ]
    return colors[id % colors.length]
  }

  const categoryTitle = category.title || category.name
  const bgColor = getCategoryColor(category.id)
  const IconComponent = getCategoryIcon(categoryTitle)

  return (
    <button
      style={{
        ...styles.container,
        backgroundColor: bgColor,
        ...(isSelected ? styles.selectedContainer : {}),
        transform: isSelected ? 'scale(1.05)' : 'scale(1)'
      }}
      onClick={onPress}
      className="card-hover"
    >
      <div style={styles.contentContainer}>
        <div style={styles.iconContainer}>
          <IconComponent size={24} color="#FFFFFF" />
        </div>
        
        <span style={styles.categoryName}>
          {categoryTitle}
        </span>
      </div>
      
      <div style={styles.decoration} />
      <div style={styles.decoration2} />
    </button>
  )
}

const styles = {
  container: {
    width: '180px',
    height: '100px',
    margin: '6px',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease'
  },
  selectedContainer: {
    borderWidth: '2.5px',
    borderColor: '#FFF',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.35)'
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    position: 'relative',
    zIndex: 2
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    backgroundColor: 'rgba(255,255,255,0.35)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255,255,255,0.5)'
  },
  categoryName: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: '16px',
    textAlign: 'center',
    marginTop: '6px',
    letterSpacing: '0.3px',
    textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
  },
  decoration: {
    position: 'absolute',
    width: '90px',
    height: '90px',
    borderRadius: '45px',
    right: '-25px',
    top: '-25px',
    opacity: 0.8,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  decoration2: {
    position: 'absolute',
    width: '70px',
    height: '70px',
    borderRadius: '35px',
    left: '-15px',
    bottom: '-15px',
    opacity: 0.7,
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
}

export default CategoryCard