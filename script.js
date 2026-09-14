/* =========================================================
   LOVE WEBSITE + THE GREAT WAR
   COMPLETE GAME SCRIPT
========================================================= */


/* =========================================================
   BASIC WEBSITE INTERACTIONS
========================================================= */

const enterBtn = document.getElementById("enterBtn");
const evidenceBtn = document.getElementById("evidenceBtn");
const secretCard = document.getElementById("secretCard");

const welcome = document.querySelector(".welcome");
const evidence = document.querySelector(".evidence");


/* INTRO → WELCOME */

if (enterBtn) {

    enterBtn.addEventListener("click", () => {

        welcome?.scrollIntoView({
            behavior: "smooth"
        });

    });

}


/* WELCOME → EVIDENCE */

if (evidenceBtn) {

    evidenceBtn.addEventListener("click", () => {

        evidence?.scrollIntoView({
            behavior: "smooth"
        });

    });

}


/* SECRET CARD */

if (secretCard) {

    secretCard.addEventListener("click", () => {

        secretCard.classList.toggle("revealed");

    });

}


/* =========================================================
   GREEK GOD EASTER EGG
========================================================= */

const greekCard = document.querySelector(".greek-card");

if (greekCard) {

    greekCard.addEventListener("click", () => {

        greekCard.classList.toggle("revealed");

    });

}


/* =========================================================
   GREAT WAR — ELEMENTS
========================================================= */

const battlefield =
    document.getElementById("battlefield");

const outpost =
    document.getElementById("outpost");

const battleMessage =
    document.getElementById("battleMessage");

const victoryScreen =
    document.getElementById("victoryScreen");

const playAgain =
    document.getElementById("playAgain");


/* OBJECTIVES */

const objectiveOne =
    document.getElementById("objectiveOne");

const objectiveTwo =
    document.getElementById("objectiveTwo");

const objectiveThree =
    document.getElementById("objectiveThree");


/* ARMY */

const armyActive =
    document.getElementById("armyActive");

const armyFallen =
    document.getElementById("armyFallen");


/* MORALE */

const moraleFill =
    document.getElementById("moraleFill");


/* UNITS */

const playerUnits =
    document.querySelectorAll(".player-unit");

const enemyUnits =
    document.querySelectorAll(".enemy-unit");


/* =========================================================
   GAME STATE
========================================================= */

let selectedUnit = null;

let gameOver = false;

let morale = 100;

let enemyInterval = null;

let outpostCaptured = false;


/* =========================================================
   HELPERS
========================================================= */

function livingPlayerUnits() {

    return Array.from(playerUnits).filter(unit => {

        return !unit.classList.contains("defeated");

    });

}


function livingEnemyUnits() {

    return Array.from(enemyUnits).filter(unit => {

        return !unit.classList.contains("defeated");

    });

}


function getUnitPosition(unit) {

    return {

        x: unit.offsetLeft + unit.offsetWidth / 2,

        y: unit.offsetTop + unit.offsetHeight / 2

    };

}


function distanceBetween(unitA, unitB) {

    const a =
        getUnitPosition(unitA);

    const b =
        getUnitPosition(unitB);

    const dx =
        b.x - a.x;

    const dy =
        b.y - a.y;

    return Math.sqrt(
        dx * dx + dy * dy
    );

}


/* =========================================================
   BATTLE MESSAGE
========================================================= */

function message(text) {

    if (!battleMessage) return;

    battleMessage.textContent = text;

}


/* =========================================================
   MORALE
========================================================= */

function updateMorale(amount) {

    morale = Math.max(
        0,
        Math.min(100, morale + amount)
    );

    if (moraleFill) {

        moraleFill.style.width =
            `${morale}%`;

    }

}


/* =========================================================
   UNIT SELECTION
========================================================= */

playerUnits.forEach(unit => {

    unit.addEventListener("click", event => {

        event.stopPropagation();

        if (gameOver) return;

        if (
            unit.classList.contains("defeated")
        ) {
            return;
        }


        /* DESELECT */

        playerUnits.forEach(otherUnit => {

            otherUnit.classList.remove(
                "selected"
            );

        });


        /* SELECT */

        selectedUnit = unit;

        unit.classList.add("selected");

        message("UNIT SELECTED — CHOOSE A POSITION");

    });

});


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

if (battlefield) {

    battlefield.addEventListener(
        "click",
        event => {

            if (gameOver) return;

            if (!selectedUnit) return;


            /* Don't move when clicking enemies */

            if (
                event.target.closest(".enemy-unit")
            ) {
                return;
            }


            /* Don't move when clicking outpost */

            if (
                event.target.closest(".objective-point")
            ) {
                return;
            }


            const rect =
                battlefield.getBoundingClientRect();


            let x =
                event.clientX - rect.left;

            let y =
                event.clientY - rect.top;


            /* Keep soldiers inside battlefield */

            const padding = 30;

            x = Math.max(
                padding,
                Math.min(
                    rect.width - padding,
                    x
                )
            );

            y = Math.max(
                padding,
                Math.min(
                    rect.height - padding,
                    y
                )
            );


            /* Direction */

            const currentLeft =
                selectedUnit.offsetLeft;

            if (x > currentLeft) {

                selectedUnit.style
                    .setProperty(
                        "--player-direction",
                        "1"
                    );

            } else {

                selectedUnit.style
                    .setProperty(
                        "--player-direction",
                        "-1"
                    );

            }


            selectedUnit.style.left =
                `${x}px`;

            selectedUnit.style.top =
                `${y}px`;


            selectedUnit.classList.add(
                "moving"
            );


            setTimeout(() => {

                selectedUnit?.classList.remove(
                    "moving"
                );

            }, 520);


            message("UNIT ADVANCING");


            /* CHECK OUTPOST */

            checkOutpostCapture();


            /* DESELECT */

            selectedUnit.classList.remove(
                "selected"
            );

            selectedUnit = null;

        }
    );

}


/* =========================================================
   OUTPOST CAPTURE
========================================================= */

function checkOutpostCapture() {

    if (!outpost) return;

    if (outpostCaptured) return;


    const livingUnits =
        livingPlayerUnits();


    for (const unit of livingUnits) {

        const distance =
            distanceBetween(
                unit,
                outpost
            );


        if (distance < 115) {

            outpostCaptured = true;


            if (objectiveOne) {

                objectiveOne.textContent =
                    "✓";

            }


            message(
                "OUTPOST CAPTURED"
            );


            updateMorale(10);

            break;

        }

    }

}


/* =========================================================
   PLAYER ATTACK
========================================================= */

enemyUnits.forEach(enemy => {

    enemy.addEventListener("click", event => {

        event.stopPropagation();

        if (gameOver) return;

        if (!selectedUnit) {

            message("SELECT A UNIT FIRST");

            return;

        }


        if (
            enemy.classList.contains("defeated")
        ) {
            return;
        }


        const distance =
            distanceBetween(
                selectedUnit,
                enemy
            );


        if (distance > 150) {

            message(
                "ENEMY OUT OF RANGE"
            );

            return;

        }


        attackEnemy(
            selectedUnit,
            enemy
        );


        selectedUnit.classList.remove(
            "selected"
        );

        selectedUnit = null;

    });

});


/* =========================================================
   ATTACK ENEMY
========================================================= */

function attackEnemy(player, enemy) {

    if (gameOver) return;

    if (
        player.classList.contains("defeated")
    ) {
        return;
    }

    if (
        enemy.classList.contains("defeated")
    ) {
        return;
    }


    /* Face enemy */

    const playerPosition =
        getUnitPosition(player);

    const enemyPosition =
        getUnitPosition(enemy);


    const dx =
        enemyPosition.x -
        playerPosition.x;


    player.style.setProperty(
        "--player-direction",
        dx >= 0 ? "1" : "-1"
    );


    message("ENGAGING ENEMY");


    /* HIT */

    enemy.classList.add("hit");


    setTimeout(() => {

        enemy.classList.remove(
            "hit"
        );

    }, 350);


    /* DAMAGE */

    let hp =
        parseInt(
            enemy.dataset.hp || "100"
        );


    hp -= 20;

    enemy.dataset.hp =
        hp;


    /* Enemy HP bar */

    const hpBar =
        enemy.querySelector(".enemy-hp");


    if (hpBar) {

        hpBar.style.width =
            `${Math.max(0, hp)}%`;

    }


    /* DEFEAT */

    if (hp <= 0) {

        defeatEnemy(enemy);

        return;

    }


    /* ENEMY RETALIATES */

    setTimeout(() => {

        if (!gameOver) {

            enemyAttack(
                enemy,
                player
            );

        }

    }, 250);

}


/* =========================================================
   DEFEAT ENEMY
========================================================= */

function defeatEnemy(enemy) {

    enemy.classList.add(
        "defeated"
    );


    enemy.style.pointerEvents =
        "none";


    updateMorale(5);


    message(
        "ENEMY UNIT DEFEATED"
    );


    checkVictory();

}


/* =========================================================
   ENEMY AI
========================================================= */

function moveEnemies() {

    if (gameOver) return;


    const enemies =
        livingEnemyUnits();

    const players =
        livingPlayerUnits();


    if (!enemies.length) {

        checkVictory();

        return;

    }


    if (!players.length) {

        checkDefeat();

        return;

    }


    enemies.forEach(enemy => {


        /* Find closest player */

        let closestPlayer =
            null;

        let closestDistance =
            Infinity;


        players.forEach(player => {

            const distance =
                distanceBetween(
                    enemy,
                    player
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

        });


        if (!closestPlayer) return;


        /* ATTACK RANGE */

        if (
            closestDistance <= 105
        ) {

            enemyAttack(
                enemy,
                closestPlayer
            );

            return;

        }


        /* MOVE */

        const enemyPosition =
            getUnitPosition(enemy);

        const playerPosition =
            getUnitPosition(
                closestPlayer
            );


        const dx =
            playerPosition.x -
            enemyPosition.x;

        const dy =
            playerPosition.y -
            enemyPosition.y;


        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (!length) return;


        const speed = 7;


        const newX =
            enemy.offsetLeft +
            (dx / length) *
            speed;


        const newY =
            enemy.offsetTop +
            (dy / length) *
            speed;


        /* Face player */

        enemy.style.setProperty(
            "--soldier-direction",
            dx >= 0 ? "1" : "-1"
        );


        enemy.style.left =
            `${newX}px`;

        enemy.style.top =
            `${newY}px`;


        enemy.classList.add(
            "moving"
        );


        setTimeout(() => {

            enemy.classList.remove(
                "moving"
            );

        }, 520);

    });

}


/* =========================================================
   ENEMY ATTACK
========================================================= */

function enemyAttack(enemy, player) {

    if (gameOver) return;

    if (
        enemy.classList.contains(
            "defeated"
        )
    ) {
        return;
    }


    if (
        player.classList.contains(
            "defeated"
        )
    ) {
        return;
    }


    /* Prevent attack spam */

    if (
        enemy.dataset.attacking === "true"
    ) {
        return;
    }


    enemy.dataset.attacking =
        "true";


    /* Face player */

    const enemyPosition =
        getUnitPosition(enemy);

    const playerPosition =
        getUnitPosition(player);


    const dx =
        playerPosition.x -
        enemyPosition.x;


    const direction =
        dx >= 0 ? "1" : "-1";


    enemy.style.setProperty(
        "--soldier-direction",
        direction
    );


    enemy.style.setProperty(
        "--attack-direction",
        direction
    );


    enemy.classList.add(
        "attacking"
    );


    message(
        "ENEMY STRIKES — YOUR UNIT UNDER FIRE"
    );


    /* IMPACT */

    setTimeout(() => {

        if (
            player.classList.contains(
                "defeated"
            )
        ) {
            return;
        }


        player.classList.add(
            "hit"
        );


        battlefield?.classList.add(
            "impact"
        );


        setTimeout(() => {

            player.classList.remove(
                "hit"
            );

        }, 350);


        setTimeout(() => {

            battlefield?.classList.remove(
                "impact"
            );

        }, 250);


        /* DAMAGE */

        let hp =
            parseInt(
                player.dataset.hp || "100"
            );


        hp -= 15;


        player.dataset.hp =
            hp;


        /* PLAYER HP */

        const hpBar =
            player.querySelector(".unit-hp");


        if (hpBar) {

            hpBar.style.width =
                `${Math.max(0, hp)}%`;

        }


        /* MORALE */

        updateMorale(-8);


        /* DEFEAT */

        if (hp <= 0) {

            defeatPlayer(player);

        }

    }, 220);


    setTimeout(() => {

        enemy.classList.remove(
            "attacking"
        );

        enemy.dataset.attacking =
            "false";

    }, 650);

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


    /* =====================================================
       UPDATE ACTIVE / FALLEN
    ===================================================== */

    const active =
        Array.from(playerUnits).filter(
            unit =>
                !unit.classList.contains(
                    "defeated"
                )
        ).length;


    const fallen =
        playerUnits.length -
        active;


    if (armyActive) {

        armyActive.textContent =
            active;

    }


    if (armyFallen) {

        armyFallen.textContent =
            fallen;

    }


    updateMorale(-15);


    message(
        "YOUR UNIT HAS FALLEN"
    );


    if (
        livingPlayerUnits().length === 0
    ) {

        checkDefeat();

    }

}


/* =========================================================
   PLAYER DEFEAT
========================================================= */

function checkDefeat() {

    if (gameOver) return;

    if (
        livingPlayerUnits().length > 0
    ) {
        return;
    }


    gameOver = true;


    if (enemyInterval) {

        clearInterval(
            enemyInterval
        );

        enemyInterval = null;

    }


    message(
        "THE BATTLE IS LOST"
    );

}


/* =========================================================
   VICTORY
========================================================= */

function checkVictory() {

    if (gameOver) return;


    const enemiesRemaining =
        livingEnemyUnits().length;


    if (enemiesRemaining !== 0) {
        return;
    }


    gameOver = true;


    if (objectiveTwo) {

        objectiveTwo.textContent =
            "✓";

    }


    if (objectiveThree) {

        objectiveThree.textContent =
            outpostCaptured
                ? "✓"
                : "—";

    }


    if (enemyInterval) {

        clearInterval(
            enemyInterval
        );

        enemyInterval = null;

    }


    message(
        "BATTLE WON"
    );


    setTimeout(() => {

        showVictory();

    }, 900);

}


/* =========================================================
   VICTORY SCREEN
========================================================= */

function showVictory() {

    if (!victoryScreen) return;


    battlefield?.classList.add(
        "battle-ended"
    );


    victoryScreen.innerHTML = `

        <div class="victory-label">
            ✦ BATTLEFIELD REPORT ✦
        </div>


        <h3>
            CONGRATULATIONS,
            <span>YOU FUCKING NERD.</span>
        </h3>


        <p>
            You actually finished this stupidest little game.
        </p>


        <p class="victory-joke">
            You clicked tiny soldiers around a fake medieval battlefield
            until everyone was dead.

            <br><br>

            I am simultaneously impressed and deeply concerned.
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
        "visible"
    );


    const newPlayAgain =
        document.getElementById(
            "playAgain"
        );


    if (newPlayAgain) {

        newPlayAgain.addEventListener(
            "click",
            resetGame
        );

    }

}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

    gameOver = false;

    morale = 100;

    selectedUnit = null;

    outpostCaptured = false;


    if (battlefield) {

        battlefield.classList.remove(
            "battle-ended"
        );

    }


    if (victoryScreen) {

        victoryScreen.classList.remove(
            "visible"
        );

    }


    /* RESET OBJECTIVES */

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


    /* RESET ARMY */

    if (armyActive) {

        armyActive.textContent =
            "3";

    }


    if (armyFallen) {

        armyFallen.textContent =
            "0";

    }


    /* RESET MORALE */

    if (moraleFill) {

        moraleFill.style.width =
            "100%";

    }


    /* RESET PLAYER UNITS */

    playerUnits.forEach(unit => {

        unit.classList.remove(
            "defeated",
            "selected",
            "hit",
            "moving"
        );


        unit.style.pointerEvents =
            "";


        unit.dataset.hp =
            "100";

    });


    /* RESET ENEMY UNITS */

    enemyUnits.forEach(enemy => {

        enemy.classList.remove(
            "defeated",
            "hit",
            "attacking",
            "moving"
        );


        enemy.style.pointerEvents =
            "";


        enemy.dataset.hp =
            "100";


        enemy.dataset.attacking =
            "false";

    });


    message(
        "SELECT A UNIT"
    );


    /* RESTART ENEMY AI */

    startEnemyAI();

}


/* =========================================================
   ENEMY AI TIMER
========================================================= */

function startEnemyAI() {

    if (enemyInterval) {

        clearInterval(
            enemyInterval
        );

    }


    enemyInterval =
        setInterval(
            moveEnemies,
            300
        );

}


/* =========================================================
   INITIALIZE GAME
========================================================= */

if (battlefield) {

    /* Initial HP */

    playerUnits.forEach(unit => {

        unit.dataset.hp =
            "100";

    });


    enemyUnits.forEach(enemy => {

        enemy.dataset.hp =
            "100";

        enemy.dataset.attacking =
            "false";

    });


    /* Initial morale */

    if (moraleFill) {

        moraleFill.style.width =
            "100%";

    }


    /* Start enemy movement */

    startEnemyAI();

}
