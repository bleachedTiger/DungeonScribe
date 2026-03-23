import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CampaignList from "./pages/campaigns/CampaignList";
import CampaignForm from "./pages/campaigns/CampaignForm";
import CampaignDetails from "./pages/campaigns/CampaignDetails";
import CharacterForm from "./pages/campaigns/CharacterForm";
import Spells from './pages/dnd/Spells';
import Monsters from './pages/dnd/Monsters';
import Items from './pages/dnd/Items';
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Protected Routes */}
          <Route path="/campaigns" element={
            <ProtectedRoute><CampaignList /></ProtectedRoute>
          } />
          <Route path="/campaigns/new" element={
            <ProtectedRoute><CampaignForm /></ProtectedRoute>
          } />
          <Route path="/campaigns/:id" element={
            <ProtectedRoute><CampaignDetails /></ProtectedRoute>
          } />
          <Route path="/campaigns/:id/edit" element={
            <ProtectedRoute><CampaignForm /></ProtectedRoute>
          } />
          <Route path="/campaigns/:id/characters/new" element={
            <ProtectedRoute><CharacterForm /></ProtectedRoute>
          } />
          <Route path="/campaigns/:id/characters/:characterId/edit" element={
            <ProtectedRoute><CharacterForm /></ProtectedRoute>
          } />
          {/* D&D Reference Routes */}
          <Route path="/dnd/spells" element={
            <ProtectedRoute><Spells /></ProtectedRoute>
          } />
          <Route path="/dnd/monsters" element={
            <ProtectedRoute><Monsters /></ProtectedRoute>
          } />
          <Route path="/dnd/items" element={
            <ProtectedRoute><Items /></ProtectedRoute>
          } />
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App