'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'

// Define the types
interface HeroImage {
  id: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  sizes: {
    thumbnail: { width: number; height: number; url: string };
    card: { width: number; height: number; url: string };
    tablet: { width: number; height: number; url: string };
  };
  createdAt: string;
  updatedAt: string;
  url: string;
  thumbnailURL: string;
}

interface HeroData {
  id: string;
  Heading: string;
  Description: string;
  "Hero Image": HeroImage;
  createdAt: string;
  updatedAt: string;
}

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      const response = await fetch('/api/Hero');
      const data = await response.json();
      setHeroData(data.docs[0]); // Assuming only one hero data is returned
    };
    
    fetchHeroData();
  }, []);

  if (!heroData) return <div>Loading...</div>;

  return (
    <section className="relative w-full h-[500px] md:h-[700px]">
      
      <Image
        src={heroData["Hero Image"].url}
        alt={heroData.Heading}
        width={heroData["Hero Image"].width}  // Using the image width
        height={heroData["Hero Image"].height} // Using the image height
        className="absolute rounded-[5rem] inset-0 object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-neutral-900 opacity-30"></div>
      <div className="relative z-10 container mx-auto text-center text-white px-4 py-24">
        <h1 className="text-4xl sm:text-6xl font-bold">{heroData.Heading}</h1>
        <p className="mt-4 text-lg sm:text-2xl">{heroData.Description}</p>
      </div>
    </section>
  );
};

export default HeroSection;
