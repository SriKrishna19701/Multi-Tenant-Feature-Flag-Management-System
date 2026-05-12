
const Organization = require('../model/Organization');

// Create a new organization
exports.createOrganization = async (req, res) => {
    try {
        const { name } = req.body;
            if (!name) {
            return res.status(400).json({ message: 'Organization name is required' });
        }
        const existingOrg = await Organization.findOne({ name });
        if (existingOrg) {
            return res.status(400).json({ message: 'Organization already exists' });
        }
        const organization = new Organization({ name });
        await organization.save();
        res.status(201).json(organization);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all organizations
exports.getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an organization
exports.deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await Organization.findByIdAndDelete(id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json({ message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Public organization list for registration
exports.getOrganizationsPublic = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};