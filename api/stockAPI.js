const { getStock } = require("../Components/axios");
const yahooFinance = require('yahoo-finance2').default;


async function getStockSearch(strStockKey){
  console.log(await yahooFinance.search(strStockKey));
}
async function getStockQuote(strStockKey){

  const results = await yahooFinance.quote(strStockKey);
  const {regularMarketPrice, regularMarketChange, marketState, symbol, fullExchangeName, longName, currency, regularMarketDayRange} = results;
  const list =  {regularMarketPrice, regularMarketChange, marketState, symbol, fullExchangeName, longName, currency, regularMarketDayRange};
  return list;
}

async function getStockProfile(strStockKey){
  return getStock(strStockKey, 'profile')
}

async function getStockPriceChange(strStockKey){
  return getStock(strStockKey, 'stock-price-change')
}



module.exports = {getStockPriceChange, getStockProfile, getStockQuote, getStockSearch};