import Donor from '../models/Donor.js'
import User from '../models/User.js'
import bcrypt from 'bcrypt'

const calculateEligibility = (donor) => {
  const ageEligible = donor.age >= 18 && donor.age <= 65
  const lastDonation = donor.lastDonationDate ? new Date(donor.lastDonationDate) : null
  const monthsSinceLastDonation = lastDonation
    ? (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24 * 30)
    : Infinity
  const donationEligible = ageEligible && (!lastDonation || monthsSinceLastDonation >= 3)

  return {
    eligible: donationEligible,
    ageEligible,
    monthsSinceLastDonation: Number.isFinite(monthsSinceLastDonation) ? Math.floor(monthsSinceLastDonation) : null,
    message: donationEligible
      ? 'Eligible for donation'
      : ageEligible
      ? 'Last donation was within 3 months'
      : 'Age is outside the donation range',
  }
}

export const createDonor = async (req, res) => {
  try {
    const { fullName, email, phone, age, bloodGroup, address, city, district, lastDonationDate, medicalNotes, password } = req.body

    if (!fullName || !email || !phone || !age || !bloodGroup || !address || !city || !district) {
      return res.status(400).json({ success: false, error: 'Please provide all required donor fields' })
    }

    // if a password is provided, we'll create an associated User account for donor login
    let createdUser = null
    if (password) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already exists as a user' })
      }

      const hashed = await bcrypt.hash(password, 10)
      createdUser = await User.create({ username: fullName, email, password: hashed, role: 'donor' })
    }
    const donor = new Donor({
      fullName,
      email,
      phone,
      age,
      bloodGroup,
      address,
      city,
      district,
      lastDonationDate,
      medicalNotes,
      user: createdUser ? createdUser._id : undefined,
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
    const donor = await Donor.findById(req.params.id)
    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    const { password, email, fullName } = req.body

    // If password provided, ensure linked User exists or is created/updated
    if (password) {
      if (donor.user) {
        const user = await User.findById(donor.user)
        if (user) {
          if (email) user.email = email
          if (fullName) user.username = fullName
          user.password = await bcrypt.hash(password, 10)
          await user.save()
        }
      } else {
        // create linked user for donor
        const existingUser = await User.findOne({ email: email || donor.email })
        if (existingUser) {
          return res.status(400).json({ success: false, error: 'Email already exists as a user' })
        }

        const hashed = await bcrypt.hash(password, 10)
        const createdUser = await User.create({ username: fullName || donor.fullName, email: email || donor.email, password: hashed, role: 'donor' })
        donor.user = createdUser._id
      }
    } else if (donor.user && (email || fullName)) {
      // sync non-password profile changes to linked user
      const user = await User.findById(donor.user)
      if (user) {
        if (email) user.email = email
        if (fullName) user.username = fullName
        await user.save()
      }
    }

    Object.assign(donor, req.body)
    await donor.save()

    return res.status(200).json({ success: true, message: 'Donor updated successfully', donor })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)

    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    // remove linked user account if exists
    if (donor.user) {
      try {
        await User.findByIdAndDelete(donor.user)
      } catch (err) {
        // continue even if user delete fails
        console.warn('Failed to delete linked user for donor', donor._id, err.message)
      }
    }

    await donor.remove()

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

    const eligibility = calculateEligibility(donor)
    return res.status(200).json({
      success: true,
      donorId: donor._id,
      eligible: eligibility.eligible,
      monthsSinceLastDonation: eligibility.monthsSinceLastDonation,
      message: eligibility.message,
    })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const addDonationRecord = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)
    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    const eligibility = calculateEligibility(donor)
    if (!eligibility.eligible) {
      return res.status(400).json({ success: false, error: eligibility.message })
    }

    const { date, location, status } = req.body
    const donationDate = date ? new Date(date) : new Date()

    const donationRecord = {
      date: donationDate,
      location: location?.trim() || 'Unknown location',
      status: status || 'Completed',
    }

    donor.donationHistory.push(donationRecord)
    donor.lastDonationDate = donationDate
    donor.eligibilityStatus = false
    await donor.save()

    return res.status(201).json({ success: true, message: 'Donation recorded successfully', donation: donationRecord, donor })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const updateDonationRecord = async (req, res) => {
  try {
    const { id, donationId } = req.params
    const { date, location, status } = req.body

    const donor = await Donor.findById(id)
    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    const record = donor.donationHistory.id(donationId)
    if (!record) {
      return res.status(404).json({ success: false, error: 'Donation record not found' })
    }

    if (date) record.date = new Date(date)
    if (location !== undefined) record.location = location
    if (status) record.status = status

    await donor.save()

    const latestRecord = donor.donationHistory.reduce((latest, entry) => (entry.date > latest.date ? entry : latest), donor.donationHistory[0])
    if (latestRecord) {
      donor.lastDonationDate = latestRecord.date
      donor.eligibilityStatus = false
      await donor.save()
    }

    return res.status(200).json({ success: true, message: 'Donation record updated successfully', donation: record, donor })
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message })
  }
}

export const deleteDonationRecord = async (req, res) => {
  try {
    const { id, donationId } = req.params
    const donor = await Donor.findById(id)
    if (!donor) {
      return res.status(404).json({ success: false, error: 'Donor not found' })
    }

    const record = donor.donationHistory.id(donationId)
    if (!record) {
      return res.status(404).json({ success: false, error: 'Donation record not found' })
    }

    record.remove()
    await donor.save()

    if (donor.donationHistory.length > 0) {
      const latestRecord = donor.donationHistory.reduce((latest, entry) => (entry.date > latest.date ? entry : latest), donor.donationHistory[0])
      donor.lastDonationDate = latestRecord.date
    } else {
      donor.lastDonationDate = undefined
    }
    donor.eligibilityStatus = true
    await donor.save()

    return res.status(200).json({ success: true, message: 'Donation record deleted successfully', donor })
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
