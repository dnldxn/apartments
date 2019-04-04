from bs4 import BeautifulSoup
from requests import get
import re
from datetime import date

import db


# Constants
APARTMENT = 'Avion at Spectrum'
FLOORPLANS = {
    968:    'Refresh1',
    1001:   'Refresh2',
    979:    'Relax1',
    1031:   'Relax2',
    1180:   'Renew'
}
TODAY = str(date.today())
URL = "https://www.avionatspectrum.com/CmsSiteManager/callback.aspx?act=Proxy/GetUnits&available=true&siteid=5952717&bestprice=true&leaseterm=13"


# Scrape
r = get(URL, timeout=20).json()

listings = []

units = r['units']
for unit in units:

    data = {}
    if unit['numberOfBeds'] > 1:
        data['unit'] = unit['unitNumber']
        data['size'] = unit['squareFeet']

        floorplan = unit['floorPlanImages'][0].get('alt')
        if floorplan:
            data['floorplan'] = re.sub(':.*', '', floorplan)
        else:
            data['floorplan'] = FLOORPLANS[data['size']]

        data['floor'] = unit['unitNumber'][2]
        data['available_dt'] = re.sub(' .*', '', unit['vacantDate'])
        data['beds'] = unit['numberOfBeds']
        data['baths'] = unit['numberOfBaths']
        
        data['terms'] = []
        data['terms'].append({'k': unit['maxLeaseTermInMonth'], 'v': unit['rent']})

        listings.append(data)


# Insert into database
db.insert_results(APARTMENT, TODAY, listings)
