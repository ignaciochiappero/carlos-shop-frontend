import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
      <div className="relative bg-gradient-to-r from-indigo-700 to-purple-700 w-full h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-28 xl:pt-28 xl:pb-32">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to</span>{" "}
                  <span className="block text-white xl:inline">
                    The Carlos Store
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Questionable taste, undeniable deals. Come for the bargains,
                  stay for the weird.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/products"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center py-10 lg:py-0">
              <Image
                src="/carlos-transparent.png"
                alt="The Carlos Store"
                unoptimized
                width={400}
                height={400}
                className="h-auto w-auto max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    
  );
}
