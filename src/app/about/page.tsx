"use client";

import Image from "next/image";
import { useState } from "react";

export default function AboutPage() {
  const [hoverCount, setHoverCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const weirdFacts = [
    "Carlos once sold a cloud in a jar. The customer claimed it rained in their living room.",
    "Our first weird item was a clock that runs backwards but is always correct twice a day.",
    "We don't accept returns because Carlos believes every weird item 'finds its person'.",
    "Carlos has a pet rock named Gerald who serves as our Chief Security Officer.",
    "The store was originally going to sell normal things, but Carlos couldn't remember what normal things were.",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          About <span className="text-purple-900">The Carlos Store</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Purveyor of the peculiar, vendor of the vexing, and merchant of the
          mysterious since whenever Carlos woke up with this idea.
        </p>
      </div>

      <div className="bg-[#312c85] rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          Our Weird History
        </h2>
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <p className="text-lg text-white mb-4">
              The Carlos Store began when Carlos found a mysterious object in
              his basement that nobody could identify. Instead of throwing it
              away like a normal person, he put a price tag on it.
            </p>
            <p className="text-lg text-white mb-4">
              To his surprise, someone bought it! That someone later reported
              that the object occasionally whispers stock tips, but Carlos
              maintains a strict "no refunds, no explanations" policy.
            </p>
            <p className="text-lg text-white">
              Since that fateful day, Carlos has dedicated his life to finding
              items that make people ask, "What is that?" and "Why would anyone
              want that?" and most importantly, "How much?"
            </p>
          </div>
          <div className="mt-8 lg:mt-0 flex justify-center">
            <div className="relative h-64 w-64 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 shadow-lg transform rotate-3 transition-all duration-500 hover:rotate-6 hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-bold italic">
                  Probably Carlos
                </span>
              </div>
              <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-xs font-bold">Maybe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <div className="bg-white shadow rounded-lg p-8">
          <p className="text-xl text-center italic mb-6 text-black">
            "To sell items so weird that they circle back around to useful, but
            not quite."
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-black">
            <p className="text-lg">
              We believe that in a world full of normal stores selling normal
              things, someone needs to be the weird one. Carlos volunteered.
            </p>
          </div>

          <button
            className="block mx-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
            onMouseEnter={() => setHoverCount(hoverCount + 1)}
            onClick={() => setShowSecret(hoverCount >= 5)}
          >
            {hoverCount >= 5
              ? "Click to reveal store secret"
              : "Definitely not a secret button"}
          </button>

          {showSecret && (
            <div className="mt-4 p-4 bg-black text-green-400 font-mono rounded">
              <p>
                SYSTEM BREACH: Carlos is actually three raccoons in a trench
                coat.
              </p>
              <p className="text-xs mt-2">
                Please keep buying our weird stuff, we have trash to collect.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Things We've Sold
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              Pre-Haunted Dolls
            </h3>
            <p className="text-gray-700">
              Why wait for your doll to become haunted naturally? Ours come
              ready to give you the creeps from day one.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              Mystery Box of Smells
            </h3>
            <p className="text-gray-700">
              A sealed box containing 12 unlabeled vials of smells. Some nice,
              some... memorable. No refunds.
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              Left-Handed Shadows
            </h3>
            <p className="text-gray-700">
              For when your regular shadow just isn't doing it for you. Results
              may vary based on lunar cycle.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Dehydrated Water
            </h3>
            <p className="text-gray-700">
              Just add water to rehydrate! Great for emergency situations where
              you need water but already have water.
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-red-800 mb-2">
              WiFi-Blocking Plants
            </h3>
            <p className="text-gray-700">
              Perfect for creating a tech-free zone or forcing family
              conversation at dinner time.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              Used Wishes
            </h3>
            <p className="text-gray-700">
              Someone else already wished on these. Now they're collectible!
              Results of previous wishes not guaranteed.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Weird Facts About Us
        </h2>
        <ul className="space-y-4">
          {weirdFacts.map((fact, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-3">
                {index + 1}
              </span>
              <p className="text-gray-700">{fact}</p>
            </li>
          ))}
        </ul>
      </div>



      <div className="mt-16 text-center">
        <div className="italic text-gray-500 text-sm">
          <p>No normal items were harmed in the making of this store.</p>
          <p>
            © {new Date().getFullYear()} The Carlos Store - Reality is just a
            suggestion here
          </p>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <button className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-6 bg-purple-100 p-4 rounded-lg text-center">
        <p className="text-purple-800 italic">
          Disclaimer: Any resemblance of our weird products to actual useful
          items is purely coincidental and frankly, surprising to us too.
        </p>
      </div>
    </div>
  );
}
