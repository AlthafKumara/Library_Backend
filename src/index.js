import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const Version = "v1"

app.listen(PORT, () => {
  console.log(`
🚀 Server running
   URL  : http://localhost:${PORT}
   ENV  : ${process.env.NODE_ENV || 'development'}
   Health: http://localhost:${PORT}/api/${Version}
  `);
});