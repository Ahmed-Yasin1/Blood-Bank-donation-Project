import User from '../models/User.js';
import EmergencyRequest from '../models/EmergencyRequest.js';
import BloodInventory from '../models/BloodInventory.js';
import Hospital from '../models/Hospital.js';

export const generateSystemReport = async (req, res) => {
    try {
       
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalRequests = await EmergencyRequest.countDocuments();
        const totalHospitals = await Hospital.countDocuments();
        
        const inventoryItems = await BloodInventory.find();
        const totalBloodUnitsAvailable = inventoryItems.reduce((acc, item) => acc + (item.units || 0), 0);

       
        const reportData = {
            generatedAt: new Date(),
            summary: {
                totalDonors,
                totalRequests,
                totalHospitals,
                totalBloodUnitsAvailable,
                inventoryDetails: inventoryItems
            }
        };

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