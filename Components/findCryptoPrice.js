const { cryptoFunc } = require("./axios");
const { sendMessage } = require("../api/messageAPI");
const cryptoCurrencyCoinList = require('../DB/cryptoCurrencyCoinList.json');
// const navigator = require('browser-env')


async function findCryptoPrice(ctx, userName) {
    console.log(ctx);
    var cryptoName
    console.log(ctx.message.from, ctx.message.text.split(' ')[1], 'lince 16')
    try {
        cryptoName = ctx.message.text.toString().split(' ')[1].toLowerCase();
    } catch (e) {
        sendMessage(ctx.message.chat.id, `Enter your coin name along with /findCryptoPrice 
        e\\.g\\. \`/findcryptoprice bitcoin\` `,'MarkdownV2')
    }
    if (cryptoName == undefined || cryptoName == '') {
        // sendMessage(ctx.message.chat.id, `Enter your coin name along with /findCryptoPrice \n\t\t\te\\.g\\. \`/findcryptoprice bitcoin\``,'MarkdownV2')
        sendMessage(ctx.message.chat.id, `Enter the correct details, otherwise you will not get any corrct details `)
    } else {
        let promise = new Promise((res, rej) => {
            cryptoFunc(cryptoName)
                .then(response => {
                    var rate
                    // console.log(response.data, typeof response.data)
                    for (var propName in response.data) {
                        if (response.data.hasOwnProperty(propName)) {
                            rate = response.data[propName].inr;
                            console.log(rate,response.data, 'crypto price');
                        }
                    }
                    console.log(rate,rate == null, 'crypto price');
                    if (rate != undefined && response != null && rate) {
                        const message = `Hello ${userName}, today the ${cryptoName} price is ${rate} inr`
                        res(sendMessage(ctx.message.chat.id, message));
                        res(sendMessage(ctx.message.chat.id, `\u{1F600} i'm expecting more messages from you`))
                    }else {
                        try {

                            let getSuggCoinsList = [], message = `\*Your text is not matched with coin ids, but it's matched with below results, kindly use ids to search price\* \n\n`,delimeter = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'], elementID ,elementName, elementSym ;
                            for (const key in cryptoCurrencyCoinList) {
                                // console.log(cryptoCurrencyCoinList[key]);
                                if (Object.hasOwnProperty.call(cryptoCurrencyCoinList, key)) {
                                    const element = cryptoCurrencyCoinList[key];
                                    if (element.id.toLowerCase() == cryptoName || element.name.toLowerCase() == cryptoName || element.symbol == cryptoName) getSuggCoinsList.push(element);
                                }
                            }
                            if(getSuggCoinsList.length ==0){
                                message = `There is no such a coin in our list, please try with another\\! \n\t\t\t we are concern about your inconvenience  `;
                            }else if(getSuggCoinsList.length ==1){
                                message = `As of now, there is no exact coin we found related to the text that the name is  ${getSuggCoinsList[0].name} \n\n\n \* \` ID : ${getSuggCoinsList[0].id} \` \* and Symbol : ${getSuggCoinsList[0].symbol} \n\n`
                                for (const key in getSuggCoinsList) {
                                    const element = getSuggCoinsList[key];
                                    elementID = element.id;
                                    elementName = element.name;
                                    elementSym = element.symbol;
                                    for (const iterator of delimeter) {
                                        elementID = elementID.includes(iterator)?elementID.replaceAll(iterator,'\\'+iterator):elementID, iterator
                                        elementName = elementName.includes(iterator)?elementName.replaceAll(iterator,'\\'+iterator):elementName, iterator
                                        elementSym = elementSym.includes(iterator)?elementSym.replaceAll(iterator,'\\'+iterator):elementSym, iterator
                                    }
                                    message += ` \t\t\t\\-\\-\\> \*Coin id :\` /findcryptoprice ${elementID} \`\*, Coin name : ${elementName}, Coin symbol : ${elementSym}  \\<\\-\\-\n`;
                                }
                            }else if(getSuggCoinsList.length >=2){
                                for (const key in getSuggCoinsList) {
                                    const element = getSuggCoinsList[key];
                                    elementID = element.id;
                                    elementName = element.name;
                                    elementSym = element.symbol;
                                    
                                    for (const iterator of delimeter) {
                                        elementID = elementID.includes(iterator)?elementID.replaceAll(iterator,'\\'+iterator):elementID, iterator
                                        elementName = elementName.includes(iterator)?elementName.replaceAll(iterator,'\\'+iterator):elementName, iterator
                                        elementSym = elementSym.includes(iterator)?elementSym.replaceAll(iterator,'\\'+iterator):elementSym, iterator
                                    }
                                    message += ` \t\t\t\\-\\-\\> \* Coin id :\` /findcryptoprice ${elementID} \`\*, Coin name : ${elementName}, Coin symbol : ${elementSym}  \\<\\-\\-\n`;
                                }
                            }
                            res(sendMessage(ctx.message.chat.id, message, 'MarkdownV2'))
                            console.log(message);

                        } catch (error) {
                            console.log(error);
                            rej(sendMessage(ctx.message.chat.id, 'Please make sure your coin name is correct or not\\! '));
                        }
                    }
                })
        })
        promise.then(e => {
            console.log();
        }).catch(e => console.log(e))
    }
}


module.exports = { findCryptoPrice }