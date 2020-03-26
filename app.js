var fs = require('fs')
var csv = require('fast-csv')
var os = require('os')

var fetchRecords = require('./fetchData')

var project = 'spidermap'

var filters = {
  //bbox: '-30.190425,21.235134,-31.210631,22.932522',
  taxon: 'Theraphosidae',
  //geo: 'Namibia'
}

/*
var postFilterKey = 'recordedBy'
var postFilterVal = 'Tippett'
var postFilterMethod = 'like'
*/

var postFilterKey = null
var postFilterVal = null
var postFilterMethod = null

var API_KEY = 'db1dfbcc0491a747eb6a0ca5c8bc2ef5'

csvFile = 'theraphosidae20200104.csv'

htmlFile = 'UroPlanNamibia.html'

//what format to write out the results as
format = 'csv'

console.log('fetching records')

fetchRecords(project, filters, postFilterKey, postFilterVal, postFilterMethod, API_KEY, format)
  .then(results => {

    if (results.length == 0){
      console.log('NO RECORDS RETURNED')
      return;
    }

    //silent else

    console.log('Number of returned records: ' + results.length)
    
    if (format == 'csv') {
      var ws = fs.createWriteStream(csvFile);
      csv
        .write(results, {headers: true})
        .pipe(ws);
  
      console.log('done writing CSV')
    }
    else if (format == 'html') {
      var htmlBody = ""
      results.forEach(record => {
        htmlBody += `<p><a href="${record.URL}">${record.URL}</a></p>${os.EOL}`
      });
      var createHTML = require('create-html')
      
      var html = createHTML({
        title: 'example',
        body: htmlBody
      })
      
      fs.writeFile(htmlFile, html, function (err) {
        if (err) console.log(err)
        else {
          console.log('Completed writing HTML file')
        }
      })
    }
    
    
  })
  .catch(err => console.log(err))