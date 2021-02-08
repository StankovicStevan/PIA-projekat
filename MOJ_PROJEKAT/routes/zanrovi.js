var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['Zanrovi']);

module.exports = router;

router.get('/genres', function(req, res, next){
    console.log("Usao u zanrove");
    db.Zanrovi.find(function(err, genres){
        if(err){
            res.send(err);
        }
        res.json(genres);
    })
});

router.delete('/deleteGenre/:vrsta', function(req, res, next){
    console.log("Usao u delete");
    console.log(req.params.vrsta);
    db.Zanrovi.remove({vrsta: req.params.vrsta},function(err, genre){
        console.log("Usao u remove");
        if(err){
            console.log("ERROR");
            res.send(err);
        }
        console.log(genre);
        res.json(genre);
    });
});

router.post('/addGenre', function(req, res, next){
    var genre1=req.body;
    const genre= {
        vrsta: req.body.vrsta
    };
    console.log(genre1);
    db.Zanrovi.save(genre, function(err,genre){
        console.log("USAO U SAVE");
        if(err){
            res.send(err);
        }
        console.log("PROSAO ERR POSLE SAVE-A");
        console.log(genre);
        res.json(genre);
    });
});