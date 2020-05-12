var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
var time;
var interval;
var numBalls = 20;
var max;
var scores = [];
var retrievedData = JSON.parse(localStorage.getItem("highScorebb"));
if (Array.isArray(retrievedData)) {
    retrievedData.sort();
} else {
    retrievedData = [];
}

class Ball {
    constructor(x, y, dx, dy, r, rock) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.rock=rock;
        this.color = chColor();
        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            if(this.rock){
                var image= new Image();
                image.src="rock.png";
                ctx.drawImage(image, this.x-this.r,this.y-this.r,2*this.r,2*this.r);
            }else{
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        this.update = function () {
            var self = this;
            self.x += self.dx;
            self.y += self.dy;
            if (self.x > W - self.r) {
                self.x = W - self.r;
                self.dx = -self.dx;
            } else if (self.x < self.r) {
                self.x = self.r;
                self.dx = -self.dx;
            }
            if (self.y > H - self.r) {
                self.y = H - self.r;
                self.dy = -self.dy;
            } else if (self.y < self.r) {
                self.y = self.r + 1;
                self.dy = -self.dy;
            }
            self.draw();
        }
    }
}

var gamePaused = false;
var balls = [];

function pauseGame() {
    if (!gamePaused) {
        int = clearInterval(int);
        interval=clearInterval(interval);
        gamePaused = true;
    } else if (gamePaused) {
        int = setInterval(animate, 1000 / 60);
        var startTime=Date.now();
        interval=setInterval(function(){
            var elapsedTime = Date.now() - startTime;
            time = (elapsedTime / 1000).toFixed(3);
            console.log(time);
        },100);
        gamePaused = false;
    }
}

function main() {
    balls = [];
    for (var i = 0; i < numBalls; i++) {
        var x = Math.random() * W;
        var y = Math.random() * H;
        var r = Math.random() * 20 + 40;
        balls.push(new Ball(x, y, Math.random() * 4, Math.random() * 4, r, false));
    }
}
main();
var area = [];
var sum = 0;

document.addEventListener('keydown', function (key) {
    if (key.which == 32) {
        pauseGame();
    }
})
var mouse = {
    x: 0,
    y: 0
}
var score=0;
var rClick=0;
let rect = canvas.getBoundingClientRect();

canvas.addEventListener("click", function (e) {
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    for (let i = 0; i < balls.length; i++) {
        var d = Math.sqrt((balls[i].x - mouse.x) ** 2 + (balls[i].y - mouse.y) ** 2);
        if (d < balls[i].r) {
            if(balls[i].rock){
                if(rClick<6){
                    rClick++;
                    var rockm=new Audio("rock.mp3");
                    rockm.play();
                    if(rClick==5){
                        score=score+balls[i].r;
                        document.getElementById("score").innerText=Math.floor(score);
                        balls.splice(i, 1);
                        rClick=0;
                    }
                }
            }else{
                var burst=new Audio("burst.mp3");
                burst.play();
                score=score+balls[i].r;
                document.getElementById("score").innerText=Math.floor(score);
                balls.splice(i, 1);
            }
        }
    }
})
function checkSum(){
    var res;
    for (let i = 0; i < balls.length; i++) {
        area[i] = Math.PI * balls[i].r * balls[i].r;
        sum = sum + area[i];
    }
    res=sum;
    sum=0;
    return res;
}
function chColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var mouseDown = false;
var no= 0;
var nor=0;
var n=1;
var b=3;
var br=6;
var cd=5;
var countdown=true;
var f=false;
var rb=1;
setInterval(function(){
    for(let i=0;i<balls.length;i++){
        balls[i].color=chColor();
    }
},500)

function highScore() {
    if (localStorage.getItem("highScorebb")) {
        var retrievedData = JSON.parse(localStorage.getItem("highScorebb"));
        retrievedData.sort();
        max = retrievedData[retrievedData.length - 1];
        document.getElementById("highscore").textContent = max;
    }
}
highScore();
function animate() {
    ctx.clearRect(0, 0, W, H);
    if ( time>=2.5*n && no<b && !f) {
        var r = Math.random() * 20 + 40;
        balls.push(new Ball(Math.random()*W, Math.random()*H, Math.random() * 5, Math.random() * 5, r, false));
        checkSum();
        if(no==2){
            no=0;
            n++;
            b++;
        }
        no++;
    }
    if(checkSum()>336000 && countdown){
        var int = setInterval(function(){
            document.getElementById("timer").innerText=cd;
            cd--;
            if(cd==-1){
                scores.push(parseInt(score));
                scores.filter((value,index) => scores.indexOf(value) != index);
                var str = JSON.stringify(scores);
                localStorage.setItem("highScorebb", str);
                highScore();
                alert("Well Played!")
                restartGame();
            }
            if(checkSum()<336000){
                clearInterval(int);
                countdown=true;
                cd=10;
            }
        },1000)
        countdown=false;
    }
    if(score>700*rb && nor<br){
        var r = Math.random() * 20 + 50;
        balls.push(new Ball(Math.random()*W, Math.random()*H, Math.random() * 5, Math.random() * 5, r, true));
        checkSum();
        nor++;
        if(nor==br){
            rb++;
            nor=0;
        }
    }
    if(balls.length==0){
        scores.push(parseInt(score));
        scores.filter((value,index) => scores.indexOf(value) != index);
        var str = JSON.stringify(scores);
        localStorage.setItem("highScorebb", str);
        highScore();
        alert("Congrats!! You cleared all the balls.");
        restartGame();
    }

    for (var ball1 of balls) {
        ball1.update();
        for (var ball2 of balls) {
            if (ball1 !== ball2) {
                var collision = checkCollision(ball1, ball2);
                if (collision[0]) {
                    adjustPositions(ball1, ball2, collision[1]);
                    resolveCollision(ball1, ball2);
                }
            }
        }
    }
}

function checkCollision(ballA, ballB) {
    var rSum = ballA.r + ballB.r;
    var dx = ballB.x - ballA.x;
    var dy = ballB.y - ballA.y;
    return [rSum * rSum > dx * dx + dy * dy, rSum - Math.sqrt(dx * dx + dy * dy)];
}

function resolveCollision(ballA, ballB) {
    var relvelocity = [ballB.dx - ballA.dx, ballB.dy - ballA.dy];
    var normal = [ballB.x - ballA.x, ballB.y - ballA.y];
    var magnitude = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
    normal = [normal[0] / magnitude, normal[1] / magnitude];
    
    var velocityAlongnormal = relvelocity[0] * normal[0] + relvelocity[1] * normal[1];
    if (velocityAlongnormal > 0)
        return;
    
    var bounce = 1;
    var j = -(1 + bounce) * velocityAlongnormal;
    j /= 1 / ballA.r + 1 / ballB.r;
    
    var impulse = [j * normal[0], j * normal[1]];
    ballA.dx -= 1 / ballA.r * impulse[0];
    ballA.dy -= 1 / ballA.r * impulse[1];
    ballB.dx += 1 / ballB.r * impulse[0];
    ballB.dy += 1 / ballB.r * impulse[1];
}

function adjustPositions(ballA, ballB, depth) {
    var correction = (Math.max(depth, 0) / (1 / ballA.r + 1 / ballB.r));
    var normal = [ballB.x - ballA.x, ballB.y - ballA.y];
    var magnitude = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
    normal = [normal[0] / magnitude, normal[1] / magnitude];
    correction = [correction * normal[0], correction * normal[1]];
    ballA.x -= 1 / ballA.r * correction[0];
    ballA.y -= 1 / ballA.r * correction[1];
    ballB.x += 1 / ballB.r * correction[0];
    ballB.y += 1 / ballB.r * correction[1];
}
function start(){
    var startTime = Date.now();
    interval = setInterval(function(){
        var elapsedTime = Date.now() - startTime;
        time = (elapsedTime / 1000).toFixed(3);
        console.log(time);
    }, 100);
}
var fcd=6;
var felixClicks=0;
function felix(){
    if(felixClicks<2){
        var fint=setInterval(function(){
            fcd--;
            f=true;
            if(fcd==-1){
                f=false;
                clearInterval(fint);
            }
        },1000)
        felixClicks++;
    }if(felixClicks==2){
        document.getElementById("felix").style.display="none";
    }
}
function gaunlet(){
    for(let i=0; i<balls.length;i++){
        balls.pop()
    }
    document.getElementById("gaunlet").style.display="none";
}
function restartGame(){
    location.reload(true);
}
var int;
function play(){
    document.getElementById("play").style.display="none";
    document.getElementById("myCanvas").style.visibility="visible";
    document.getElementById("felix").style.visibility="visible";
    document.getElementById("gaunlet").style.visibility="visible";
    start();
    int = setInterval(animate, 1000 / 60);   
}
