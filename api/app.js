const express = require("express");
const mongoose = require("mongoose");
const app = express();
const GoogleMapsService = require('./api/services/googleMapsService')
const Store = require('./api/models/store');
require('dotenv').config();

const googleMapsService = new GoogleMapsService();

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); //share with everyone my serponse *
    next(); // go to next endpoints of server
 })

console.log(process.env.DB_API_KEY);
mongoose.connect(`mongodb+srv://stason351:${process.env.DB_API_KEY}@cluster0.s421y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
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
    const zipCode = req.query.zip_code;
    googleMapsService.getCoordinates(zipCode)
   .then(coordinates => {
        Store.find({
            location: {
                $near: {
                        $maxDistance: 3218,
                        $geometry: {
                            type: "Point",
                            coordinates: coordinates,
                        }
                },
            }
        }, (err, stores) => {
            if(err) {
                res.status(500).send();
            } else {
                res.status(200).send(stores);
            }
        })
    })
    .catch(err => console.log(err))
})

app.set('port', 3000);
app.listen(3000, () => console.log("listening in localhost 3000"));