const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser')
const PhoneRoute = require('./routes/PhoneRoute');
const path = require("path");
const cors = require('cors');
const app = express();


const urlencodedParser = express.urlencoded({extended: false});
const hbs = require('express-handlebars').create({extname:'.hbs',  defaultLayout: false, layoutsDir:"/views", helpers:{canbutton:()=>{ return `<input class="boton1"  value="Отказаться" onclick="window.location = '/'"></input>`}}});


app.engine('.hbs', hbs.engine);
app.set("view engine", ".hbs");
app.set('port',3000);

app.set('/views', express.static(path.join(__dirname,'/views')));
const corsOptions = {
    origin: 'https://nodejs-3etv.onrender.com',
    method:"GET,HEAD,PUT,POST, PATCH,DELETE"
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'/static')));
app.use(urlencodedParser);
app.use(methodOverride('_method'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use('/', PhoneRoute);
//app.use(express.json())



app.listen(app.get('port'), () => {
    console.log('Сервер запущен на порту 3000');
});

