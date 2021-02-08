var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['DesavanjaZahtevi']);

module.exports = router;

router.get('/eventRequests', function(req, res, next){
    console.log("Usao u f-ju");
    db.DesavanjaZahtevi.find(function(err, events){
        if(err){
            res.send(err);
        }
        res.json(events);
    })
});

router.get('/getEventRequestsByEvent/:nazivDesavanja', function(req, res, next){
    console.log("Usao u f-ju");
    console.log(req.params);
    db.DesavanjaZahtevi.find({nazivDesavanja: req.params.nazivDesavanja}, function(err, events){
        if(err){
            res.send(err);
        }
        res.json(events);
        console.log(events);
    })
});

router.post('/participateEventRequest', (req, res, next)=>{
    console.log("sto nece ispis");
    console.log(req.body);
    const eventRequest= {
       nazivDesavanja: req.body.nazivDesavanja,
       potencijalniUcesnik: req.body.potencijalniUcesnik     
    };

    db.DesavanjaZahtevi.save(eventRequest, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(eventRequest);
        console.log(eventRequest);
    });
});

router.post('/deleteEventRequest/:nazivDesavanja', function(req, res, next){
    console.log("Usao u delete");
    console.log(req.params);
    console.log(req.body);
    db.DesavanjaZahtevi.remove({nazivDesavanja: req.params.nazivDesavanja, potencijalniUcesnik: req.body.potencijalniUcesnik},function(err, user){
        console.log("Usao u remove");
        if(err){
            console.log("ERROR");
            res.send(err);
        }
        console.log(user);
        res.json(user);
    });
});
