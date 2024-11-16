
var request = require('request-promise-native')


module.exports = async function(project, callParamsObject, postFilterKey, postFilterVal, postFilterMethod, API_KEY) {
  //postfilter methods filter the returned results
  //postfiltermethod is either 'equals' or 'like'
  //destFile is the destination CSV file

  var results = []

  var fetchURL = `http://vmus.adu.org.za/api/v1/occurrences?project=${project}`

  if(callParamsObject){
    for (var key in callParamsObject){
      fetchURL += `&${key}=${callParamsObject[key]}`
    }
  }
  
  fetchURL += `&API_KEY=${API_KEY}`
  fetchURL = encodeURI(fetchURL)

  console.log(fetchURL)

  try {
    var res = await request(fetchURL)
  }
  catch(err){
    console.log('Error fetching records: ' + err)
  }

  var data = JSON.parse(res)
  let pagesFetched = 0
  if(data.results){
    addResults(project, results, data, postFilterKey, postFilterVal, postFilterMethod)
    pagesFetched += 1
    console.log('fetched', pagesFetched, 'page of resultes')
    //get all the records
    while(!data.meta.endOfRecords){
      try {
        res = await request(fetchURL + `&offset=${results.length}`)
      }
      catch(err) {
        throw err
      }
      
      data = JSON.parse(res)
      if(data.results){
        addResults(project, results, data, postFilterKey, postFilterVal, postFilterMethod)
        pagesFetched += 1
        console.log('fetched', pagesFetched, 'page of resultes')
      }
    }
  }

  return results

}

function mapVMRecord(record, project){
  
  var vmNumber = Number(record.occurrenceID.split(":").pop())
  var recordURL = `http://vmus.adu.org.za/?vm=${project}-${vmNumber}`
  
  var returnRecord = {
    vmNumber: vmNumber,
    institutionCode: record.institutionCode,
    URL: recordURL,
    scientificName: record.scientificName,
    country: record.country,
    stateProvince: record.stateProvince,
    verbatimLocality: record.verbatimLocality,
    decimalLatitude: Number(record.decimalLatitude.substr(0,9)),
    decimalLongitude: Number(record.decimalLongitude.substr(0,9)),
    eventDate: record.eventDate,
    recordedBy: record.recordedBy
    
  }

  return returnRecord

}

function addResults(project, results, data, postFilterKey, postFilterVal, postFilterMethod){
  if(postFilterKey){
    if(postFilterMethod == 'equals'){
      results.push.apply(results, data.results.filter(item => item[postFilterKey] == postFilterVal).map(item => mapVMRecord(item, project)))
    }
    else {
      results.push.apply(results, data.results.filter(item => item[postFilterKey].includes(postFilterVal)).map(item => mapVMRecord(item, project)))
    }
  }
  else {
    results.push.apply(results, data.results.map(item => mapVMRecord(item, project)))
  }
}
