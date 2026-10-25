export const BUSINESS = {
  name: 'Bistro Saimaa',
  phone: {
    e164: '+358504499322',
    international: '+358 50 4499 322',
    national: '050 449 9322',
  },
  email: 'bistrosaimaa@gmail.com',
  address: {
    street: 'Brahentie 42',
    postalCode: '52300',
    locality: 'Ristiina',
    country: 'FI',
  },
  lunch: {
    opens: { hour: 11, minute: 0 },
    closes: { hour: 15, minute: 0 },
  },
  mapsUrl: 'https://maps.google.com/?q=Bistro+Saimaa+Ristiina',
} as const;

export const ADDRESS_LINE = `${BUSINESS.address.street}, ${BUSINESS.address.postalCode} ${BUSINESS.address.locality}`;
