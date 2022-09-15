const findRoute = require('./RoutingAlgorithm/start');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT
app.use(express.json());
//api Endpoint
app.post('/api', async (req, res) => {
   
    let arrayOfLocations = req.body.locations;
    if (!Array.isArray(arrayOfLocations)) {
        res.json({ "Error": "Wrong Data Format" });
    }
    else if (!arrayOfLocations.every(element => typeof element === "string")) {
        res.json({ "Error:": "Could not understand Address" });
    }
    else {
        //Calculating Delivery Route
       console.log('searching Route');
        let deliveryRoute = await findRoute(arrayOfLocations);
       console.log('found Route');
        let answer = {
            "Route": deliveryRoute
        };
       console.log(answer);
        res.json(answer);
    }
})
//Other Endpoints do not exist
app.route(/.*/).all((req, res) => {
    res.json({
        "Error": "Endpoint does not exist"
    });
});
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
