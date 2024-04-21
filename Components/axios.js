const axios = require("axios");
const urlToken = require('dotenv').config().parsed;
const BASE_URL = `https://api.telegram.org/bot${urlToken.BOT_TOKEN}/`;
const fs = require('fs');

async function updateCryptoCurrencyCoinList() {

    await axios.get('https://api.coingecko.com/api/v3/coins/list').then(e => {
        try {
            fs.writeFileSync('./DB/cryptoCurrencyCoinList.json',Buffer.from(e.data),{})
        } catch (error) {
            console.log(error);
        }
    }
    ).catch(e => console.log(e.data))

}
setTimeout(
    async () => {
        updateCryptoCurrencyCoinList();
    }, 86400000
)

function get(method, param) {
    console.log(method, param);
    (axios.get({
        method: 'get',
        baseURL: BASE_URL + method,
        param
    }))
}
function postMessage(method, data) {
    // axios.post('POST',{})
    console.log(method, data, BASE_URL, "\n Base URL here\n");
    (axios({
        method: 'post',
        'Content-Type': 'application/x-www-form-urlencoded',
        url: BASE_URL + method,
        data

    }))
}
function postDocument(method, data) {
    (axios({
        method: 'post',
        'Content-Type': 'application/png',
        'filename': 'text.jpg',
        url: BASE_URL + method,
        data
    }))
}
async function deleteChatMessage(method, data) {
    try {
        await axios({
            method: 'post',
            url: BASE_URL + method,
            data
        })
    } catch (error) {
        console.log(error);
    }
}

async function cryptoFunc(cryptoName) {
    return await (axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoName}&vs_currencies=inr`))
}

async function weather(locationName) {
    return await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${locationName}&APPID=${urlToken.WEATHER_API_TOKEN.trim()}&units=metric&lang=en&mode=json`)
}
async function getFileID(fileId) {
    return axios.get(`${BASE_URL}getFile?file_id=${fileId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

async function getFileNameAndSendFile(path) {
    return axios.get(`https://api.telegram.org/file/bot${urlToken.BOT_TOKEN}/${path}`
        , { responseType: 'arraybuffer' }
    )
}
module.exports = { postMessage, get, cryptoFunc, weather, getFileID, getFileNameAndSendFile, postDocument, deleteChatMessage }