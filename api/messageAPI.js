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
const { BASE_URL } = require("../Components/axios");
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
    //  if (Buffer.isBuffer(data)) {
      if (!filename) {
        deprecate(`Buffers will have their filenames default to "filename" instead of "data". ${deprecationMessage}`);
        filename = new Date().getFullYear()+"_"+new Date().getMonth()+"_"+new Date().getDate()+"_"+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+new Date().getMilliseconds();
        console.log('dont have filename');
      }
      // if (contentType) {
        const filetype = fileType(data);
        if (filetype) {
          contentType = filetype.mime;
          const ext = filetype.ext;
          if (ext && !process.env.NTBA_FIX_350) {
            filename = `${filename}.${ext}`;
            console.log('fileName : ',filename, filedata,filetype);
          }
        } else if (!process.env.NTBA_FIX_350) {
          deprecate(`An error will no longer be thrown if file-type of buffer could not be detected. ${deprecationMessage}`);
          throw new errors.FatalError('Unsupported Buffer file-type');
        }
      // }
    // } 
    filename = filename;
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

function fixReplyMarkup(obj) {
  const replyMarkup = obj.reply_markup;
  if (replyMarkup && typeof replyMarkup !== 'string') {
    obj.reply_markup = stringify(replyMarkup);
  }
}

/**
 * Fix 'entities' or 'caption_entities' or 'explanation_entities' parameter by making it JSON-serialized, as
 * required by the Telegram Bot API
 * @param {Object} obj Object;
 * @private
 * @see https://core.telegram.org/bots/api#sendmessage
 * @see https://core.telegram.org/bots/api#copymessage
 * @see https://core.telegram.org/bots/api#sendpoll
 */
function _fixEntitiesField(obj) {
  const entities = obj.entities;
  const captionEntities = obj.caption_entities;
  const explanationEntities = obj.explanation_entities;
  if (entities && typeof entities !== 'string') {
    obj.entities = stringify(entities);
  }

  if (captionEntities && typeof captionEntities !== 'string') {
    obj.caption_entities = stringify(captionEntities);
  }

  if (explanationEntities && typeof explanationEntities !== 'string') {
    obj.explanation_entities = stringify(explanationEntities);
  }
}


/**
 * Fix 'reply_parameters' parameter by making it JSON-serialized, as
 * required by the Telegram Bot API
 * @param {Object} obj Object; either 'form' or 'qs'
 * @private
 * @see https://core.telegram.org/bots/api#sendmessage
 */
function  _fixReplyParameters(obj) {
  if (obj.hasOwnProperty('reply_parameters') && typeof obj.reply_parameters !== 'string') {
    obj.reply_parameters = stringify(obj.reply_parameters);
  }
}


function _request(_path, options = {}) {

  if (options.form) {
    fixReplyMarkup(options.form);
    _fixEntitiesField(options.form);
    _fixReplyParameters(options.form);
  }
  if (options.qs) {
    fixReplyMarkup(options.qs);
    _fixReplyParameters(options.qs);
  }

  options.method = 'POST';
  options.url = BASE_URL+_path;
  options.simple = false;
  options.resolveWithFullResponse = true;
  options.forever = true;
  debug('HTTP request: %j', options);
  return request(options)
    .then(resp => {
      let data;
      try {
        data = resp.body = JSON.parse(resp.body);
      } catch (err) {
        throw new errors.ParseError(`Error parsing response: ${resp.body}`, resp);
      }

      if (data.ok) {
        return data.result;
      }
      throw new errors.TelegramError(`${data.error_code} ${data.description}`, resp);
    }).catch(error => {
      // TODO: why can't we do `error instanceof errors.BaseError`?
      if (error.response) throw error;
      throw new errors.FatalError(error);
    });
}
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
  return _request('sendPhoto', opts);
}
function sendDocument(chatId, photo, options = {}, fileOptions = {}) {
  const opts = {
      qs: options,
  };
  opts.qs.chat_id = chatId;
  try {
      const sendData = _formatSendData('document', photo, fileOptions);
      opts.formData = sendData[0];
      opts.qs.document = sendData[1];
  } catch (ex) {
      return Promise.reject(ex);
  }
  return _request('sendDocument', opts);
}
module.exports = {sendMessage, _formatSendData, deleteMessage, _request, sendDocument, sendPhoto}