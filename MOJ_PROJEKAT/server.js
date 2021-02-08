var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');

var index = require('./routes/index');
var korisnici = require('./routes/korisnici');
var zahtevi = require('./routes/zahtevi');
var desavanja = require('./routes/desavanja');
var knjige = require('./routes/knjige');
var komentari = require('./routes/komentari');
var zanrovi = require('./routes/zanrovi');
var knjigeZahtevi = require('./routes/knjigeZahtevi');
var desavanjaZahtevi = require('./routes/desavanjaZahtevi');
var desavanjaKomentari = require('./routes/desavanjaKomentari');
var knjigeStrane = require('./routes/knjigeStrane');
var ciljevi = require('./routes/ciljevi');

var port = 3000;

var app = express();


//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Set Static Folder
app.use(express.static(path.join(__dirname, 'MojProjekat')));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use('/images',express.static(path.join('images')));

var cors = require('cors');
app.use(cors({origin: "*"}));

//Rute
app.use('/', index);
app.use('/', korisnici);
app.use('/', zahtevi);
app.use('/', desavanja);
app.use('/', knjige);
app.use('/', komentari);
app.use('/', zanrovi);
app.use('/', knjigeZahtevi);
app.use('/', desavanjaZahtevi);
app.use('/', desavanjaKomentari);
app.use('/', knjigeStrane);
app.use('/', ciljevi);

app.listen(port, function(){
    console.log('Server started on port ' + port);
});




