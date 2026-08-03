import express from 'express'
import { registerUser, loginUser, getProfile, getAllUsers } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getProfile)
router.get('/users', protect, authorizeRoles('admin'), getAllUsers)

export default router;