import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from "path";

import { connectToDB } from './config/db.js'
import authRoutes from "./routes/auth.route.js"
import carRoutes from "./routes/car.route.js"
import userRoutes from "./routes/user.route.js"
import adminRoutes from "./routes/admin.route.js"

const __dirname = path.resolve();

dotenv.config({
  path: '../.env',
})

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/cars", carRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)

const port = process.env.PORT || 3000

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(clientPath));

  app.use((req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

const startServer = async () => {
	try {
		await connectToDB()
		console.log('DB connected')

		app.listen(port, () => {
			console.log(`Server działa na porcie ${port}`)
		})

	} catch (e) {
		console.error('DB connection failed:', e)
		process.exit(1)
	}
}

startServer()
