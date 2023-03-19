const express = require('express');
const methodOverride = require('method-override');
const app = express();
app.use(methodOverride('_method'));
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
// Обработка GET запроса к корню сайта
const urlencodedParser = express.urlencoded({extended: false});

const PostRoutes = require('./routes/PostRoute')
const DepartmentRoutes = require('./routes/DepartmentRoute')
const PerInfoRoutes = require('./routes/PerInfoRoute')
const SerInfoRoutes = require('./routes/SerInfoRoute')
const SpecializationRoutes = require('./routes/SpecializationRoute')


app.use(urlencodedParser);
app.set("views engine", "hbs");
//app.engine('html', require('hbs').__express);
app.use(methodOverride('_method'));
app.use("/",PostRoutes );
app.use("/",DepartmentRoutes );
app.use("/",PerInfoRoutes );
app.use("/SerInfo",SerInfoRoutes );
app.use("/",SpecializationRoutes );

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});