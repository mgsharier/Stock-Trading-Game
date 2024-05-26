import axios from "axios";

export let getStockPrice = async (ticker) => {
  const url = 'https://www.alphavantage.co/query';
  const params = {
    function: 'TIME_SERIES_DAILY',
    symbol: ticker, 
    apikey: 'J8LD3CGIUPZG0HFR' 
  };

  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    if(!data['Meta Data']) {
        return 10;// Return 10 ( a default value of the stock) if the API call limit is over.
    }
    const lastRefreshed = data['Meta Data']['3. Last Refreshed'];
    const latestClosePrice = data['Time Series (Daily)'][lastRefreshed]['4. close'];
    return latestClosePrice; 
  } 
  catch (error) {
    console.error('Error:', error);
    return null; 
  }
};
