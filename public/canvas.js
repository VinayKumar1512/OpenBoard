/*
<- canvas -> 
 canvas is an HTML element with the help of which we can perform drawing graphics.
 canvas api -> Canvas API provides a means for drawing graphics via JavaScript and the HTML <canvas>
 element.
 With the help of canvas api,we can draw on html canvas element
 Browser provides us with the canvas api
*/

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

/*undo redo tracker array to keep track of graphics till happend
-> which help in performing undoredo operations*/
let undoRedoTracker = [];
let track = 0;

let pencilColor = "black";
let eraserColor= "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value; 

/*Canvas API
-> In order to draw onto the canvas we need to get a special reference to the drawing area 
called a context ,we can say it like an api
-> We get this special reference by using HTMLCanvasElement.getContext() method
-> We have this method access through canvas element
-> String in getContext denote 2d context, we can pass other values too
-> It provides an object that has all the drawing properties and functions you use to 
draw on the canvas.
Basically it indirectly provides access to canvas internal functioning.
*/
let tool = canvas.getContext("2d");
let mousedown = false;
//below lines shoud come before the lines i.e beginPath,moveto etc.
tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;
/*
-> beginPath-> in order to draw complex shapes on canvas, we need to set or draw a path, beginPath will
set the path or begin path from where our line will start
-> when our mouse got up and next time we draw a new path will begins,from where another graphic will start
-> moveTo(x,y)-> it defines the starting point of the line to be drawn
-> lineTo(x,y)-> its defines the endpoint of the line to be drawn
-> stroke()-> use to give color to the drawed line or make drawed line visible
*/
// tool.beginPath();
// tool.moveTo(10,10);
// tool.lineTo(100,150);
// tool.stroke();

/*on mouse down -> set new Path and starting point of line or stroke*/
canvas.addEventListener("mousedown", function (e) {
  mousedown = true;
  // beginPath(e.clientX, e.clientY);
  /*create a data object which is having x-axis and y axis of the canvas where we mousedown*/
  let data ={
    x : e.clientX,
    y :e.clientY,
  }

  //send data from frontend to the server to which our socket is connected */
  socket.emit("beginPath",data);
});

/*on mouse move draw the stroke or line*/
canvas.addEventListener("mousemove", function (e) {
  //draw only when mouse is down
  if (mousedown) {
    let data={
      color :eraserFlag ? eraserColor: pencilColor,
      width : eraserFlag ? eraserWidth : pencilWidth,
      x:e.clientX,
      y:e.clientY
    }
    
     //send stroke draw data from frontend to the server to which our socket is connected */
    socket.emit("strokeDrawing",data);
    // color = eraserFlag ? eraserColor: pencilColor;
    // width = eraserFlag ? eraserWidth : pencilWidth;
    // strokeDrawing(e.clientX, e.clientY, color, width);
  }
});

/* on mouse up -> false mousedown so that stroke is not drawn when we move mouse*/
canvas.addEventListener("mouseup", function (e) {
  mousedown = false;

//adding url of graphics drawn when we mouse up in undoredotracker array and updating track
  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;//keep track of graphic
});

//begin Path
function beginPath(obj) {
  tool.beginPath();
  tool.moveTo(obj.x, obj.y);
}
//draw a stroke or line
function strokeDrawing(obj) {
  tool.strokeStyle = obj.color;
  tool.lineWidth = obj.width;
  tool.lineTo(obj.x, obj.y);
  tool.stroke();
}

//changing color of the pencil
for (let i = 0; i < pencilColors.length; i++) {
  let colorElem = pencilColors[i];
  colorElem.addEventListener("click", function (e) {
    // console.log(e.currentTarget);
    let color = colorElem.classList[0];
    pencilColor = color;
    tool.strokeStyle = pencilColor;
  });
}

//changing pencil and stroke width
pencilWidthElem.addEventListener("change", function (e) {
  pencilWidth = pencilWidthElem.value;
  tool.lineWidth = pencilWidth;
});

//chaning eraser and stroke width 
eraserWidthElem.addEventListener("change", function (e) {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
});

/* if eraser flag is true,means eraser selected,make stroke color white and with equal to eraser width
color white because it overrides other color, i.e so make screen clear i.e white
-> else color of stroke is of pencil and width is also of pencil
*/
eraser.addEventListener("click", function (e) {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilWidth;
  }
});

//code to download the board img
download.addEventListener("click", function () {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "Board.jpg";
  a.click();
});

//undoing the changes on erasing
undo.addEventListener("click", function (e) {
  //in undo track will decrement
  if (track > 0) track--;
  console.log(track);
  // let trackObj = {
  //   trackValue: track,
  //   undoRedoTracker,
  // };
  let data = {
    trackValue: track,
    undoRedoTracker,
  };
  // undoRedoCanvas(trackObj);
  socket.emit("undoredo",data);
});

//redoing the changes on erasing
redo.addEventListener("click", function () {
  //in redo track will increment
  if (track < undoRedoTracker.length - 1) track++;
  console.log(undoRedoTracker);
  let data= {
    trackValue: track,
    undoRedoTracker,
  };
  //sending undo redo data to server
  socket.emit("undoredo",data);
  // undoRedoCanvas(trackObj);
});

//undo redo canvas method
function undoRedoCanvas(trackObj) {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;

  let url = undoRedoTracker[track];
  let img = new Image();
  img.src = url;

  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log("hello");
  };
}

//receiving data from server i.e sended to all other connected users,than we need to show it
//users have this script on there browser when the load site,thus relatime changes shown that i will
//make or they will make
//socket for single connection communication, for each individual connection show the changes

socket.on("beginPath",(data)=>{
  beginPath(data);
})

socket.on("strokeDrawing",(data)=>{
  strokeDrawing(data);
})

socket.on("undoredo",(data)=>{
  undoRedoCanvas(data);
})
