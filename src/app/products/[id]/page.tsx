"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { productsApi } from "@/lib/api";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { state: cart, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isInCart = product && cart.items.some((item) => item.id === product.id);
  const productInWishlist = product && isInWishlist(product.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsApi.getOne(id);
        setProduct({
          ...data,
          image: data.image || "/placeholder-image.png",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(
          "Failed to load product. It may not exist or there was a network error."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "/placeholder-image.png",
      });

      // Show notification
      showNotification("Product added to cart!");
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (productInWishlist) {
      removeFromWishlist(product.id);
      showNotification("Removed from wishlist!");
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "/placeholder-image.png",
      });
      showNotification("Added to wishlist!");
    }
  };

  const showNotification = (message: string) => {
    const notification = document.getElementById("notification");
    if (notification) {
      // Update message
      notification.textContent = message;

      // Show notification
      notification.classList.remove("opacity-0");
      notification.classList.add("opacity-100");

      // Hide after 3 seconds
      setTimeout(() => {
        notification.classList.remove("opacity-100");
        notification.classList.add("opacity-0");
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Product not found"}
          </h1>
          <p className="text-gray-500 mb-6">
            We couldn't find the product you're looking for.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <svg
            className="mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-8 lg:mb-0">
          <div className="relative h-full w-full">
            <Image
              src={product.image || "/placeholder-image.png"}
              alt={product.name}
              unoptimized 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.png";
              }}
            />
          </div>
        </div>

        {/* Product details */}
        <div className="lg:pl-8">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="mt-4">
            <p className="text-2xl font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <div className="mt-2 prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center px-8 py-3 border border-transparent rounded-md text-white font-medium shadow-sm ${
                isInCart
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {isInCart ? "Add More to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`flex items-center justify-center px-4 py-3 border ${
                productInWishlist
                  ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } rounded-md font-medium`}
            >
              <Heart
                className={`h-5 w-5 ${
                  productInWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>
          </div>

          {/* Product metadata */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-sm text-gray-500">
              <p>Product ID: {product.id.substring(0, 8)}...</p>
              <p>
                {product.createdAt &&
                  new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <div
        id="notification"
        className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 opacity-0"
      >
        Product added to cart!
      </div>
    </div>
  );
}
