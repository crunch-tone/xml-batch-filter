//necessary modules initializing
const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");
const _ = require("lodash");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

//global variables
var batchNumber;
var srcCorrectFilePath = path.join(__dirname, "./src.xml");
var XMLcontent;
var parser = new xml2js.Parser({
  explicitArray: false
});

//interacting with user
readline.question(`Please enter the batch number `, number => {
  console.log(`Searching for the batch ${number}!`);
  batchNumber = number;
  readline.close();

  //XML file parsing
  fs.readFile(srcCorrectFilePath, function(err, data) {
    parser.parseString(data, function(err, result) {
      XMLcontent = result;
      processFile();
      console.log("Done");
    });
  });
});

function processFile() {
  var filtered = _.filter(XMLcontent.WIPDatas.WIPData, {
    Batch: `${batchNumber}`
  });
  var filteredResult = [];

  //wrapping resulted objects with the correct tags
  function wrap(obj) {
    var newObj = { WIPData: obj };
    filteredResult.push(newObj);
  }

  filtered.forEach(wrap);

  //building result XML
  var builder = new xml2js.Builder({ rootName: "WIPDatas" });
  var xml = builder.buildObject(filteredResult);
  fs.writeFile("result.xml", xml, function(err) {
    if (err) throw err;
    console.log("Saved!");
  });
}
