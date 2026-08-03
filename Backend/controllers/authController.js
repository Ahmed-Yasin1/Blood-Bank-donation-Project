import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const getToken = user => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'blood-bank-secret',
    { expiresIn: '1h' }
  )
}

// register a new user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'doctor'
    })

    await user.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    const token = getToken(user)
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json({ users })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
