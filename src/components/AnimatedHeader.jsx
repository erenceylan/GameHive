import React, { useEffect, useState } from 'react'

const AnimatedHeader = ({ title }) => {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100)
    }, 150)

    return () => clearInterval(interval)
  }, [])

  const backgroundColor = `hsl(${250 + Math.sin(animationPhase * 0.1) * 30}, 70%, 65%)`

  return (
    <div style={{
      ...styles.container,
      backgroundColor
    }}>
      {/* Animated waves */}
      <div style={styles.wavesContainer}>
        <div style={{
          ...styles.wave,
          transform: `translateX(${-100 + (animationPhase * 2) % 200}px)`
        }} />
        <div style={{
          ...styles.wave2,
          transform: `translateX(${100 - (animationPhase * 1.5) % 200}px)`
        }} />
      </div>
      
      {/* Title */}
      <h1 style={styles.title}>{title}</h1>
      
      {/* Decorative elements */}
      <div style={{
        ...styles.decorElem1,
        transform: `rotate(${animationPhase * 3.6}deg)`
      }} />
      <div style={{
        ...styles.decorElem2,
        transform: `rotate(${-animationPhase * 3.6}deg)`
      }} />
    </div>
  )
}

const styles = {
  container: {
    height: '160px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: '25px',
    borderBottomRightRadius: '25px',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '20px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    zIndex: 10,
    letterSpacing: '1px',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
    margin: 0
  },
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    overflow: 'hidden'
  },
  wave: {
    position: 'absolute',
    bottom: '-10px',
    left: 0,
    right: 0,
    height: '50px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50px',
    width: '200%'
  },
  wave2: {
    position: 'absolute',
    bottom: '-20px',
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50px',
    width: '200%'
  },
  decorElem1: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: '-30px',
    right: '-20px'
  },
  decorElem2: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: '-20px',
    left: '-20px'
  }
}

export default AnimatedHeader