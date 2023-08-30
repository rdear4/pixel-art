var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEST_FILES = [
    {
        name: "Ron Dear",
        filename: "dear-ron"
    },
    {
        name: "Thomas Dear",
        filename: "dear-thomas"
    },
    {
        name: "Emily Dear",
        filename: "dear-emily"
    }
]



//Create the test file

const createFile = (name, filename) => {
    
    let testFileData = {
        
        "name": name,
        "images": [
            {
                "id": uuidv4(),
                "name": "Image - 1",
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
        fs.writeFileSync(`${__dirname}/saved/${filename}.json`, JSON.stringify(testFileData))
        return true
      } catch (err) {
        console.log(err)
        return false
      }

}

for (let file of TEST_FILES) {
    
    createFile(file.name, file.filename)
}
