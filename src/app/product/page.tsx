'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useProductContext } from '../../context/ProductContext';
import Image from 'next/image';
import Link from 'next/link';

// Define a type for the data item structure
interface ItemData {
  id: string;
  slug: string;
  image_url: string;
  lowest_price_cents: number;
}

interface Item {
  data: ItemData;
  value: string;
}

const Home = () => {
  const [data, setData] = useState<Item[]>([]); // Updated state type
  const [error, setError] = useState<string | null>(null); // Allowing string or null
  const { setPageData, pageData } = useProductContext();
  const [mntRate, setMntRate] = useState<number | null>(null); // Start with null to wait for the rate

  const fetchData = useCallback(async () => {
    try {
      const urls = [
        "https://ac.cnstrc.com/browse/collection_id/top-trending-canada?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=5&page=1&num_results_per_page=96&sort_by=relevance&sort_order=descending&_dt=1740739279383",
        "https://ac.cnstrc.com/browse/collection_id/new-arrivals-apparel?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=4&page=1&num_results_per_page=96&sort_by=relevance&sort_order=descending&_dt=1740739819767",
      ];

      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const jsonData = await Promise.all(responses.map((res) => res.json()));

      const combinedResults = jsonData.flatMap((res) => res.response.results);
      setData(combinedResults);

    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Error fetching data. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data.length > 0) {
      setPageData(data);
    }
  }, [data, setPageData]);

  useEffect(() => {
    // Fetch currency data from the new API endpoint
    const fetchCurrencyData = async () => {
      try {
        const res = await fetch('https://hexarate.paikama.co/api/rates/latest/USD?target=MNT');
        const data = await res.json();

        if (data.status_code === 200 && data.data) {
          setMntRate(data.data.mid); // Set MNT rate from the API response
        } else {
          setError('MNT rate not available');
        }
      } catch (error) {
        setError('Failed to fetch currency data');
      }
    };

    fetchCurrencyData();
  }, []);

  // Loading state until MNT rate is fetched
  if (mntRate === null) {
    return <div>Loading currency data...</div>; // Show loading message until mntRate is available
  }

  return (
    <div className="p-6">
      <h1 className="font-extrabold text-white text-3xl my-16">Trending</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {data.length > 0 ? (
            data.map((item) => (
              <Link href={`/product/${item.data.slug}`} key={item.data.id} passHref>
                <div className="text-white  hover:shadow-neutral-700/10 bg-black border border-neutral-800 hover:border-neutral-600 p-8 rounded-2xl tracking-tight relative cursor-pointer transition-all hover:shadow-lg hover:scale-[1.008]">
                  <Image
                    className="rounded-lg mx-auto"
                    src={item.data.image_url}
                    alt={item.value}
                    width={600}
                    height={600}
                    style={{ objectFit: "cover" }}
                  />
                  <div className="text-sm font-bold flex items-center justify-between mt-4 border py-2 px-3 border-neutral-800 rounded-full">
                    <p>{item.value}</p>
                    <p className="group bg-blue-700 p-2 rounded-full transition-colors duration-300 flex items-center justify-center min-w-[120px] hover:bg-green-600">
                      <span className="group-hover:hidden flex">
                        MNT{" "}
                        {Math.ceil((item.data.lowest_price_cents * mntRate) / 100).toLocaleString()}
                      </span>
                      <span className="hidden group-hover:block transform scale-120">Buy</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-white text-center w-full">Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
