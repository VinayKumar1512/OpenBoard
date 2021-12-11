let optionsContainer = document.querySelector(".options_container");
/* default value -> true i.e we want to show 
   options when we visit site*/
let optionsFlag = true;
let toolsCont = document.querySelector(".tools_container");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilFlag = false;
let eraserFlag = false;
let stickyNotes = document.querySelector(".sticky-notes");
let upload = document.querySelector(".upload");

//optionsFlag-> true- tools are open, false -> tools are closed
optionsContainer.addEventListener("click", function () {
  optionsFlag = !optionsFlag;
  if (optionsFlag) {
    openTools();
  } else {
    closeTools();
  }
});

function openTools() {
  let iconElem = optionsContainer.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "flex";
}

function closeTools() {
  let iconElem = optionsContainer.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  toolsCont.style.display = "none";

  /* Also Closing pencil and eraser container on closing tools container*/
  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

/* toggling pencil Container-> when we click on pencil-> show on click,
if we click again hide it*/
pencil.addEventListener("click", function () {
  pencilFlag = !pencilFlag;
  if (pencilFlag) pencilToolCont.style.display = "block";
  else pencilToolCont.style.display = "none";
});

/*toggling eraser Container*/
eraser.addEventListener("click", function () {
  eraserFlag = !eraserFlag;
  if (eraserFlag) eraserToolCont.style.display = "flex";
  else eraserToolCont.style.display = "none";
});

/*code to upload a file on board*/
upload.addEventListener("click", function () {
  //Open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  /*on change of input element*/
  input.addEventListener("change", function () {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    //create a stikcy template to show uploaded img or document
    let stickyTemplateHTML = `<div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
     </div>
     <div class="note-cont">
        <img src=${url}>
     </div>`;

    createSticky(stickyTemplateHTML);
  });
});

/* clicking on stickyNotes icon => create a sticky note */
stickyNotes.addEventListener("click", function () {
  let stickyTemplateHTML = `<div class="header-cont">
 <div class="minimize"></div>
 <div class="remove"></div>
</div>
<div class="note-cont">
 <textarea spellcheck="false"> </textarea>
</div>`;

  createSticky(stickyTemplateHTML);
});

function createSticky(stickyTemplateHTML) {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = stickyTemplateHTML;

  document.body.appendChild(stickyCont);

  /*minimize or remove sticky note on clicking on minimize and remove*/
  let minimize = stickyCont.querySelector(".minimize");
  let remove = stickyCont.querySelector(".remove");
  noteActions(minimize, remove, stickyCont);

  //drag and drop functionality on sticky note
  stickyCont.onmousedown = function (event) {
    dragandDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
}
/*drag and drop functionality method*/
function dragandDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}

// minimizing and removing sticky note method
function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", function () {
    stickyCont.remove();
    // console.log(remove);
  });

  minimize.addEventListener("click", function () {
    let noteCont = stickyCont.querySelector(".note-cont");
    //below method -> check display on an element i.e of noteCont here
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    // if it's none make display block i.e show noteCont else make it none

    if (display === "none") noteCont.style.display = "block";
    else noteCont.style.display = "none";
    // console.log(minimize);
  });
}
