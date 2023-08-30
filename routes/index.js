var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');

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
    console.log(`${__dirname}/../public/javascripts/saved/${req.query.name}.json`)
    let fileData = fs.readFileSync(`${__dirname}/../public/javascripts/saved/${req.query.name}.json`)
    res.send(fileData)
  } catch (e) {
    console.log(e)
    res.send("ERROR")
  }

})



module.exports = router;
