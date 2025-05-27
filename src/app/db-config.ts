// src/app/db-config.ts
export const dbConfig = {
  name: 'MyAppDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'entries',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'passportNo', keypath: 'passportNo', options: { unique: false } },
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'commodity', keypath: 'commodity', options: { unique: false } },
      ],
    },
  ],
};
