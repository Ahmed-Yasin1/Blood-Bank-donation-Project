import express from 'express'
import { createDonor, updateDonor, deleteDonor, searchDonors, getDonorEligibility, getDonationHistory } from '../controllers/DonorController.js'

const router = express.Router()

router.post('/', createDonor)
router.put('/:id', updateDonor)
router.delete('/:id', deleteDonor)
router.get('/search', searchDonors)
router.get('/:id/eligibility', getDonorEligibility)
router.get('/:id/history', getDonationHistory)

export default router
