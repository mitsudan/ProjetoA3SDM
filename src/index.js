const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controles/authController')(app);
require('./controles/projectController')(app);

app.listen(3000);
