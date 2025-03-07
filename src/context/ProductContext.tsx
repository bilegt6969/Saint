'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductContext = createContext<any>(null);

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [pageData, setPageData] = useState<any>([]);

  useEffect(() => {
    // Try to get the data from localStorage on initial load
    const storedPageData = localStorage.getItem('pageData');
    if (storedPageData) {
      setPageData(JSON.parse(storedPageData));
    }
  }, []);

  useEffect(() => {
    // Whenever pageData changes, store it in localStorage
    if (pageData.length > 0) {
      localStorage.setItem('pageData', JSON.stringify(pageData));
    }
  }, [pageData]);

  return (
    <ProductContext.Provider value={{ pageData, setPageData }}>
      {children}
    </ProductContext.Provider>
  );
};
