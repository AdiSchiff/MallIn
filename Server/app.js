const express = require('express');
var app = express();
const http = require("http");
const {Server} = require("socket.io");

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

const azrieliStore = require('./routes/azrieli_tlv_store')
app.use('/api/AzrieliStore',azrieliStore);

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// app.listen(process.env.PORT);
// const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT"],
    },
});

// io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);
//     socket.on("newMessage", (id) => {
//         console.log("server received message " + id)
//         socket.broadcast.emit('newMessage',id);
//     });
// });

// const PORT = process.env.PORT || 5000; // Use the port from environment variable or default to 5000
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });