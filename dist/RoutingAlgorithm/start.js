import fetch from 'node-fetch'

async function iniateFindingRoute(locationStringArray) {
    let costArray = new Array(locationStringArray.length).fill(0).map(() => new Array(locationStringArray.length));
    //Filling Array with cost of Routes
    costArray = await fillSquare(costArray, locationStringArray);
    //calculating Route
    let route = calculateRoute(costArray);
    return route;
}
function calculateRoute(weightMatrix) {
    let fullPath;
    //finding the shortest path for any combination of 2 locations
    //meaning the path from location 0 to 1
    let shortest = [0, 1];
    for (let i = 0; i < weightMatrix.length; i++) {
        for (let j = i + 1; j < weightMatrix.length; j++) {
            if (weightMatrix[i][j] < weightMatrix[shortest[0]][shortest[1]]) {
                shortest = [i, j];
            }
        }
    }
    fullPath = shortest;
    //finding the remaining Path
    while (fullPath.length < weightMatrix.length) {
        let currentStart = fullPath[fullPath.length - 1];
        let currentDestination = undefined;
        for (let i = 0; i < weightMatrix[0].length; i++) {
            if (!weightMatrix[currentStart][i] || fullPath.indexOf(i) != -1) {
                continue;
            }
            else {
                if (currentDestination === undefined) {
                    currentDestination = i;
                }
                if (weightMatrix[currentStart][i] < weightMatrix[currentStart][currentDestination]) {
                    currentDestination = i;
                }
            }
        }
        fullPath.push(currentDestination);
    }
    return fullPath;
}
async function fillSquare(emptySquare, addressArray) {
    let promises = [];
    for (let i = 0; i < emptySquare.length; i++) {
        for (let j = i + 1; j < emptySquare[0].length; j++) {
            if (!emptySquare[i][j]) {
                promises.push(calculateTravelTime(addressArray[i], addressArray[j]));
            }
        }
    }
    let travelTimes = await Promise.all(promises);
    let tavelTimesIndex = 0;
    for (let i = 0; i < emptySquare.length; i++) {
        for (let j = 0; j < emptySquare.length; j++) {
            if (!emptySquare[i][j] && i < j) {
                emptySquare[i][j] = travelTimes[tavelTimesIndex];
                emptySquare[j][i] = emptySquare[i][j];
                tavelTimesIndex++;
            }
        }
    }
    return emptySquare;
}
async function calculateTravelTime(start, destination) {
    const KEY = "AkQhNv7SE_-O8cXIsFiTiQcS82xr3PwK7tMd2kq0G6GHzWBCChZkMr-lq04Dzwwv";
    const URL = "https://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=" + start + "&viaWaypoint.2=" + start + "&waypoint.3=" + destination + "&optimize=time&distanceUnit=km&key=" + KEY;
    const config = {
        method: "GET"
    };
    return fetch(URL, config).then((data) => { return data.json(); }).then((data) => { return data.resourceSets[0].resources[0].travelDuration; });
}
module.exports = iniateFindingRoute;
