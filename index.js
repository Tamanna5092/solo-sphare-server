const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 9000

const app = express()

const corsOperation = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credential: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOperation))
app.use(express.json())

app.listen(port, () => console.log(`Server running on port ${port}`))