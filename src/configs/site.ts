export const site = {
  title: 'romaingrx.com',
  description: 'Attach your seatbelt because the next 10 years will be wild',
  url: import.meta.env.PROD ? 'https://romaingrx.com' : 'http://localhost:4321',
} as const;
