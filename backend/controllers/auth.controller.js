import User from '../models/user.model.js'
import { generateToken } from '../utils/jwt.js'

export const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body

		if (!name || !email || !password) {
			return res.status(400).json({ success: false, message: 'All fields are required' })
		}

		const existingUser = await User.findOne({ email })
		if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' })

		const user = await User.create({
			name,
			email,
			password,
		})

		res.status(201).json({
			success: true,
			message: 'User created successfully',
		})
	} catch (error) {
		console.log('SIGNUP ERROR:', error)
		res.status(500).json({ message: error.message })
	}
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ success: false, message: 'Wszytkie pola sa wymagane' })
		}

		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ success: false, message: 'Niepoprawne dane' })
		}

		const isMatch = await user.comparePassword(password)
		if (!isMatch) {
			return res.status(400).json({ success: false, message: 'Niepoprawne dane' })
		}

		const token = generateToken(user._id)

		res.status(200).json({
			success: true,
			message: 'Login successful',
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		})
	} catch (error) {
		res.status(500).json({ success: false, message: error.message })
	}
}