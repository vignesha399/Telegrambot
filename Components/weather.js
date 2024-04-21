const { sendMessage } = require("../api/messageAPI");
const { weather } = require("./axios");


async function findWeatherReport(ctx, userName) {
    console.log(ctx.message.chat, ctx.message.text, ctx, userName);
    var locationName;
    try {
        locationName = ctx.message.text.split(' ')[1].trim();
    } catch (e) {
        sendMessage(ctx.message.chat.id, `Enter your favorite place name along with /weatherReport 
            e\\.g\\. \`/weatherreport dharmapuri \` `,'MarkdownV2')
    }
    if (locationName == undefined || locationName == '') {

    } else {
        try {
            await weather(locationName)
                .then(response => {
                    console.log(response.data.name)
                    rate = response.data.name;
                    const message = `Hello ${userName}, today's weather in ${response.data.name}, ${response.data.sys.country}
                sunraise at ${new Date(response.data.sys.sunrise * 1000).toLocaleDateString()} ${new Date(response.data.sys.sunrise * 1000).toLocaleTimeString()} ,
                sunset at ${new Date(response.data.sys.sunset * 1000).toLocaleDateString()} ${new Date(response.data.sys.sunset * 1000).toLocaleTimeString()} 
                weather is like
                    ${response.data.weather[0].description}
                    temp : ${response.data.main.temp}c
                    feel like : ${response.data.main.feels_like}c
                    date : ${new Date(response.data.dt * 1000).toLocaleString()}`
                    sendMessage(ctx.message.chat.id, message);
                })
        } catch (e) {
            sendMessage(ctx.message.chat.id, `Hello ${userName}, ${locationName} is not found, 
                try with city name 
                e\\.g\\. \` /weatherreport dharmapuri \` `,'MarkdownV2')
        }

    }

}


module.exports = { findWeatherReport };