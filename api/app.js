const express = require("express");
const mongoose = require("mongoose");
const { db } = require("./api/models/store");
const cors = require('cors');
const app = express();

const Store = require('./api/models/store')

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); //share with everyone my serponse *
    next(); // go to next endpoints of server
 })


mongoose.connect('mongodb+srv://stason351:UkU0KFY8dPzyIJTX@cluster0.s421y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    limit: '50mb'
}));

app.post("/api/stores", (req, res) => {
  
    let dbStores = [];
    let stores = req.body;

    stores.forEach((store)=> {
        dbStores.push({
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatusText: store.openStatusText,
            addressLines: store.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude
                ]
            }
        })
    });

    Store.create(dbStores, (err, stores) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(stores);
        }
    })

})



app.delete("/api/stores", async (req, res) => {
    
    Store.deleteMany({}, (err) => {
        res.status(200).send(err);
    });

})

app.get("/api/stores", (req, res) => {
    Store.find({}, (err, arr) => {
        if(err) {
            res.status(500).send();
        } else {
            res.status(200).send(arr);
        }
    });
   
})

app.set('port', 3000);



// stason351 UkU0KFY8dPzyIJTX mongoose
app.listen(3000, () => console.log("listening in localhost 3000"));