

export const getDashboardStats = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: {
                totalDonors: 0,
                totalRequests: 0,
                totalBloodUnitsAvailable: 0,
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