//front-new\src\components\ui\nav.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, 
  Menu, 
  User, 
  Heart, 
  LogIn, 
  LogOut, 
  ChevronDown, 
  Settings,
  PlusCircle 
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuthStore, isAuthenticated, removeAccessToken } from "@/lib/auth"; 
import { useNavbar } from "@/context/NavbarContext";

export function Nav() {
  const { 
    isMenuOpen, 
    isDropdownOpen, 
    toggleMenu, 
    toggleDropdown, 
    closeDropdown,
    fetchUserProfile
  } = useNavbar();
  
  const { state: cart } = useCart();
  const { state: wishlist } = useWishlist();
  const { user, logout: storeLogout } = useAuthStore(); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Usar useState para controlar el estado de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Verificar la autenticación solo en el cliente y cargar perfil si es necesario
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      
      // Si está autenticado pero no tenemos datos del usuario, cargarlo
      if (authStatus && !user) {
        await fetchUserProfile();
      }
    };
    
    checkAuth();
    
    // También configuramos un intervalo para comprobar periódicamente
    // útil después de login/logout
    const intervalId = setInterval(checkAuth, 2000);
    
    return () => clearInterval(intervalId);
  }, [fetchUserProfile, user]);

  // Calculate the total quantity of items in the cart
  const cartItemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const wishlistItemCount = wishlist.items.length;

  useEffect(() => {
    // Cerrar el dropdown cuando se hace clic afuera
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown]);

  const handleLogout = () => {
    // Cerrar el dropdown si está abierto
    closeDropdown();
    
    // 1. Use the logout function from the Zustand store to clear store state
    storeLogout();

    // 2. Explicitly remove the access_token from localStorage
    removeAccessToken();

    // 3. Also remove from direct localStorage in case any other part of the app is using it
    localStorage.removeItem("access_token");
    
    // Actualizar estado local
    setIsLoggedIn(false);

    // Redirect to home
    window.location.href = "/";
  };

  // Verificar si el usuario es administrador
  const isAdmin = user?.role === "ADMIN";

  // La fecha y hora actual, por curiosidad (tu ejemplo)
  const currentDateTime = new Date().toISOString().substring(0, 19).replace('T', ' ');
  const currentUsername = user?.userName || "Usuario";

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/carlos-logo-transparency.png"
                alt="The Carlos Store"
                width={50}
                height={50}
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-indigo-900">
                The Carlos Store
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Centrados */}
          <div className="hidden sm:flex sm:items-center sm:justify-center flex-1 mx-8">
            <div className="flex space-x-8">
              <Link
                href="/products"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
              >
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>

              <Link
                href="/about"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              {isAdmin && (
                <Link
                  href="/products/new"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                >
                  Add Product
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden sm:flex sm:items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-all duration-200 py-2 px-3 rounded-md hover:bg-gray-50"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {currentUsername}
                    </span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {/* Dropdown Menu con animación */}
                  <div 
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 transition-all duration-200 origin-top-right transform ${
                      isDropdownOpen 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Logged as</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user?.email || "usuario@email.com"}</p>
                    </div>
                    
                    <Link 
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                      onClick={() => closeDropdown()}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    

                    
                    <hr className="my-1 border-gray-200" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
                

                
                <div className="h-6 border-l border-gray-300 mx-1"></div>
                
                {/* Wishlist con animación hover */}
                <Link
                  href="/wishlist"
                  className="flex items-center justify-center p-2 text-gray-600 hover:text-indigo-600 relative transition-colors duration-200 hover:bg-gray-50 rounded-full"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full transform transition-transform duration-200 hover:scale-110">
                      {wishlistItemCount}
                    </span>
                  )}
                </Link>
                
                {/* Cart con animación hover */}
                <Link
                  href="/cart"
                  className="flex items-center justify-center p-2 text-gray-600 hover:text-indigo-600 relative transition-colors duration-200 hover:bg-gray-50 rounded-full"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full transform transition-transform duration-200 hover:scale-110">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-all duration-200 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button - con animación */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <Menu className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu con animación - posicionado absolutamente */}
      <div
        className={`sm:hidden fixed inset-0 top-16 bg-white z-40 shadow-lg transition-opacity duration-300 ${
          isMenuOpen 
            ? 'opacity-100' 
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }}
      >
        <div className="pt-2 pb-3 px-2 space-y-1">
          <Link
            href="/products"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
            onClick={toggleMenu}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
            onClick={toggleMenu}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
            onClick={toggleMenu}
          >
            About
          </Link>
          {isAdmin && (
            <Link
              href="/products/new"
              className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
              onClick={toggleMenu}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Añadir Producto
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
                onClick={toggleMenu}
              >
                <User className="h-5 w-5 mr-2" />
                Mi Perfil ({currentUsername})
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
                onClick={toggleMenu}
              >
                <Heart className="h-5 w-5 mr-2" />
                Mi Lista de Deseos
                {wishlistItemCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
                onClick={toggleMenu}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Mi Carrito
                {cartItemCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150 rounded-md"
              onClick={toggleMenu}
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login
            </Link>
          )}
        </div>
        
        {/* Panel inferior en móvil solo para usuarios logeados */}
        {isLoggedIn && (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-around px-4">
              <Link
                href="/profile"
                className="p-2 text-gray-600 hover:text-indigo-600 relative transition-colors duration-150"
                onClick={toggleMenu}
              >
                <User className="h-6 w-6" />
              </Link>
              <Link
                href="/wishlist"
                className="p-2 text-gray-600 hover:text-indigo-600 relative transition-colors duration-150"
                onClick={toggleMenu}
              >
                <Heart className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="p-2 text-gray-600 hover:text-indigo-600 relative transition-colors duration-150"
                onClick={toggleMenu}
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}