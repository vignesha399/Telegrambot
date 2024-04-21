const { postMessage, postDocument, deleteChatMessage } = require("../Components/axios");
const EventEmitter = require('eventemitter3');
const fileType = require('file-type');
const request = require('@cypress/request-promise');
const streamedRequest = require('@cypress/request');
const qs = require('querystring');
const stream = require('stream');
const mime = require('mime');
const path = require('path');
const fs = require('fs');
const { errors } = require("node-telegram-bot-api/src/telegram");
const { BASE_URL } = require("..");
const deprecate = require('node-telegram-bot-api/src/utils').deprecate;
const debug = require('debug')('node-telegram-bot-api');

function _formatSendData(type, data, fileOptions = {}) {
    const deprecationMessage =
      'See https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#sending-files' +
      ' for more information on how sending files has been improved and' +
      ' on how to disable this deprecation message altogether.';
    let filedata = data;
    let filename = fileOptions.filename;
    let contentType = fileOptions.contentType;

    if (data instanceof stream.Stream) {
      if (!filename && data.path) {
        // Will be 'null' if could not be parsed.
        // For example, 'data.path' === '/?id=123' from 'request("https://example.com/?id=123")'
        const url = URL.parse(path.basename(data.path.toString()));
        if (url.pathname) {
          filename = qs.unescape(url.pathname);
          console.log(filename,"from nodeTelebot354");
        }
      }
    } else if (Buffer.isBuffer(data)) {
      if (!filename && !process.env.NTBA_FIX_350) {
        deprecate(`Buffers will have their filenames default to "filename" instead of "data". ${deprecationMessage}`);
        filename = 'data';
      }
      if (!contentType) {
        const filetype = fileType(data);
        if (filetype) {
          contentType = filetype.mime;
          const ext = filetype.ext;
          if (ext && !process.env.NTBA_FIX_350) {
            filename = `${filename}.${ext}`;
          }
        } else if (!process.env.NTBA_FIX_350) {
          deprecate(`An error will no longer be thrown if file-type of buffer could not be detected. ${deprecationMessage}`);
          throw new errors.FatalError('Unsupported Buffer file-type');
        }
      }
    } else if (data) {
      if (this.options.filepath && fs.existsSync(data)) {
        filedata = fs.createReadStream(data);
        if (!filename) {
          filename = path.basename(data);
        }
      } else {
        return [null, data];
      }
    } else {
      return [null, data];
    }

    filename = filename || 'filename';
    contentType = contentType || mime.lookup(filename);
    if (process.env.NTBA_FIX_350) {
      contentType = contentType || 'application/octet-stream';
    } else {
      deprecate(`In the future, content-type of files you send will default to "application/octet-stream". ${deprecationMessage}`);
    }

    // TODO: Add missing file extension.
console.log('success form format send data');
    return [{
      [type]: {
        value: filedata,
        options: {
          filename,
          contentType,
        },
      },
    }, null];
  }

async function sendMessage(id, text, MarkdownV2, reply_markup={} ) {
    console.log('message from sendMessage', reply_markup);
    return (postMessage('sendMessage', {
        chat_id: id,
        text: text,
        'disable_notification': false,
        parse_mode: MarkdownV2,
        reply_markup: JSON.stringify(reply_markup.reply_markup)
    }))
}
async function deleteMessage(id, msdID, MarkdownV2) {
    // console.log('message from deleteMessage');
    return (await deleteChatMessage('deleteMessages', {
        chat_id: id,
        message_ids: [msdID]
    }))
}
async function sendDocument(id, options){
    sendMessage(options.qs.chat_id,options.formData.photo);
    console.log(options, options.formData.photo.options, options.formData.photo.value)
    options.method = 'POST';
    options.simple = false;
    options.url = BASE_URL;
    options.uri = 'https://api.telegram.org/bot'+options.method
    options.resolveWithFullResponse = true;
    options.forever = true;
    debug('HTTP request: %j', options);
    return request(options)
      .then(resp => {
        let data;
        try {
          data = resp.body = JSON.parse(resp.body);
        //   console.log((data.photo+ 'data place'));
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                console.log(element);
                
            }
        }
        } catch (err) {
          throw new errors.ParseError(`Error parsing response: ${resp.body}`, resp);
        }

        if (data.ok) {
          return data.result;
        }
      }).catch(error => {
        // TODO: why can't we do `error instanceof errors.BaseError`?
        if (error.response) throw error;
        throw new errors.FatalError(error);
      });
    // (postDocument('sendPhoto', JSON.parse(options.formData.photo)))
}
module.exports = {sendMessage, sendDocument, _formatSendData, deleteMessage}