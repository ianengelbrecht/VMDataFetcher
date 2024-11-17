import fs from 'fs';
import Papa from 'papaparse';

const fileName = String.raw`Theraphosidae 20241116.csv`

const fileStream = fs.createReadStream(fileName);
Papa.parse(fileStream, {
  header: true, // Convert rows to objects using the first row as header
  complete: (results) => {
    console.log('read', results.data.length, 'records from file')
    console.log('all done')
  },
  error: (error) => reject(error),
});
