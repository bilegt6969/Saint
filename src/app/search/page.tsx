"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const url = `https://ac.cnstrc.com/autocomplete/${query}?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=19&num_results_Products=25&num_results_Collections=20&_dt=1741089199248`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch data');
        const result = await res.json();
        setData(result.sections.Products || []); // Adjust if 'Products' isn't available
      } catch (err) {
        setError(err.message);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query]);

  return (
    <div className="text-white">
      <h1>Search Results</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {data.length > 0 ? (
            data.map((item) => (
              <Link href={`/product/${item.data.slug}`} key={item.data.id} passHref>
                <div className="text-white bg-black border border-neutral-800 hover:border-neutral-600 p-8 rounded-2xl tracking-tight relative cursor-pointer transition-all hover:shadow-lg hover:scale-[1.008]">
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
                      <span className="group-hover:hidden">
                        MNT{" "}
                        {Math.round(((item.data.lowest_price_cents * 1.2) / 100) * 3450).toLocaleString()}
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

export default SearchPage;
