import User from '../models/User.js';
import EmergencyRequest from '../models/EmergencyRequest.js';
import BloodInventory from '../models/BloodInventory.js';

export const getDashboardStats = async (req, res) => {
    try {
        
        const totalDonors = await User.countDocuments({ role: 'donor' }); 
        const totalRequests = await EmergencyRequest.countDocuments();
        
       
        const inventoryItems = await BloodInventory.find();
        const totalBloodUnitsAvailable = inventoryItems.reduce((acc, item) => acc + (item.units || 0), 0);

        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: {
                totalDonors,
                totalRequests,
                totalBloodUnitsAvailable,
                recentActivities: [] 
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};