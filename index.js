const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./config/keys');


mongoose.connect(config.mongoURI, { useNewUrlParser:true });
require('./models/Demand');
require('./models/Registration');


app.use(bodyParser.json());

require("./routes/dialogeFlowRoutes")(app);
require('./routes/fullfilmentRoutes')(app);


if (process.env.NODE_ENV === 'production') {
    // js and css files
    app.use(express.static('client/build'));

    // index.html for all page routes
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
