const component = require('./handler');
const express = require('express');
const expressApp = express();
const cors = require('cors');
expressApp.use(express.json());

expressApp.use(cors())
expressApp.get("*", (req, res) => {
    console.log(req.body);

    res.end('hi botu!')
});
expressApp.post("*", async (req, res) => {
    console.log(req.body);
    await component.handler(req.body).then(e => console.log(e), res.end('request successful, but error occured')).catch(e => console.log(e, 'app.post'));
});


expressApp.listen(80, () => {
    console.log('server started;');
    
})

