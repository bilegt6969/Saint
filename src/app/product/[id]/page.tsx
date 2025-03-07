"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";
import { DropdownItem } from "@heroui/react";

function Page() {
  const [data, setData] = useState(null);
  const [Pricedata, setPriceData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [offerType, setOfferType] = useState("new");
  const pathname = usePathname();
  const RawSlug = pathname.split("/product/");
  const Slug = RawSlug[1] || "default-slug";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize1, setSelectedSize1] = useState("All");
  const [PriceArrayData, setPriceArrayData] = useState<any[]>([]); // Ensure it's an array
  const [mntRate, setMntRate] = useState<number | null>(null); // Start with null to wait for the rate
  const [error1, setError1] = useState<string | null>(null); // Allowing string or null

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSizeSelect = (size) => {
    setSelectedSize1(size);
    setIsOpen(false);
  };

  const [NewType_Product, setNewTypeProduct] = useState([]);
  const [UsedType_Product, setUsedTypeProduct] = useState([]);
  const [OfferType_Product, setOfferTypeProduct] = useState([]);


  useEffect(() => {
    // Fetch currency data from your custom API route
    const fetchCurrencyData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/getcurrencydata');
        const data = await res.json();

        if (data.mnt) {
          setMntRate(data.mnt); // Set MNT rate
        } else {
          setError1('MNT rate not available');
        }
      } catch (error) {
        setError1('Failed to fetch currency data');
      }
    };

    fetchCurrencyData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/hey?slug=${Slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result.data);
        setPriceData(result.PriceData);

        const AvailableProducts = result.PriceData.filter(
          (item) =>
            item.stockStatus === "multiple_in_stock" ||
            item.stockStatus === "single_in_stock",
        );

        setNewTypeProduct(
          AvailableProducts.filter(
            (item) =>
              item.shoeCondition === "new_no_defects" &&
              item.boxCondition === "good_condition",
          ),
        );

        setUsedTypeProduct(
          AvailableProducts.filter((item) => item.shoeCondition === "used"),
        );

        setOfferTypeProduct(
          AvailableProducts.filter(
            (item) =>
              item.shoeCondition === "new_no_defects" ||
              item.shoeCondition === "new_with_defects" ||
              item.boxCondition === "good_condition" ||
              item.boxCondition === "badly_damaged" ||
              item.boxCondition === "no_original_box",
          ),
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [Slug, NewType_Product, UsedType_Product, OfferType_Product]);

  useEffect(() => {
    console.log(NewType_Product); // This will run after NewType_Product has been updated
  }, [NewType_Product]);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data && !Pricedata) return <div className="text-white">Loading...</div>;

  const product = data?.pageProps?.productTemplate;
  if (!product)
    return <div className="text-white">No product data available.</div>;

  const images =
    product.productTemplateExternalPictures?.map((img) => img.mainPictureUrl) ||
    [];

  const handlePreviousImage = () => {
    setFade(true);
    setTimeout(() => {
      setSelectedImageIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length,
      );
      setFade(false);
    }, 200);
  };

  const handleNextImage = () => {
    setFade(true);
    setTimeout(() => {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFade(false);
    }, 200);
  };

  let TailoredSize =
    offerType === "new"
      ? NewType_Product
      : offerType === "used"
        ? UsedType_Product
        : offerType === "offer"
          ? OfferType_Product
          : []; // Default value if no condition matches

  const sizeOptions = [
    ...new Set(TailoredSize?.map((item) => item.sizeOption?.presentation)),
  ];

  // Filter TailoredSize based on the selected size
  const King = TailoredSize.filter(
    (item) => item.sizeOption?.presentation === selectedSize1,
  );

  // Convert the first matched item to a JSON string (if exists)
  const jsonString =
    King.length > 0 ? JSON.stringify(King[0]) : "No matching item found";

  // Log the entire JSON string and the selected size
  console.log(jsonString, selectedSize1);

  // Access lastSoldPriceCents.amount (if King has at least one item)
  if (King.length > 0) {
    const lastSoldPriceAmount = King[0].lastSoldPriceCents?.amount;
    console.log("Last Sold Price Amount:", lastSoldPriceAmount); // Expected: 10200
  } else {
    console.log("No matching size found.");
  }




  // Loading state until MNT rate is fetched
  if (mntRate === null) {
    return <div>Loading currency data...</div>; // Show loading message until mntRate is available
  }
  return (
    <div className="">
      <div className="h-fit  max-h-[] w-full bg-black border border-neutral-700 flex justify-center items-center rounded-3xl">
        <div className="w-full bg-transparent flex flex-col lg:flex-row gap-8 p-8">
          {/* Product Image Display */}
          <div className="flex flex-col items-center relative bg-white rounded-2xl">
            <div className="relative h-[700px] w-[900px] flex items-center justify-center bg-white rounded-2xl overflow-hidden">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImageIndex]}
                  alt="Product Image"
                  width={800}
                  height={900}
                  className={`object-cover transition-opacity duration-500 ease-in-out ${fade ? "opacity-0" : "opacity-100"}`}
                />
              ) : (
                <p className="text-black">No image available</p>
              )}
            </div>

            {/* Image Navigation Buttons */}
            {images.length > 1 && (
              <div className="absolute bottom-[7rem] flex w-full justify-center">
                <div className="mx-auto flex h-11 items-center rounded-full border text-neutral-400 backdrop-blur-sm border-black bg-neutral-900/80">
                  <button
                    onClick={handlePreviousImage}
                    className="p-2 rounded-full hover:bg-neutral-700"
                  >
                    <ArrowLeftIcon className="h-5" />
                  </button>
                  <div className="mx-1 h-6 w-px bg-neutral-400"></div>
                  <button
                    onClick={handleNextImage}
                    className="p-2 rounded-full hover:bg-neutral-700"
                  >
                    <ArrowRightIcon className="h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Thumbnail Selector */}
            <div className="flex gap-2 mt-3 mb-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border-[2px] p-2 rounded-lg ${selectedImageIndex === index ? "border-blue-700" : "border-neutral-900"}`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="text-white flex flex-col justify-start items-start scrollbar-hidden overflow-y-auto max-h-full p-4">
            {product ? (
              <>
                     <span className="flex space-x-1"> <p className="underline">{product.productCategory}</p><p>/</p><p className="underline">{product.productType}</p> </span> 

                <h1 className="text-[45px] tracking-tight leading-[50px] font-bold">
                  {product.name}
                </h1>

                <div className="bg-neutral-600 w-full h-[1px] my-10"></div>
                <div className="space-y-4">
                  {/* Toggle between New/Used */}
                  <div className="flex space-x-2 bg-neutral-800 p-1 rounded-full border border-neutral-700 items-center justify-center">
                    <button
                      className={`text-base ${offerType === "new" ? "bg-black text-white" : "bg-transparent"} border py-2 px-4 border-neutral-800 font-semibold rounded-full inline-block transition-all duration-300 ease-in-out`}
                      onClick={() => setOfferType("new")}
                    >
                      New
                    </button>

                    <button
                      className={`text-base ${offerType === "used" ? "bg-black text-white" : "bg-transparent"} border py-2 px-4 border-neutral-800 font-semibold rounded-full inline-block transition-all duration-300 ease-in-out`}
                      onClick={() => setOfferType("used")}
                    >
                      Used
                    </button>

                    <button
                      className={`text-base ${offerType === "offer" ? "bg-black text-white" : "bg-transparent"} border py-2 px-4 border-neutral-800 font-semibold rounded-full inline-block transition-all duration-300 ease-in-out`}
                      onClick={() => setOfferType("offer")}
                    >
                      Offer
                    </button>
                  </div>

                  {/* Size selection */}
                </div>

                <div className="relative text-left w-full space-y-4 mt-4">
                  <button
                    onClick={toggleDropdown}
                    className="bg-neutral-800 flex border justify-between font-semibold border-neutral-700 text-white px-2 py-2 rounded-full shadow-md focus:outline-none transition-transform duration-300 ease-in-out w-full items-center"
                  >
                    <div className="flex w-full justify-between px-4 py-2 items-center rounded-full bg-neutral-900 border border-neutral-700">
                      <p className="">Size:</p>

                      <div className="flex space-x-4 items-center border border-neutral-700 bg-black px-4 py-2 rounded-full">
                        <p>{selectedSize1}</p>
                        <ChevronDownIcon className="h-5" />
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      className={`origin-top-left absolute left-0 mt-2 w-full h-min rounded-2xl shadow-lg bg-neutral-800 border border-neutral-700 transform ${
                        isOpen
                          ? "scale-y-100 opacity-100"
                          : "scale-y-0 opacity-0"
                      } transition-all duration-500 ease-in-out`}
                      style={{
                        transformOrigin: "top",
                        transitionProperty: "transform, opacity",
                      }}
                    >
                      <div className="grid grid-cols-3 gap-2 p-4">
                        {sizeOptions.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size)}
                            className="block w-full px-4 py-2 text-sm bg-black border border-neutral-700 p-1 rounded-xl text-center text-white hover:bg-neutral-900 transition-colors duration-200"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>No product details available</div>
            )}
            <div className="w-full bg-neutral-800 border border-neutral-700 mt-4 p-8 rounded-2xl font-semibold">
              {King.length > 0
                ? (
                <div className=""><h1>Buy Now for</h1> 
                <span className="text-2xl">MNT {" "}
                {(King[0].lastSoldPriceCents?.amount * mntRate / 100).toLocaleString()}

                </span>
                <div className="">
                  <button className="px-4 py-2 rounded-full bg-white text-black border border-neutral-700 mt-8">Buy Now</button>
                </div>
                </div>)
                : "Please Choose Your Size."}
                
            </div>
            <div className="text-white w-full mt-4 font-semibold p-8 rounded-2xl bg-neutral-800 border border-neutral-700">
       <p>brandName: {product.brandName}</p>
       <p>color: {product.color}</p> 
       <p>details: {product.details}</p> 
       <p>gender: {product.gender[0]}</p> 
       <p>midsole: {product.midsole}</p> 
       <p>releaseDate: {product.releaseDate}</p> 
       <p>upperMaterial: {product.upperMaterial}</p> 
       <p>singleGender: {product.singleGender}</p> 
       <p>story: {product.story}</p> 


       

      </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Page;
