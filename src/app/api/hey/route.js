// src/app/api/hey/route.js

import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug'); // Get the slug from the URL search params

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
  }

  const url = `https://www.goat.com/_next/data/ttPvG4Z_6ePho2xBcGAo6/en-us/apparel/${slug}.json?tab=new&expandedSize=101&productTemplateSlug=${slug}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from GOAT API: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Extract productTemplate.id
    const productId = data.pageProps.productTemplate.id;

    const PriceTagUrl = `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${productId}&countryCode=MN`;
    
    // Initialize PriceData to avoid reference issues in the return statement
    let PriceData = null;

    try {
      const priceResponse = await fetch(PriceTagUrl);
      if (!priceResponse.ok) {
        throw new Error(`Failed to fetch from GOAT API: ${priceResponse.statusText}`);
      }
      PriceData = await priceResponse.json();
    } catch (priceError) {
      console.error(priceError);
    }

    // Return the fetched data along with the product ID and PriceData
    return NextResponse.json({ data, PriceData });
  } catch (err) {
    return NextResponse.json({ error: `Failed to fetch data: ${err.message}` }, { status: 500 });
  }
}
