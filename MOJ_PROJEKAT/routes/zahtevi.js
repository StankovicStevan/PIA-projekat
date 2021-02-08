var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['Zahtevi']);

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

router.post('/register', upload.single("slika"), (req, res, next)=>{
    console.log("Usao u POST");
    const url=req.protocol+'://'+req.get("host");
    var tmp=req.body.default;
    var putanja="";
    if(tmp=="default"){
        putanja="default.png";
    }
    else{
        putanja=req.file.filename;
    }
    const user= {
        ime: req.body.ime,
        prezime: req.body.prezime,
        username: req.body.username,
        password: req.body.password,
        slikaPutanja: url+"/images/"+putanja,
        datum: req.body.datum,
        grad: req.body.grad,
        drzava: req.body.drzava,
        email: req.body.email,
        tip: req.body.tip,
        cita: [],
        cekanje: [],
        procitao: [],
        pratioci: [],
        pracenOdStrane: [],
        obavestenja: [],
        aktivan: false,
        poslednjaPrijava: ""
    };

    db.Zahtevi.save(user, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

router.get('/requests', function(req, res, next){
    //console.log('Iksi');
    db.Zahtevi.find(function(err, tasks){
        //console.log('Radi');
        if(err){
            res.send(err);
        }
        //console.log('Radi1');
        //console.log(tasks);
        res.json(tasks);
    })
});

router.delete('/deleteRequest/:username', function(req, res, next){
    console.log("Usao u delete");
    console.log(req.params);
    db.Zahtevi.remove({username: req.params.username},function(err, user){
        console.log("Usao u remove");
        if(err){
            console.log("ERROR");
            res.send(err);
        }
        console.log(user);
        res.json(user);
    });
});

