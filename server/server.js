const express = require('express');
const cors = require('cors')

const app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.listen(process.env.PORT || 3000, () => {
    console.log('server started on port 3000');
})
