const express = require('express')
const app = express()

const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '/.env') })  

const uri = 'mongodb+srv://djagoda:mongo20041@cluster0.d9s4xfa.mongodb.net/?retryWrites=true&w=majority';
 
/* Our database and collection */
const databaseAndCollection = { db: "CMSC335_FinalProject", collection: "users"};
const { MongoClient, ServerApiVersion } = require('mongodb')
const client = new MongoClient(uri, {serverApi: ServerApiVersion.v1});

async function main() {
    try {
        await client.connect();
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
}

/* View engine */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.ejs')

/* App */
app.use(express.json())
app.use(express.urlencoded({ extended: false })) 
app.use(express.static(path.join(__dirname, 'public')))

/* GET Home page */
app.get('/', (req, res) => {
	res.render('homePage')
});


/* POST Home Page Data page */
app.post('/homePageData', async (req, res) => {
    
  const { username, password} = req.body;

try {
  await client.connect()
  await insertHomePageData(username, password);

  return res.render('homePageData', {
    username: username,
    password: password,
  });

  } catch (e) {
      console.error(e);

  } finally {
      await client.close();
  }
});

async function insertHomePageData (username, password) {
    
  const result = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection);
  
  await result.insertOne({
      username: password,
      password: password
  });

  await client.close();
}

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