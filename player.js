import { RocketEnemy, AsteroidEnemy, LaserEnemy } from './enemy.js';


export class Player {
    constructor(game){
        this.game = game;
        this.width = 206;
        this.height = 66;
        // starting position of plane
        this.x = 200;
        this.y = (this.game.height-this.height)/2;
        this.image = document.getElementById('player');
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 15 ;
    }
    update(input){
        this.checkCollision();
        //Horizental movement
        this.x += this.speedX;
        if (input.includes('ArrowRight')) this.speedX = this.maxSpeed;
        else if (input.includes('ArrowLeft')) this.speedX = -this.maxSpeed;
        else this.speedX = 0;
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        //Vertical movement
        this.y += this.speedY;
        if (input.includes('ArrowDown')) this.speedY = this.maxSpeed;
        else if (input.includes('ArrowUp')) this.speedY = -this.maxSpeed;
        else this.speedY = 0;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
        //Diagonal movement normalized
        if (this.speedX !== 0 && this.speedY !== 0) {
            const diagonalSpeed = Math.sqrt(this.maxSpeed ** 2 / 2);
            this.speedX = this.speedX > 0 ? diagonalSpeed : -diagonalSpeed;
            this.speedY = this.speedY > 0 ? diagonalSpeed : -diagonalSpeed;
        }
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y+30, this.width, this.height-30);
        context.drawImage(this.image, this.x, this.y);
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (enemy instanceof RocketEnemy){
                if (
                    //collision
                    enemy.x < this.x + this.width &&
                    enemy.x + enemy.width > this.x &&
                    enemy.y+18 < this.y+30 + this.height-30 &&
                    enemy.y+18 + enemy.height-36 > this.y+30 

                ){
                    enemy.markedForDeletion = true;
                    this.game.gameOver = true;
                } else {
                    //no collision
                }
            } else if (enemy instanceof LaserEnemy || enemy instanceof AsteroidEnemy){
                if (
                    //collision
                    enemy.x < this.x + this.width &&
                    enemy.x + enemy.width > this.x &&
                    enemy.y < this.y+30 + this.height-30 &&
                    enemy.y + enemy.height > this.y+30 &&
                    enemy.alpha === 1

                ){
                    enemy.markedForDeletion = true;
                    this.game.gameOver = true;
                } else {
                    //no collision
                }
            }
            
        })
    }
}