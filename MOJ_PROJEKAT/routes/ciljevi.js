var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['Ciljevi']);

module.exports = router;

router.get('/goalsForUser/:username', function(req, res, next){
    console.log("Usao u f-ju");
    console.log(req.body);
    db.Ciljevi.find({vlasnik: req.params.username},function(err, goals){
        if(err){
            res.send(err);
        }
        res.json(goals);
        console.log(goals);
    })
});

router.post('/saveGoal', (req, res, next)=>{
    console.log("Usao u POST");
    console.log(req.body);
    const goal= {
        vlasnik: req.body.vlasnik,
        brojKnjiga: req.body.brojKnjiga,
        datum: req.body.datum,
        procitaneKnjigeDoSad: req.body.procitaneKnjigeDoSad,
        dodat: req.body.dodat     
    };

    db.Ciljevi.save(goal, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(goal);
        console.log(goal);
    });
});

router.post('/updateGoalAdded',function(req, res, next){
    var user=req.body;
    console.log("UPDATE GOAL ADDED");
    console.log(req.body);
    db.Ciljevi.updateOne({vlasnik: req.body.vlasnik, brojKnjiga: req.body.brojKnjiga, datum: req.body.datum, procitaneKnjigeDoSad: req.body.procitaneKnjigeDoSad}, 
        {$set:{dodat: req.body.dodat}}, function(err,user){
        console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        console.log(user);
        res.json(user);
    });
});