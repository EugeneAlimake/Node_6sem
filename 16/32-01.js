const app = require('express')();
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.js');
let phoneNumbers = require('./phoneNumbers');
const fs = require("fs");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.get("/TS", (req, res) => {
    res.json(phoneNumbers);
});
app.post('/TS', (req, res) => {
    console.log(req.body)
    const {Id, name, number} = req.body;
    if (name && number && Id) {
        phoneNumbers.push(
            {
                Id,
                name,
                number
            });
        fs.writeFile(__dirname + '/phoneNumbers.json', JSON.stringify(phoneNumbers, null, '  '), err => {
            if (err) {
                throw err;
            }
        });
        res.json({message: ' posted'});
    } else {
        res.status(400).json({message: ' parameters are missing'});
    }
});

app.put('/TS', async (req, res) => {
    const {Id, name, number} = req.body;

    if (Id, name, number) {
        let isNumber = phoneNumbers.find(phone => phone.Id == req.body.Id);
        if (!isNumber) {
            throw new Error('Phone number is not exists');
        }
        isNumber.Id = Id;
        isNumber.name = name;
        isNumber.number = number;

        fs.writeFile(__dirname + '/phoneNumbers.json', JSON.stringify(phoneNumbers, null, '  '), err => {
            if (err) {throw err;}
        });
        res.json({message: ' updated'});
    }
    else {
        res.status(400).json({message: ' parameters are missing'});
    }
});

app.delete('/TS', (req, res)=>{
    if(req.query.Id)
    {
        let isNumber = phoneNumbers.find(phone => phone.Id == req.query.Id);
        if (!isNumber)
        {
            throw new Error(' number is not exists');
        }
        phoneNumbers = phoneNumbers.filter(phone => phone.Id == req.query.Id);
        fs.writeFile(__dirname + './phoneNumbers.json', JSON.stringify(phoneNumbers, null, '  '), err => {
            if (err) {throw err;}
        });
        res.json({ message: 'deleted'});
    }
    else{
        res.status(400).json({ message: 'One or more of parameters are missing'});
    }
});

app.listen(3000, () => {
    console.log('app is listerning on port 3000');
});
