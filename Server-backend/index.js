const app = require('./App');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to DB')
})

app.listen(port, () => {
    console.log('Server is running on port:', port)
});
