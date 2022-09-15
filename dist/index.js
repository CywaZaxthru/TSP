const findRoute = require('./RoutingAlgorithm/start');
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;
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
        let deliveryRoute = await findRoute(arrayOfLocations);
        let answer = {
            "Route": deliveryRoute
        };
        res.json(answer);
    }
});
//Other Endpoints do not exist
app.route(/.*/).all((req, res) => {
    res.json({
        "Error": "Endpoint does not exist"
    });
});
app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});
