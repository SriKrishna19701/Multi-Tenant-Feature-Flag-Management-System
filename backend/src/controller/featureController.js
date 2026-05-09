const Feature = require('../models/Feature');

// Create a new feature
exports.createFeature = async (req, res) => {
    try {
        const { featureKey, enabled } = req.body;
        const organizationId = req.user.organization;
        
        if (!featureKey) {
            return res.status(400).json({ message: 'Feature key is required' });
        }
        // checking for existing feature key in the same organization
        const existingFeature = await Feature.findOne({ featureKey, organization: organizationId });
        if (existingFeature) {
            return res.status(400).json({ message: 'Feature key already exists in this organization' });
        }
        const feature = new Feature({
            featureKey,
            enabled,
            organization: organizationId,
        });
        await feature.save();
        res.status(201).json(feature);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all features for the organization
exports.getFeatures = async (req, res) => {
    try {
        const organizationId = req.user.organization;
        const features = await Feature.find({ organization: organizationId });
        res.json(features);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a feature
exports.updateFeature = async (req, res) => {
    try {
        const { id } = req.params;
        const { featureKey, enabled } = req.body;
        const organizationId = req.user.organization;

        const feature = await Feature.findOne({ _id: id, organization: organizationId });
        if (!feature) {
            return res.status(404).json({ message: 'Feature not found' });
        }
        // update 
        if(featureKey !== undefined) feature.featureKey = featureKey;
        if(enabled !== undefined) feature.enabled = enabled;
        await feature.save();
        res.json(feature);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//delete a feature
exports.deleteFeature = async (req, res) => {
    try {
        const { id } = req.params;
        const organizationId = req.user.organization;

        const feature = await Feature.findOneAndDelete({ _id: id, organization: organizationId });
        if (!feature) {
            return res.status(404).json({ message: 'Feature not found' });
        }
        res.json({ message: 'Feature deleted successfully' });
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//check feature (for End User)
exports.checkFeature = async (req, res) => {
    try {
        const { featureKey } = req.body;
        const organizationId = req.user.organization;

        if (!featureKey) {
            return res.status(400).json({ message: 'Feature key is required' });
        }
        const feature = await Feature.findOne({ featureKey, organization: organizationId });
        if (!feature) {
            return res.status(404).json({ message: 'Feature not found' });
        }
        res.json({ enabled: feature.enabled });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};