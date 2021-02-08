var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var path = require('path');
var db = mongojs('mongodb+srv://stevan:iksiiksi@mytasklist.cyhs3.mongodb.net/Projekat?retryWrites=true&w=majority',['Korisnici']);
var async=require('async');
var nodemailer=require('nodemailer');
var crypto=require('crypto');
require('dotenv').config;



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

router.put('/updateUserData/:username', upload.single("slika"), function(req, res, next){
    //var user=req.body;
    console.log('Usao u put');
    console.log(req.body.ime);
    console.log(req.body.slikaPutanja);
    const url=req.protocol+'://'+req.get("host");
    let slicica="";
    if(req.file!=null){
        console.log(req.file.filename);
        let putanja=req.file.filename;
        slicica=url+"/images/"+putanja;
    }
    else{
        slicica=req.body.slikaPutanja;
    }
    let updUser={
        ime: req.body.ime,
        prezime: req.body.prezime,
        username: req.body.username,
        password: req.body.password,
        slikaPutanja: slicica,
        datum: req.body.datum,
        grad: req.body.grad,
        drzava: req.body.drzava,
        email: req.body.email,
        tip: req.body.tip
    }
    //console.log(req.params);
    //console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, {$set:{
        ime: req.body.ime,
        prezime: req.body.prezime,
        username: req.body.username,
        password: req.body.password,
        slikaPutanja: slicica,
        datum: req.body.datum,
        grad: req.body.grad,
        drzava: req.body.drzava,
        email: req.body.email,
        tip: req.body.tip
    }}, function(err,user){
        console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        //console.log(user);
        res.json(user);
    });
});


//Login
router.post('/login', function(req, res, next){
    var data=req.body;
    console.log(data.username);
    db.Korisnici.find({username: data.username, password: data.password}, function(err,user){
        //console.log("Radi1");
        if(err){
            //console.log("Radi2");
            res.send(err);
        }
        //console.log("Radi3");
        //console.log(user);
        res.json(user);
    });
});





//Dohvati sve korisnike
router.get('/users', function(req, res, next){
    //console.log('Iksi');
    db.Korisnici.find(function(err, tasks){
        //console.log('Radi');
        if(err){
            res.send(err);
        }
        //console.log('Radi1');
        //console.log(tasks);
        res.json(tasks);
    })
});

router.put('/updateUser/:username',function(req, res, next){
    var user=req.body;
    //console.log(req.params);
    //console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, {$set:{tip: req.body.tip}}, function(err,task){
        console.log("Usao u update");
        if(err){
            //console.log("Baca err");
            res.send(err);
        }
        //console.log("Prosao err");
        //console.log(user);
        res.json(task);
    });
});



router.post('/addUser', function(req, res, next){
    var korisnik=req.body;
    console.log("ADD USER");
    console.log(req.body.ime);
    const user= {
        ime: req.body.ime,
        prezime: req.body.prezime,
        username: req.body.username,
        password: req.body.password,
        slikaPutanja: req.body.slikaPutanja,
        datum: req.body.datum,
        grad: req.body.grad,
        drzava: req.body.drzava,
        email: req.body.email,
        tip: req.body.tip,
        cita:req.body.cita,
        cekanje: req.body.cekanje,
        procitao: req.body.procitao,
        pratioci: req.body.pratioci,
        pracenOdStrane: req.body.pracenOdStrane,
        obavestenja: req.body.obavestenja,
        aktivan: req.body.aktivan,
        poslednjaPrijava: req.body.poslednjaPrijava
    };
    console.log(korisnik);
    db.Korisnici.save(user, function(err,user){
        console.log("USAO U SAVE");
        if(err){
            res.send(err);
        }
        console.log("PROSAO ERR POSLE SAVE-A");
        console.log(user);
        res.json(user);
    });
});

router.post('/resetPassword/:email', function(req, res, next){
    console.log(req.params);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      //port: 587,
      //secure: false, // true for 465, false for other ports
      auth: {
          user: 'stankovicstevan98@gmail.com', // generated ethereal user
          pass: 'skrampfet98'  // generated ethereal password
      },
      //tls:{
        //rejectUnauthorized:false
      //}
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'stankovicstevan98@gmail.com', // sender address
        to: req.params.email, // list of receivers
        subject: 'Reset your password', // Subject line
        text: 'You are receiving this because you(or someone else) have requested the reset of the password of your account.'+
        'Please click on the following link, or paste this into your browser to compleye the proccess of password reset '+
        'http://localhost:4200/resetPassword/'+req.params.email+'\n\n'+
        'If you did not request this, please ignore this email and your password will remain unchanged.'
         // plain text body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        //res.render('contact', {msg:'Email has been sent'});
    });
});

router.get('/searchEmail/:email', function(req, res, next){
    console.log(req.params.email);
    db.Korisnici.find({email: req.params.email}, function(err, user){
        console.log('Search User by this email');
        if(err){
            res.send(err);
        }
        console.log(user);
        res.json(user);
    })
});

router.put('/saveNewPassword/:username',function(req, res, next){
    var user=req.body;
    console.log(req.params.username);
    console.log(req.body);
    //console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, {$set:{password: req.body.password}}, function(err,user){
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

router.get('/getUserByUsername/:username',function(req, res, next){
    db.Korisnici.findOne({username: req.params.username}, function(err, user){
        if(err){
            res.send(err);
        }
        console.log(user);
        res.json(user);
    });
});

router.put('/followUser/:username',function(req, res, next){
    var user=req.body;
    console.log(req.params.username);
    console.log(req.body);
    console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, 
        {$set:{pratioci: typeof(req.body.pratioci) === 'string'?[req.body.pratioci]: req.body.pratioci,}}, function(err,user){
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

router.put('/followedByUser/:username',function(req, res, next){
    var user=req.body;
    console.log("FOLLOWEDBYUSER");
    console.log(req.params);
    console.log(req.body.pracenOdStrane)
    console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, 
        {$set:{pracenOdStrane: typeof(req.body.pracenOdStrane) === 'string'?[req.body.pracenOdStrane]: req.body.pracenOdStrane,}}, function(err,user){
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

router.put('/updateReadBook/:username',function(req, res, next){
    var user=req.body;
    console.log("ADDREADBOOK");
    console.log(req.params);
    console.log(req.body.procitao)
    console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, 
        {$set:{procitao: typeof(req.body.procitao) === 'string'?[req.body.procitao]: req.body.procitao,}}, function(err,user){
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

router.put('/updateReadingBook/:username',function(req, res, next){
    var user=req.body;
    console.log("ADDREADINGBOOK");
    console.log(req.params);
    console.log(req.body.cita)
    console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, 
        {$set:{cita: typeof(req.body.cita) === 'string'?[req.body.cita]: req.body.cita,}}, function(err,user){
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

router.put('/updateWaitingBook/:username',function(req, res, next){
    var user=req.body;
    console.log("ADDWAITINGBOOK");
    console.log(req.params);
    console.log(req.body.cekanje)
    console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, 
        {$set:{cekanje: typeof(req.body.cekanje) === 'string'?[req.body.cekanje]: req.body.cekanje,}}, function(err,user){
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

router.put('/updateNotifications/:username',function(req, res, next){
    var user=req.body;
    console.log("USAO U NOTIFIKACIJE");
    console.log(req.params);
    console.log(req.body.obavestenja+"OBAVESTENJE");
    //console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, {$set:{obavestenja: req.body.obavestenja}}, function(err,user){
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

router.put('/updateLastActivity/:username',function(req, res, next){
    var user=req.body;
    console.log("USAO U NOTIFIKACIJE");
    console.log(req.params);
    console.log(req.body.poslednjaPrijava);
    //console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, {$set:{poslednjaPrijava: req.body.poslednjaPrijava}}, function(err,user){
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

router.put('/updateActiveOrNot/:username',function(req, res, next){
    var user=req.body;
    console.log("USAO U NOTIFIKACIJE");
    console.log(req.params);
    console.log(req.body.aktivan);
    //console.log('Update a user');
    db.Korisnici.updateOne({username: req.params.username}, {$set:{aktivan: req.body.aktivan}}, function(err,user){
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


  

module.exports = router;

//POMOCNE F-JE

router.put('/korisnici/:id', function(req, res, next){
    var user = req.body;
    var updUser={};

    if(user.username){
        updUser.username=user.username;
    }

    if(!updUser){
        res.status(400);
        res.json({
            "error":"Bad Data"
        })
    }
    else{
        db.Korisnici.update({_id:mongojs.ObjectID(req.params.id)}, updUser, {}, function(err, task){//updUser koji treba da se updajt-uje
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }

});



//Dohvati jednog korisnika
router.get('/getUser/:id', function(req, res, next){
    db.Korisnici.findOne({_id:mongojs.ObjectID(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

//Sacuvaj korisnika
router.post('/addUser',function(req, res, next){
    var korisnik= req.body;
    if(!korisnik.username){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    }
    else{
        db.Korisnici.save(korisnik,function(err, user){
            if(err){
                res.send(err);
            }
            res.json(user);
        });
    }
});

//Izbrisi korisnika
router.delete('/deleteUser/:id', function(req, res, next){
    db.Korisnici.remove({_id:mongojs.ObjectID(req.params.id)}, function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

//Azuriraj korisnika
router.put('/korisnici/:id', function(req, res, next){
    var user = req.body;
    var updUser={};

    if(user.username){
        updUser.username=user.username;
    }

    if(!updUser){
        res.status(400);
        res.json({
            "error":"Bad Data"
        })
    }
    else{
        db.Korisnici.update({_id:mongojs.ObjectID(req.params.id)}, updUser, {}, function(err, task){//updUser koji treba da se updajt-uje
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }

});