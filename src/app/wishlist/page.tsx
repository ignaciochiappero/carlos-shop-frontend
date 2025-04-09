"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { state: wishlistState, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    // Optional: Remove from wishlist after adding to cart
    removeFromWishlist(item.id);
  };

  if (wishlistState.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Wishlist</h1>
        <div className="bg-white p-8 rounded-md shadow-sm">
          <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Your Wishlist</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {wishlistState.items.map((item) => (
            <li key={item.id} className="px-4 py-6 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-24 w-24 relative">
                  <Image
                    src={item.image || "/placeholder-image.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/products/${item.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {item.name}
                    </Link>
                    <p className="text-lg font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-indigo-700 bg-white hover:bg-gray-50"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-gray-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
