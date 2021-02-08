var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['Desavanja']);

module.exports = router;

router.get('/events', function(req, res, next){
    console.log("Usao u f-ju");
    db.Desavanja.find(function(err, events){
        if(err){
            res.send(err);
        }
        res.json(events);
    })
});

router.post('/registerEvent', (req, res, next)=>{
    console.log("sto nece ispis");
    console.log(req.body);
    const event1= {
       kreator: req.body.kreator,
       naziv: req.body.naziv,
       pocetak: req.body.pocetak,
       kraj: req.body.kraj,
       opis: req.body.opis,
       vrsta: req.body.vrsta,
       ucesnici: req.body.ucesnici/*,
       aktivnost: req.body.aktivnost*/     
    };

    db.Desavanja.save(event1, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(event1);
        console.log(event1);
    });
});

/*router.post('/register', upload.single("slika"), (req, res, next)=>{
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
});*/

router.get('/getEventByName/:naziv',function(req, res, next){
    console.log(req.params.naziv);
    db.Desavanja.findOne({naziv: req.params.naziv}, function(err, event){
        if(err){
            res.send(err);
        }
        console.log(event);
        res.json(event);
    });
});

router.put('/updateEventByActivity/:naziv',function(req, res, next){
    var user=req.body;
    console.log(req.params.naziv);
    console.log(req.body);
    //console.log('Update a user');
    db.Desavanja.updateOne({naziv: req.params.naziv}, {$set:{pocetak: req.body.pocetak, kraj: req.body.kraj}}, function(err,event){
        console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        console.log(event);
        res.json(event);
    });
});

router.put('/addParticipate/:naziv',function(req, res, next){
    var user=req.body;
    console.log(req.params.naziv);
    console.log(req.body);
    //console.log('Update a user');
    db.Desavanja.updateOne({naziv: req.params.naziv}, {$set:{ucesnici: req.body.ucesnik}}, function(err,event){
        console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        console.log(event);
        res.json(event);
    });
});