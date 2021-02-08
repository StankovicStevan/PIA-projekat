var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['Komentari']);

module.exports = router;

router.get('/comments', function(req, res, next){
    db.Komentari.find(function(err, comments){
        if(err){
            res.send(err);
        }
        res.json(comments);
    })
});

router.get('/getCommentsByBookName/:naziv',function(req, res, next){
    db.Komentari.find({knjiga: req.params.naziv}, function(err, comments){
        if(err){
            res.send(err);
        }
        //console.log(comments);
        res.json(comments);
    });
});

router.post('/getCommentsByBookNameAndUsername/:username',function(req, res, next){
    //console.log("Usao u post");
    //console.log(req.params.username);
    //console.log(req.body.knjiga);
    db.Komentari.find({vlasnik: req.params.username, knjiga: req.body.knjiga}, function(err, comments){
        if(err){
            res.send(err);
        }
        //console.log(comments);
        res.json(comments);
    });
});

router.put('/updateComment', function(req, res, next){
    //console.log(req.body.knjiga);
    //console.log(req.body.vlasnik);
    //console.log(req.body.ocena);
    //console.log(req.body.sadrzaj);
    db.Komentari.updateOne({knjiga: req.body.knjiga, vlasnik: req.body.vlasnik}, {$set:{
        sadrzaj: req.body.sadrzaj,
        ocena: req.body.ocena
    }}, function(err,comment){
        console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        //console.log(comment);
        res.json(comment);
    });
});

router.post('/addComment', (req, res, next)=>{
    //console.log("Usao u POST");
    //console.log(req.body.sadrzaj);
    
    const comment= {
        sadrzaj: req.body.sadrzaj,
        ocena: req.body.ocena,
        vlasnik: req.body.vlasnik,
        knjiga: req.body.knjiga,
        autor: typeof(req.body.autor) === 'string'?[req.body.autor]: req.body.autor
    };

    db.Komentari.save(comment, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(tmp);
        //console.log(tmp);
    });
});