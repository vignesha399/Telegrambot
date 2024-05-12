const axios = require("axios");
const { sendMessage, sendDocument, sendPhoto } = require("../api/messageAPI");
const { getFileID, getFileNameAndSendFile } = require("./axios");


async function sendFile(chatID, fileId, fileType, path, ctxx, fileName) {
    // console.log(fileType);
    // fileName = "vignesh";
    // fileType = ".pdf";
    let promise = new Promise(async (resolve, reject) => {
        // bot.onReplyToMessage(chatID, ctxx.message_id, ('name'));
        await getFileNameAndSendFile(path)
            .then(async (res) => {
                // Send the document content as Buffer
                // sendMessage(chatID, res.data)
                console.log(fileName, res.data, fileType);
                try {
                    
                    return resolve(await sendDocument(chatID, Buffer.from(res.data), {}, {
                        filename: fileName,
                        // Explicitly specify the MIME type.
                        contentType: fileType,
                    }))
                } catch (error) {
                    console.log(error);
                }
            })
            .then((response) => {
                console.log('Document sent:', response);
            })
            .catch((error) => {
                console.error('Error sending document:', error);
            });
    }).catch((error) => {
            return reject(console.error('Error downloading document:', error))
        });
}

async function getCustomFileNameFromUser(chatID, fileId, fileType, path, ctxx) {
    let promise = new Promise(async (resolve, reject) => {
        await sendMessage(chatID, `Enter file  \|\|spoiler\|\| \*bold \_italic bold \~italic bold strikethrough \|\|italic bold strikethrough spoiler\|\|\~ \_\_underline italic bold\_\_\_ bold\*`, 'MarkdownV2');
        // console.log(chatID, chatID - 1);
        return resolve(await sendFile(chatID, fileId, fileType, path, ctxx, ctxx.message.caption));
    });
    console.log(promise.then(async a => await a + " line 182;").catch(e => e));

}

async function renameDoument(ctx) {
    console.log('rename doc');
    let fileId = ctx.message.document.file_id, fileType = ctx.message.document.mime_type, path, fileSize = ctx.message.document.file_size;
    // if (fileSize <= 40000000) {
        let promise = await new Promise(async (res, rej) => {
            let contentStatus = await getFileID(fileId);
            if (contentStatus.data.ok) {
                path = contentStatus.data.result.file_path;
                runOnce = false;
                fileSendUpdate = true;
                return res(await getCustomFileNameFromUser(ctx.message.chat.id, fileId, fileType, path, ctx).catch(e => console.log(e)))
            } else {
                return rej('contain null');
            }
        })
    // } else {
    //     console.log(ctx.message.document.file_size);
    //     sendDocument(ctx.message.chat.id, "Your file size is too big");
    // }
}
async function renamePhoto(ctx) {
    let fileId = ctx.message.photo[3].file_id, fileType = ctx.message.photo[0].mime_type, path;
    // console.log(fileId, await ctx.photo[0].file_id);
    let promise = new Promise(async function (resolve, reject) {
        let contentStatus = await getFileID(fileId);
        console.log(contentStatus);
        if (contentStatus.data.ok) {
            path = contentStatus.data.result.file_path;

            resolve(await getCustomFileNameFromUser(ctx.message.chat.id, fileId, fileType, path, ctx).catch(e=>console.log(e)));
            // return resolve(await bot.sendPhoto(ctx.chat.id, "")) 
        } else {
            return reject('contain null')
        }
    })
    await promise.then(async a => console.log(await + " line number 233 onResolve"), async a => console.log(await + " line number 233 onReject"));

}

module.exports = { renamePhoto, renameDoument }