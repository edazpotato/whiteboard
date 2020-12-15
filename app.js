var size = 10;
var colour = "000000";
var toolbarHeight = 100;
var eraserMode = false;


// When the document has loaded...
document.addEventListener("DOMContentLoaded", function(){
	// Set some nice vars
	var colourPicker = document.getElementById("colourPicker");
	colour = colourPicker.value;
	var sizePicker = document.getElementById("thiccness");
	size = sizePicker.value;

	// Setup canvas
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	// Function for resizing the canvas (It gets cleared when you change the size so you need to do some magic)
	function setCanvasSizeToWindowSize(){
		var oldCanvas = canvas.toDataURL("image/png");
		var img = new Image();
		img.src = oldCanvas;
		img.addEventListener("load", function(){
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight-toolbarHeight;
			ctx.drawImage(img, 0, 0);
		});
	}
	setCanvasSizeToWindowSize();

	// Load canvas from localstorage if it's in there
	localStorageData = localStorage.getItem("whiteboard");
	if (localStorageData) {
		data = JSON.parse(localStorageData);
		var img = new Image();
		img.src = data.canvasState;
		ctx.drawImage(img, 0, 0);
	}

	// Function for saving the current canvas to localstorage
	function saveCanvasToLocalStorage(){
		var canvasData = canvas.toDataURL("image/png");
		localStorage.setItem("whiteboard", JSON.stringify({canvasState: canvasData}))
	}
	setInterval(saveCanvasToLocalStorage, 100)

	var painting = false;

	function startPosition(e){
		painting = true;
		draw(e);
	}

	function finishedPosition(){
		painting = false;
		ctx.beginPath();
	}

	function draw(e){
		if (!painting) {
			return;
		}

		ctx.lineWidth = size;
		
		ctx.lineCap = 'round';

		ctx.strokeStyle = colour;

		ctx.lineTo(e.clientX, e.clientY-toolbarHeight);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY-toolbarHeight);
	}

	// Events
	window.addEventListener("resize", setCanvasSizeToWindowSize)
	document.addEventListener("mousedown", startPosition);
	document.addEventListener("mouseup", finishedPosition);
	document.addEventListener("mousemove", draw);
	colourPicker.addEventListener("change", function(e){colour = e.target.value});
	sizePicker.addEventListener("change", function(e){size = e.target.value});
	document.getElementById("clearButton").addEventListener("click", function(e){ctx.clearRect(0, 0, canvas.width, canvas.height)});
});
