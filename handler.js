const path = require('path');
const axios = require("axios");
const { findCryptoPrice } = require('./Components/findCryptoPrice');
const { findWeatherReport } = require('./Components/weather');
const { sendMessage, deleteMessage } = require('./api/messageAPI');
const { renamePhoto, renameDoument } = require('./Components/renameFiles');
const outFile = require('./outFile');
const fs = require('fs');
var { ncrypt } = require("ncrypt-js");

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
    outFile(req);
    if (req.message?.text || req.edited_message?.text) {
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
                        sendMessage(
                            req.message.chat.id, `Hello ${userName}! What time is it?`, '', {
                            reply_markup: {
                                "text": "text button",
                                "url": "http://core.telegram.org/bots/api#inlinekeyboardmarkup"
                                // keyboard,

                            }
                        }
                        );
                        try {
                            for (let index = req.message.message_id; index > 0; index--) {
                                deleteMessage(req.message.chat.id, index);
                            }
                        } catch (error) {
                            console.log(error);
                            sendMessage(req.message?.chat.id || req.edited_message.chat.id, `Hello ${userName}, something went wrong in server side. Please try aftr some time`)
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
                if (req.message.chat.type == 'private') {
                    (
                        () => {
                            console.log(req.message.chat)
                            sendMessage(req.message.chat.id, `Hello ${userName}, \n\tplease try with below commnads \n\t\t\t \`/findcryptoprice\` \\-  find current crypo currency price \n\t\t\t\ \`/weatherreport\` \\- find today's forecast \n\n \t\t\t\t\t\tNote : This bot is still in development mode`, 'MarkdownV2')
                        }
                    )();
                }
                break;
        }
    } else if (req.message.photo) {
        console.log(req);
        if (req.message.photo) {

            fs.writeFile('./file.jpg', Buffer.from((req.message.photo)), (err) => { if (err) console.log(err) })
            await renamePhoto(req).catch(e => console.log(e))
            // console.log(req.message.photo);
        }
    } else if (req.message.document) {
        await renameDoument(req).catch(e => console.log(e));
        console.log('handler ');
    }
    var _secretKey = "some-super-secret-key";
    var object = {
        NycryptJs: "is cool and fun.",
        You: "should try it!"
    }

    var ncryptObject = new ncrypt('ncrypt-js');

    // encrypting super sensitive data here
    var encryptedObject = ncryptObject.encrypt(object);
    console.log("Encryption process...");
    console.log("Plain Object     : ", object);
    console.log("Encrypted Object : " + encryptedObject);

    // decrypted super sensitive data here
    var decryptedObject = ncryptObject.decrypt(encryptedObject);
    console.log("... and then decryption...");
    console.log("Decipher Text : ", decryptedObject);
    console.log("...done.");
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