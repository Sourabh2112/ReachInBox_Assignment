const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/emails', emailRoutes);

app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
});
