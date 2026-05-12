import mongoose, { model, Schema } from 'mongoose'

const ReservationSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User' },

		car: {
			type: Schema.Types.ObjectId,
			ref: 'Car',
			required: true,
		},

		startDate: {
			type: Date,
			required: true,
		},

		endDate: {
			type: Date,
			required: true,
			validate: {
				validator: function (value) {
					return value > this.startDate
				},
				message: 'Data zakonczenia musi byc pozniejsza niz pozyczenia',
			},
		},

		status: {
			type: String,
			enum: ['aktywna', 'anulowana', 'zakonczona'],
			default: 'aktywna',
		},

		priceSummary: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
)

const Reservation = model('Reservation', ReservationSchema)
export default Reservation
