const { sendMessage } = require("../api/messageAPI");
const { getStockQuote, getStockSearch } = require("../api/stockAPI");
const { getStock } = require("./axios");
const userObject = require("../DB/userStock.json")

const valueObject = {
  "chatID": 0,
  "fromID": 0,
  "firstName": "",
  "lastName": "",
  "stock": {
    "stockName": "",
    "symbol": "",
    "exchange": "",
    "exchDisp": ""
  },
  "freequency": {
    "5m": [
      {
        "stockName": "",
        "symbol": "",
        "exchange": "",
        "exchDisp": ""
      }
    ],
    "15m": [
      {
        "stockName": "",
        "symbol": "",
        "exchange": "",
        "exchDisp": ""
      }
    ],
    "30m": [
      {
        "stockName": "",
        "symbol": "",
        "exchange": "",
        "exchDisp": ""
      }
    ],
    "45m": [
      {
        "stockName": "",
        "symbol": "",
        "exchange": "",
        "exchDisp": ""
      }
    ],
    "60m": [
      {
        "stockName": "",
        "symbol": "",
        "exchange": "",
        "exchDisp": ""
      }
    ],
  },
  "targetValue": [
    {
      "value" : 0,
      "stockName": "",
      "symbol": "",
      "exchange": "",
      "exchDisp": ""
    }
  ]

}
async function search(strStockKey) {
  const param = {
    query: strStockKey
  }
  console.log('search', await getStock('', 'search', param).then(e => e.status === 200 && e.data, err => 'no result'));
}

async function stockDetails(req) {
  let text;
  try {
    text = req.message.text.split(' ')[1];
    // console.log(req, userName, await getStockSearch(text));
    // console.log(req, userName, await search(text));
    const stockInfo = await getStockQuote(text);
    let message = `${text} details : \n\n Name : ${stockInfo.longName}\n Symbol : \`${stockInfo.symbol}\`\n current price : ${stockInfo.regularMarketPrice},\n Today High : ${stockInfo.regularMarketDayRange.high},\n Today Low : ${stockInfo.regularMarketDayRange.low},\n Currency : ${stockInfo.currency},\n Exchange Name : ${stockInfo.fullExchangeName},\n Current change : ${stockInfo.regularMarketChange} rs,\n 50 D avg : ${stockInfo.fiftyDayAverage}\n `;
    sendMessage(req.message.from.id, message, 'MarkdownV2');
  } catch (err) {
    const message = `something went wrong!`
    sendMessage(req.message.from.id, message, 'MarkdownV2')
  }
}
async function stockAlert(text, chatID, userName) {
  try {
    console.log('from stockAlert text', text,  chatID, userName)
    console.log('get quote', await getStockQuote(text));
    const stockInfo = await getStockQuote(text);
    let message = `${stockInfo.longName} ${stockInfo.regularMarketChange}\n ${userName}\n\n ${stockInfo.longName} alert : \n\n Name : ${stockInfo.longName}\n Symbol : \`${stockInfo.symbol}\`\n current price : \* ${stockInfo.regularMarketPrice}\*,\n Today High : ${stockInfo.regularMarketDayRange.high},\n Today Low : ${stockInfo.regularMarketDayRange.low},\n Currency : ${stockInfo.currency},\n Exchange Name : ${stockInfo.fullExchangeName},\n Current change : ${stockInfo.regularMarketChange} rs\n `;
    sendMessage(chatID, message, 'MarkdownV2');
  } catch (err) {
    const message = `something went wrong!`
    sendMessage(chatID, message, 'MarkdownV2')
  }
}
async function setStockAlert(req, userName) {
  
  try {
    console.log('from stockAlert text', text,  chatID, userName)
    const setObject = valueObject;
    setObject.chatID = req.message.chat.id
    setObject.fromID = req.message.from.id
    setObject.firstName = req.message.from.first_name
    setObject.lastName = req.message.from.last_name
    // setObject.freequency. = req.message.from.last_name
    // fs.appendFile('../DB/userStock.json', Buffer.from(JSON.stringify(, null, 2)));
    let message = `${stockInfo.longName} ${stockInfo.regularMarketChange}\n ${userName}\n\n ${stockInfo.longName} alert : \n\n Name : ${stockInfo.longName}\n Symbol : \`${stockInfo.symbol}\`\n current price : \* ${stockInfo.regularMarketPrice}\*,\n Today High : ${stockInfo.regularMarketDayRange.high},\n Today Low : ${stockInfo.regularMarketDayRange.low},\n Currency : ${stockInfo.currency},\n Exchange Name : ${stockInfo.fullExchangeName},\n Current change : ${stockInfo.regularMarketChange} rs\n `;
    sendMessage(chatID, message, 'MarkdownV2');
  } catch (err) {
    const message = `something went wrong!`
    sendMessage(chatID, message, 'MarkdownV2')
  }
}

async function stockNotify(req, userName) {
  stockInfo()
}
async function setStockNotify(req, userName) {
  stockInfo()
}

async function recursiveGetAction (minute) {
  userObject.filter(({freequency, firstName, lastName, chatID}) => freequency[minute].length != 0 && freequency[minute].filter(async ({symbol}) => await stockAlert(symbol, chatID, `${firstName} ${lastName}` )))
}
async function recursiveTargetNotifyAction (minute) {
  userObject.filter(({targetValue, firstName, lastName, chatID}) => targetValue.length != 0 && targetValue.filter(async ({symbol, value, exchangeName}) => await stockNotify(symbol, chatID, `${firstName} ${lastName}` )));
}

setInterval(() => recursiveGetAction("5m"), 60000)
// setInterval(() => recursiveGetAction("15m"), 15000)
// setInterval(() => recursiveGetAction("30m"), 30000)
// setInterval(() => recursiveGetAction("45m"), 45000)
// setInterval(() => recursiveGetAction("60m"), 600000)

module.exports = { stockDetails, setStockAlert, setStockNotify }