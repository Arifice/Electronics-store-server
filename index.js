const  express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;

// middlewire
app.use(cors());
app.use(express.json());

// database  user name : ElrctronicsProduct  ; password : vaaMQffwv40Ssfi9




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.meaty0s.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.meaty0s.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection=client.db('productDB').collection('product');
    const userCollection=client.db('productDB').collection('user');
    const cartCollection=client.db('productDB').collection('cart');

    // create product    
    app.post('/product',async(req,res)=>{
      const newProduct=req.body;
      console.log(newProduct);
      const result=await productCollection.insertOne(newProduct);
      res.send(result);
    })

    // read or get product
    app.get('/product',async(req,res)=>{
      const cursor=productCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    // update product
    app.get('/product/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await productCollection.findOne(query);
      res.send(result);
    })

    app.put('/product/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id: new ObjectId(id)};
      const options={ upsert: true};
      const updatedProduct=req.body;
      const product={
        $set:{
          productName:updatedProduct.productName,
          image:updatedProduct.image,
          brandName:updatedProduct.brandName,
          type:updatedProduct.type,
          price:updatedProduct.price,
          description:updatedProduct.description
        }
      }
      const result=await productCollection.updateOne(filter,product,options);
      res.send(result);
    })
    // update login user
    app.patch('/user',async(req,res)=>{
      const user=req.body;
      const filter={email: user.email}; 
      const option={upsert:true};
      const updateDoc={
        $set:{  
          createdAt:user.createdAt,
          lastSignAt:user.lastSignAt,          
          emailVerify:user.emailVerify,
        }        
      }
      const result=await userCollection.updateOne(filter,updateDoc,option);
      res.send(result);
    })
    // delete product
    app.delete('/product/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await productCollection.deleteOne(query);
      res.send(result);
    })


   
    // create user
    app.post('/user', async(req,res)=>{
      const newUser=req.body;
      console.log(newUser);
      const result=await userCollection.insertOne(newUser);
      res.send(result);
    })

    // read or get user
    app.get('/user',async(req,res)=>{
      const cursor=userCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })
    // delete user
    app.delete('/user/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await userCollection.deleteOne(query);
      res.send(result);
    })
    // user update
    app.get('/user/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const result=await userCollection.findOne(query);
      res.send(result);
    })
    app.put('/user/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const option={upsert: true};
      const updateUser=req.body;
      const user={
        $set:{
          name:updateUser.name,
          photo:updateUser.photo,
          email:updateUser.email,
          password:updateUser.password
        }
      }
      const result=await userCollection.updateOne(query,user,option);
      res.send(result);
    })

    // for cart

    // create cart
    app.post('/cart',async(req,res)=>{
      const product=req.body;
      console.log(product);
      const result=await cartCollection.insertOne(product);
      res.send(result);
    })
    // get cart
    app.get('/cart',async(req,res)=>{
      const cursor=cartCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })
    // delete cart   
    
    app.delete('/cart/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: id};
      console.log(id, query);
      const result =await cartCollection.deleteOne(query);
      res.send(result);
    })
    app.delete('/cart',async(req,res)=>{
      const result=await cartCollection.deleteMany({});
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Electronics store server is runmning');
})
app.listen(port, ()=>{
    console.log(`Electronics store server is running on port ${port}`);
})