const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID= require('mongodb').ObjectID;
const bodyParser = require('body-parser');
require ('dotenv').config()


const app = express()
const port = process.env.PORT ||  5000
app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c3tkh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err',err)
  const serviceCollection = client.db("Comripo").collection("service");
  const reviewCollection = client.db("Comripo").collection("review");
  const orderCollection = client.db("Comripo").collection("order");
  const adminCollection = client.db("Comripo").collection("admin");
  
// console.log('database connected successfully')

// order book page
app.post('/addOrder',(req,res)=>{
  const order = req.body;
  console.log('adding new event', order)
  orderCollection.insertOne(order)
  .then(result => {
    console.log('inserted count',result.insertedCount)
    res.send(result.insertedCount > 0)

  })
})
//orderlist page order recive
// app.post('/orders',(req,res) => {
//   orderCollection.find({email:req.query.email})
//   .toArray((err, documents)=>{
//     res.send(documents);
//   })
// })


app.post('/orders', (req, res) => {
  const date = req.body;
  const email = req.body.email;
  adminCollection.find({ email: email })
      .toArray((err, admin) => {
          const filter = { date: date.date }
          if (admin.length === 0) {
              filter.email = email;
          }
          orderCollection.find(filter)
              .toArray((err, documents) => {
                  
                  res.send(documents);
              })
      })
})




//service section page getData
app.get('/services',(req,res) =>{
  serviceCollection.find()
  .toArray((err, items)=>{
    res.send(items)
    
  }) 

})

//service add, admin page
app.post('/addService',(req, res)=>{
  const newReview = req.body;
  console.log('adding new service:',newReview)
  serviceCollection.insertOne(newReview)
  .then(result => {
    console.log('insertedCount',result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})



//review section page getData
app.get('/reviews',(req,res) =>{
  reviewCollection.find()
  .toArray((err, items)=>{
    res.send(items)
    
  }) 

})


//review add, admin page
app.post('/addReview',(req, res)=>{
  const newReview = req.body;
  console.log('adding new service:',newReview)
  reviewCollection.insertOne(newReview)
  .then(result => {
    console.log('insertedCount',result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})



//admin add, admin page
app.post('/addAdmin',(req, res)=>{
  const newAdmin = req.body;
  console.log('adding new service:',newAdmin)
  adminCollection.insertOne(newAdmin)
  .then(result => {
    console.log('insertedCount',result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})




app.delete('/deleteItem/:id',(req, res)=>{

    const id = ObjectID(req.params.id);
    console.log('delete this ',id);
    serviceCollection.findOneAndDelete({_id:id})
  .then(documents => res.send(!!documents.value))
})


app.post('/isAdmin',(req, res)=>{
  const email = req.body.email;
  adminCollection.find({email: email})
  .toArray((err, admin)=>{
    res.send(admin.length > 0);
  })
})



});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})