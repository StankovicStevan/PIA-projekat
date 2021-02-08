var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['KnjigeZahtevi']);

module.exports = router;


const multer = require("multer");

const MIME_TYPE_MAP={
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);//Filename extension
    }
});

var upload = multer({storage: storage});

router.post('/registerBook', upload.single("slika"), (req, res, next)=>{
    console.log("Usao u POST");
    const url=req.protocol+'://'+req.get("host");
    var tmp=req.body.default;
    var putanja="";
    if(tmp=="default"){
        putanja="defaultSlika.png";
    }
    else{
        putanja=req.file.filename;
    }
    const book= {
        slikaPutanja: url+"/images/"+putanja,
        naziv: req.body.naziv,
        autori: typeof(req.body.autor) === 'string'?[req.body.autor]: req.body.autor,
        datumIzdavanja: req.body.datumIzdavanja,
        zanr: typeof(req.body.zanr) === 'string' ? [req.body.zanr]: req.body.zanr,
        opis: req.body.opis,
        prosecnaOcena: req.body.prosecnaOcena,
        stanje: req.body.stanje,
        strane: req.body.strane,
        pdf: req.body.pdf        
    };

    db.KnjigeZahtevi.save(book, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(book);
    });
});

router.get('/bookRequests', function(req, res, next){
    db.KnjigeZahtevi.find(function(err, bookRequests){
        if(err){
            res.send(err);
        }
        res.json(bookRequests);
    })
});

router.delete('/deleteBookRequest/:naziv', function(req, res, next){
    console.log("Usao u delete");
    console.log(req.params.naziv);
    db.KnjigeZahtevi.remove({naziv: req.params.naziv},function(err, book){
        console.log("Usao u remove");
        if(err){
            console.log("ERROR");
            res.send(err);
        }
        console.log(book);
        res.json(book);
    });
});

router.put('/declineBookRequest/:naziv',function(req, res, next){
    var user=req.body;
    console.log(req.params.naziv);
    console.log(req.body);
    //console.log('Update a user');
    db.KnjigeZahtevi.updateOne({naziv: req.params.naziv}, {$set:{stanje: req.body.stanje}}, function(err,book){
        console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        console.log(book);
        res.json(book);
    });
});

router.get('/declinedBookRequests',function(req, res, next){
    console.log("Usao u back");
    db.KnjigeZahtevi.find({stanje: "odbijen"}, function(err, books){
        if(err){
            res.send(err);
        }
        console.log(books);
        res.json(books);
    });
});