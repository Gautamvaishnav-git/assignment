# assignment

backend
- create .env and add the following variables
```env
DATABASE_URL='<your postgres db connection string>'
NODE_ENV=development
PORT=<port>
JWT_SECRET=<your secret>
```
- run
```js
  pnpm run dev
  or
  npm run dev
```

frontend
- create .env and add the following variables
```env
VITE_API_URI=http://localhost:5000
```
- run
```js
  pnpm run dev
  or
  npm run dev
```
