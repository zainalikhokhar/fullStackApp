const express = require("express")
const app = express()
const mysql = require("mysql")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const path = require("path")
const ejs = require("ejs")
var cookieSession = require('cookie-session')
const e = require("express")
const {DateTime} = require("luxon")


app.use(express.static("resources"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
    name: 'session',
    secret: '93uenlasid91ccnjeakdJL#LU)@C(U@OJCWWl0q9uo,jl',
    maxAge: 24* 60 * 60 * 1000,
  }))
app.set("view engine","ejs")

const authenticateMiddleware = (req, res, next) => {
    if (req.session.hasOwnProperty("user_id") && req.session.hasOwnProperty("user_name")) {
        next()
    }
    else res.redirect("/login.html")
}


const con = mysql.createConnection({
    user: "root",
    password: "zain1234",
    host: "localhost",
    database: "first_db"
})

con.connect((err)=>{
    if (err) throw err;
    else console.log("Connected to MySQL successfully.")
})

app.get("/", (req,res)=>{
    con.query(`INSERT INTO Users (name,email) VALUES ('${req.query.name}', '${req.query.email}')`, (err, result)=>{
        if (err) res.send("An error has occured");
        else res.send("Hello World")
    })
})

app.post("/signup", (req,res)=>{
    // SALTING in Hashing Passwords
    bcrypt.hash(req.body.password, 10, (err, hashed_password)=>{
        if (err) throw err;
        con.query(`INSERT INTO Users (name,email,password) VALUES ('${req.body.full_name}', '${req.body.email}', '${hashed_password}')`, (err, result)=>{
            if (err) res.send("An error has occured");
            else res.send("Sign Up Successful")
        })
    })
})

app.post("/login", (req,res)=>{
    const email = req.body.email
    const text_password = req.body.password
    con.query(`SELECT id, name, password FROM Users WHERE email='${email}'`, (err, results)=>{
        if (err) res.sendStatus(500)
        else {
            const correct_password_hash = results[0].password
            bcrypt.compare(text_password, correct_password_hash, (err, comparison_result)=>{
                if (err) throw err
                if (comparison_result) {
                    req.session.user_id = results[0].id
                    req.session.user_name = results[0].name
                    res.redirect("/feed")
                }
                else res.sendStatus(401)
            })
        }
    })
})

app.get("/logout", authenticateMiddleware,(req,res)=>{
    req.session = null
    res.redirect("/login.html")
})

app.get("/myprofile", authenticateMiddleware, (req,res)=>{
    res.render("myprofile.ejs" ,{
        name: req.session.user_name
    })
})


app.get("/feed",(req,res)=>{
    res.render("feed.ejs",{
        name: req.session.user_name,
        user_id : req.session.user_id
    })
})


// sql injections
app.post("/post/new",authenticateMiddleware,(req,res)=>{

    if (req.body.hasOwnProperty("content") && req.body.content !=""){
        con.query("INSERT INTO Posts (content,user_id) VALUE (?,?)", [req.body.content, req.session.user_id], (err,result)=>{
            if (err) res.sendStatus(500)
            else res.sendStatus(201)
        })
    }
    else {
        res.sendStatus(400)
    }
    
})

app.post("/deletePost",(req,res)=>{
    // console.log("in server", req.body.deleteId)
    con.query("delete from Posts where id=(?)", [req.body.deleteId], (err,result)=>{
        if (err) res.sendStatus(500)
        else res.sendStatus(201)})
})

app.get("/post/all",authenticateMiddleware,(req,res)=>{
    con.query("select Posts.id, Posts.content, Posts.date_posted, Users.name, Users.id AS user_id from Posts inner join Users ON Posts.user_id=Users.id", (err,result)=>{
        if (err) res.sendStatus(500)
        else{
            const final = result.map(post =>{
                post.date_posted = DateTime.fromJSDate(post.date_posted).toFormat('dd LLL yyyy')
                return post
            });
            res.json(final)
        }
    })
})
app.listen(5000, ()=>{
    console.log("Server listening on port 3000.")
})