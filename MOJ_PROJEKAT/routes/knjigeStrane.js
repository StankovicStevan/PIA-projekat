var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['KnjigeStrane']);

module.exports = router;

router.get('/bookPages', function(req, res, next){
    console.log("Usao u f-ju");
    db.KnjigeStrane.find(function(err, bookPages){
        if(err){
            res.send(err);
        }
        res.json(bookPages);
    })
});