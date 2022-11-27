const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/pic/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

let tablename = "userInfo";
let tablename2 = "score";
let tablename3 = "post";
let tablename4 = "comment";
var user;
var email;
var played = 0;
const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "0810169030",
    database: "game"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/checkRegister', async (req,res) => {
    if(req.body.password == req.body.password_confirmed){
        let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),img VARCHAR(100))";
        let result = await queryDB(sql);
        let checksql = `SELECT id,email FROM ${tablename}`;
        let checkEmail = await queryDB(checksql);
        checkEmail = Object.assign({},checkEmail);
        var keyCheck = Object.keys(checkEmail);
        for(i=0;i<keyCheck.length;i++){
            if(req.body.email == checkEmail[keyCheck[i]]["email"] ){
                return res.redirect("register.html?error=2");
            }
        }
        sql = `INSERT INTO userInfo (username, email,password,img) VALUES ("${req.body.username}", "${req.body.email}","${req.body.password}","${"avatar.png"}")`;
        result = await queryDB(sql);
        console.log("New record created successfullyone");
        return res.redirect('login.html');
    }
    else{
        return res.redirect("register.html?error=1");
    }
})

app.post('/profilepic', (req,res) => {
    let upload = multer({storage: storage,fileFilter:imageFilter}).single('avatar');
    upload(req,res,(err)=>{
        if(req.fileValidationError){
            return res.send(req.fileValidationError);
        }
        else if(!req.file){
            return res.send('Please select an image to upload');
        }
        else if(err instanceof multer.MulterError){
            return res.send(err);
        }
        else if(err){
            return res.send(err);
        }
        updateImg(user,req.file.filename);
            //res.clearCookie('img');
        res.cookie('img',req.file.filename);
        return res.redirect('profile.html');
    })

})

const updateImg = async (username, filen) => {
    let sql = `UPDATE ${tablename} SET img = '${filen}' WHERE username = '${username}'`;
    let result = await queryDB(sql);
    console.log(result);
    return new Promise((resolve,reject) => {
        resolve(result);
    })
}
app.post('/startSelectLevel',(req,res)=>{
        res.cookie('level',req.body.Level);
        console.log(req.body.Level);
        return res.redirect('gameplay.html');
})
//ทำให้สมบูรณ์
app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    res.clearCookie('level');
    res.clearCookie('score');
    res.clearCookie('id');
    res.clearCookie('email');
    return res.redirect('login.html');
})

//ทำให้สมบูรณ์
app.get('/readPost', async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS post (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, user VARCHAR(255),message VARCHAR(255),score VARCHAR(255),img VARCHAR(255),level VARCHAR(255),video VARCHAR(255),likes INT,commentactive INT)";
    let result = await queryDB(sql);
    sql = `SELECT id, user,message,score,img,level,video,likes,commentactive FROM ${tablename3}`;
    result = await queryDB(sql);
    result = Object.assign({},result);
    console.log(result);
    res.json(result);
    console.log("Readed");
    //res.json(result);
})
//ทำให้สมบูรณ์
app.post('/writePost',async (req,res) => {
    sql = `INSERT INTO Post (user, message , score,img,level,video,likes,commentactive) VALUES ("${req.body.user}", "${req.body.message}","${req.body.score}","${req.body.img}","${req.body.level}","${req.body.video}","${0}","${0}")`;
    result = await queryDB(sql);
    console.log("Posted");
    result = Object.assign({},result);
    res.json(result);
})
app.get('/readComment', async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS comment (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP,post INT, user VARCHAR(255),message VARCHAR(255),img VARCHAR(255))";
    let result = await queryDB(sql);
    sql = `SELECT id, post,user,message,img FROM ${tablename4}`;
    result = await queryDB(sql);
    result = Object.assign({},result);
    console.log(result);
    res.json(result);
    console.log("Readed Commento");
    //res.json(result);
})
app.post('/writecomment',async (req,res) => {
    let sql = `INSERT INTO Comment (post,user,message,img) VALUES ("${req.body.Boxid3}","${req.body.Boxname}", "${req.body.postMsg}","${req.body.Boximg}")`;
    let result = await queryDB(sql);
    console.log("Posted Commento");
    result = Object.assign({},result);
    res.redirect("feed.html");
})
app.get('/readranking',async(req,res)=>{
    let sql = `SELECT id,user,score,level FROM ${tablename3}`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    res.json(result);
})
app.post('/selectrankinglevel',(req,res)=>{
    res.cookie('rankLevel',req.body.Level);
    console.log(req.body.Level);
    return res.redirect('ranking.html');
})
app.post('/like',async(req,res)=>{
    let sql2 = `SELECT id, likes FROM ${tablename3}`;
    let result2 = await queryDB(sql2);
    result2 = Object.assign({},result2);
    var keyData2 = Object.keys(result2);
    for(i=0;i<keyData2.length;i++){
        if(req.body.Boxid == result2[keyData2[i]]["id"]){
                let sql = `UPDATE ${tablename3} SET likes = '${result2[keyData2[i]]["likes"]+1}' WHERE id = '${req.body.Boxid}'`;
                result = await queryDB(sql);
                console.log("liked");
                result = Object.assign({},result);
                res.redirect("feed.html");
        }
    }
  
})
app.post('/comment',async(req,res)=>{
    let sql2 = `SELECT id, commentactive FROM ${tablename3}`;
    let result2 = await queryDB(sql2);
    result2 = Object.assign({},result2);
    var keyData2 = Object.keys(result2);
    for(i=0;i<keyData2.length;i++){
        if(req.body.Boxid2 == result2[keyData2[i]]["id"]){
                if(result2[keyData2[i]]["commentactive"] == 0){
                    let sql = `UPDATE ${tablename3} SET commentactive = '${1}' WHERE id = '${req.body.Boxid2}'`;
                    result = await queryDB(sql);
                    result = Object.assign({},result);
                    res.redirect("feed.html");
                }
                else if(result2[keyData2[i]]["commentactive"] == 1){
                    let sql = `UPDATE ${tablename3} SET commentactive = '${0}' WHERE id = '${req.body.Boxid2}'`;
                    result = await queryDB(sql);
                    result = Object.assign({},result);
                    res.redirect("feed.html");
                }
 
        }
    }
})
//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
    let sql = `SELECT id, email,username, password,img FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    var keyData = Object.keys(result);
    for(i = 0;i<keyData.length;i++){
        if(req.body.email == result[keyData[i]]["email"]&&req.body.password == result[keyData[i]]["password"]){
            res.cookie('email',result[keyData[i]]["email"]);
            res.cookie('username',result[keyData[i]]["username"]);
            req.body.img = result[keyData[i]]["img"];
            res.cookie('img',req.body.img);
            email = result[keyData[i]]["email"];
            user = result[keyData[i]]["username"];
            console.log("correct");
            return res.redirect('start.html');
        }
    }
    return res.redirect('login.html?error=1');
})


app.post('/profilename',(req,res)=>{
    updateName(email,req.body.newusername);
    res.cookie('username',req.body.newusername);
    return res.redirect('profile.html');
})
const updateName = async (email, username) => {
    let sql = `UPDATE ${tablename} SET username = '${username}' WHERE email = '${email}'`;
    let result = await queryDB(sql);
    console.log(result);
    return new Promise((resolve,reject) => {
        resolve(result);
    })
}
app.post('/getscore',async(req,res)=>{
    let sql = "CREATE TABLE IF NOT EXISTS score (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, user VARCHAR(255),score VARCHAR(255),level VARCHAR(255))";
    let result = await queryDB(sql);
    sql =`INSERT INTO score (user, score,level) VALUES ("${req.body.user}", "${req.body.score}","${req.body.level}")`;
    result = await queryDB(sql);
    result = Object.assign({},result);
    played += 1;
    let sql2 = `SELECT id,user,score FROM ${tablename2}`;
    let result2 = await queryDB(sql2);
    result2 = Object.assign({},result2);
    var keyData = Object.keys(result2);
    res.cookie('id',result2[keyData[played-1]]["id"]);
    res.cookie('score',req.body.score);
    console.log(played);
    res.json(result);
})
app.get('/uploadvideo',async(req,res)=>{
    let upload = multer({storage: storage}).single('avatar');
    res.json(upload);
})
app.post('/uploadvideo2', (req,res) => {
    let upload = multer({storage: storage}).single('avatar');
    upload(req,res,(err)=>{
        if(req.fileValidationError){
            return res.send(req.fileValidationError);
        }
        else if(!req.file){
            return res.send('Please select an image to upload');
        }
        else if(err instanceof multer.MulterError){
            return res.send(err);
        }
        else if(err){
            return res.send(err);
        }
            //res.clearCookie('img');
        res.cookie('video',req.file.filename);
        return res.redirect('feed.html');
    })

})
const updateVideo = async (username, filen) => {
    let sql = `UPDATE ${tablename3} SET video = '${filen}' WHERE id = '${username}'`;
    let result = await queryDB(sql);
    console.log(result);
    return new Promise((resolve,reject) => {
        resolve(result);
    })
}
 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/index.html`);
});
