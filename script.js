var	canvas = document.getElementById('myCanvas'); 
var ctx = canvas.getContext('2d');

//#region Positioning
var x = (canvas.width/2)+Math.floor(Math.random()*21)-10;
var y = (canvas.height - 30)+Math.floor(Math.random()*21)-10;
var dx = Math.random() * (7 - 3) + 3;
var dy = -dx;
//#endregion
var ballRadius = 25;
var ball = new Image();
ball.src = "http://pngimg.com/uploads/football/football_PNG52790.png";



//#region Paddle Variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
//#endregion

//#region Is Left or Right Being Pressed
var isRight = false;
var isLeft = false;
//#endregion

//#region Bricks 
var brickRowCount = 2;
var brickColCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
initialiseBricks();
function initialiseBricks(){
	for (c = 0; c < brickColCount; c++) {
		bricks[c] = [];
			for (r = 0; r < brickRowCount; r++) {
			bricks[c][r] = {x:0, y:0, status:1};
			
			}
			
		}
}


//#endregion

var score = 0;

var lives = 3;

var levels = 1; 
var maxLevel = 5;

var isPaused = false;

//Event listener for button down (left and Right)
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove",mouseMoveHandler);

function keyDownHandler(e){
	if (e.keyCode == 39 || e.keyCode == 68) {
		isRight = true;
	}
	else if (e.keyCode == 37 || e.keyCode == 65) {
		isLeft = true;
	}
}
 
function keyUpHandler(e){
	if (e.keyCode == 39 || e.keyCode == 68) {
		isRight = false;
	}
	else if (e.keyCode == 37 || e.keyCode == 65) {
		isLeft = false;
	}
}

function mouseMoveHandler(e){

	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 + paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
		paddleX = relativeX - paddleWidth/2;
	}
}

function clearCanvas(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawBall (){
	
		ctx.drawImage(ball,x,y,ballRadius,ballRadius);
		
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, (canvas.height-paddleHeight)-10, paddleWidth, paddleHeight);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();

}

function drawBricks(){
	//create an 2D array where the bricks will be stored
	for (c = 0; c < brickColCount; c++){
		for (r = 0; r < brickRowCount; r++) {
			//If brick is active and not destroyed, draw the brick
			if (bricks[c][r].status == 1) {
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX,brickY,brickWidth,brickHeight);
				ctx.fillStyle = "light blue";
				ctx.fill();
				ctx.closePath();
			}
			
		} 
	}
}

function collisionDetection(){
	//collision detection for each brick in the array
	for (let c = 0; c < brickColCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			//b is assigned as the current brick in the array for which the comparison is being made
			var b = bricks[c][r];
			//if break collides with ball and status is active, change ball direction and disable brick
			if (b.status == 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					//brickRowCount*brickColCount
					if (score == brickRowCount*brickColCount) {
						if (levels == maxLevel) {
							document.location.reload();
							alert("You Win!");
						}else{
							levels++;
							brickRowCount++;
							initialiseBricks();
							score = 0;
							dx += 1;
							dy = -dy;
							dy -= 1
							x = (canvas.width/2)+Math.floor(Math.random()*21)-10;
							y = (canvas.height - 30)+Math.floor(Math.random()*21)-10;
							paddleX = (canvas.width-paddleWidth)/2;
							isPaused = true;

							//#region Pause Screen
							ctx.beginPath();
							ctx.rect(0,0,canvas.width,canvas.height);
							ctx.fillStyle = "#0085DD";
							ctx.fill();
							ctx.font = "24px Papyrus";
							ctx.fillStyle = "#000000";
							ctx.fillText("Level " + (levels - 1) + " completed", 170, 150);
							ctx.closePath();

							setTimeout(function(){
								isPaused = false;
								draw();
							},3000);
							//#endregion
							

						}
					}
				}
			}	
		}
	}
}



function drawScore(){
	ctx.font = "20px Papyrus";
	ctx.fillStyle = "#000000";
	ctx.fillText("Score: "+score, 8, 20);
}

function drawLives(){
	ctx.font = "20px Papyrus";
	ctx.fillStyle = "#000000";
	ctx.fillText("Lives: " + lives, canvas.width-100, 20);
}

function drawLevel(){
	ctx.font = "20px Papyrus";
	ctx.fillStyle = "#000000";
	ctx.fillText("Level: " + levels, canvas.width-270, 20);
}


function draw(){
	//Drawing code
	clearCanvas();
	drawBall();
	drawPaddle();
	drawBricks();
	collisionDetection();
	drawScore();
	drawLives();
	drawLevel();

//#region Collision Code
	if (y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		}else{
			lives--;
			if (!lives) {
				alert("Game Over!")
				document.location.reload();
			}else{
				x = (canvas.width/2)+Math.floor(Math.random()*21)-10;
				y = (canvas.height - 30)+Math.floor(Math.random()*21)-10;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
};


if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
	dx = -dx;
}

//#endregion

//#region Move Paddle
	if (isRight && paddleX < canvas.width-paddleWidth) {
		paddleX += 7;
	}
	else if (isLeft && paddleX > 0) {
		paddleX -= 7;
	}
//#endregion

x += dx;
y += dy;
if (!isPaused) {
	requestAnimationFrame(draw);
}

}

draw();