import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomTabBar from './BottomTabBar'

const Layout = () => {
  const location = useLocation()
  
  // Hide bottom tab bar on play screen for better gaming experience
  const hideBottomBar = location.pathname.startsWith('/play/')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, paddingBottom: hideBottomBar ? 0 : '80px' }}>
        <Outlet />
      </main>
      {!hideBottomBar && <BottomTabBar />}
    </div>
  )
}

export default Layout