"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { state: cart, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
        <div className="bg-white p-8 rounded-md shadow-sm">
          <div className="flex justify-center mb-6">
            <ShoppingCart className="h-16 w-16 text-gray-300" />
          </div>
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Your Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8">
          <div className="border-t border-gray-200 bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id} className="p-6">
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
                        <div className="flex items-center">
                          <label
                            htmlFor={`quantity-${item.id}`}
                            className="mr-2 text-sm text-gray-500"
                          >
                            Quantity:
                          </label>
                          <select
                            id={`quantity-${item.id}`}
                            name={`quantity-${item.id}`}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-700 mr-4">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
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

        <div className="mt-16 lg:mt-0 lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Order Summary
            </h2>

            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${cart.total.toFixed(2)}
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-sm text-gray-600">Shipping estimate</dt>
                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  ${(cart.total + 5).toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Checkout
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-500"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900">
              Satisfaction Guaranteed
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              If you're not satisfied with your weird stuff from The Carlos
              Store, Carlos will personally come to your house and look at you
              disapprovingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
