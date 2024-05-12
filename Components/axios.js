const axios = require("axios");
const { Blob } = require("buffer");
const EventEmitter = require('events')
const event = new EventEmitter();
require('dotenv').config();
const urlToken = process.env;
const BASE_URL = `https://api.telegram.org/bot${urlToken.BOT_TOKEN}/`;
const fs = require('fs');

// let updateCryptoCurrencyCoinListVar = updateCryptoCurrencyCoinListVarFile[0].updateCryptoCurrencyCoinListVar
async function updateCryptoCurrencyCoinList() {

    await axios.get('https://api.coingecko.com/api/v3/coins/list').then(e => {
        try {
            fs.writeFile('./DB/cryptoCurrencyCoinList.json', Buffer.from(JSON.stringify(e.data, null, 2)), (err) => fs.writeFile('./DB/errorlog.txt', Buffer.from(err)))
            // console.log(e.data);
        } catch (error) {
            console.log(error);
            fs.writeFile('./DB/error.txt', Buffer.from(error));
        }
    }).catch(e => console.log(e.data))
}
setInterval(
    () => {
        let updateCryptoCurrencyCoinListVar
        try {
            fs.readFile('./DB/BottDB.json',((err,data)=>{
                if(err) console.log(err);
                if(data){
                    updateCryptoCurrencyCoinListVar = new TextDecoder().decode(data).substring(2)
                    // console.log(JSON.parse(new TextDecoder().decode(data).substring(2).trim().toString()),"settimeout ");
                    // console.log(JSON.parse(new Blob(data,{type:'text/plain'})),"settimeout ");
                }
            }))
            // if (updateCryptoCurrencyCoinListVar != (new Date().getDate())) {
                // updateCryptoCurrencyCoinList();
                // Object.assign(...updateCryptoCurrencyCoinListVarFile, {updateCryptoCurrencyCoinListVar : (new Date().getDate())})
                // fs.writeFile('./DB/BottDB.json',Buffer.from(updateCryptoCurrencyCoinListVarFile),{},(err=>console.log(err)))
                // console.log('log 28',updateCryptoCurrencyCoinListVar, updateCryptoCurrencyCoinListVarFile);
            // }
            // console.log('log 30',updateCryptoCurrencyCoinListVar);
            
        } catch (e) {
            console.log('error '+e);
        }
        // console.log('log 35',updateCryptoCurrencyCoinListVar);
    }, 7000
    //86400000
)
// console.log('log 39', updateCryptoCurrencyCoinListVarFile[0].updateCryptoCurrencyCoinListVar ,  (new Date().getDate()));
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
module.exports = { postMessage, get, cryptoFunc, weather, getFileID, getFileNameAndSendFile, postDocument, deleteChatMessage, updateCryptoCurrencyCoinList, BASE_URL }