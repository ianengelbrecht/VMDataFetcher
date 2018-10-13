var fs = require('fs')
var csv = require('fast-csv')

var fetchRecords = require('./fetchData')

/*for Ryans map*/
var project = 'scorpionmap'

var filters = {
  bbox: '-30.190425,21.235134,-31.210631,22.932522',
  //taxon: 'Parabuthus'
}

var postFilterKey = 'recordedBy'
var postFilterVal = 'Tippett'
var postFilterMethod = 'like'
var API_KEY = 'db1dfbcc0491a747eb6a0ca5c8bc2ef5'

csvFile = 'ryan.csv'

console.log('fetching records')

fetchRecords(project, filters, postFilterKey, postFilterVal, postFilterMethod, API_KEY)
  .then(results => {
    console.log('Number of returned records: ' + results.length)
    var ws = fs.createWriteStream(csvFile);
    csv
      .write(results, {headers: true})
      .pipe(ws);

    console.log('done writing CSV')
  })
  .catch(err => console.log(err))