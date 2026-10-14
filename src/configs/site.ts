export const site = {
  title: 'romaingrx.com',
  name: 'Romain',
  description: 'Machine learning engineer writing about AI safety, deep learning, and software.',
  url: import.meta.env.PROD ? 'https://romaingrx.com' : 'http://localhost:4321',
  repo: 'romaingrx/romaingrx.com',
  giscus: {
    sectionId: 'comments',
    repoId: 'R_kgDOM6pBlQ',
    category: 'Comments',
    categoryId: 'DIC_kwDOM6pBlc4Cmqh8',
  },
} as const;
