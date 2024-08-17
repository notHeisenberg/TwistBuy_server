const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 3000;


const allowedOrigins
    = [
        'https://twist-buy-b2a12.web.app'
        , 'http://localhost:5173'
    ];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pgsiu4c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const userCollection = client.db("twistBuy").collection("users")
        const productsCollection = client.db("twistBuy").collection("products");



        // middlewares 
        const verifyToken = (req, res, next) => {
            // console.log('inside verify token', req.headers.authorization);
            if (!req.headers.authorization) {
                return res.status(401).send({ message: 'unauthorized access' });
            }
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ message: 'unauthorized access' })
                }
                req.decoded = decoded;
                next();
            })
        }

        // jwt related api
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token });
        })

        // users related api
        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log(user)
            // insert email if user doesnt exists: 
            // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // Product related API with pagination
        app.get('/products', async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;

                const filters = {};

                // Apply search filter
                if (req.query.search) {
                    filters.name = { $regex: req.query.search, $options: 'i' };
                }

                // Apply category filter
                if (req.query.category) {
                    filters.category = req.query.category;
                }

                // Apply brand filter
                if (req.query.brand) {
                    filters.brand = req.query.brand;
                }

                // Apply price range filter
                if (req.query.minPrice && req.query.maxPrice) {
                    filters.price = {
                        $gte: parseFloat(req.query.minPrice),
                        $lte: parseFloat(req.query.maxPrice),
                    };
                }

                const productsCollection = client.db("twistBuy").collection("products");

                // Count the total number of filtered products
                const totalFilteredProducts = await productsCollection.countDocuments(filters);

                // Get the filtered products and apply pagination
                const filteredProducts = await productsCollection.find(filters)
                    .skip(skip)
                    .limit(limit)
                    .toArray();

                res.send({
                    products: filteredProducts,
                    totalProducts: totalFilteredProducts,
                    totalPages: Math.ceil(totalFilteredProducts / limit),
                    currentPage: page,
                });
            } catch (error) {
                res.status(500).send({ message: 'Failed to fetch products', error });
            }
        });


        app.get('/featured', async (req, res) => {
            try {
                const featuredProducts = await productsCollection.find({ isFeatured: true }).toArray();
                res.send({ products: featuredProducts });
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch featured products' });
            }
        });
        

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('TwistBuy is running')
})

app.listen(port, () => {
    console.log(`Teist Buy is running on port ${port}`);
})