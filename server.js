//In order to use external node modules we need to require them
const express= require("express");
const socket= require("socket.io");

const app = express();//initialized the app -> app is nothing consider it as a server or object

app.use(express.static("public"));

//server is listing to the request made to the port 5000
let port=5000;
let server = app.listen(port,function(){
 console.log("Server Running at Port 5000");
})


//it is basically tells connection estabished or not,if estalished it return a io object
let io= socket(server);
//io -> represnet group fo sockets,it's for communicating group of sockets or computers
//checking connection establishment
//on is used for event handling
// on connection establishment with all computers
io.on("connection",(socket)=>{
    //socket object is send on connection establishment
    //socket is for communicating with each individaul connection.
    console.log("Connection Established");

    //received data from a single computer i.e send to server that data is recieved
    //if event is beginPath than send data to all connected computer through socket
    //received data from an individual connection
    socket.on("beginPath",(data)=>{
    //transfer data to all connected computers -> communicationg with all other computers
      io.sockets.emit("beginPath",data);
    })

    socket.on("strokeDrawing",(data)=>{
        io.sockets.emit("strokeDrawing",data);
    })

    socket.on("undoredo",(data)=>{
        io.sockets.emit("undoredo",data);
    })
})
