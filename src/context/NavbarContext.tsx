"use client";

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from "react";
import { useAuthStore, isAuthenticated } from "@/lib/auth";
import { usersApi } from "@/lib/api";

interface NavbarContextType {
  isMenuOpen: boolean;
  isDropdownOpen: boolean;
  toggleMenu: () => void;
  toggleDropdown: () => void;
  closeDropdown: () => void;
  fetchUserProfile: () => Promise<void>;
  userProfileLoaded: boolean;
  refreshNavbar: () => void;
}

// Valores predeterminados para el contexto
const defaultNavbarContext: NavbarContextType = {
  isMenuOpen: false,
  isDropdownOpen: false,
  toggleMenu: () => {},
  toggleDropdown: () => {},
  closeDropdown: () => {},
  fetchUserProfile: async () => {},
  userProfileLoaded: false,
  refreshNavbar: () => {}
};

const NavbarContext = createContext<NavbarContextType>(defaultNavbarContext);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  // Estados para el menú y dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);
  // Nuevo estado para forzar actualizaciones
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Acceder al store de autenticación
  const { user, setUser } = useAuthStore();

  // Alternar el menú móvil
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Alternar el menú desplegable de usuario
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  // Cerrar el menú desplegable de usuario
  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  // Función para forzar la actualización del navbar
  const refreshNavbar = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  // Función para cargar el perfil de usuario
  const fetchUserProfile = useCallback(async () => {
    // Solo ejecutar en el cliente para evitar errores de hidratación
    if (typeof window === 'undefined') return;
    
    try {
      // Verificar si el usuario está autenticado
      const authStatus = isAuthenticated();
      
      if (authStatus) {
        console.log("Usuario autenticado, cargando perfil...");
        const userData = await usersApi.getProfile();
        setUser(userData);
        console.log("Perfil cargado:", userData);
      }
    } catch (error) {
      console.error("Error al cargar el perfil de usuario:", error);
    } finally {
      setUserProfileLoaded(true);
    }
  }, [setUser]);

  // Cargar el perfil del usuario al iniciar o cuando se solicite actualización
  useEffect(() => {
    fetchUserProfile();
    // El refreshCounter asegura que este efecto se ejecute cuando llamemos a refreshNavbar()
  }, [fetchUserProfile, refreshCounter]);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteChange = () => {
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
    };

    // Limpiar al desmontar
    return () => {
      handleRouteChange();
    };
  }, []);

  // Listener para cerrar menús al presionar Escape
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    // Listener para eventos de almacenamiento (para detectar cambios de token en otras pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        fetchUserProfile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchUserProfile]);

  // Proporcionar el contexto
  return (
    <NavbarContext.Provider value={{
      isMenuOpen,
      isDropdownOpen,
      toggleMenu,
      toggleDropdown,
      closeDropdown,
      fetchUserProfile,
      userProfileLoaded,
      refreshNavbar
    }}>
      {children}
    </NavbarContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useNavbar = (): NavbarContextType => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};