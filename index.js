const component = require('./handler');
const express = require('express');
const expressApp = express();
expressApp.use(express.json());


expressApp.get("*", (req, res) => {
    console.log(req.body);

    res.end('hi botu!')
});
expressApp.post("*", async (req, res) => {
    console.log(req.body);
    await component.handler(req.body).then(e => console.log(), res.end('request successful')).catch(e => console.log(e, 'app.post'));
});


expressApp.listen(80, 'localhost', () => {
    console.log('server started;');
    
})

