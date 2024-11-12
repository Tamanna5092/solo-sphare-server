const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 9000;

const app = express();

const corsOperation = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credential: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOperation));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abrfq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    
    const jobCollection = client.db('SoloSphare').collection('jobs')
    const bidsCollection = client.db('SoloSphare').collection('bids')

// get all jobs data from db
app.get("/jobs", async (req, res) => {
  const result = await jobCollection.find().toArray()
  res.send(result)
});

// get single job data from db using id
app.get("/job/:id", async (req, res) => {
  const id =req.params
  const query = {_id: new ObjectId(id)}
  const result = await jobCollection.findOne(query)
  res.send(result)
})


// save a bid data in db
app.post('/bid', async(req, res) => {
  const bidData = req.body
  const result = await bidsCollection.insertOne(bidData)
  res.send(result)
})

// save a job data in db
app.post('/job', async(req, res) => {
  const jobData = req.body
  const result = await jobCollection.insertOne(jobData)
  res.send(result)
})

// get all jobs posted by a apecific user
app.get('/jobs/:email', async (req, res) => {
  const email =req.params.email
  const query = {'buyer.email': email}
  const result = await jobCollection.find(query).toArray()
  res.send(result)
})

// delete a job data from db
app.delete('/job/:id', async (req, res) => {
  const id =req.params.id
  const query = { _id : new ObjectId(id)}
  const result = await jobCollection.deleteOne(query)
  res.send(result)
})



    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Solo Sphare server");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
