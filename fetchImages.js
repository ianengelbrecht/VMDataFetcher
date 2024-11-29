import fs from 'fs';
import Papa from 'papaparse';
import fetchVMImages from './funcs.js'

const fileName = String.raw`Theraphosidae 20241116.csv`
const project = 'spidermap'

console.log('reading file')
const fileStream = fs.createReadStream(fileName);
Papa.parse(fileStream, {
  header: true, // Convert rows to objects using the first row as header
  complete: async (results) => {
    console.log('fetching images')
    const start = performance.now();
    const records = results.data
    let processed = 0
    let imageCount = 0
    const errors = {}
    for (const row of records) {
      try {
        imageCount += await fetchVMImages(project, row.vmNumber)
      }
      catch(err) {
        errors[row.vmNumber] = err.toString()
      }
      finally {
        
        processed++
        if (records.length == processed) {
          const end = performance.now(); // Get the end time in milliseconds
          const elapsedTime = end - start; // Calculate total elapsed time in ms
          const seconds = Math.floor((elapsedTime / 1000) % 60);
          const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
          const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
          
          if (Object.keys(errors).length > 0) {
            for (const [vmNumber, error] of Object.entries(errors))
              console.log(vmNumber, ':', error)
          }

          console.log(`${imageCount} images fetched in ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          console.log('all done!')
        }
      }
    } 
    return  
  },
  error: (error) => reject(error),
});