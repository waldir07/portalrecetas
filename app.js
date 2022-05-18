const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser =  require('cookie-parser');
const flash = require('connect-flash');

//express app start
const app = express();

//PORT
const port = process.env.PORT || 3000;

//SPECIAL
require('dotenv').config();

//----------MIDDLEWARES-------//

app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));

//STATIC FOLDER
app.use(express.static('public'));

//LAYOUTS
app.use(expressLayouts);

//cookiparser
app.use(cookieParser('CookingBlogSecure'));

//session
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true
}));

//flash and fileupload
app.use(flash());
app.use(fileUpload());




//ENGINE
app.set('layout','./layouts/main');
app.set('view engine', 'ejs')
//RUTAS
const routes = require('./server/routes/recipeRoutes.js');
app.use('/',routes);

//LISTEN
app.listen(port,()=> {
    console.log(`listening to port ${port}`);
});
