const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ky76see.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const volunteerCollection = client.db("volunteerDB").collection("event");

    // search by title
    app.get("/searchByTitle/:text", async (req, res) => {
      const searchText = req.params.text;
      const result = await volunteerCollection
        .find({
          $or: [
            {
              title: { $regex: searchText, $options: "i" },
            },
          ],
        })
        .toArray();
      res.send(result);
    });

    // routes for get data
    app.get("/posts", async (req, res) => {
      const cursor = await volunteerCollection.find().toArray();
      res.send(cursor);
    });

    app.post("/posts", async (req, res) => {
      res.send(await volunteerCollection.insertOne(req.body));
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("volunteer server is running");
});

app.listen(port, () => {
  console.log(`volunteer server running on port: ${port}`);
});
