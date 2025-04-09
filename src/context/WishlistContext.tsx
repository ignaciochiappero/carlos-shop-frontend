"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

// Define types
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" };

// Initial state
const initialState: WishlistState = {
  items: [],
};

// Create context
const WishlistContext = createContext<
  | {
      state: WishlistState;
      addToWishlist: (item: WishlistItem) => void;
      removeFromWishlist: (id: string) => void;
      clearWishlist: () => void;
      isInWishlist: (id: string) => boolean;
    }
  | undefined
>(undefined);

// Reducer function
function wishlistReducer(
  state: WishlistState,
  action: WishlistAction
): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      // Don't add if already exists
      if (state.items.some((item) => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case "CLEAR_WISHLIST": {
      return initialState;
    }

    default:
      return state;
  }
}

// Provider component
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist) as WishlistState;
        // Reset state and add each item
        parsedWishlist.items.forEach((item) => {
          dispatch({ type: "ADD_ITEM", payload: item });
        });
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(state));
    }
  }, [state]);

  // Actions
  const addToWishlist = (item: WishlistItem) => {
    dispatch({
      type: "ADD_ITEM",
      payload: item,
    });
  };

  const removeFromWishlist = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const isInWishlist = (id: string) => {
    return state.items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        state,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook for using the wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
