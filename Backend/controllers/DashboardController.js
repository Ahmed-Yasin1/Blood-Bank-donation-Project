import User from '../models/User.js';
import EmergencyRequest from '../models/EmergencyRequest.js';
import BloodInventory from '../models/BloodInventory.js';
import Hospital from '../models/Hospital.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalRequests = await EmergencyRequest.countDocuments();
        const totalHospitals = await Hospital.countDocuments();
        const totalUsers = await User.countDocuments();

        const inventoryItems = await BloodInventory.find();
        const totalBloodUnitsAvailable = inventoryItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
        const lowStockCount = await BloodInventory.countDocuments({ quantity: { $lt: 10 } });
        const expirySoonCount = await BloodInventory.countDocuments({ expiryDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

        const bloodTypeCounts = inventoryItems.reduce((counts, item) => {
            const type = item.bloodType || 'Unknown';
            counts[type] = (counts[type] || 0) + (item.quantity || 0);
            return counts;
        }, {});

        const roleCounts = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);

        const userRoles = roleCounts.reduce((acc, role) => {
            acc[role._id] = role.count;
            return acc;
        }, {});

        const recentActivities = [
            `Tracked ${totalUsers} system users`,
            `Logged ${totalRequests} emergency requests`,
            `Detected ${lowStockCount} low-stock item${lowStockCount === 1 ? '' : 's'}`,
        ];

        res.status(200).json({
            success: true,
            message: 'Dashboard data fetched successfully',
            data: {
                totalDonors,
                totalRequests,
                totalHospitals,
                totalUsers,
                totalBloodUnitsAvailable,
                lowStockCount,
                expirySoonCount,
                bloodTypeCounts,
                userRoles,
                recentActivities,
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