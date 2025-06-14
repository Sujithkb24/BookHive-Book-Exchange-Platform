require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const authRouter = require('./router/auth-router');
const sellRouter = require('./router/sell-router');
const orderRouter = require('./router/order-router');
const connectToDatabase = require('./utils/database');

const port = 3000;

app.use(express.json())
app.use('/api/auth', authRouter);
app.use('/api/sell', sellRouter);
app.use('/api/order', orderRouter);

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})
