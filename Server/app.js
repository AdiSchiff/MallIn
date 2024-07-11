const express = require('express');
var app = express();
const http = require("http");
const navigationController = require("./controllers/navigation");


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({limit: "1000mb"}));
app.use(bodyParser.urlencoded({extended: true}));

const cors = require('cors');
app.use(cors());

const custumeEnv = require('custom-env');
custumeEnv.env(process.env.NODE_ENV, './config');

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.static('public'));

const user = require('./routes/user')
app.use('/api/Users',user);

const login = require('./routes/login')
app.use('/api/Tokens',login);

const azrieliStore = require('./routes/azrieli_store')
app.use('/api/AzrieliStore',azrieliStore);

const navigation = require('./routes/navigation')
app.use('/api/Navigation',navigation);

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await navigationController.getGraphInstance();
});
