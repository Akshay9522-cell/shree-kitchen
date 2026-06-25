import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "./context/AuthContext"; 
import App from './App.jsx'
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="38498341693-16s1jrsbgkvcloq2d1hce4j90rkie0dt.apps.googleusercontent.com">
    <AuthProvider>
      
      <App />
    
      <Toaster position="top-center" />
    </AuthProvider>
      </GoogleOAuthProvider>
    
  </StrictMode>,
)
