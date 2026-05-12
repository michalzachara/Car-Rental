import { model, Schema } from 'mongoose'

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},

		password: {
			type: String,
			required: true,
		},

		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},

		reservations: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Reservation',
			},
		],
	},
	{ timestamps: true },
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = model('User', UserSchema)
export default User;