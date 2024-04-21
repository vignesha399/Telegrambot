const axios = require("axios");
const { sendMessage, _formatSendData, sendDocument } = require("../api/messageAPI");
const { getFileID, getFileNameAndSendFile } = require("./axios");

function sendPhoto(chatId, photo, options = {}, fileOptions = {}) {
    const opts = {
        qs: options,
    };
    opts.qs.chat_id = chatId;
    try {
        const sendData = _formatSendData('photo', photo, fileOptions);
        opts.formData = sendData[0];
        opts.qs.photo = sendData[1];
    } catch (ex) {
        return Promise.reject(ex);
    }
    return sendDocument('sendPhoto', opts);
}

async function sendFile(chatID, fileId, fileType, path, ctxx, fileName) {
    console.log(fileType);
    let promise = new Promise(async (resolve, reject) => {
        // bot.onReplyToMessage(chatID, ctxx.message_id, ('name'));
        await getFileNameAndSendFile(path)
            .then(async (res) => {
                // Send the document content as Buffer
                // sendMessage(chatID, res.data)
                // console.log(fileName, res.data);
                // return resolve(await sendPhoto(chatID, Buffer.from(res.data), {}, {
                //     filename: fileName,
                //     // Explicitly specify the MIME type.
                //     contentType: fileType,
                // }))
                // .then((response) => { 
                //     // fileSendUpdate = false;
                //     return resolve(console.log('Document sent:', ));
                // }).catch((error) => {
                //     return reject(console.error('Error sending document:', error));
                // }))
                const formData = new FormData();
                formData.append('chat_id', chatID);
                formData.append('photo', new Blob(res.data), {
                    filename: 'document.jpg',
                    contentType: 'image/jpeg'
                });
                for(const key in formData) {
                    if (Object.hasOwnProperty.call(formData, key)) {
                        const element = formData[key];
                        console.log(element[1].value);
                    }
                    console.log(key);
                }
                console.log(formData, );
                // Make the HTTP POST request to send the document
                axios.post('https://api.telegram.org/bot/sendPhoto', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then((response) => {
                        console.log('Document sent:', response.data);
                    })
                    .catch((error) => {
                        console.error('Error sending document:', error.response.data);
                    });
            })
            .catch((error) => {
                return reject(console.error('Error downloading document:', error))
            });
    })
    // console.log(promise);

}

async function getCustomFileNameFromUser(chatID, fileId, fileType, path, ctxx) {
    let promise = new Promise(async (resolve, reject) => {
        await sendMessage(chatID, 'Enter file "|| spoiler || <span class="tg-spoiler">spoiler</span>"');
        console.log(chatID, chatID - 1);
        return resolve(await sendFile(chatID, fileId, fileType, path, ctxx, ctxx.message.caption));
    });
    console.log(promise.then(async a => await a + " line 182;").catch(e => e));

}

async function renameDoument(ctx) {
    let fileId = ctx.message.document.file_id, fileType = ctx.message.document.mime_type, path, fileSize = ctx.message.document.file_size;
    if (fileSize <= 40000000) {
        let promise = await new Promise(async (res, rej) => {
            let contentStatus = await getFileID(fileId);
            if (contentStatus.data.ok) {
                path = contentStatus.data.result.file_path;
                runOnce = false;
                fileSendUpdate = true;
                return res(await getCustomFileNameFromUser(ctx.message.chat.id, fileId, fileType, path, ctx).catch(e => console.log(e)))
            } else {
                return rej('contain null')
            }
        })
    } else {
        console.log(ctx.message.document.file_size);
        sendDocument(ctx.message.chat.id, "Your file size is too big");
    }
}
async function renamePhoto(ctx) {
    let fileId = ctx.message.photo[0].file_id, fileType = ctx.message.photo[0].mime_type, path;
    // console.log(fileId, await ctx.photo[0].file_id);
    let promise = new Promise(async function (resolve, reject) {
        let contentStatus = await getFileID(fileId);
        // console.log(contentStatus);
        if (contentStatus.data.ok) {
            path = contentStatus.data.result.file_path;

            return resolve(await getCustomFileNameFromUser(ctx.message.chat.id, fileId, fileType, path, ctx));
            // return resolve(await bot.sendPhoto(ctx.chat.id, "")) 
        } else {
            return reject('contain null')
        }
    })
    await promise.then(async a => console.log(await + " line number 233 onResolve"), async a => console.log(await + " line number 233 onReject"));

}

module.exports = { renamePhoto, renameDoument }