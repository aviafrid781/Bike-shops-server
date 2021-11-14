const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zoeq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//console.log(uri)

async function run() {
    try {
        await client.connect();
        // console.log(' DataBase connection succesfully');
        const database = client.db('bike-shop');
        const productsCollection = database.collection('products');

        const usersCollection = database.collection('users');
        const topProductsCollection = database.collection('topProducts');
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('reviews');


        //get topProducts multiple 
        app.get('/topProducts', async (req, res) => {
            const cursor = topProductsCollection.find({});
            const topProducts = await cursor.toArray();
            res.send(topProducts);

        })

        //Get topProducts single API
        app.get('/topProducts/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) };
            const topProduct = await topProductsCollection.findOne(query);
            res.json(topProduct);


        })



        //get MoreProducts multiple 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);

        })
        //Get  More products single API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);


        })
        //Post Method for add new Products
        app.post('/products', async (req, res) => {

            const products = req.body;
            console.log('hit the post order api', products);

            const result = await productsCollection.insertOne(products);;
            console.log(result);
            res.json(result);
        });
        //delete single products api  from  more products 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);

        });



        //order POST API
        app.post('/orders', async (req, res) => {

            const order = req.body;
            console.log('hit the post order api', order);

            const result = await ordersCollection.insertOne(order);;
            console.log(result);
            res.json(result);
        });

        //get multiple oder Api
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const order = await cursor.toArray();
            res.send(order);

        })

        //get single order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) };
            const orders = await ordersCollection.findOne(query);
            res.json(orders);


        })

        //delete order  API 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);

        });










        //Reviews post 
        app.post('/reviews', async (req, res) => {

            const reviews = req.body;
            console.log('hit the post order api', reviews);

            const result = await reviewsCollection.insertOne(reviews);;
            console.log(result);
            res.json(result);
        });


        //get Reviews multiple 
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);

        })






        //cheaking user email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }

            res.json({ admin: isAdmin });

        })
        //post user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });


        // users double cheak 
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;

            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        })

    }
    finally {
        //await client.close();   
    }

}
run().catch(console.dir);




app.get('/', (req, res) => {

    res.send('Bikeshop Servar is running')
})

app.listen(port, () => {
    console.log(`listening is ${port}`)
})