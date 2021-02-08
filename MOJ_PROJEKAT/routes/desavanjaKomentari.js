var express = require('express');
var router = express.Router();
var path=require('path');
var mongojs = require('mongojs');
var db= mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['DesavanjaKomentari']);

module.exports = router;

router.get('/eventComments', function(req, res, next){
    console.log("Usao u f-ju");
    db.DesavanjaKomentari.find(function(err, eventComments){
        if(err){
            res.send(err);
        }
        res.json(eventComments);
        console.log(eventComments);
    })
});

router.post('/insertEventComment', (req, res, next)=>{
    console.log(req.body);
    const eventComment= {
       desavanje: req.body.desavanje,
       kreator: req.body.kreator,
       sadrzaj: req.body.sadrzaj  
    };

    db.DesavanjaKomentari.save(eventComment, function(err,tmp){
        if(err){
            res.send(err);
        }
        res.json(eventComment);
        console.log(eventComment);
    });
});