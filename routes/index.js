var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createCanvas } = require("canvas")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("api")
});

router.get("/saved", (req, res) => {

  //Get all the saved files from disk. Return list of names
  try {
    let files = fs.readdirSync(`${__dirname}/../public/javascripts/saved/`)
    res.json(files.map((e, i) => e.split(".")[0]))
  } catch (e) {
    console.log(e)
    res.send("ERROR")
  }

})

router.get("/images", (req, res) => {

  //Get all the saved files from disk. Return list of names

  try {
    
    let fileData = JSON.parse(fs.readFileSync(`${__dirname}/../public/javascripts/saved/${req.query.name}.json`))
    res.json(fileData)
  } catch (e) {
    console.log(e)
    res.send("ERROR")
  }

})

const createSaveFile = (name, filePath, filename) => {

  let newSaveFileData = {
    "filename": filename,
    "name": name,
    "images": [
        
    ],
    
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(newSaveFileData))
    return true
  } catch (e) {
    console.log(e)

    return false
  }

}


const getUserSaveData = (nameComponents) => {

  let filenameToCheck = `${nameComponents[1].toLowerCase()}-${nameComponents[0].toLowerCase()}`
  let filePath = `${__dirname}/../public/javascripts/saved/${filenameToCheck}.json`
  try {
    fs.accessSync(filePath)
    console.log("File exists!")
  } catch (e) {
    console.log("File does not exist")
    //Create the file
    createSaveFile(`${nameComponents[0]} ${nameComponents[1]}`, filePath, filenameToCheck)
  }

  //Read the save file and return

  return JSON.parse(fs.readFileSync(filePath))
}

const addNewImageToSave = (saveData) => {

  let newImageData = {
    id: uuidv4(),
    name: "",
    dimensions: [32, 32],
    pixelInfo: new Array(32*32).fill([255, 0, 0, 255]),
    "log": [
        {
            "time": new Date().getTime(),
            "note": "File Created"
        }
    ]

  }

  let saveFileData = {...saveData, images: [...saveData.images, newImageData]}

  try {
    fs.writeFileSync(`${__dirname}/../public/javascripts/saved/${saveData.filename}.json`, JSON.stringify(saveFileData))
    //Create the tmp img file

    createTmpImage(`${saveData.filename}-${saveFileData.images.length-1}.png`)
    return saveFileData
  } catch (e) {
      console.log(e)
      return saveData
  }

}


router.post("/image/new", (req, res) => {

  //Make sure that there is a name with a space
  try {
    let newUserName = req.body.name
    let nameComponents = newUserName.split(" ")

    let userData = getUserSaveData(nameComponents)
    
    //Add new image to the file data
    userData = {...addNewImageToSave(userData)}

    // console.log(`There are now ${userData.images.length} images`)

    //Send back the new image id

    res.json({imgId: userData.images[userData.images.length-1].id})


  //   if (getUserSaveData()) {
  //     console.log("Good to go")
  //     //Create the new save file
  //     if (createSaveFile(`${nameComponents[0]} ${nameComponents[1]}`, filenameToCheck)) {
  //       res.status(200).send("New User created")
  //     } else {
  //       res.status(500).send("Error creating new save file")
  //     }
      
  //   } else {
  //     res.status(400).send("Error")
  //   }
  // } catch (e) {
  //   console.log(e)
  //   res.status(500).json({errorMessage: e})
  // }

  } catch (e) {
    console.log(e)
    res.status(500).json({error: e})
  }

  
})

const createTmpImage = (filename) => {

  const canvas = createCanvas(32, 32)
  const context = canvas.getContext("2d")

  for (let i = 0; i < 32*32; i++) {

    let color = (i % 2 === 0) ? `rgb(255, 0, 255 / 255.0})` : `rgb(255, 0, 0 / 255.0})`
    context.fillStyle = color
    context.fillRect(i % 32, Math.floor(i / 32), 1, 1)

  }

  const buffer = canvas.toBuffer("image/png")
  try {
      fs.writeFileSync(`${__dirname}/../public/images/${filename}`, buffer)
  } catch (e) {
      console.log(e)
  }

}


module.exports = router;
