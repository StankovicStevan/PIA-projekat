var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['Knjige']);

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

/*router.post('/ubaciSliku', upload.single("slika"), (req, res, next)=>{
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
    const user= {
        slikaPutanja: url+"/images/"+putanja,
        naziv: req.body.naziv,
        autori: typeof(req.body.autor) === 'string'?[req.body.autor]: req.body.autor,
        datumIzdavanja: req.body.datum,
        zanr: typeof(req.body.zanr) === 'string' ? [req.body.zanr]: req.body.zanr,
        opis: req.body.opis,
        prosecnaOcena: req.body.opis
    };

    db.Knjige.save(user, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});*/

router.get('/books', function(req, res, next){
    //console.log('Iksi');
    db.Knjige.find(function(err, books){
        //console.log('Radi');
        if(err){
            res.send(err);
        }
        //console.log('Radi1');
        //console.log(books);
        res.json(books);
    });
});

router.get('/dohvatiKnjigeSaOdrAutorom/:autor',function(req, res, next){
    db.Knjige.find({autor: req.params.autor}, function(err, books){
        if(err){
            res.send(err);
        }
        //console.log(books);
        res.json(books);
    });
});

router.get('/getBookByName/:naziv',function(req, res, next){
    db.Knjige.findOne({naziv: req.params.naziv}, function(err, books){
        if(err){
            res.send(err);
        }
        //console.log(books);
        res.json(books);
    });
});

router.post('/addBook', function(req, res, next){
    console.log("Usao u back");
    var book1=req.body.naziv;
    const book= {
        slikaPutanja: req.body.slikaPutanja,
        naziv: req.body.naziv,
        autori: typeof(req.body.autor) === 'string'?[req.body.autor]: req.body.autor,
        datumIzdavanja: req.body.datumIzdavanja,
        zanr: typeof(req.body.zanr) === 'string' ? [req.body.zanr]: req.body.zanr,
        opis: req.body.opis,
        prosecnaOcena: req.body.prosecnaOcena,
        strane: req.body.strane,
        pdf: req.body.pdf
    };
    console.log(book1);
    db.Knjige.save(book, function(err,book){
        console.log("USAO U SAVE");
        if(err){
            res.send(err);
        }
        console.log("PROSAO ERR POSLE SAVE-A");
        console.log(book);
        res.json(book);
    });
});

router.post('/registerRealBook', upload.single("slika"), (req, res, next)=>{
    //console.log("Usao u POST");
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
        strane: req.body.strane,
        pdf: req.body.pdf      
    };

    db.Knjige.save(book, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(book);
        //console.log(book);
    });
});

router.put('/updateBookData/:naziv', upload.single("slika"), function(req, res, next){
    //var user=req.body;
    //console.log('Usao u put');
    //console.log(req.params.naziv);
    //console.log(req.body.slikaPutanja);
    const url=req.protocol+'://'+req.get("host");
    let nazivcic=req.body.naziv;
    console.log(req.body.naziv);
    if(req.body.naziv==""||req.body.naziv==null){
        console.log(nazivcic+"DODATO");
        nazivcic=req.params.naziv;
    }
    let slicica="";
    if(req.file!=null){
        //console.log(req.file.filename);
        let putanja=req.file.filename;
        slicica=url+"/images/"+putanja;
    }
    else{
        slicica=req.body.slikaPutanja;
    }
    let updUser={
        slikaPutanja: slicica,
        //naziv: req.body.naziv1==""?req.params.naziv:req.body.naziv1,
        naziv: nazivcic,
        autori: typeof(req.body.autor) === 'string'?[req.body.autor]: req.body.autor,
        datumIzdavanja: req.body.datumIzdavanja,
        zanr: typeof(req.body.zanr) === 'string' ? [req.body.zanr]: req.body.zanr,
        opis: req.body.opis,
        prosecnaOcena: req.body.prosecnaOcena,
        strane: req.body.strane   
    }
    //console.log(req.params);
    //console.log('Update a user');
    db.Knjige.updateOne({naziv: req.params.naziv}, {$set:{
        slikaPutanja: slicica,
        naziv: nazivcic,
        autori: typeof(req.body.autor) === 'string'?[req.body.autor]: req.body.autor,
        datumIzdavanja: req.body.datumIzdavanja,
        zanr: typeof(req.body.zanr) === 'string' ? [req.body.zanr]: req.body.zanr,
        opis: req.body.opis,
        prosecnaOcena: req.body.prosecnaOcena,
        strane: req.body.strane,
        pdf: req.body.pdf
    }}, function(err,book){
        //console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        //console.log(book);
        res.json(book);
    });
});

router.put('/updateBookRating/:naziv',function(req, res, next){
    var user=req.body;
    //console.log("USAO U UPDATE");
    //console.log(req.params.naziv);
    //console.log(req.body.ocena);
    //console.log('Update a user');
    db.Knjige.updateOne({naziv: req.params.naziv}, 
        {$set:{prosecnaOcena: req.body.ocena}}, function(err,book){
        //console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        //console.log(book);
        res.json(book);
    });
});