
export default async function(project, callParamsObject, postFilterKey, postFilterVal, postFilterMethod, API_KEY) {
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

  try {
    var res = await fetch(fetchURL)
  }
  catch(err){
    console.log('Error fetching records: ' + err)
    process.exit()
  }

  var data = await res.json()
  let pagesFetched = 0
  if(data.results){
    addResults(project, results, data, postFilterKey, postFilterVal, postFilterMethod)
    pagesFetched += 1
    console.log('fetched', pagesFetched, 'page of results')
    //get all the records
    while(!data.meta.endOfRecords){
      try {
        res = await fetch(fetchURL + `&offset=${results.length}`)
      }
      catch(err) {
        throw err
      }
      
      data = await res.json()
      if(data.results){
        addResults(project, results, data, postFilterKey, postFilterVal, postFilterMethod)
        pagesFetched += 1
        console.log('fetched', pagesFetched, 'page of results')
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
    URL: recordURL,
    ...record
  }

  returnRecord.decimalLatitude = Number(record.decimalLatitude.substr(0,9))
  returnRecord.decimalLongitude = Number(record.decimalLongitude.substr(0,9))

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
