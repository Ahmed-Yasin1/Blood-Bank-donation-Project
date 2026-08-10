import User from '../models/User.js';
import EmergencyRequest from '../models/EmergencyRequest.js';
import BloodInventory from '../models/BloodInventory.js';
import Hospital from '../models/Hospital.js';

export const generateSystemReport = async (req, res) => {
    try {
       
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalRequests = await EmergencyRequest.countDocuments();
        const pendingRequests = await EmergencyRequest.countDocuments({ status: 'Pending' });
        const totalHospitals = await Hospital.countDocuments();

        const inventoryItems = await BloodInventory.find();
        const totalUnits = inventoryItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

        // aggregate by blood type
        const groupMap = inventoryItems.reduce((map, item) => {
            const type = item.bloodType || item.bloodType?.toUpperCase?.() || 'UNKNOWN'
            map[type] = (map[type] || 0) + (item.quantity || 0)
            return map
        }, {})

        const bloodGroupStats = Object.keys(groupMap).map((bloodGroup) => ({ bloodGroup, units: groupMap[bloodGroup] }))

        const recentRequests = await EmergencyRequest.find().sort({ createdAt: -1 }).limit(6).populate('hospital', 'name location')

        const reportData = {
            generatedAt: new Date(),
            totalDonors,
            totalRequests,
            pendingRequests,
            totalHospitals,
            totalUnits,
            bloodGroupStats,
            inventoryDetails: inventoryItems,
            recentRequests,
        }

        return res.status(200).json({
            success: true,
            message: "System report generated successfully",
            data: reportData
        });
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Error generating system report",
                error: error.message
            });
        }
    }
};