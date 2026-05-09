const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database', err);
});
