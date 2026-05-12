import { model, Schema } from 'mongoose'

const CarSchema = new Schema(
	{
		brand: { type: String, required: true },
		model: { type: String, required: true },

		category: {
			type: String,
			enum: ['miejskie', 'kompaktowe', 'SUV', 'rodzinne', 'premium', 'dostawcze'],
			required: true,
		},

		productionYear: { type: Number, required: true },

		fuelType: {
			type: String,
			required: true,
			enum: ['gaz', 'benzyna', 'disel'],
		},

		gearbox: {
			type: String,
			enum: ['manual', 'automatyczna'],
		},

		seats: { type: Number, required: true },

		pricePerHour: { type: Number, required: true },

		picture: { type: String, required: true },
	},
	{ timestamps: true },
)

const Car = model('Car', CarSchema)
export default Car;