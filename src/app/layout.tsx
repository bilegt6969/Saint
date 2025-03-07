// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Geist } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "../context/ProductContext"; // Import ProductProvider
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saint",
  description: "Saint",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug?: string }; // Expecting a single string segment
}) {
  const excludedPages = ["hero"]; // List of pages where mx-[10rem] should be removed
  const isExcluded = excludedPages.includes(params.slug || "");

  return (
    <html className="bg-neutral-900" lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-neutral-900 antialiased`}>
        <ProductProvider>
          <Navbar />
          <div className={`pt-20  ${isExcluded ? "" : "sm:mx-[1rem] md:mx-[5rem] lg:mx-[5rem] xl:mx-[5rem]"}`}>
            {children}
          </div>
        </ProductProvider>
      </body>
    </html>
  );
}
