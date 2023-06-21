const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.undypbz.mongodb.net/?retryWrites=true&w=majority`;

// Middleware
app.use(cors());
app.use(express.json());

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
    const services = client.db("photography").collection("services");
    const reviews = client.db("photography").collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const curser = services.find(query);
      const result = await curser.toArray();
      res.send(result);
    });

    // single service API
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // filter services with `new ObjectId(id)`
      const curser = await services.findOne(query); // wait for find the docs
      res.send(curser || []);
    });

    // post single service
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await services.insertOne(service);
      res.send(result);
    });

    // Review Post API
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviews.insertOne(review);
      res.send(result);
    });

    // get single service review
    app.get("/review", async (req, res) => {
      const query = req.query;
      const opitons = {
        sort: { timePosted: -1 },
      };
      const result = await reviews.find(query, opitons).toArray();
      res.send(result);
    });

    // delete review
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviews.deleteOne(query);
      res.send(result);
    });

    // add review
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviews.findOne(query);
      res.send(result);
    });

    app.patch("/review/:id", async (req, res) => {
      const id = req.params.id;
      // create a document which need to update
      const newDoc = {
        $set: {
          ...req.body,
        },
      };
      // create filter for review update
      const filter = { _id: new ObjectId(id) };
      const result = await reviews.updateOne(filter, newDoc);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Base get API
app.get("/", (req, res) => {
  res.send("The server is running");
});

app.listen(port, () => {
  console.log(`Server running on Port:${port}`);
});
