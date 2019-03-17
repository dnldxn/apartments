from bs4 import BeautifulSoup
from requests import get
import re
from datetime import date

import db


# Constants
APARTMENT = 'Avion at Spectrum'
TODAY = str(date.today())
URL = "https://www.avionatspectrum.com/CmsSiteManager/callback.aspx?act=Proxy/GetUnits&available=true&siteid=5952717&bestprice=true&leaseterm=13"


# Scrape
r = get(URL, timeout=20).json()

listings = []

units = r['units']
for unit in units:

    data = {}
    if unit['numberOfBeds'] > 1:
        data['floorplan'] = re.sub(':.*', '', unit['floorPlanImages'][0].get('alt', ''))
        data['unit'] = unit['unitNumber']
        data['size'] = unit['squareFeet']
        data['floor'] = unit['unitNumber'][2]
        data['available_dt'] = re.sub(' .*', '', unit['vacantDate'])
        data['beds'] = unit['numberOfBeds']
        data['baths'] = unit['numberOfBaths']
        
        data['terms'] = []
        data['terms'].append({'k': unit['maxLeaseTermInMonth'], 'v': unit['rent']})

        listings.append(data)


# Insert into database
db.insert_results(APARTMENT, TODAY, listings)
