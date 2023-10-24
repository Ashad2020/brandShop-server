// BrandShop
// fJzGLI3lfj1tWau3
const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const productCollection = database.collection("product");
    const userCollection = database.collection("users");
    const cartCollection = database.collection("cart");

    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params;
      const queryBrand = { _id: new ObjectId(id) };
      const brand = await brandCollection.findOne(queryBrand);
      const query = { brand: brand.name };
      const cursor = productCollection.find(query);
      const Products = await cursor.toArray();
      res.send(Products);
    });
    app.get("/product/:id", async (req, res) => {
      console.log(req.params);
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.patch("/product/:id", async (req, res) => {
      const id = req.params;
      const updatedProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          brand: updatedProduct.brand,
          productName: updatedProduct.productName,
          photoUrl: updatedProduct.photoUrl,
          category: updatedProduct.category,
          price: updatedProduct.price,
          description: updatedProduct.description,
          rating: updatedProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // app.get("/user/:id", async (req, res) => {
    //   const id = req.params.id;
    //   // console.log(email);
    //   const query = { uid: id };
    //   const user = await userCollection.findOne(query);
    //   const notFound = { find: "not" };

    //   user ? res.send(user) : res.send(notFound);
    //   console.log(user);
    //   console.log(notFound);
    // });
    // app.post("/user", async (req, res) => {
    //   const user = req.body;
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });
    app.post("/cart", async (req, res) => {
      const user = req.body;
      const result = await cartCollection.insertOne(user);
      res.send(result);
    });
    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { uid: id };
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

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
