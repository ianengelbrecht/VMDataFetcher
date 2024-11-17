// fetched records for a project, with options for filters
// see fetchImges to fetch the images for the same records

import fs from 'fs'
import csv from 'fast-csv'
import os from 'os'
import fetchRecords from './fetchData.js'

const project = 'spidermap'

//TODO allow for searching multiple taxa
const filters = {
  //bbox: '-25.712226, 29.344893,-25.855600, 29.644615',
  taxon: 'Theraphosidae',
  //geo: 'Malawi'
}

const csvFile = 'Theraphosidae 20241116.csv'

/*
var postFilterKey = 'recordedBy'
var postFilterVal = 'Tippett'
var postFilterMethod = 'like'
*/

const postFilterKey = null
const postFilterVal = null
const postFilterMethod = null

const API_KEY = 'db1dfbcc0491a747eb6a0ca5c8bc2ef5'

console.log('fetching records')

fetchRecords(project, filters, postFilterKey, postFilterVal, postFilterMethod, API_KEY)
  .then(results => {

    if (results.length == 0){
      console.log('NO RECORDS RETURNED')
      return;
    }

    console.log('Number of returned records: ' + results.length)
    
    const ws = fs.createWriteStream(csvFile);
    csv
      .write(results, {headers: true, quote: true, includeEndRowDelimiter: true})
      .pipe(ws)
      .on('finish', _ => console.log('done writing CSV'));
    
  })
  .catch(err => console.log(err))