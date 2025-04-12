"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, User, Heart, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuthStore, isAuthenticated, removeAccessToken } from "@/lib/auth"; // Import removeAccessToken

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state: cart } = useCart();
  const { state: wishlist } = useWishlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { logout: storeLogout } = useAuthStore(); // Get logout function from auth store

  // Calculate the total quantity of items in the cart
  const cartItemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const wishlistItemCount = wishlist.items.length;

  useEffect(() => {
    // Check authentication status whenever component mounts or auth might change
    const checkLoginStatus = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
    };

    checkLoginStatus();

    // Listen for storage events (in case token changes in another tab)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    // 1. Use the logout function from the Zustand store to clear store state
    storeLogout();

    // 2. Explicitly remove the access_token from localStorage
    // This is what your API interceptors are looking for
    removeAccessToken();

    // 3. Also remove from direct localStorage in case any other part of the app is using it
    localStorage.removeItem("access_token");

    // Update local state
    setIsLoggedIn(false);

    // Redirect to home
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
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

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Products
            </Link>
          

            <Link
              href="/about"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              About
            </Link>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
            <div className="h-6 border-l border-gray-300"></div>
            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              className="p-1 text-gray-600 hover:text-indigo-600 relative"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/wishlist"
              className="p-1 text-gray-600 hover:text-indigo-600 relative"
            >
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="p-1 text-gray-600 hover:text-indigo-600 relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/products"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              About
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-3">
              <Link
                href={isLoggedIn ? "/profile" : "/login"}
                className="text-gray-600 hover:text-indigo-600 relative"
              >
                <User className="h-6 w-6" />
              </Link>
              <Link
                href="/wishlist"
                className="text-gray-600 hover:text-indigo-600 relative"
              >
                <Heart className="h-6 w-6" />
                {wishlistItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="text-gray-600 hover:text-indigo-600 relative"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
