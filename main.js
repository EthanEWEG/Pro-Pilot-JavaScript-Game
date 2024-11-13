import { Player } from './player.js';
import { InputHandler } from './input.js';
import { RocketEnemy, AsteroidEnemy, LaserEnemy, CloudEnemy } from './enemy.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;
    const audio = document.getElementById('game-audio');
    audio.play(); 
    audio.playbackRate = 0.8;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.totalDistance = 0;
            this.oldX = 0;
            this.backgroundLevel = 0;
            this.gameOver = false;
            this.debug = false;
            this.globalSpeed = 0;
        }
        update(deltaTime){
            this.player.update(this.input.keys);
            // handleDistance
            this.totalDistance += (deltaTime/100 + (this.player.x - this.oldX)/100);
            this.oldX = this.player.x;
            if (this.totalDistance > 3000){
                audio.playbackRate = 1;
                this.totalDistance += (deltaTime/10 + (this.player.x - this.oldX)/10);
                this.backgroundLevel = 4;
            } else if (this.totalDistance > 1000){
                audio.playbackRate = 0.95;
                this.totalDistance += (deltaTime/25 + (this.player.x - this.oldX)/25);
                this.backgroundLevel = 3;
            } else if (this.totalDistance > 500){
                audio.playbackRate = 0.9;
                this.totalDistance += (deltaTime/50 + (this.player.x - this.oldX)/50);
                this.backgroundLevel = 2;
            } else if (this.totalDistance > 200){
                audio.playbackRate = 0.85;
                this.totalDistance += (deltaTime/100 + (this.player.x - this.oldX)/100);
                this.backgroundLevel = 1;
            }
            // handleEnemies
            if (this.enemyTimer > this.enemyInterval*2){
                if (this.backgroundLevel >= 1){
                    this.globalSpeed = 0.5;
                    this.enemies.push(new AsteroidEnemy(this));
                }
                if (this.backgroundLevel >= 3){
                    this.globalSpeed = 1;
                    this.enemies.push(new LaserEnemy(this));
                    this.enemies.push(new RocketEnemy(this));
                }
                if (this.backgroundLevel === 0){
                    //this.globalSpeed = 4;
                    this.enemies.push(new RocketEnemy(this));
                    this.enemies.push(new CloudEnemy(this));
                }
                if (this.backgroundLevel === 2){
                    this.enemies.push(new RocketEnemy(this));
                    this.enemies.push(new RocketEnemy(this));
                }
                if (this.backgroundLevel === 4){
                    this.globalSpeed = 1.5;
                    this.enemies.push(new AsteroidEnemy(this));
                }
                if (this.backgroundLevel != 4){
                    this.enemies.push(new CloudEnemy(this));
                }
                this.enemies.push(new RocketEnemy(this));
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            })
        }
        draw(context){
            switch(this.backgroundLevel){
                case 1:
                    context.fillStyle = "#4c849a";
                    context.fillRect(0, 0, this.width, this.height);
                    break;
                case 2:
                    context.fillStyle = "#fdb353";
                    context.fillRect(0, 0, this.width, this.height);
                    break;
                case 3:
                    context.fillStyle = "#532b08";
                    context.fillRect(0, 0, this.width, this.height);
                    break;
                case 4:
                    context.fillStyle = "#240337";
                    context.fillRect(0, 0, this.width, this.height);
                    break;
            }
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
            this.drawScore(ctx ,this.totalDistance);
        }
        drawScore(context, totalDistance){
            context.font = "bold 56px Courier New";
            context.strokeStyle = "black";
            context.lineWidth = 3;
            context.fillStyle = "white";
            context.textAlign = "center";
            context.textBaseline = "top";
            context.strokeText(Math.floor(totalDistance)+" Meters", this.width/2, 20)
            context.fillText(Math.floor(totalDistance)+" Meters", this.width/2, 20)
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    let gameScoreSaved = false;

    function animate(timeStamp){
        if (!game.gameOver) {
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.update(deltaTime);
            game.draw(ctx);
            requestAnimationFrame(animate);
        }
        if (game.gameOver){
            audio.pause();
            gameOverScreen();
        }
    }
    animate(0);

    //function can be called below its call point because it gets hoisted!
    function gameOverScreen(){
        const gameOverDiv = document.createElement('div');
        gameOverDiv.style.position = 'absolute';
        gameOverDiv.style.top = '50%';
        gameOverDiv.style.left = '50%';
        gameOverDiv.style.transform = 'translate(-50%, -50%)';
        gameOverDiv.style.backgroundColor = 'black';
        gameOverDiv.style.padding = '20px';
        gameOverDiv.style.borderRadius = '10px';
        gameOverDiv.style.color = 'white';
        gameOverDiv.style.textAlign = 'center';
        gameOverDiv.style.fontSize = '24px';

        const message = document.createElement('p');
        message.textContent = `You reached ${Math.floor(game.totalDistance)} meters`;
        gameOverDiv.appendChild(message);

        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.style.backgroundColor = 'gray';
        playAgainButton.style.color = 'white';
        playAgainButton.style.fontSize = '20px';
        playAgainButton.style.padding = '10px';
        playAgainButton.style.marginTop = '10px';
        playAgainButton.onclick = function() {
            window.location.reload();
        };
        gameOverDiv.appendChild(playAgainButton);

        const homeButton = document.createElement('button');
        homeButton.textContent = 'Go Home';
        homeButton.style.backgroundColor = 'gray';
        homeButton.style.color = 'white';
        homeButton.style.fontSize = '20px';
        homeButton.style.padding = '10px'
        homeButton.style.marginTop = '10px';
        homeButton.onclick = function() {
            window.location.href = 'index.html';
        };
        gameOverDiv.appendChild(homeButton);

        const leaderboard = document.createElement('div');
        leaderboard.style.marginTop = '20px';

        const scores = getLeaderboard();
        const leaderboardTitle = document.createElement('p');
        leaderboardTitle.textContent = 'Leaderboard:';
        leaderboard.appendChild(leaderboardTitle);

        scores.forEach(score => {
            const scoreText = document.createElement('p');
            scoreText.textContent =  score + " meters";
            leaderboard.appendChild(scoreText);
        })

        if (!gameScoreSaved){
            saveScore(Math.floor(game.totalDistance));
            gameScoreSaved = true;
        }

        gameOverDiv.appendChild(leaderboard);
        document.body.appendChild(gameOverDiv);
    }

    function getLeaderboard() {
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        return leaderboard.sort((a, b) => b - a).slice(0, 5); 
    }
    
    function saveScore(score) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(score);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }
});
