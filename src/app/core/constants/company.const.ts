export const COMPANY = {
  name: 'Peach Nutrition S.L.',
  // cif: 'B-12345678',
  // registrationNo: '123456',

  address: {
    street: 'Calle del Bienestar 14',
    postcode: '28001',
    city: 'Madrid',
    country: 'Spain',
    // full: 'Calle del Bienestar 14, 28001 Madrid, Spain',
  },

  phone: {
    // display: '+34 91 123 4567',
    // href: 'tel:+34911234567',
  },

  email: {
    general: 'peachnutritioncdm@gmail.com',
    returns: 'peachnutritioncdm@gmail.com',
    privacy: 'peachnutritioncdm@gmail.com',
    legal: 'peachnutritioncdm@gmail.com',
  },

  website: 'www.peach-nutrition.com',
  supportHours: 'Monday to Friday, 09:00–18:00 CET',

  externalLinks: {
    aepd: 'https://www.aepd.es',
  },
} as const;
