from bs4 import BeautifulSoup
from requests import get
import re
from datetime import date, datetime

import db


# Constants
APARTMENT = 'Ava Pacific Beach'
TODAY = str(date.today())


# Scrape
url = 'https://api.avalonbay.com/json/reply/ApartmentSearch?communityCode=CA025&min=1600&max=2800&_=1550548620970'
r = get(url, timeout=20).json()

listings = []

available_floorplans = r['results']['availableFloorPlanTypes']
two_bedroom = [x for x in available_floorplans if x['floorPlanTypeCode'] == '2BD'][0]['availableFloorPlans']
for fp in two_bedroom:

    for a in fp['finishPackages'][0]['apartments']:

        data = {}

        data['floorplan'] = 'TODO'
        data['unit'] = a['apartmentNumber']
        data['floor'] = a['floor']
        data['beds'] = a['beds']
        data['baths'] = a['baths']

        # available date
        epoch_str = re.search('/Date\((\d+)\)/', a['pricing']['availableDate']).group(1)
        data['available_dt'] = datetime.fromtimestamp(int(epoch_str) / 1000.0).strftime('%Y-%m-%d')
        
        # go to subpage to get more details
        apartment_code = a['apartmentCode']
        url = 'https://www.avaloncommunities.com/california/san-diego-apartments/ava-pacific-beach/apartment/' + apartment_code

        r2 = get(url, timeout=20)
        soup = BeautifulSoup(r2.content, "html.parser")
        
        description_el = soup.find('div', {'class': 'description'})
        data['size'] = int(re.search(r'(\d+) sq ft', description_el.text).group(1))

        # terms
        leases = soup.find('div', {'class': 'terms'}).select('table')[0].findAll('tr')
        data['terms'] = []
        for lease in leases:
            
            td_elements = lease.select('td')
            
            length = re.sub('[^0-9]', '', td_elements[0].text)  # regex to remove all non-digits
            price = int(re.sub('[^0-9]', '',  td_elements[-1].text)) # regex to remove all non-digits

            if int(length) > 5:
                data['terms'].append({'k': length, 'v': price})

        listings.append(data)

print(listings)
# Insert into database
#db.insert_results(APARTMENT, TODAY, listings)
