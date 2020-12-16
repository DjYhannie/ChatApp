const PORT = process.env.PORT || 5000;

var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var path = require("path");

//set static folder
app.use("/static", express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

let username = "";

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home/:username", (req, res) => {
  username = req.params.username;
  res.render("home", { username: username });
});

let activeUser = [];

function addActive(id, username) {
  let result = activeUser.findIndex((element) => element.username == username);
  if (result == -1) {
    activeUser.push({ id: id, username: username });
  }
  console.log(activeUser);
  return activeUser;
}

function leaveUser(id) {
  let result = activeUser.findIndex((element) => element.id == id);
  console.log(result)
  activeUser.splice(result, 1);
  return activeUser;
}

//socket io connection
io.on("connection", (socket) => {
  io.emit("checkactiveUser", addActive(socket.id, username));
  console.log("a user connected");

  socket.on("join", (msg) => {
    socket.broadcast.emit("join", msg);
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  socket.on("typing", (msg) => {
    socket.broadcast.emit("typing", msg);
  });

  socket.on("disconnection", (msg) => {
    socket.broadcast.emit("disconnection", msg);
  });

  socket.on("disconnect", function () {
    io.emit("checkactiveUser", leaveUser(socket.id));
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
