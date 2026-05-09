const bcrypt = require('bcrypt');
const User = require('../model/User');
const Organization = require('../model/Organization');
const generateToken = require('../utils/generateToken');

// Super Admin Login
exports.superAdminLogin = async (req, res) => {
   try {
    const { email, password } = req.body;
    
    if(email !== process.env.SUPER_ADMIN_EMAIL || password !== process.env.SUPER_ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken({ _id: 'SUPER_ADMIN', role: 'SUPER_ADMIN' });
    res.json({ token });

    res.status(200).json({ message: 'Super Admin logged in successfully', token }); 

} catch (error) {
    res.status(500).json({ message: 'Internal server error' });
}};

// Organization Admin Login
exports.orgAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('organization');
        if (!user || user.role !== 'ORG_ADMIN') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Organization Admin registration
exports.orgAdminRegister = async (req, res) => {
    try {
        const { name, email, password, organization } = req.body;
        
        // checking reqired fields
        if (!name || !email || !password || !organization) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // checking if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // checking if organization exists
        const org = await Organization.findById(organization);
        if (!org) {
            return res.status(400).json({ message: 'Organization not found' });
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // creating an user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            organization,
            role: 'ORG_ADMIN'
        });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ message: 'Organization Admin registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }         
};

// user login
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('organization');
        if (!user || user.role !== 'USER') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// user registration
exports.userRegister = async (req, res) => {
    try {
        const { name, email, password, organization } = req.body;
        
        // checking reqired fields
        if (!name || !email || !password || !organization) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // checking if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // checking if organization exists
        const org = await Organization.findById(organization);
        if (!org) {
            return res.status(400).json({ message: 'Organization not found' });
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // creating an user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            organization,
            role: 'USER'
        });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }         
};