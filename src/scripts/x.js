const puppeteer = require('puppeteer');
const axios = require('axios');

const PAYLOAD_API_URL = 'http://localhost:3000/api/product-posts';
const PAYLOAD_API_KEY = process.env.PAYLOAD_SECRET;

// Function to fetch product data
const fetchData = async () => {
  const url = 'https://ac.cnstrc.com/browse/collection_id/top-trending-canada?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=5&page=1&num_results_per_page=10&sort_by=relevance&sort_order=descending&_dt=1740739279383';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

// Function to get all existing slugs from Payload
const getExistingSlugs = async () => {
  try {
    const res = await axios.get(PAYLOAD_API_URL);
    return res.data.map(product => product.slug); // Return an array of slugs from existing products
  } catch (error) {
    console.error('Error fetching existing slugs:', error);
    return [];
  }
};

// Function to scrape image URLs and save them to Payload
const scrapeImages = async (productUrl, slug) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 0 });
    await page.waitForSelector('div.GalleryItemDesktop__Wrapper-sc-1a01eh5-0.hIJrNS', { timeout: 0 });

    // Extract image URLs
    const imageUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div.GalleryItemDesktop__Wrapper-sc-1a01eh5-0.hIJrNS img'))
        .map(img => img.src)
        .filter(src => src); // Ensure the src is valid
    });

    console.log(`Image URLs for ${slug}:`, imageUrls);

    // Format image URLs in the structure expected by Payload
    const formattedImageUrls = imageUrls.map(url => ({ url }));

    // Save Product Data to Payload with image URLs
    await axios.post(PAYLOAD_API_URL, {
      slug: slug, // Each product is named by its slug
      imageUrls: formattedImageUrls, // Send image URLs as an array of objects
    }, {
      headers: { 'Authorization': `Bearer ${PAYLOAD_API_KEY}` }
    });

    console.log(`Saved image URLs for ${slug}`);

  } catch (error) {
    console.error(`Error scraping images for ${slug}:`, error);
  } finally {
    await browser.close();
  }
};

(async () => {
  // Step 1: Fetch existing slugs from Payload
  const existingSlugs = await getExistingSlugs();
  console.log('Existing slugs in Payload:', existingSlugs);

  // Step 2: Fetch product data
  const data = await fetchData();
  if (data && data.response && data.response.results.length > 0) {
    for (const item of data.response.results) {
      const slug = item.data.slug;

      // Step 3: Check if the slug already exists in Payload
      if (existingSlugs.includes(slug)) {
        console.log(`Product with slug ${slug} already exists. Skipping...`);
        continue; // Skip scraping for this product
      }

      // Step 4: Scrape images for products not already in Payload
      const productUrl = `https://www.goat.com/apparel/${slug}`;
      console.log(`Scraping images from: ${productUrl}`);
      await scrapeImages(productUrl, slug);
    }
  } else {
    console.log('No data available');
  }
})();
