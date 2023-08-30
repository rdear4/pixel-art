var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');

const TEST_FILENAME = "dear-emily.json"

//Create the test file

let testFileData = {
    "name": "Ron Dear",
    "images": [
        {
            "dimensions": [32, 32],
            "pixelInfo": []
        }
    ],
    "updateLog": [

    ]
}

// Create the first test image data - alternating RGBCyan color sequence

let dummyDataOptions = [
    [255, 0, 0, 255],
    [0, 255, 0, 255],
    [0, 0, 255, 255],
    [0, 255, 255, 255],
]

for (let i = 0; i < 32 * 32; i++) {

    testFileData.images[0].pixelInfo[i] = dummyDataOptions[i % 4]

}

testFileData.updateLog.push(new Date().getTime())

try {
    fs.writeFileSync(`${__dirname}/saved/${TEST_FILENAME}`, JSON.stringify(testFileData))
    return true
  } catch (err) {
    console.log(err)
    return false
  }