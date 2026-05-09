const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const organizationRoutes = require('./src/routes/organizationRoutes');
const featureRoutes = require('./src/routes/featureRoutes');
const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/features', featureRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database', err);
});
