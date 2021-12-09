var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine','ejs');


var conn = mysql.createConnection({
    
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});

conn.connect(function(err){
    if(err) throw err;
    console.log('connected successfully!!!!!!!')
    
})
app.get('/', function(req, res){
    res.render('insert');
});
app.post('/insert', function(req,res){
    var name= req.body.name;
    var email= req.body.email;
    var password= req.body.password;

    var sql=`insert into users(user_name, user_email, user_password) values('${name}','${email}','${password}')`;
    conn.query(sql, function(err, results){
        if(err) throw err;
        res.send("<h1>data sent....</h1>")
    });
});
app.get('/show', function(req,res){
    var sql=`select * from users`;
    conn.query(sql, function(err,results){
        if(err) throw err;
        res.render('show', {users: results})
    })
    
});
app.get('/delete/:id', function(req, res){
    var id = req.params.id;
    var sql=`delete from users where user_id='${id}'`;
    conn.query(sql, function(err,results){
        if(err) throw err;
        res.redirect('/show');
    });
});

app.get('/edit/:id',function(req,res){
    var id= req.params.id;
    var sql = `select * from users where user_id='${id}'`;
    conn.query(sql, function(err, results){
        if(err) throw err;
        res.render('edit', {users: results});
    });
});

app.post('/update/:id', function(req, res){
   
   var id = req.params.id;
    var name= req.body.name;
    var email= req.body.email;
    var password= req.body.password;

    var sql=`update users set user_name='${name}', user_email='${email}', user_password='${password}' where user_id='${id}'`;
    conn.query(sql, function(err, results){
        if(err) throw err;
        res.redirect('/show');
    });
})
app.listen(process.env.PORT || 3306);