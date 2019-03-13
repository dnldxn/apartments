from bs4 import BeautifulSoup
from requests import get
import re
from datetime import date

import db


# Constants
APARTMENT = 'The Verge'

FLOORPLANS = [
    ('The Cusp', '17', 1020),
    ('Greenway', '18', 1134)
]

TODAY = str(date.today())


# Scrape
listings = []
for fp in FLOORPLANS:
    
    url = 'https://vergeapartments.com/floorplans/?action=check-availability&floorplan=' + fp[1]
    page_response = get(url, timeout=5, headers={'X-Requested-With': 'XMLHttpRequest'})
    soup = BeautifulSoup(page_response.content, "html.parser")
    
    units = soup.find_all('tr', {'class': 'check-availability__row--lease-term'})
    for unit in units:
        data = {}
        data['floorplan'] = fp[0]
        data['unit'] = unit['data-unit']
        data['floor'] = int(data['unit'][1]) if data['unit'][0] == '1' else int(data['unit'][1]) - 2
        data['size'] = fp[2]
        data['terms'] = []
        
        leases = unit.find_all('label')
        for lease in leases:
            r = re.search('(\d{1,2}) Months months at \$(\d{4})\/mo', lease.text)
            length = r.group(1)
            price = int(r.group(2))
            
            data['terms'].append({'k': length, 'v': price})
        
        listings.append(data)


# Insert into database
db.insert_results(APARTMENT, TODAY, listings)
