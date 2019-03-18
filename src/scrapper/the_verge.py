from bs4 import BeautifulSoup
from requests import get
import re
from datetime import date, datetime

import db


# Constants
APARTMENT = 'The Verge'
FLOORPLANS = [
    ('The Cusp', '17', 1020, 2, 2.0),
    ('Greenway', '18', 1134, 2, 2.0)
]
TODAY = str(date.today())


# Scrape
listings = []
for fp in FLOORPLANS:
    
    url = 'https://vergeapartments.com/floorplans/?action=check-availability&floorplan=' + fp[1]
    page_response = get(url, timeout=10, headers={'X-Requested-With': 'XMLHttpRequest'})
    soup = BeautifulSoup(page_response.content, "html.parser")
    
    units = soup.select('tr[class="check-availability__row"]')
    for unit in units:

        data = {}

        data['floorplan'] = fp[0]
        data['size'] = fp[2]
        data['beds'] = fp[3]
        data['baths'] = fp[4]

        # Unit Number
        unit_str = unit.find('span', text='Apt # ').parent.text.strip()
        data['unit'] = re.search(r'Apt # (\d+)', unit_str).group(1)

        # Floor (based on Unit #)
        data['floor'] = int(data['unit'][1]) if data['unit'][0] == '1' else int(data['unit'][1]) - 2

        # Available Date
        availability_str = unit.find('span', text='Availability ').parent.text
        if 'now' in availability_str.lower():
            data['available_dt'] = 'Available Now'
        else:
            # The original date is in this format: "April 17, 2019"
            r = r'Available on ([A-Za-z]+ \d{1,2}, \d{4})'
            date_str = re.search(r, availability_str).group(1)

            # The final date is in this format: "2019-04-17"
            data['available_dt'] = str(datetime.strptime(date_str, '%B %d, %Y').date())

        # Lease Terms
        data['terms'] = []
        terms = soup.find('tr', {'class': 'check-availability__row--lease-term', 'data-unit': data['unit']}).find_all('label')
        for term in terms:
            r = re.search('(\d{1,2}) Months months at \$(\d{4})\/mo', term.text)
            length = r.group(1)
            price = int(r.group(2))

            if int(length) > 5:
                data['terms'].append({'k': length, 'v': price})


        listings.append(data)

print(listings)
# Insert into database
# db.insert_results(APARTMENT, TODAY, listings)
