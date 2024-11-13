class Enemy{
    constructor(){
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.markedForDeletion = false;
        this.globalSpeed = 0;
    }
    update(){
        //movement
        this.x += this.speedX;
        this.y += this.speedY;
        
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y)
    }
}

export class RocketEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 163;
        this.height = 69;
        this.globalSpeed = game.globalSpeed;
        this.x = -200 + Math.random() * -400;
        this.y = (this.game.height-this.height) * Math.random();
        this.speedX = this.globalSpeed + 8 + Math.random() * 3;
        this.speedY = 0;
        this.image = document.getElementById("missile");
    }
    update(){
        super.update();
        //check if off screen
        if (this.x > this.game.width + this.width) this.markedForDeletion = true;
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y+18, this.width, this.height-36);
        context.drawImage(this.image, this.x, this.y)
    }
}

export class AsteroidEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 92;
        this.height = 70;
        this.globalSpeed = game.globalSpeed;
        if (Math.random() < 0.33){
            this.x = this.game.width + this.width;
            this.y = (this.game.height) * Math.random();
        } else {
            this.x = (this.game.width * Math.random())+300;
            this.y = 0 - this.height;
        }   
        this.speedX = -(this.globalSpeed + 4 + Math.random() * 6);
        this.speedY = (this.globalSpeed + 2 + Math.random() * 3);
        this.image = document.getElementById("meteor");
        this.alpha = 1;
    }
    update(){
        super.update();
        //check if off screen
        if ((this.x < 0 - this.width) || (this.y > this.game.height + this.height)) this.markedForDeletion = true;
    }
}

export class LaserEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 1280;
        this.height = 20;
        this.x = 0;
        this.y = (this.game.height - this.height) * Math.random();
        this.speedX = 0;
        this.speedY = 0;
        this.image = document.getElementById("laser");
        this.alpha = 0;
        this.elapsedTime = 0;
    }
    update(deltaTime){
        super.update();
        this.elapsedTime += deltaTime;
        if (this.elapsedTime < 3000){
            this.alpha = this.elapsedTime / 6000;
        } else if (this.elapsedTime < 5000){
            this.alpha = 1;
        } else {
            //remove from screen
            this.markedForDeletion = true;
        }
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.save();
        context.globalAlpha = this.alpha;
        context.drawImage(this.image, this.x, this.y);
        //reset for other drawings
        context.restore();
    }
}

export class CloudEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 486;
        this.height = 226;
        this.globalSpeed = game.globalSpeed;
        this.x = this.game.width;
        this.y = (this.game.height - this.height) * Math.random();
        this.speedX = -(this.globalSpeed + 4 + Math.random() * 3);;
        this.speedY = 0;
        this.cloudType = Math.random();
        if (this.cloudType < 0.25){
            this.image = document.getElementById("cloud1");
        } else if (this.cloudType < 0.5){
            this.image = document.getElementById("cloud2");
        } else if (this.cloudType < 0.75){
            this.image = document.getElementById("cloud3");
        } else{
            this.image = document.getElementById("cloud4");
        }
        this.alpha = 0.75 + (1 - 0.75) * Math.random();
    }
    update(){
        super.update()
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
        context.save();
        context.globalAlpha = this.alpha;
        context.drawImage(this.image, this.x, this.y);
        context.restore();
    }
}