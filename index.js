// BrandShop
// fJzGLI3lfj1tWau3
const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://BrandShop:fJzGLI3lfj1tWau3@cluster0.abv0rui.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
    const database = client.db("shopDB");
    const brandCollection = database.collection("brand");

    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    /* 
    const one = {
      name: "Panasonic",
      img: "https://i.ibb.co/BszPWWF/Panasonic.jpg",
    };
   
    async function insertBrand() {
      const result = await brandCollection.insertOne(one);
    }
    insertBrand();
    */
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
// app.get("/", (req, res) => {
//   res.send("I am live");
// });

app.listen(port, () => {
  console.log("I am listening on port", port);
});