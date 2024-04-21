const path = require('path');
const axios = require("axios");
const { findCryptoPrice } = require('./Components/findCryptoPrice');
const { findWeatherReport } = require('./Components/weather');
const { sendMessage, deleteMessage } = require('./api/messageAPI');
const { renamePhoto, renameDoument } = require('./Components/renameFiles');

let userName;
function findUserName(first_name, last_name) {
    if (first_name != undefined && last_name != undefined) {
        return userName = `${first_name} ${last_name}`
    } else if (first_name != undefined) {
        return userName = `${first_name}`
    } else if (last_name != undefined) {
        return userName = `${last_name}`
    } else {
        return userName = '';
    }
}


async function handler(req) {
    if (req.message.text) {
        findUserName(req.message.from.first_name, req.message.from.last_name);
        let commandText = req.message.text.toString().split(' ');
        console.log(req.message.text, commandText);
        switch (commandText[0]) {
            case '/findcryptoprice':
                console.log('case findcryptoprice');
                await findCryptoPrice(req, userName);
                break;
            case '/findcryptoprice@kurpandibot':
                console.log('case findcryptoprice');
                await findCryptoPrice(req, userName);
                break;
            case '/weatherreport':
                console.log('case 2');
                await findWeatherReport(req, userName);
                break;
            case '/weatherreport@kurpandibot':
                console.log('case 2');
                await findWeatherReport(req, userName);
                break;
            case '/delete_my_chat':
                console.log('case 2');
                (
                    () => {
                        // Define the custom keyboard layout
                        const keyboard = [
                            ['Button 1', 'Button 2'],
                            ['Button 3', 'Button 4']
                        ];

                        // Create a reply markup object with the custom keyboard
                        const KeyboardButton = {
                            keyboard,
                            request_contact: true
                        };
                        // sendMessage(
                        //     req.message.chat.id,
                        //     `Hello ${userName}! What time is it?`,
                        //     '', // Empty string for parse mode
                        //     {
                        //         reply_markup: {
                        //             "text":"text button",
                        //             "url": "http://core.telegram.org/bots/api#inlinekeyboardmarkup"
                        //         }
                        //     }
                        // );
                        try {
                            for (let index = req.message.message_id; index > 0; index--) {
                                deleteMessage(req.message.chat.id, index);
                            }
                        } catch (error) {
                            console.log(error);
                            sendMessage(req.message.chat.id, `Hello ${userName}, something went wrong in server side. Please try aftr some time`)
                        }
                    }
                )();
                break;
            case '/delete_my_chat@kurpandibot':
                console.log('case 2');
                (
                    async () => {
                        console.log(req.message.chat)
                        try {
                            for (let index = req.message.message_id; index > 0; index--) {
                                let data = await deleteMessage(req.message.chat.id, index);
                            }
                        } catch (error) {

                            console.log(error);
                            sendMessage(req.message.chat.id, `Hello ${userName}, something went wrong in server side. Please try aftr some time`)
                        }
                    }
                )();
                break;
            case 'Hi':
                console.log('case 2');
                (
                    () => {
                        console.log(req.message.chat)
                        sendMessage(req.message.chat.id, `Hello ${userName}, I'm weather bot, i can provide currect crypto currency price; \n\t\t\t How can i help you!`);
                    }
                )();
                break;
            case 'Bye':
                console.log('case 2');
                (
                    () => {
                        console.log(req.message.chat)
                        sendMessage(req.message.chat.id, `Ok, bye`)
                    }
                )();
                break;
            default:
                console.log('run default');
                (
                    () => {
                        console.log(req.message.chat)
                        sendMessage(req.message.chat.id, `Hello ${userName}, \n\tplease try with below commnads \n\t\t\t \`/findcryptoprice\` \\-  find current crypo currency price \n\t\t\t\ \`/weatherreport\` \\- find today's forecast \n\n \t\t\t\t\t\tNote : This bot is still in development mode`, 'MarkdownV2')
                    }
                )();
                break;
        }
    } else if (req.message.photo) {
        console.log(req);
        if (req.message.photo) {
            // writeFileSync('./file.jpg',Buffer.from(req.message.photo), {flush: true })
            // await renamePhoto(req).catch(e => console.log(e))
            console.log(req.message.photo);
        } else if (req.message.document) {
            // await renameDoument(req);
        }
    }
    //setMyCommands([
    //     {
    //         "command": "start",
    //         "description": "Start the bot"
    //     },
    //     {
    //         "command": "findcryptoprice",
    //         "description": "find the price of coin"
    //     },
    //     {
    //         "command": "weatherreport",
    //         "description": "get weather report"
    //     },
    //     {
    //         "command": "delete_my_chat",
    //         "description": " command"
    //     }
    // ])
}








module.exports = { handler }