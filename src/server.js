const express = require('express');
const cors = require('cors');
require('dotenv').config();

const programsRouter = require('./routes/programs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/programs', programsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 