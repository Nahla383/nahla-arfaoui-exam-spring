const express = require('express');
const app = express();

const studentRouter = require('./studentRouter');

app.use(express.json());

app.use('/api/students', studentRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `can't find ${req.originalUrl}`
    });
});

const port = 9000;
app.listen(port, () => {
    console.log(`App running on Port ${port}`);
});