const 
 express = require('express'),
 path = require('path'),
 urlShortener = require('node-url-shortener')
 bodyParser = require('body-parser'),
 _handlebars = require('handlebars'),
 expressHandlebars = require('express-handlebars'),
 {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'),
 db = require('./models/index.js'),

 port = process.env.PORT || 3000,
 app = express();

app.use(bodyParser.urlencoded({ extended: true })); //parse the incoming request object - strings, arrays, object, or any type
app.use(express.urlencoded({ extended: true })); //parse the incoming request object as strings or arrays
app.engine('handlebars', expressHandlebars({ 
     handlebars: allowInsecurePrototypeAccess(_handlebars)
}));
app.set('view engine', 'handlebars');

app.get('/',(req, res) => {
    db.Url.findAll({ order: [['createdAt', 'DESC']], limit: 5 })
    .then( urlObjs => res.render('index', {urlObjs}) )
});

app.post('/url',(req, res) => {
    const url = req.body.url;
    urlShortener.short(url,(err, shortUrl) => {
        db.Url.findOrCreate({where: {url, shortUrl}})
        .then( ([urlObj, created]) => {res.send(shortUrl)} )
    });
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));