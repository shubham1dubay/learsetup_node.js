const express = require('express');
const helmet = require('helmet');// 12.2k(gzipped: 3.2k)
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const authRouters = require('./routers/authRouters');

const app = express();
app.use(cors())
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Data Base connected")
}).catch((err) => {
    console.log(err)
});
app.use('/api/auth', authRouters)
app.get('/', (req, res) => {
    res.json({ message: "Hello from the server" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port `);
});
