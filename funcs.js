//Thanks Johan Kritzinger, Walter Neser's friend, for the secret to getting the image URLs

import fs from 'node:fs'

export default async function fetchVMImages(projectName, recordNumber) {

  let imageNumber = 1
  while (imageNumber < 4) {

    let imgurl = `https://vmus.adu.org.za/${projectName.toLowerCase()}/${recordNumber.toString().padStart(6, '0')}-${imageNumber}.jpg`
    let res = await fetch(imgurl)
    let image
    if (res.ok){
      image = await res.blob()
    }
    else {
      break
    }

    console.log('got image', recordNumber + '_' + imageNumber + '.jpg')
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(`./images/${projectName}_${recordNumber}_${imageNumber}.jpg`, buffer)
    imageNumber++
  }
    
}