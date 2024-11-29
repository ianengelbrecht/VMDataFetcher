import requests
import csv
import re
import os
import json
 
# The csv file used as input
csvfile = 'VM_Data__Walter_Neser__20241024.csv'

# If the project in the pics are not a lower case of the project, add it here
pic_dict = {
    'BirdPix': 'birdpix',
    'FrogMAP': 'safap',
    'LepiMAP': 'sabca',
    'MammalMAP': 'vimma',
    'OdonataMAP': 'odonata',
    'ReptileMAP': 'sarca',
    'TreeMAP': 'vith',
}

try:
   os.makedirs("VM-data")
except FileExistsError:
   # directory already exists
   pass

outdata = []

with open(csvfile, newline='') as csvfile:
    reader = csv.DictReader(csvfile)

    # prevProj is in when you're only testing
    # test only
    # prevProj = ''
    for row in reader:
    #   # test only
    #   if row['project'] != prevProj:
        # pad record number
        record = str(row['Vm_number']).zfill(6)
        # first part of url for picture
        pic_url = f"https://vmus.adu.org.za/{pic_dict.get(row['project'], row['project'].lower())}/{record}"
        print(f"{row['project']}, {row['Vm_number']}")
        # get content
        content_data = requests.get(row['URL']).text
        # find comments only
        content = re.findall('(?<=<h4 align="center">Comments by the Expert Panel on this record:</h4>)(.*?)(?=</table>[\s]</table>)', content_data, flags=re.S)
        
        # If there are comments, create an html doc containing them
        # this is not pretty, but seems about right
        # It would be possible to extract data from this, but it can be done on the resulting json, haven't done it yet
        if len(content) > 0:
            comment_content = content[0].replace('\\n', '\n')
            comments = f"<html><body><table><tr><td>{comment_content}</table></table></body></html>"
            row['comments'] = comments

        # download up to 3 images
        row['pics'] = []
        for n in [1,2,3]:
            img_data = requests.get(f'{pic_url}-{n}.jpg')
            # only if url is found
            if img_data.status_code == 200:
                row['pics'].append(f"{record}-{n}.jpg")
                with open(f'VM-data/{record}-{n}.jpg', 'wb') as handler:
                    handler.write(img_data.content)
        # test only
        # prevProj = row['project']
        outdata.append(row)

json_obj = json.dumps(outdata, indent=2)
with open('VM-data/VM-Data-Walter-Neser.json', 'w') as outfile:
    outfile.write(json_obj)

