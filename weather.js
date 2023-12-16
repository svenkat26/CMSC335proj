const express = require('express')
const app = express()

const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '/.env') })  

 
const readline = require('readline');
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:false}));
const { resolve } = require('dns');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://djagoda:mongo20041@cluster0.d9s4xfa.mongodb.net/?retryWrites=true&w=majority';


/* View engine */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.ejs')
app.use(express.static('views'));

/* App */
app.use(express.json())
app.use(express.urlencoded({ extended: false })) 
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({extended:false}))

/* GET Home page */
app.get('/', (req, res) => {
	res.render('homePage')
});

app.post('/submitApplication', async(req, res) => {
  const json_body = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("CMSC335_FinalProject").collection("users").insertOne(json_body);
  res.redirect('/');
});

app.post('/findApplication', async(req, res) => {
  const json_body = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  const query_obj = await client.db("CMSC335_FinalProject").collection("users").findOne(json_body);
  if (query_obj !== null) {
    res.status(200).json(query_obj);
  } else {
    res.status(401).json({ error: "Incorrect username and password combination" });
  }  
});

app.get('/welcomePage', async(req, res) => {
  const firstName = req.query;
  res.render('welcomePage', firstName);
})

/* Get Create Account page */
app.get('/createAccount', (req, res) => {
	res.render('createAccount')
});

/* Terminal */
const PORT = process.argv[2];
app.listen(PORT)
console.log(`Web server started and running at http://localhost:${PORT}`);
console.log("Stop to shutdown the server: ");

process.stdin.on("readable", () => {
    let dataInput = process.stdin.read();
    if (dataInput !== null) {
      if (dataInput.toString().trim() === "stop") {
        console.log("Shutting down the server\n");
        process.exit(0);
      } else {
        console.log(`Invalid command: ${dataInput.toString().trim()}\n`);
      }
      console.log("Stop to shutdown the server: ");
      process.stdin.resume();  
    }
});

module.exports = app