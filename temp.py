import csv

csvfile = "Theraphosidae 20241116.csv"

with open(csvfile, newline='') as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        print(row['vmNumber'])