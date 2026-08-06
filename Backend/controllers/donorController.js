import Donor from '../models/Donor.js'

export const createDonor = async (req, res) => {
  try {
    const { fullName, email, phone, age, bloodGroup, address, city, lastDonationDate, medicalNotes } = req.body

    if (!fullName || !email || !phone || !age || !bloodGroup || !address || !city) {
      return res.status(400).json({ success: false, error: 'Please provide all required donor fields' })
    }

    const donor = new Donor({
      fullName,
      email,
      phone,
      age,
      bloodGroup,
      address,
      city,
      lastDonationDate,
      medicalNotes
    })

    await donor.save()
    return res.status(201).json({ success: true, message: 'Donor created successfully', donor })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Email already exists' })
    }
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    return res.status(200).json({ success: true, message: 'Donor updated successfully', donor })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id)

    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    return res.status(200).json({ success: true, message: 'Donor deleted successfully' })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const searchDonors = async (req, res) => {
  try {
    const query = req.query.q || ''
    const searchFilter = query
      ? {
          $or: [
            { fullName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { city: { $regex: query, $options: 'i' } },
            { bloodGroup: { $regex: query, $options: 'i' } }
          ]
        }
      : {}

    const donors = await Donor.find(searchFilter).sort({ createdAt: -1 })
    return res.status(200).json({ success: true, count: donors.length, donors })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const getDonorEligibility = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)

    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    const ageEligible = donor.age >= 18 && donor.age <= 65
    const lastDonation = donor.lastDonationDate ? new Date(donor.lastDonationDate) : null
    const monthsSinceLastDonation = lastDonation
      ? (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24 * 30)
      : Infinity
    const donationEligible = ageEligible && (!lastDonation || monthsSinceLastDonation >= 3)

    return res.status(200).json({
      success: true,
      donorId: donor._id,
      eligible: donationEligible,
      message: donationEligible ? 'Eligible for donation' : ageEligible ? 'Last donation was within 3 months' : 'Age is outside the donation range'
    })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const getDonationHistory = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)

    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    return res.status(200).json({ success: true, donorId: donor._id, donationHistory: donor.donationHistory || [] })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}
