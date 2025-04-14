"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { state: cart, clearCart } = useCart();
  const [shipping, setShipping] = useState(5.0);
  const [tipAmount, setTipAmount] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expDate: "",
    cvv: "",
  });

  // Calculate tip amount based on percentage
  useEffect(() => {
    const calculatedTip = (cart.total * tipPercentage) / 100;
    setTipAmount(parseFloat(calculatedTip.toFixed(2)));
  }, [tipPercentage, cart.total]);

  // Calculate total including tip and shipping
  const orderTotal = cart.total + shipping + tipAmount;

  const handleTipChange = (percentage: number) => {
    setTipPercentage(percentage);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getTipEmoji = () => {
    if (tipPercentage === 0) return "😐";
    if (tipPercentage <= 5) return "😕";
    if (tipPercentage <= 15) return "😊";
    return "🤩";
  };

  const getTipMessage = () => {
    if (tipPercentage === 0) return "Carlos is indifferent about this.";
    if (tipPercentage <= 5) return "Carlos is slightly disappointed.";
    if (tipPercentage <= 15) return "Carlos appreciates your generosity!";
    return "Carlos will name his next weird item after you!";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode ||
      !formData.cardNumber ||
      !formData.cardName ||
      !formData.expDate ||
      !formData.cvv
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Simulate payment processing
    setIsProcessing(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate random order number
      const randomOrderNum = "CS" + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(randomOrderNum);

      setIsProcessing(false);
      setIsComplete(true);

      // Clear cart after successful order
      clearCart();

      // After 5 seconds, redirect to homepage
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } catch (error) {
      setIsProcessing(false);
      setError(
        "There was a problem processing your payment. Please try again."
      );
    }
  };

  // If cart is empty, redirect to cart page
  if (cart.items.length === 0 && !isComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        <div className="bg-white p-8 rounded-md shadow-sm">
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

  // Order complete screen
  if (isComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="bg-white p-8 rounded-md shadow-sm">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Complete!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your weird purchase!
          </p>
          <p className="text-gray-500 mb-6">Order #{orderNumber}</p>

          {tipAmount > 0 && (
            <div className="mb-6">
              <p className="text-lg text-indigo-600">
                {getTipEmoji()} Carlos says thanks for the $
                {tipAmount.toFixed(2)} tip!
              </p>
              <p className="text-sm text-gray-500 italic">{getTipMessage()}</p>
            </div>
          )}

          <p className="text-gray-500 mb-8">
            You will be redirected to the homepage in a few seconds...
          </p>

          <Link
            href="/products"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Checkout form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="expDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiration Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      id="expDate"
                      name="expDate"
                      placeholder="MM/YY"
                      value={formData.expDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tip for Carlos */}
            <div className="bg-white p-6 shadow-sm rounded-lg mb-8">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Tip for Carlos
                </h2>
                <span className="ml-2 text-3xl">{getTipEmoji()}</span>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Carlos works hard to find these weird things. Show your
                appreciation!
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleTipChange(0)}
                  className={`py-2 px-4 rounded-md text-sm font-medium ${
                    tipPercentage === 0
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  No tip 😐
                </button>
                <button
                  type="button"
                  onClick={() => handleTipChange(5)}
                  className={`py-2 px-4 rounded-md text-sm font-medium ${
                    tipPercentage === 5
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  5% 😕
                </button>
                <button
                  type="button"
                  onClick={() => handleTipChange(10)}
                  className={`py-2 px-4 rounded-md text-sm font-medium ${
                    tipPercentage === 10
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  10% 😊
                </button>
                <button
                  type="button"
                  onClick={() => handleTipChange(15)}
                  className={`py-2 px-4 rounded-md text-sm font-medium ${
                    tipPercentage === 15
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  15% 😊
                </button>
                <button
                  type="button"
                  onClick={() => handleTipChange(20)}
                  className={`py-2 px-4 rounded-md text-sm font-medium ${
                    tipPercentage === 20
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  20% 🤩
                </button>
              </div>

              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-700">{getTipMessage()}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isProcessing ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="mt-10 lg:mt-0 lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <div className="relative h-full w-full">
                        <Image
                          src={item.image || "/placeholder-image.png"}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="ml-6 flex-1 flex flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty {item.quantity}
                      </p>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                <p>Subtotal</p>
                <p>${cart.total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-500 mb-2">
                <p>Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-base font-medium text-indigo-600 mb-2">
                  <p>Tip for Carlos {getTipEmoji()}</p>
                  <p>${tipAmount.toFixed(2)}</p>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                <p>Total</p>
                <p>${orderTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    src="/carlos-logo-transparency.png"
                    alt="Carlos Shop"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500 italic">
                    "Carlos personally guarantees that these weird items will
                    leave you confused or your money back!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
