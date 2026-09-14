const enterBtn = document.getElementById("enterBtn");
const evidenceBtn = document.getElementById("evidenceBtn");
const secretCard = document.getElementById("secretCard");
const greekCard = document.querySelector(".greek-card");



/* =========================================================
   ENTER THE WEBSITE
========================================================= */

enterBtn.addEventListener("click", function () {

    document.querySelector(".intro").style.display = "none";

    document.querySelector(".welcome").style.display = "flex";

});



/* =========================================================
   SHOW THE EVIDENCE
========================================================= */

evidenceBtn.addEventListener("click", function () {

    document.querySelector(".evidence").scrollIntoView({
        behavior: "smooth"
    });

});



/* =========================================================
   SECRET CARD
========================================================= */

secretCard.addEventListener("click", function () {

    secretCard.classList.toggle("revealed");

});



/* =========================================================
   GREEK GOD CARD
   DESKTOP HOVER + MOBILE TAP
========================================================= */

greekCard.addEventListener("click", function () {

    greekCard.classList.toggle("revealed");

});



/* =========================================================
   THE GREAT WAR
========================================================= */

const battlefield = document.getElementById("battlefield");

const playerUnits = document.querySelectorAll(".player-unit");
const enemyUnits = document.querySelectorAll(".enemy-unit");

const outpost = document.getElementById("outpost");
const battleMessage = document.getElementById("battleMessage");

const objectiveOne = document.getElementById("objectiveOne");
const objectiveTwo = document.getElementById("objectiveTwo");
const objectiveThree = document.getElementById("objectiveThree");

const armyCount = document.getElementById("armyCount");
const moraleFill = document.getElementById("moraleFill");

const victoryScreen = document.getElementById("victoryScreen");
const playAgain = document.getElementById("playAgain");


let selectedUnit = null;
let enemiesRemaining = enemyUnits.length;
let outpostCaptured = false;
let morale = 100;
let enemyTimer = null;



/* =========================================================
   GAME MESSAGE
========================================================= */

function message(text) {

    battleMessage.textContent = text;

}



/* =========================================================
   GET POSITION
========================================================= */

function getPosition(element) {

    return {
        x: element.offsetLeft + element.offsetWidth / 2,
        y: element.offsetTop + element.offsetHeight / 2
    };

}



/* =========================================================
   SELECT PLAYER UNIT
========================================================= */

playerUnits.forEach(function (unit) {

    unit.addEventListener("click", function (event) {

        event.stopPropagation();

        if (unit.classList.contains("defeated")) {
            return;
        }

        playerUnits.forEach(function (otherUnit) {
            otherUnit.classList.remove("selected");
        });

        selectedUnit = unit;

        unit.classList.add("selected");

        message("UNIT SELECTED — CHOOSE YOUR DESTINATION");

    });

});



/* =========================================================
   MOVE PLAYER UNIT
========================================================= */

battlefield.addEventListener("click", function (event) {

    if (!selectedUnit) {
        message("SELECT A UNIT FIRST");
        return;
    }

    if (
        event.target.classList.contains("enemy-unit") ||
        event.target.closest(".enemy-unit")
    ) {
        return;
    }

    const rect = battlefield.getBoundingClientRect();

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    const unitWidth = selectedUnit.offsetWidth;
    const unitHeight = selectedUnit.offsetHeight;

    x = Math.max(10, Math.min(x - unitWidth / 2, battlefield.clientWidth - unitWidth - 10));
    y = Math.max(10, Math.min(y - unitHeight / 2, battlefield.clientHeight - unitHeight - 10));

    selectedUnit.style.left = x + "px";
    selectedUnit.style.top = y + "px";

    message("ADVANCE!");

    checkOutpost();

    checkNearbyEnemies();

});



/* =========================================================
   ATTACK ENEMY
========================================================= */

enemyUnits.forEach(function (enemy) {

    enemy.addEventListener("click", function (event) {

        event.stopPropagation();

        if (!selectedUnit) {
            message("SELECT A UNIT FIRST");
            return;
        }

        if (enemy.classList.contains("defeated")) {
            return;
        }

        const playerPosition = getPosition(selectedUnit);
        const enemyPosition = getPosition(enemy);

        const distance = Math.hypot(
            playerPosition.x - enemyPosition.x,
            playerPosition.y - enemyPosition.y
        );

        if (distance > 120) {

            message("TOO FAR — MOVE CLOSER");

            return;

        }

        attackEnemy(enemy);

    });

});



/* =========================================================
   ATTACK FUNCTION
========================================================= */

function attackEnemy(enemy) {

    /* -----------------------------------------
       CREATE HP
    ----------------------------------------- */

    let hp = parseInt(enemy.dataset.hp || "100");

    /* -----------------------------------------
       ATTACK ANIMATION
    ----------------------------------------- */

    if (selectedUnit) {
        selectedUnit.classList.remove("attacking");

        void selectedUnit.offsetWidth;

        selectedUnit.classList.add("attacking");

        setTimeout(function () {
            selectedUnit.classList.remove("attacking");
        }, 350);
    }

    enemy.classList.remove("hit");

    void enemy.offsetWidth;

    enemy.classList.add("hit");

    setTimeout(function () {
        enemy.classList.remove("hit");
    }, 300);

    /* -----------------------------------------
       DAMAGE
    ----------------------------------------- */

    hp -= 30;

    hp = Math.max(0, hp);

    enemy.dataset.hp = hp;

    /* -----------------------------------------
       HP BAR
    ----------------------------------------- */

    let hpBar = enemy.querySelector(".enemy-hp");

    if (!hpBar) {

        hpBar = document.createElement("div");

        hpBar.className = "enemy-hp";

        hpBar.innerHTML = `
            <div class="enemy-hp-fill"></div>
        `;

        enemy.appendChild(hpBar);
    }

    const hpFill = hpBar.querySelector(".enemy-hp-fill");

    hpFill.style.width = hp + "%";

    /* -----------------------------------------
       ENEMY STILL ALIVE
    ----------------------------------------- */

    if (hp > 0) {

        message("HIT — ENEMY " + hp + "%");

        return;
    }

    /* -----------------------------------------
       ENEMY DEFEATED
    ----------------------------------------- */

    message("ENEMY DEFEATED.");

    setTimeout(function () {

        enemy.classList.add("defeated");

        enemy.style.pointerEvents = "none";

        enemiesRemaining--;

        objectiveTwo.textContent =
            enemiesRemaining === 0 ? "☑" : "□";

        checkVictory();

    }, 350);
}


/* =========================================================
   CHECK NEARBY ENEMIES
========================================================= */

function checkNearbyEnemies() {

    if (!selectedUnit) {
        return;
    }

    enemyUnits.forEach(function (enemy) {

        if (enemy.classList.contains("defeated")) {
            return;
        }

        const playerPosition = getPosition(selectedUnit);
        const enemyPosition = getPosition(enemy);

        const distance = Math.hypot(
            playerPosition.x - enemyPosition.x,
            playerPosition.y - enemyPosition.y
        );

        if (distance < 120) {
            message("ENEMY IN RANGE — CLICK TO ATTACK");
        }

    });

}


/* =========================================================
   CAPTURE OUTPOST
========================================================= */

function checkOutpost() {

    if (outpostCaptured || !selectedUnit) {
        return;
    }

    const playerPosition = getPosition(selectedUnit);
    const outpostPosition = getPosition(outpost);

    const distance = Math.hypot(
        playerPosition.x - outpostPosition.x,
        playerPosition.y - outpostPosition.y
    );

    if (distance < 85) {

        outpostCaptured = true;

        objectiveOne.textContent = "☑";

        outpost.querySelector("span").textContent = "⚑";

        message("OUTPOST CAPTURED.");

        checkVictory();

    }

}



/* =========================================================
   ENEMY MOVEMENT
========================================================= */

function moveEnemies() {

    if (enemiesRemaining === 0) {
        return;
    }

    enemyUnits.forEach(function (enemy) {

        if (enemy.classList.contains("defeated")) {
            return;
        }

        const livingPlayers = Array.from(playerUnits).filter(function (unit) {

            return !unit.classList.contains("defeated");

        });

        if (livingPlayers.length === 0) {
            return;
        }

        let closestPlayer = livingPlayers[0];
        let closestDistance = Infinity;

        livingPlayers.forEach(function (player) {

            const playerPosition = getPosition(player);
            const enemyPosition = getPosition(enemy);

            const distance = Math.hypot(
                playerPosition.x - enemyPosition.x,
                playerPosition.y - enemyPosition.y
            );

            if (distance < closestDistance) {

                closestDistance = distance;
                closestPlayer = player;

            }

        });

        if (closestDistance < 70) {

            morale -= 10;

            morale = Math.max(0, morale);

            moraleFill.style.width = morale + "%";

            message("THE ENEMY IS ATTACKING!");

            if (morale === 0) {

                message("YOUR ARMY HAS LOST MORALE.");

            }

            return;
        }

        const playerPosition = getPosition(closestPlayer);
        const enemyPosition = getPosition(enemy);

        const dx = playerPosition.x - enemyPosition.x;
        const dy = playerPosition.y - enemyPosition.y;

        const distance = Math.hypot(dx, dy);

        if (distance === 0) {
            return;
        }

        const step = 12;

        const newX =
            enemy.offsetLeft + (dx / distance) * step;

        const newY =
            enemy.offsetTop + (dy / distance) * step;

        enemy.style.left = Math.max(
            5,
            Math.min(
                newX,
                battlefield.clientWidth - enemy.offsetWidth - 5
            )
        ) + "px";

        enemy.style.top = Math.max(
            5,
            Math.min(
                newY,
                battlefield.clientHeight - enemy.offsetHeight - 5
            )
        ) + "px";

    });

}



/* =========================================================
   VICTORY
========================================================= */

function checkVictory() {

    if (!outpostCaptured || enemiesRemaining > 0) {
        return;
    }

    objectiveThree.textContent = "☑";

    message("VICTORY.");

    clearInterval(enemyTimer);

    setTimeout(function () {

        victoryScreen.classList.add("show");

    }, 700);

}



/* =========================================================
   PLAY AGAIN
========================================================= */

playAgain.addEventListener("click", function () {

    resetGame();

});



function resetGame() {

    selectedUnit = null;

    enemiesRemaining = enemyUnits.length;

    outpostCaptured = false;

    morale = 100;

    moraleFill.style.width = "100%";

    victoryScreen.classList.remove("show");

    objectiveOne.textContent = "□";
    objectiveTwo.textContent = "□";
    objectiveThree.textContent = "□";

    playerUnits.forEach(function (unit, index) {

        unit.classList.remove("selected");
        unit.classList.remove("defeated");

        unit.style.opacity = "1";
        unit.style.pointerEvents = "auto";

        const positions = [
            ["22%", "58%"],
            ["31%", "66%"],
            ["25%", "76%"]
        ];

        unit.style.left = positions[index][0];
        unit.style.top = positions[index][1];

    });


    enemyUnits.forEach(function (enemy, index) {

        enemy.classList.remove("defeated");

        enemy.style.opacity = "1";
        enemy.style.pointerEvents = "auto";

        const positions = [
            ["67%", "38%"],
            ["76%", "55%"],
            ["62%", "72%"]
        ];

        enemy.style.left = positions[index][0];
        enemy.style.top = positions[index][1];

    });


    message("SELECT A UNIT");

    startEnemyMovement();

}



/* =========================================================
   START ENEMY MOVEMENT
========================================================= */

function startEnemyMovement() {

    clearInterval(enemyTimer);

    enemyTimer = setInterval(function () {

        moveEnemies();

    }, 1500);

}



/* =========================================================
   START GAME
========================================================= */

startEnemyMovement();
