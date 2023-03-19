const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser')
const PhoneRoute = require('./routes/PhoneRoute');
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname,'/static')));

const hbs = require('express-handlebars').create({extname:'.hbs',  defaultLayout: false, layoutsDir:"views", helpers:{canbutton:()=>{ return `<input class="boton1"  value="Отказаться" onclick="window.location = '/'"></input>`}}});
app.use(express.static(path.join(__dirname + '/views')));
const urlencodedParser = express.urlencoded({extended: false});
app.use(urlencodedParser);
app.use(methodOverride('_method'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.set('port',3000);
app.engine('.hbs', hbs.engine);
app.set("views engine", "hbs");
app.use(express.json())
PhoneRoute(app);
app.listen(app.get('port'), () => {
    console.log('Сервер запущен на порту 3000');
});

