import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UseAuth } from '../context/AuthContext'

function Navbar() {
  const { logout } = UseAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const handleLogout = (): void => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const handleNavClick = (): void => {
    setMenuOpen(false)
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="max-w-6xl mx-auto">

        {/* Top bar - always visible */}
        <div className="flex items-center justify-between">
          <Link
            to="/campaigns"
            onClick={handleNavClick}
            className="text-xl font-bold text-amber-500 hover:text-amber-400"
          >
            ⚔️ DungeonScribe
          </Link>

          {/* Desktop nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/campaigns"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Campaigns
            </Link>
            <Link
              to="/dnd/spells"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Spells
            </Link>
            <Link
              to="/dnd/monsters"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Monsters
            </Link>
            <Link
              to="/dnd/items"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Magic Items
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Hamburger button - visible on mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2 rounded transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              // X icon when open
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon when closed
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu - only visible when open */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-2 border-t border-gray-700 pt-4 flex flex-col gap-1">
            <Link
              to="/campaigns"
              onClick={handleNavClick}
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded transition-colors"
            >
              Campaigns
            </Link>
            <Link
              to="/dnd/spells"
              onClick={handleNavClick}
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded transition-colors"
            >
              Spells
            </Link>
            <Link
              to="/dnd/monsters"
              onClick={handleNavClick}
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded transition-colors"
            >
              Monsters
            </Link>
            <Link
              to="/dnd/items"
              onClick={handleNavClick}
              className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded transition-colors"
            >
              Magic Items
            </Link>
            <button
              onClick={handleLogout}
              className="text-left text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar