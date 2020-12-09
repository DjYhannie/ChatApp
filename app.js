
const PORT = 4000;



var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

//set static folder
app.use('/static',express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");

app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/home/:username', (req,res)=>{
    const username = req.params.username;
    res.render('home',{username: username});
})

//socket io connection
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (msg)=> {
        socket.broadcast.emit('join', msg);
    });

    socket.on('message', (msg)=> {
        socket.broadcast.emit('message',msg);
    })

    socket.on('typing', (msg)=> {
        socket.broadcast.emit('typing', msg);
    })

    socket.on('disconnection', (msg)=> {
        socket.broadcast.emit('disconnection', msg);
    })
});



http.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});