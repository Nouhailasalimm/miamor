/* =========================================================
   LOVE WEBSITE + GREAT WAR
   COMPLETE GAME SCRIPT
========================================================= */


/* =========================================================
   INTRO / WEBSITE INTERACTIONS
========================================================= */

const enterBtn =
    document.getElementById("enterBtn");

const evidenceBtn =
    document.getElementById("evidenceBtn");

const secretCard =
    document.getElementById("secretCard");

const greekCard =
    document.querySelector(".greek-card");


/* =========================================================
   ENTER WEBSITE
========================================================= */

if (enterBtn) {

    enterBtn.addEventListener(
        "click",
        function () {

            const intro =
                document.querySelector(".intro");

            const welcome =
                document.querySelector(".welcome");


            if (intro) {
                intro.style.display = "none";
            }

            if (welcome) {
                welcome.style.display = "flex";
            }

        }
    );

}


/* =========================================================
   SHOW EVIDENCE
========================================================= */

if (evidenceBtn) {

    evidenceBtn.addEventListener(
        "click",
        function () {

            const evidence =
                document.querySelector(".evidence");


            if (evidence) {

                evidence.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


/* =========================================================
   SECRET CARD
========================================================= */

if (secretCard) {

    secretCard.addEventListener(
        "click",
        function () {

            secretCard.classList.toggle(
                "revealed"
            );

        }
    );

}


/* =========================================================
   GREEK GOD CARD
========================================================= */

if (greekCard) {

    greekCard.addEventListener(
        "click",
        function () {

            greekCard.classList.toggle(
                "revealed"
            );

        }
    );

}


/* =========================================================
   GREAT WAR ELEMENTS
========================================================= */

const battlefield =
    document.getElementById("battlefield");

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


/* =========================================================
   GAME STATE
========================================================= */

let selectedUnit =
    null;

let enemiesRemaining =
    enemyUnits.length;

let outpostCaptured =
    false;

let morale =
    100;

let enemyTimer =
    null;

let gameOver =
    false;


/* =========================================================
   GAME BALANCE
========================================================= */

const PLAYER_MAX_HP =
    100;

const ENEMY_MAX_HP =
    100;

const PLAYER_DAMAGE =
    20;

const ENEMY_DAMAGE =
    15;

const PLAYER_ATTACK_RANGE =
    125;

const ENEMY_ATTACK_RANGE =
    105;

const ENEMY_MOVE_SPEED =
    7;


/* =========================================================
   GAME MESSAGE
========================================================= */

function message(text) {

    if (battleMessage) {

        battleMessage.textContent =
            text;

    }

}


/* =========================================================
   GET UNIT CENTER POSITION
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

function createHPBar(
    unit,
    hp,
    isEnemy
) {

    let hpBar =
        unit.querySelector(
            ".unit-hp"
        );


    if (!hpBar) {

        hpBar =
            document.createElement(
                "div"
            );

        hpBar.className =
            "unit-hp";


        hpBar.innerHTML = `
            <div class="unit-hp-fill"></div>
        `;


        unit.appendChild(
            hpBar
        );


        hpBar.style.position =
            "absolute";

        hpBar.style.left =
            "50%";

        hpBar.style.top =
            "-8px";

        hpBar.style.transform =
            "translateX(-50%)";

        hpBar.style.width =
            "52px";

        hpBar.style.height =
            "5px";

        hpBar.style.background =
            "rgba(15, 8, 5, .9)";

        hpBar.style.border =
            "1px solid rgba(220, 190, 145, .65)";

        hpBar.style.pointerEvents =
            "none";

        hpBar.style.zIndex =
            "60";

        hpBar.style.boxSizing =
            "border-box";


        const fill =
            hpBar.querySelector(
                ".unit-hp-fill"
            );


        fill.style.display =
            "block";

        fill.style.width =
            "100%";

        fill.style.height =
            "100%";

        fill.style.transition =
            "width .35s ease";

        fill.style.background =
            isEnemy
                ? "#8f3028"
                : "#58748a";

    }


    updateHPBar(
        unit,
        hp
    );


    return hpBar;

}


/* =========================================================
   UPDATE HP BAR
========================================================= */

function updateHPBar(
    unit,
    hp
) {

    const hpBar =
        unit.querySelector(
            ".unit-hp"
        );


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
        Math.max(
            0,
            hp
        ) + "%";

}


/* =========================================================
   REMOVE HP BAR
========================================================= */

function removeHPBar(unit) {

    const hpBar =
        unit.querySelector(
            ".unit-hp"
        );


    if (hpBar) {

        hpBar.remove();

    }

}


/* =========================================================
   SELECT BLUE SOLDIER
========================================================= */

playerUnits.forEach(
    function (unit) {

        unit.addEventListener(
            "click",
            function (event) {

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


                selectedUnit =
                    unit;


                unit.classList.add(
                    "selected"
                );


                const hp =
                    parseInt(
                        unit.dataset.hp ||
                        PLAYER_MAX_HP
                    );


                message(
                    "UNIT SELECTED — HP " +
                    hp +
                    "%"
                );

            }
        );

    }
);


/* =========================================================
   MOVE BLUE SOLDIER
========================================================= */

if (battlefield) {

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


            /* Don't move when clicking an enemy */

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


            x =
                Math.max(
                    10,
                    Math.min(
                        x -
                        unitWidth / 2,

                        battlefield.clientWidth -
                        unitWidth -
                        10
                    )
                );


            y =
                Math.max(
                    10,
                    Math.min(
                        y -
                        unitHeight / 2,

                        battlefield.clientHeight -
                        unitHeight -
                        10
                    )
                );


            /* -----------------------------------------
               TURN BLUE SOLDIER
            ----------------------------------------- */

            const oldX =
                selectedUnit.offsetLeft;


            selectedUnit.style.setProperty(
                "--player-direction",

                x < oldX
                    ? "-1"
                    : "1"
            );


            /* -----------------------------------------
               MOVE
            ----------------------------------------- */

            selectedUnit.style.left =
                x + "px";

            selectedUnit.style.top =
                y + "px";


            /* -----------------------------------------
               MOVEMENT ANIMATION
            ----------------------------------------- */

            selectedUnit.classList.remove(
                "moving"
            );

            void selectedUnit.offsetWidth;

            selectedUnit.classList.add(
                "moving"
            );


            setTimeout(
                function () {

                    selectedUnit.classList.remove(
                        "moving"
                    );

                },
                520
            );


            message(
                "ADVANCE!"
            );


            checkOutpost();

            checkNearbyEnemies();

        }
    );

}


/* =========================================================
   CLICK RED SOLDIER TO ATTACK
========================================================= */

enemyUnits.forEach(
    function (enemy) {

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
                    getPosition(
                        selectedUnit
                    );


                const enemyPosition =
                    getPosition(
                        enemy
                    );


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


                attackEnemy(
                    enemy
                );

            }
        );

    }
);


/* =========================================================
   BLUE ATTACKS RED
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


    /* -----------------------------------------
       FACE ENEMY
    ----------------------------------------- */

    const playerPosition =
        getPosition(
            selectedUnit
        );


    const enemyPosition =
        getPosition(
            enemy
        );


    selectedUnit.style.setProperty(
        "--player-direction",

        enemyPosition.x <
        playerPosition.x
            ? "-1"
            : "1"
    );


    /* -----------------------------------------
       ATTACK ANIMATION
    ----------------------------------------- */

    selectedUnit.classList.remove(
        "attacking"
    );

    void selectedUnit.offsetWidth;

    selectedUnit.classList.add(
        "attacking"
    );


    /* -----------------------------------------
       RED GETS HIT
    ----------------------------------------- */

    setTimeout(
        function () {

            enemy.classList.remove(
                "hit"
            );

            void enemy.offsetWidth;

            enemy.classList.add(
                "hit"
            );

        },
        140
    );


    /* -----------------------------------------
       DAMAGE
    ----------------------------------------- */

    setTimeout(
        function () {

            hp -=
                PLAYER_DAMAGE;


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


            message(
                "HIT — ENEMY " +
                hp +
                "% HP"
            );


        },
        210
    );


    /* -----------------------------------------
       END ATTACK
    ----------------------------------------- */

    setTimeout(
        function () {

            selectedUnit.classList.remove(
                "attacking"
            );


            selectedUnit.dataset.attacking =
                "false";


            /* Enemy dies */

            if (
                hp <= 0
            ) {

                defeatEnemy(
                    enemy
                );

                return;

            }


            /* Enemy retaliates */

            setTimeout(
                function () {

                    enemyAttack(
                        enemy
                    );

                },
                250
            );

        },
        500
    );

}


/* =========================================================
   DEFEAT RED SOLDIER
========================================================= */

function defeatEnemy(enemy) {

    if (
        enemy.classList.contains(
            "defeated"
        )
    ) {
        return;
    }


    enemy.classList.add(
        "defeated"
    );


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


    setTimeout(
        function () {

            enemy.style.opacity =
                "0";


            removeHPBar(
                enemy
            );

        },
        400
    );


    checkVictory();

}


/* =========================================================
   FIND CLOSEST BLUE SOLDIER
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
                getPosition(
                    player
                );


            const enemyPosition =
                getPosition(
                    enemy
                );


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
   RED ARMY MOVEMENT
========================================================= */

function moveEnemies() {

    if (gameOver) {
        return;
    }


    if (
        enemiesRemaining === 0
    ) {
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


            const closestPlayer =
                target.unit;


            const closestDistance =
                target.distance;


            /* -----------------------------------------
               CLOSE ENOUGH → ATTACK
            ----------------------------------------- */

            if (
                closestDistance <=
                ENEMY_ATTACK_RANGE
            ) {

                enemyAttack(
                    enemy
                );

                return;

            }


            /* -----------------------------------------
               CALCULATE MOVEMENT
            ----------------------------------------- */

            const playerPosition =
                getPosition(
                    closestPlayer
                );


            const enemyPosition =
                getPosition(
                    enemy
                );


            const dx =
                playerPosition.x -
                enemyPosition.x;


            const dy =
                playerPosition.y -
                enemyPosition.y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            if (
                distance <= 0
            ) {
                return;
            }


            const step =
                Math.min(
                    ENEMY_MOVE_SPEED,
                    distance - 5
                );


            const newX =
                enemy.offsetLeft +
                (dx / distance) *
                step;


            const newY =
                enemy.offsetTop +
                (dy / distance) *
                step;


            /* -----------------------------------------
               RED SOLDIER FACES BLUE SOLDIER
            ----------------------------------------- */

            enemy.style.setProperty(
                "--soldier-direction",

                dx < 0
                    ? "-1"
                    : "1"
            );


            /* -----------------------------------------
               MOVE RED SOLDIER
            ----------------------------------------- */

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


            /* -----------------------------------------
               WALKING ANIMATION
            ----------------------------------------- */

            enemy.classList.remove(
                "moving"
            );


            void enemy.offsetWidth;


            enemy.classList.add(
                "moving"
            );


            setTimeout(
                function () {

                    enemy.classList.remove(
                        "moving"
                    );

                },
                520
            );

        }
    );

}


/* =========================================================
   RED SOLDIER ATTACKS BLUE
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


    /* -----------------------------------------
       CALCULATE ATTACK DIRECTION
    ----------------------------------------- */

    const enemyPosition =
        getPosition(
            enemy
        );


    const playerPosition =
        getPosition(
            player
        );


    const attackDirection =
        playerPosition.x >
        enemyPosition.x
            ? 1
            : -1;


    enemy.style.setProperty(
        "--attack-direction",
        attackDirection
    );


    enemy.style.setProperty(
        "--soldier-direction",
        attackDirection
    );


    enemy.dataset.attacking =
        "true";


    /* -----------------------------------------
       RED SOLDIER ATTACKS
    ----------------------------------------- */

    enemy.classList.remove(
        "attacking"
    );


    void enemy.offsetWidth;


    enemy.classList.add(
        "attacking"
    );


    /* -----------------------------------------
       IMPACT
    ----------------------------------------- */

    setTimeout(
        function () {

            player.classList.remove(
                "hit"
            );


            void player.offsetWidth;


            player.classList.add(
                "hit"
            );


            if (battlefield) {

                battlefield.classList.add(
                    "impact"
                );


                setTimeout(
                    function () {

                        battlefield.classList.remove(
                            "impact"
                        );

                    },
                    180
                );

            }

        },
        220
    );


    /* -----------------------------------------
       DAMAGE
    ----------------------------------------- */

    setTimeout(
        function () {

            let hp =
                parseInt(
                    player.dataset.hp ||
                    PLAYER_MAX_HP
                );


            hp -=
                ENEMY_DAMAGE;


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


            /* morale */

            morale -=
                8;


            morale =
                Math.max(
                    0,
                    morale
                );


            if (moraleFill) {

                moraleFill.style.width =
                    morale + "%";

            }


            message(
                "ENEMY STRIKES — YOUR UNIT " +
                hp +
                "% HP"
            );


            /* player dies */

            if (
                hp <= 0
            ) {

                defeatPlayer(
                    player
                );

            }

        },
        260
    );


    /* -----------------------------------------
       END RED ATTACK
    ----------------------------------------- */

    setTimeout(
        function () {

            enemy.classList.remove(
                "attacking"
            );


            enemy.dataset.attacking =
                "false";

        },
        650
    );

}


/* =========================================================
   BLUE SOLDIER DIES
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


    removeHPBar(
        player
    );


    const currentArmy =
        parseInt(
            armyCount
                ? armyCount.textContent
                : "3"
        );


    if (armyCount) {

        armyCount.textContent =
            Math.max(
                0,
                currentArmy - 1
            );

    }


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
   CHECK DEFEAT
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

        gameOver =
            true;


        clearInterval(
            enemyTimer
        );


        message(
            "YOUR ENTIRE ARMY HAS FUCKING DIED."
        );

    }

}


/* =========================================================
   OUTPOST
========================================================= */

function checkOutpost() {

    if (
        outpostCaptured ||
        !selectedUnit ||
        !outpost
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


    if (
        distance < 85
    ) {

        outpostCaptured =
            true;


        if (objectiveOne) {

            objectiveOne.textContent =
                "☑";

        }


        const flag =
            outpost.querySelector(
                "span"
            );


        if (flag) {

            flag.textContent =
                "⚑";

        }


        message(
            "OUTPOST CAPTURED."
        );

    }

}


/* =========================================================
   CHECK NEARBY ENEMIES
========================================================= */

function checkNearbyEnemies() {

    if (!selectedUnit) {
        return;
    }


    if (
        selectedUnit.classList.contains(
            "defeated"
        )
    ) {
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
                getPosition(
                    enemy
                );


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
                    "ENEMY IN RANGE — CLICK TO ATTACK"
                );

            }

        }
    );

}


/* =========================================================
   VICTORY
========================================================= */

function checkVictory() {

    /*
       ALL ENEMIES DEAD = VICTORY.
       OUTPOST IS A BONUS OBJECTIVE.
    */

    if (
        enemiesRemaining > 0
    ) {
        return;
    }


    if (objectiveTwo) {

        objectiveTwo.textContent =
            "☑";

    }


    if (objectiveThree) {

        objectiveThree.textContent =
            outpostCaptured
                ? "☑"
                : "☐";

    }


    gameOver =
        true;


    clearInterval(
        enemyTimer
    );


    message(
        "THE ENEMY HAS BEEN ABSOLUTELY FUCKING DESTROYED."
    );


    setTimeout(
        function () {

            showVictory();

        },
        900
    );

}


/* =========================================================
   VICTORY SCREEN
========================================================= */

function showVictory() {

    if (!victoryScreen) {
        return;
    }

    if (battlefield) {
        battlefield.classList.add("battle-ended");
    }

    victoryScreen.innerHTML = `

        <div class="victory-label">
            ✦ BATTLEFIELD REPORT ✦
        </div>


        <h3>
            CONGRATULATIONS,
            <span>YOU FUCKING NERD.</span>
        </h3>


        <p>
            You actually finished this
            stupidest little game.
        </p>


        <p class="victory-joke">

            You clicked tiny soldiers around
            a fake medieval battlefield
            until everyone was dead.

            <br><br>

            I am simultaneously impressed
            and deeply concerned.

        </p>


        <div class="victory-banner-divider">
            ─────── ✦ ───────
        </div>


        <div class="victory-final-message">

            NOW FUCK OFF.

            <br>

            <span>
                ♥ I love you.
            </span>

        </div>


        <button
            id="playAgain"
            type="button"
        >
            I WANT TO SUFFER AGAIN →
        </button>

    `;


    victoryScreen.classList.add(
        "show"
    );


    const newPlayAgain =
        document.getElementById(
            "playAgain"
        );


    if (newPlayAgain) {

        newPlayAgain.addEventListener(
            "click",
            function () {

                resetGame();

            }
        );

    }

}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

    clearInterval(
        enemyTimer
    );

    if (battlefield) {
        battlefield.classList.remove("battle-ended");
    }
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


    if (moraleFill) {

        moraleFill.style.width =
            "100%";

    }


    if (victoryScreen) {

        victoryScreen.classList.remove(
            "show"
        );

    }


    if (objectiveOne) {

        objectiveOne.textContent =
            "□";

    }


    if (objectiveTwo) {

        objectiveTwo.textContent =
            "□";

    }


    if (objectiveThree) {

        objectiveThree.textContent =
            "□";

    }


    if (armyCount) {

        armyCount.textContent =
            "3";

    }


    /* -----------------------------------------
       RESET BLUE SOLDIERS
    ----------------------------------------- */

    const playerPositions = [

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


    playerUnits.forEach(
        function (unit, index) {

            unit.classList.remove(
                "selected",
                "defeated",
                "attacking",
                "hit",
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


            unit.style.setProperty(
                "--player-direction",
                "1"
            );


            removeHPBar(
                unit
            );


            if (
                playerPositions[index]
            ) {

                unit.style.left =
                    playerPositions[index].left;

                unit.style.top =
                    playerPositions[index].top;

            }

        }
    );


    /* -----------------------------------------
       RESET RED SOLDIERS
    ----------------------------------------- */

    const enemyPositions = [

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


    enemyUnits.forEach(
        function (enemy, index) {

            enemy.classList.remove(
                "defeated",
                "attacking",
                "hit",
                "moving"
            );


            enemy.dataset.hp =
                ENEMY_MAX_HP;


            enemy.dataset.attacking =
                "false";


            enemy.style.opacity =
                "1";


            enemy.style.pointerEvents =
                "auto";


            enemy.style.setProperty(
                "--soldier-direction",
                "-1"
            );


            enemy.style.setProperty(
                "--attack-direction",
                "-1"
            );


            removeHPBar(
                enemy
            );


            if (
                enemyPositions[index]
            ) {

                enemy.style.left =
                    enemyPositions[index].left;

                enemy.style.top =
                    enemyPositions[index].top;

            }


            createHPBar(
                enemy,
                ENEMY_MAX_HP,
                true
            );

        }
    );


    /* -----------------------------------------
       RESET OUTPOST
    ----------------------------------------- */

    if (outpost) {

        const flag =
            outpost.querySelector(
                "span"
            );


        if (flag) {

            flag.textContent =
                "⚑";

        }

    }


    message(
        "SELECT A UNIT"
    );


    startEnemyMovement();

}


/* =========================================================
   ENEMY AI LOOP
========================================================= */

function startEnemyMovement() {

    clearInterval(
        enemyTimer
    );


    enemyTimer =
        setInterval(
            function () {

                moveEnemies();

            },
            300
        );

}


/* =========================================================
   INITIALIZE BLUE SOLDIERS
========================================================= */

playerUnits.forEach(
    function (unit) {

        unit.dataset.hp =
            PLAYER_MAX_HP;


        unit.dataset.attacking =
            "false";


        unit.style.setProperty(
            "--player-direction",
            "1"
        );

    }
);


/* =========================================================
   INITIALIZE RED SOLDIERS
========================================================= */

enemyUnits.forEach(
    function (enemy) {

        enemy.dataset.hp =
            ENEMY_MAX_HP;


        enemy.dataset.attacking =
            "false";


        enemy.style.setProperty(
            "--soldier-direction",
            "-1"
        );


        enemy.style.setProperty(
            "--attack-direction",
            "-1"
        );


        createHPBar(
            enemy,
            ENEMY_MAX_HP,
            true
        );

    }
);


/* =========================================================
   START GAME
========================================================= */

if (battlefield) {

    startEnemyMovement();

}
