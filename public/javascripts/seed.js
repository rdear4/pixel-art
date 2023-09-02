var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createCanvas } = require("canvas")

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


//Create canvas to later use for making images
const canvas = createCanvas(32, 32)
const context = canvas.getContext("2d")
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
        [255, 0, 255, 100],
    ]
    
    for (let i = 0; i < 32 * 32; i++) {
    
        testFileData.images[0].pixelInfo[i] = dummyDataOptions[i % 5]
    
    }
    
    testFileData.updateLog.push(new Date().getTime())
    
    try {
        fs.writeFileSync(`${__dirname}/saved/${filename}.json`, JSON.stringify(testFileData))

        //Create the image file
        for (let i in testFileData.images[0].pixelInfo) {
            
            context.fillStyle = `rgb(${testFileData.images[0].pixelInfo[i][0]}, ${testFileData.images[0].pixelInfo[i][1]}, ${testFileData.images[0].pixelInfo[i][2]} / ${testFileData.images[0].pixelInfo[i][3] / 255.0})`
            context.fillRect(i % 32, Math.floor(i / 32), 1, 1)

            const buffer = canvas.toBuffer("image/png")
            try {
                fs.writeFileSync(`${__dirname}/../images/${filename}-0.png`, buffer)
            } catch (e) {
                console.log(e)
            }
        }
        
        return true
      } catch (err) {
        console.log(err)
        return false
      }

}

for (let file of TEST_FILES) {
    
    createFile(file.name, file.filename)
}
