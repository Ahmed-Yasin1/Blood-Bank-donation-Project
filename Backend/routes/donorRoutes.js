import express from 'express'
import {
  createDonor,
  updateDonor,
  deleteDonor,
  searchDonors,
  getDonorEligibility,
  addDonationRecord,
  updateDonationRecord,
  deleteDonationRecord,
  getDonationHistory,
} from '../controllers/DonorController.js'

const router = express.Router()

router.post('/', createDonor)
router.put('/:id', updateDonor)
router.delete('/:id', deleteDonor)
router.get('/', searchDonors)
router.get('/search', searchDonors)
router.get('/:id/eligibility', getDonorEligibility)
router.post('/:id/donations', addDonationRecord)
router.put('/:id/donations/:donationId', updateDonationRecord)
router.delete('/:id/donations/:donationId', deleteDonationRecord)
router.get('/:id/history', getDonationHistory)

export default router
