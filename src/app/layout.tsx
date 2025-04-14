import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Nav } from "@/components/ui/nav";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { NavbarProvider } from "@/context/NavbarContext";


export const metadata: Metadata = {
  title: "The Carlos Store",
  description: "Questionable taste, undeniable deals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen">
              
              <NavbarProvider>
                <Nav />
              </NavbarProvider>
              
              <main className="flex-grow">{children}</main>
              <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto text-center">
                  <p>© {new Date().getFullYear()} The Carlos Store</p>
                </div>
              </footer>
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
