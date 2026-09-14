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
========================================================= */

greekCard.addEventListener("click", function () {

    greekCard.classList.toggle("revealed");

});


/* =========================================================
   GREAT WAR
========================================================= */

const battlefield = document.getElementById("battlefield");

const playerUnits =
    document.querySelectorAll(".player-unit");

const enemyUnits =
    document.querySelectorAll(".enemy-unit");

const outpost =
    document.getElementById("outpost");

const battleMessage =
    document.getElementById("battleMessage");

const objectiveOne =
    document.getElementById("objectiveOne");

const objectiveTwo =
    document.getElementById("objectiveTwo");

const objectiveThree =
    document.getElementById("objectiveThree");

const armyCount =
    document.getElementById("armyCount");

const moraleFill =
    document.getElementById("moraleFill");

const victoryScreen =
    document.getElementById("victoryScreen");

const playAgain =
    document.getElementById("playAgain");


/* =========================================================
   GAME STATE
========================================================= */

let selectedUnit = null;

let enemiesRemaining =
    enemyUnits.length;

let outpostCaptured = false;

let morale = 100;

let enemyTimer = null;

let gameOver = false;


/* =========================================================
   UNIT STATS
========================================================= */

const PLAYER_MAX_HP = 100;
const ENEMY_MAX_HP = 100;

const PLAYER_DAMAGE = 20;
const ENEMY_DAMAGE = 15;

const PLAYER_ATTACK_RANGE = 125;
const ENEMY_ATTACK_RANGE = 105;

const ENEMY_MOVE_SPEED = 7;

const ENEMY_ATTACK_COOLDOWN = 1300;


/* =========================================================
   MESSAGE
========================================================= */

function message(text) {

    battleMessage.textContent = text;

}


/* =========================================================
   POSITION
========================================================= */

function getPosition(element) {

    return {

        x:
            element.offsetLeft +
            element.offsetWidth / 2,

        y:
            element.offsetTop +
            element.offsetHeight / 2

    };

}


/* =========================================================
   HP BAR
========================================================= */

function createHPBar(unit, hp, isEnemy) {

    let hpBar =
        unit.querySelector(".unit-hp");

    if (!hpBar) {

        hpBar =
            document.createElement("div");

        hpBar.className =
            "unit-hp";

        hpBar.innerHTML = `
            <div class="unit-hp-fill"></div>
        `;

        unit.appendChild(hpBar);

        hpBar.style.position = "absolute";
        hpBar.style.left = "50%";
        hpBar.style.top = "-8px";
        hpBar.style.transform =
            "translateX(-50%)";

        hpBar.style.width = "52px";
        hpBar.style.height = "5px";

        hpBar.style.background =
            "rgba(15, 8, 5, .9)";

        hpBar.style.border =
            "1px solid rgba(220, 190, 145, .65)";

        hpBar.style.pointerEvents =
            "none";

        hpBar.style.zIndex = "60";

        hpBar.style.boxSizing =
            "border-box";

        const fill =
            hpBar.querySelector(
                ".unit-hp-fill"
            );

        fill.style.display = "block";
        fill.style.width = "100%";
        fill.style.height = "100%";

        fill.style.transition =
            "width .35s ease";

        fill.style.background =
            isEnemy
                ? "#8f3028"
                : "#58748a";

    }

    updateHPBar(unit, hp);

    return hpBar;

}


function updateHPBar(unit, hp) {

    const hpBar =
        unit.querySelector(".unit-hp");

    if (!hpBar) {
        return;
    }

    const fill =
        hpBar.querySelector(
            ".unit-hp-fill"
        );

    if (!fill) {
        return;
    }

    fill.style.width =
        Math.max(0, hp) + "%";

}


function removeHPBar(unit) {

    const hpBar =
        unit.querySelector(".unit-hp");

    if (hpBar) {
        hpBar.remove();
    }

}


/* =========================================================
   SELECT PLAYER UNIT
========================================================= */

playerUnits.forEach(function (unit) {

    unit.addEventListener("click", function (event) {

        event.stopPropagation();

        if (gameOver) {
            return;
        }

        if (
            unit.classList.contains(
                "defeated"
            )
        ) {
            return;
        }

        playerUnits.forEach(
            function (otherUnit) {

                otherUnit.classList.remove(
                    "selected"
                );

            }
        );

        selectedUnit = unit;

        unit.classList.add("selected");

        message(
            "UNIT SELECTED — CHOOSE YOUR DESTINATION"
        );

    });

});


/* =========================================================
   MOVE PLAYER UNIT
========================================================= */

battlefield.addEventListener(
    "click",
    function (event) {

        if (gameOver) {
            return;
        }

        if (!selectedUnit) {

            message(
                "SELECT A UNIT FIRST"
            );

            return;
        }

        if (
            event.target.classList.contains(
                "enemy-unit"
            ) ||
            event.target.closest(
                ".enemy-unit"
            )
        ) {
            return;
        }

        const rect =
            battlefield.getBoundingClientRect();

        let x =
            event.clientX -
            rect.left;

        let y =
            event.clientY -
            rect.top;

        const unitWidth =
            selectedUnit.offsetWidth;

        const unitHeight =
            selectedUnit.offsetHeight;

        x = Math.max(
            10,
            Math.min(
                x - unitWidth / 2,
                battlefield.clientWidth -
                unitWidth -
                10
            )
        );

        y = Math.max(
            10,
            Math.min(
                y - unitHeight / 2,
                battlefield.clientHeight -
                unitHeight -
                10
            )
        );

        selectedUnit.style.left =
            x + "px";

        selectedUnit.style.top =
            y + "px";


        /* movement animation */

        selectedUnit.classList.remove(
            "moving"
        );

        void selectedUnit.offsetWidth;

        selectedUnit.classList.add(
            "moving"
        );

        setTimeout(function () {

            selectedUnit.classList.remove(
                "moving"
            );

        }, 400);


        message("ADVANCE!");

        checkOutpost();

        checkNearbyEnemies();

    }
);


/* =========================================================
   CLICK ENEMY
========================================================= */

enemyUnits.forEach(function (enemy) {

    enemy.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            if (gameOver) {
                return;
            }

            if (!selectedUnit) {

                message(
                    "SELECT A UNIT FIRST"
                );

                return;
            }

            if (
                enemy.classList.contains(
                    "defeated"
                )
            ) {
                return;
            }

            const playerPosition =
                getPosition(selectedUnit);

            const enemyPosition =
                getPosition(enemy);

            const distance =
                Math.hypot(
                    playerPosition.x -
                    enemyPosition.x,

                    playerPosition.y -
                    enemyPosition.y
                );


            if (
                distance >
                PLAYER_ATTACK_RANGE
            ) {

                message(
                    "TOO FAR — MOVE CLOSER"
                );

                return;

            }


            attackEnemy(enemy);

        }
    );

});


/* =========================================================
   PLAYER ATTACK
========================================================= */

function attackEnemy(enemy) {

    if (!selectedUnit) {
        return;
    }

    if (
        enemy.classList.contains(
            "defeated"
        )
    ) {
        return;
    }

    if (
        selectedUnit.classList.contains(
            "defeated"
        )
    ) {
        return;
    }


    /* prevent attack spam */

    if (
        selectedUnit.dataset.attacking ===
        "true"
    ) {
        return;
    }

    selectedUnit.dataset.attacking =
        "true";


    let hp =
        parseInt(
            enemy.dataset.hp ||
            ENEMY_MAX_HP
        );


    createHPBar(
        enemy,
        hp,
        true
    );


    /* player attack animation */

    selectedUnit.classList.remove(
        "attacking"
    );

    void selectedUnit.offsetWidth;

    selectedUnit.classList.add(
        "attacking"
    );


    /* enemy hit */

    setTimeout(function () {

        enemy.classList.remove(
            "hit"
        );

        void enemy.offsetWidth;

        enemy.classList.add(
            "hit"
        );

    }, 120);


    /* damage */

    setTimeout(function () {

        hp -= PLAYER_DAMAGE;

        hp =
            Math.max(
                0,
                hp
            );

        enemy.dataset.hp =
            hp;

        updateHPBar(
            enemy,
            hp
        );


        if (hp <= 0) {

            defeatEnemy(enemy);

        } else {

            message(
                "HIT — ENEMY " +
                hp +
                "% HP"
            );

        }

    }, 250);


    /* finish attack */

    setTimeout(function () {

        selectedUnit.classList.remove(
            "attacking"
        );

        selectedUnit.dataset.attacking =
            "false";

    }, 500);

}


/* =========================================================
   DEFEAT ENEMY
========================================================= */

function defeatEnemy(enemy) {

    enemy.classList.add(
        "defeated"
    );

    enemy.style.opacity = "0";

    enemy.style.pointerEvents =
        "none";

    enemiesRemaining--;

    objectiveTwo.textContent =
        enemiesRemaining === 0
            ? "☑"
            : "□";

    message(
        "ENEMY DEFEATED."
    );

    checkVictory();

}


/* =========================================================
   CHECK NEARBY ENEMIES
========================================================= */

function checkNearbyEnemies() {

    if (!selectedUnit) {
        return;
    }

    enemyUnits.forEach(
        function (enemy) {

            if (
                enemy.classList.contains(
                    "defeated"
                )
            ) {
                return;
            }

            const playerPosition =
                getPosition(
                    selectedUnit
                );

            const enemyPosition =
                getPosition(enemy);

            const distance =
                Math.hypot(
                    playerPosition.x -
                    enemyPosition.x,

                    playerPosition.y -
                    enemyPosition.y
                );


            if (
                distance <
                PLAYER_ATTACK_RANGE
            ) {

                message(
                    "ENEMY IN RANGE — ATTACK!"
                );

            }

        }
    );

}


/* =========================================================
   OUTPOST
========================================================= */

function checkOutpost() {

    if (outpostCaptured) {
        return;
    }

    if (!selectedUnit) {
        return;
    }


    const playerPosition =
        getPosition(
            selectedUnit
        );

    const outpostPosition =
        getPosition(
            outpost
        );

    const distance =
        Math.hypot(
            playerPosition.x -
            outpostPosition.x,

            playerPosition.y -
            outpostPosition.y
        );


    if (distance < 90) {

        outpostCaptured =
            true;

        objectiveOne.textContent =
            "☑";

        outpost.classList.add(
            "captured"
        );

        message(
            "OUTPOST CAPTURED."
        );

        checkVictory();

    }

}


/* =========================================================
   FIND CLOSEST PLAYER
========================================================= */

function findClosestPlayer(enemy) {

    const livingPlayers =
        Array.from(
            playerUnits
        ).filter(
            function (unit) {

                return !unit.classList.contains(
                    "defeated"
                );

            }
        );


    if (
        livingPlayers.length === 0
    ) {

        return null;

    }


    let closestPlayer =
        livingPlayers[0];

    let closestDistance =
        Infinity;


    livingPlayers.forEach(
        function (player) {

            const playerPosition =
                getPosition(player);

            const enemyPosition =
                getPosition(enemy);

            const distance =
                Math.hypot(
                    playerPosition.x -
                    enemyPosition.x,

                    playerPosition.y -
                    enemyPosition.y
                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closestPlayer =
                    player;

            }

        }
    );


    return {

        unit:
            closestPlayer,

        distance:
            closestDistance

    };

}


/* =========================================================
   ENEMY MOVEMENT
========================================================= */

function moveEnemies() {

    if (gameOver) {
        return;
    }

    if (enemiesRemaining === 0) {
        return;
    }

    enemyUnits.forEach(function (enemy) {

        if (enemy.classList.contains("defeated")) {
            return;
        }

        if (enemy.dataset.attacking === "true") {
            return;
        }


        const target = findClosestPlayer(enemy);

        if (!target) {
            return;
        }


        const closestPlayer = target.unit;
        const closestDistance = target.distance;


        /* =================================================
           ENEMY IS CLOSE ENOUGH TO ATTACK
        ================================================= */

        if (closestDistance <= ENEMY_ATTACK_RANGE) {

            enemyAttack(enemy);

            return;
        }


        /* =================================================
           MOVE TOWARD PLAYER
        ================================================= */

        const playerPosition =
            getPosition(closestPlayer);

        const enemyPosition =
            getPosition(enemy);


        const dx =
            playerPosition.x -
            enemyPosition.x;

        const dy =
            playerPosition.y -
            enemyPosition.y;


        const distance =
            Math.hypot(dx, dy);


        if (distance === 0) {
            return;
        }


        const step =
            Math.min(
                ENEMY_MOVE_SPEED,
                distance - 5
            );


        const newX =
            enemy.offsetLeft +
            (dx / distance) * step;

        const newY =
            enemy.offsetTop +
            (dy / distance) * step;


        /* =================================================
           FACE / LEAN TOWARD TARGET
        ================================================= */

        if (dx < 0) {
            enemy.style.setProperty(
                "--enemy-direction",
                "-1"
            );
        } else {
            enemy.style.setProperty(
                "--enemy-direction",
                "1"
            );
        }


        /* =================================================
           ACTUAL MOVEMENT
        ================================================= */

        enemy.style.left =
            Math.max(
                5,
                Math.min(
                    newX,
                    battlefield.clientWidth -
                    enemy.offsetWidth -
                    5
                )
            ) + "px";


        enemy.style.top =
            Math.max(
                5,
                Math.min(
                    newY,
                    battlefield.clientHeight -
                    enemy.offsetHeight -
                    5
                )
            ) + "px";


        /* =================================================
           MOVEMENT ANIMATION
        ================================================= */

        enemy.classList.remove("moving");

        void enemy.offsetWidth;

        enemy.classList.add("moving");


        setTimeout(function () {

            enemy.classList.remove("moving");

        }, 520);

    });

}

/* =========================================================
   ENEMY ATTACK
========================================================= */

function enemyAttack(enemy) {

    if (gameOver) {
        return;
    }

    if (
        enemy.classList.contains(
            "defeated"
        )
    ) {
        return;
    }

    if (
        enemy.dataset.attacking ===
        "true"
    ) {
        return;
    }


    const target =
        findClosestPlayer(
            enemy
        );


    if (!target) {
        return;
    }


    const player =
        target.unit;


    if (
        target.distance >
        ENEMY_ATTACK_RANGE
    ) {
        return;
    }


    enemy.dataset.attacking =
        "true";


    /* enemy attack animation */

    enemy.classList.remove(
        "attacking"
    );

    void enemy.offsetWidth;

    enemy.classList.add(
        "attacking"
    );


    /* player gets hit */

    setTimeout(function () {

        player.classList.remove(
            "hit"
        );

        void player.offsetWidth;

        player.classList.add(
            "hit"
        );

    }, 150);


    /* damage lands */

    setTimeout(function () {

        let hp =
            parseInt(
                player.dataset.hp ||
                PLAYER_MAX_HP
            );


        hp -= ENEMY_DAMAGE;

        hp =
            Math.max(
                0,
                hp
            );


        player.dataset.hp =
            hp;


        createHPBar(
            player,
            hp,
            false
        );


        updateHPBar(
            player,
            hp
        );


        morale -= 8;

        morale =
            Math.max(
                0,
                morale
            );


        moraleFill.style.width =
            morale + "%";


        message(
            "ENEMY ATTACKS — YOUR UNIT " +
            hp +
            "% HP"
        );


        if (hp <= 0) {

            defeatPlayer(
                player
            );

        }

    }, 250);


    /* cooldown */

    setTimeout(function () {

        enemy.classList.remove(
            "attacking"
        );

        enemy.dataset.attacking =
            "false";

    }, ENEMY_ATTACK_COOLDOWN);

}


/* =========================================================
   DEFEAT PLAYER
========================================================= */

function defeatPlayer(player) {

    if (
        player.classList.contains(
            "defeated"
        )
    ) {
        return;
    }


    player.classList.add(
        "defeated"
    );

    player.style.pointerEvents =
        "none";

    player.style.opacity =
        "0";


    removeHPBar(player);


    armyCount.textContent =
        Math.max(
            0,
            parseInt(
                armyCount.textContent ||
                "3"
            ) - 1
        );


    if (
        selectedUnit === player
    ) {

        selectedUnit =
            null;

    }


    message(
        "A SOLDIER HAS FALLEN."
    );


    checkDefeat();

}


/* =========================================================
   DEFEAT
========================================================= */

function checkDefeat() {

    const livingPlayers =
        Array.from(
            playerUnits
        ).filter(
            function (unit) {

                return !unit.classList.contains(
                    "defeated"
                );

            }
        );


    if (
        livingPlayers.length === 0
    ) {

        gameOver = true;

        clearInterval(
            enemyTimer
        );

        message(
            "YOUR ARMY HAS FALLEN."
        );

        return;

    }


    if (morale <= 0) {

        message(
            "YOUR ARMY HAS LOST MORALE."
        );

    }

}


/* =========================================================
   VICTORY
========================================================= */

function checkVictory() {

    if (
        !outpostCaptured ||
        enemiesRemaining > 0
    ) {
        return;
    }


    objectiveThree.textContent =
        "☑";


    message(
        "VICTORY."
    );


    gameOver = true;

    clearInterval(
        enemyTimer
    );


    setTimeout(function () {

        victoryScreen.classList.add(
            "show"
        );

    }, 700);

}


/* =========================================================
   PLAY AGAIN
========================================================= */

playAgain.addEventListener(
    "click",
    function () {

        resetGame();

    }
);


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

    clearInterval(
        enemyTimer
    );


    selectedUnit =
        null;

    enemiesRemaining =
        enemyUnits.length;

    outpostCaptured =
        false;

    morale =
        100;

    gameOver =
        false;


    moraleFill.style.width =
        "100%";


    victoryScreen.classList.remove(
        "show"
    );


    objectiveOne.textContent =
        "□";

    objectiveTwo.textContent =
        "□";

    objectiveThree.textContent =
        "□";


    armyCount.textContent =
        "3";


    /* reset players */

    playerUnits.forEach(
        function (unit, index) {

            unit.classList.remove(
                "selected"
            );

            unit.classList.remove(
                "defeated"
            );

            unit.classList.remove(
                "attacking"
            );

            unit.classList.remove(
                "hit"
            );

            unit.classList.remove(
                "moving"
            );


            unit.dataset.hp =
                PLAYER_MAX_HP;

            unit.dataset.attacking =
                "false";


            unit.style.opacity =
                "1";

            unit.style.pointerEvents =
                "auto";


            removeHPBar(
                unit
            );


            const positions = [

                {
                    left: "22%",
                    top: "58%"
                },

                {
                    left: "31%",
                    top: "66%"
                },

                {
                    left: "25%",
                    top: "76%"
                }

            ];


            unit.style.left =
                positions[index].left;

            unit.style.top =
                positions[index].top;

        }
    );


    /* reset enemies */

    enemyUnits.forEach(
        function (enemy, index) {

            enemy.classList.remove(
                "defeated"
            );

            enemy.classList.remove(
                "attacking"
            );

            enemy.classList.remove(
                "hit"
            );


            enemy.dataset.hp =
                ENEMY_MAX_HP;

            enemy.dataset.attacking =
                "false";


            enemy.style.opacity =
                "1";

            enemy.style.pointerEvents =
                "auto";


            removeHPBar(
                enemy
            );


            const positions = [

                {
                    left: "67%",
                    top: "38%"
                },

                {
                    left: "76%",
                    top: "55%"
                },

                {
                    left: "62%",
                    top: "72%"
                }

            ];


            enemy.style.left =
                positions[index].left;

            enemy.style.top =
                positions[index].top;


            createHPBar(
                enemy,
                ENEMY_MAX_HP,
                true
            );

        }
    );


    if (outpost) {

        outpost.classList.remove(
            "captured"
        );

    }


    message(
        "SELECT A UNIT"
    );


    startEnemyMovement();

}


/* =========================================================
   ENEMY TIMER
========================================================= */

function startEnemyMovement() {

    clearInterval(
        enemyTimer
    );


    enemyTimer =
        setInterval(
            moveEnemies,
            900
        );

}


/* =========================================================
   INITIALIZE
========================================================= */

playerUnits.forEach(
    function (unit) {

        unit.dataset.hp =
            PLAYER_MAX_HP;

        unit.dataset.attacking =
            "false";

    }
);


enemyUnits.forEach(
    function (enemy) {

        enemy.dataset.hp =
            ENEMY_MAX_HP;

        enemy.dataset.attacking =
            "false";


        createHPBar(
            enemy,
            ENEMY_MAX_HP,
            true
        );

    }
);


startEnemyMovement();
