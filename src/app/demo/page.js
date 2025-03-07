import { fetchData } from '../../api/posts/fetch_GOAT_data';

const DemoPage = async () => {
  try {
    // Fetch data directly within the server component
    const data = await fetchData();

    return (
      <div className='text-white'>
        <h1 className='text-white'>Demo Page</h1>
        
        {/* Example of rendering specific fields from the response */}
        {data.response && data.response.results.length > 0 ? (
          <div>
            <div className='flex'>
              {data.response.results.map((item) => {
                // Prepare the image scraping (this will use the Puppeteer logic)
                const link = `https://www.goat.com/apparel/${item.data.slug}`;

                return (
                  <div key={item.data.id} className="mb-4 border w-fit p-8">
                    <img
                      src={item.data.image_url}
                      alt={item.value}
                      className="w-48 h-48 object-cover mb-2 bg-white"
                    />
                    <a
                      href={link}
                      className='text-black rounded-xl mt-3 text-2xl bg-white  p-2'
                    >
                      goat.com
                    </a>

                    {/* You could trigger the scraping here by calling a function */}
                    {/* (e.g., to fetch images of the item) */}
                    {/* <button onClick={() => scrapeImages(link)}>Scrape Images</button> */}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>No response data available</p>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <p className='text-white'>Error loading data</p>;
  }
};

export default DemoPage;
