const collision = () => {
    let dino_hitbox = dino.getBoundingClientRect();
    let cactus_hitbox = obstacles[random].getBoundingClientRect();

    return !(dino_hitbox.right < cactus_hitbox.left || 
        dino_hitbox.left > cactus_hitbox.right || 
        dino_hitbox.bottom < cactus_hitbox.top || 
        dino_hitbox.top > cactus_hitbox.bottom);
}

const dino = document.getElementById("dino");
const game = document.getElementById("game");
const cactus1 = document.getElementById("cactus1");
const cactus2 = document.getElementById("cactus2");
const cactus3 = document.getElementById("cactus3");

const start_Button = document.getElementById("button");
const score = document.getElementById("score");
const pause = document.getElementById("pause");
const restart = document.getElementById("restart");

const obstacles = [cactus1, cactus2, cactus3];
const obstacles_classes = ["cactus1", "cactus2", "cactus3"];

var game_started = false;
var random;
var random_delay;
var dead = false;
var speed = 2;

start_Button.addEventListener("click", () => {
    start_Button.style.display = "none"
    game.classList.add("start");
    game.style.animationPlayState = "running";
    dino.style.animationPlayState = "running";
    speed = 2;

    setTimeout(() => {
        game_started = true;
        random = Math.floor(Math.random() * 3);
        
        obstacles[random].style.display = "inline-block";
        obstacles[random].style.animationDuration = speed+"s";
        obstacles[random].classList.add(obstacles_classes[random]);
    }, 10);
});

obstacles.forEach(obs => obs.addEventListener("animationend", () => {
    obs.classList.remove(obstacles_classes[random]);
    obs.style.display = "none";

    random_delay = 800 - Math.floor(Math.random() * 700);
    setTimeout(() => {
        random = Math.floor(Math.random() * 3);

        obstacles[random].style.display = "inline-block";
        obstacles[random].style.animationDuration = speed+"s";
        obstacles[random].classList.add(obstacles_classes[random]);
    }, random_delay);
}));

var dino_animation = setInterval(() => {
    if (game_started){
        dino.innerHTML = "<img src='sprites/dino_run1.png' alt='dino_run1'></img>";
        setTimeout(() => {
            dino.innerHTML = "<img src='sprites/dino_run2.png' alt='dino_run2'></img>";
        }, 200);
    }
}, 400);

document.addEventListener("click", () => {
    if (game_started && dino.classList != "jump1"){
        dino.classList.add("jump1");
    }
});

dino.addEventListener("animationend", () => {
    dino.classList.remove("jump1");
    dino.classList.remove("jump2");
});

var score_points = setInterval(() => {
    if (game_started){
        score.innerHTML = parseInt(score.innerHTML) + 10;
    }

    if (game_started && score.innerHTML >= 3000 && score.innerHTML < 6000) {
        speed = 1.5;
    }

    if (game_started && score.innerHTML >= 6000 && score.innerHTML < 12000) {
        speed = 1;
    }

    if (game_started && score.innerHTML >= 12000) {
        speed = .8;
    }

    game.style.animationDuration = speed*0.75+"s";
}, 100);

const detect_collision = setInterval(() => {
    if (game_started && collision()){
        game_started = false;

        dino.style.animationPlayState = "paused";
        obstacles[random].style.animationPlayState = "paused";
        game.style.animationPlayState = "paused";

        restart.style.display = "block";

        dead = true;
    }
}, 10);

document.addEventListener("keydown", (event) => {
    if (event.key == " " && game_started && !dead){
        dino.style.animationPlayState = "paused";
        obstacles[random].style.animationPlayState = "paused";
        game.style.animationPlayState = "paused";

        game_started = false;

        pause.style.display = "block";
    } else if (event.key == " " && !game_started && !dead){
        dino.style.animationPlayState = "running";
        obstacles[random].style.animationPlayState = "running";
        game.style.animationPlayState = "running";

        game_started = true;

        pause.style.display = "none";
    }
});

restart.addEventListener("click", () => {
    if (!game_started){
        score.innerHTML = 0;

        dino.classList.remove("jump1");
        obstacles[random].classList.remove(obstacles_classes[random]);
        obstacles[random].style.display = "none";

        restart.style.display = "none"
        obstacles[random].style.animationPlayState = "running";

        dino.innerHTML = "<img src='sprites/dino_default.png' alt='dino_stand'></img>";

        setTimeout(() => {
            start_Button.style.display = "block"
            dead = false;
        }, 10);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key == "z" && dino.classList != "jump2"){
        dino.classList.add("jump2");
    }
})