import express from "express";
import {
  createEmergencyRequest,
  getAllEmergencyRequests,
  getEmergencyById,
  updateEmergency,
  deleteEmergency,
  updateEmergencyStatus,
  smartMatching,
} from "../controllers/EmergencyController.js";

const router = express.Router();

/**
 * Emergency Request Routes
 * Base URL: /api/emergency
 */

// POST /api/emergency - Create emergency request
// Protected: Hospital/Admin only
router.post("/", createEmergencyRequest);

// GET /api/emergency - Get all emergency requests
// Query params: status, urgency, bloodType
router.get("/", getAllEmergencyRequests);

// GET /api/emergency/:id - Get emergency request by ID
router.get("/:id", getEmergencyById);

// PUT /api/emergency/:id - Update emergency request
// Protected: Hospital/Admin only
router.put("/:id", updateEmergency);

// DELETE /api/emergency/:id - Delete emergency request
// Protected: Hospital/Admin only
router.delete("/:id", deleteEmergency);

// PATCH /api/emergency/:id/status - Update emergency status
// Protected: Hospital/Admin only
// Body: { status: "Pending|Searching|Matched|Completed|Cancelled" }
router.patch("/:id/status", updateEmergencyStatus);

// GET /api/emergency/:id/match - Smart matching for donors
// Protected: Hospital/Admin only
router.get("/:id/match", smartMatching);

export default router;
