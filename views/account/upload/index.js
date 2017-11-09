const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
var app = express();

//set storage engine
const storage = multer.diskStorage({
  destination:'./public/uploads',
  filename:function(req,file,cb){
      console.log(file.originalname);
      cb(null,file.originalname+'-'+Date.now()+path.extname(file.originalname));
  }
});
//init upload
const upload = multer({
  storage:storage,
  limits:{
      fileSize:10000000//10M
  }
}).single('myFile');
exports.index = function(req, res, next){
    res.render('account/upload/index');
};

exports.uploader = function(req, res, next){
    upload(req,res,(err)=>{
        if(err){
            console.log(err);
            res.render('index',{
                mes:err
            })
        }else{
                console.log(req.file);
                if(req.file == undefined){
                    res.json({status : 'error', msg : 'fail', data : null});
                }else{
                    res.json({status : true, msg : 'success', data : req.file});
                    //res.render('account/upload/index',{file:req.file})
                }
            }
    });
};

exports.download = function(req, res, next){
    var realpath = 'http://loaclhost:3000/uploads/'+req.params.id;
    var filename = "file.docx"
    res.download(realpath,filename);
};