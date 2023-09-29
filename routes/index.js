var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createCanvas } = require("canvas");
const { runInContext } = require('vm');

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

router.put("/image/:user", (req, res) => {
  console.log(req.params.user)
  console.log(req.body)

  //Read the save file
  let fileInfo = JSON.parse(fs.readFileSync(`${__dirname}/../public/javascripts/saved/${req.params.user}.json`))

  // console.log(fileInfo)

  fileInfo.images.find((el, i) => {
    if (el.id === req.body.id) {
      console.log("Foudn!")
      console.log(i)
      fileInfo.images[i] = {...req.body}

      try {
        fs.writeFileSync(`${__dirname}/../public/javascripts/saved/${req.params.user}.json`, JSON.stringify(fileInfo))
        
        //Update Image
        updateImage(`${req.params.user}-${i}.png`, req.body.pixelInfo)
        res.send("Good")
      } catch (e) {
        console.log(e)
        res.send("Fail")
      }

    }
  })

  
  
  

})

router.get("/imageData", (req, res) => {

  console.log(req.query.id)
  console.log(req.query.name)

  try {
    let saveData = JSON.parse(fs.readFileSync(`${__dirname}/../public/javascripts/saved/${req.query.name}.json`))

    let imageData = saveData.images.filter((img, i) => img.id === req.query.id)

    console.log(imageData[0])

    res.json(imageData[0])
  } catch (e) {
    res.status(500).json({err: e})
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
    pixelInfo: new Array(32*32).fill([255, 255, 255, 0]),
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
    console.log(userData)
    // console.log(`There are now ${userData.images.length} images`)

    //Send back the new image id

    res.json({imgId: userData.images[userData.images.length-1].id, userName: userData.filename})

  } catch (e) {
    console.log(e)
    res.status(500).json({error: e})
  }

  
})

router.get("/random", (req, res) => {

  try {
    let files = fs.readdirSync(`${__dirname}/../public/javascripts/saved/`)
    let rndFileNumber = Math.floor(Math.random() * files.length)
    
    //Read rndFileData
    let saveFile = JSON.parse(fs.readFileSync(`${__dirname}/../public/javascripts/saved/${files[rndFileNumber]}`))
    // let saveFile = JSON.parse(fs.readFileSync(`${__dirname}/../public/javascripts/saved/dear-ron.json`))

    let rndImgNumber = Math.floor(Math.random() * saveFile.images.length)
    //console.log(`Length: ${saveFile.images.length} - Rnd Num: ${rndImgNumber}`)
    // console.log(saveFile.name)
    let returnObj = {
      studentName: saveFile.name,
      title: saveFile.images[rndImgNumber].name,
      data: saveFile.images[rndImgNumber].pixelInfo
    }
    // let imageData = rndFile.images[Math.floor(Math.random() * rndFile.images.length)]

    res.json(returnObj)
  } catch (e) {
    console.log(e)
    res.send("ERROR")
  }

})

const updateImage = (filename, pixelData) => {
  console.log(`${filename} ${pixelData.length}`)
  const canvas = createCanvas(32*20, 32*20)
  const context = canvas.getContext("2d")

  for (let i = 0; i < 32*32; i++) {

    //let color = (i % 2 === 0) ? `rgb(0, 0, 0 / 255.0})` : `rgb(0, 0, 0 / 255.0})`
    let color = `rgba(${pixelData[i][0]}, ${pixelData[i][1]}, ${pixelData[i][2]} / ${pixelData[i][3]})`
    // console.log(color)
    context.fillStyle = color
    context.fillRect((i % 32) * 20, (Math.floor(i / 32)) * 20, 20, 20)

  }

  const buffer = canvas.toBuffer("image/png")
  try {
      fs.writeFileSync(`${__dirname}/../public/images/app/${filename}`, buffer)
  } catch (e) {
      console.log(e)
  }

}

const createTmpImage = (filename) => {

  const canvas = createCanvas(32, 32)
  const context = canvas.getContext("2d")

  for (let i = 0; i < 32*32; i++) {

    let color = (i % 2 === 0) ? `rgb(0, 0, 0 / 255.0})` : `rgb(0, 0, 0 / 255.0})`
    context.fillStyle = color
    context.fillRect(i % 32, Math.floor(i / 32), 1, 1)

  }

  const buffer = canvas.toBuffer("image/png")
  try {
      fs.writeFileSync(`${__dirname}/../public/images/app/${filename}`, buffer)
  } catch (e) {
      console.log(e)
  }

}


module.exports = router;
