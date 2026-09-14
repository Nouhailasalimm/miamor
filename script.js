/* =========================================================
   LOVE WEBSITE + THE GREAT WAR
   CLEAN COMPLETE GAME SCRIPT
========================================================= */

/* =========================================================
   BASIC WEBSITE INTERACTIONS
========================================================= */

const enterBtn = document.getElementById("enterBtn");
const evidenceBtn = document.getElementById("evidenceBtn");
const secretCard = document.getElementById("secretCard");

const welcome = document.querySelector(".welcome");
const evidence = document.querySelector(".evidence");
const greekCard = document.querySelector(".greek-card");

if (enterBtn && welcome) {
    enterBtn.addEventListener("click", () => {
        welcome.scrollIntoView({ behavior: "smooth" });
    });
}

if (evidenceBtn && evidence) {
    evidenceBtn.addEventListener("click", () => {
        evidence.scrollIntoView({ behavior: "smooth" });
    });
}

if (secretCard) {
    secretCard.addEventListener("click", () => {
        secretCard.classList.toggle("revealed");
    });
}

if (greekCard) {
    greekCard.addEventListener("click", () => {
        greekCard.classList.toggle("revealed");
    });
}

/* =========================================================
   GREAT WAR — ELEMENTS
========================================================= */

const battlefield = document.getElementById("battlefield");
const outpost = document.getElementById("outpost");
const battleMessage = document.getElementById("battleMessage");
const victoryScreen = document.getElementById("victoryScreen");

const objectiveOne = document.getElementById("objectiveOne");
const objectiveTwo = document.getElementById("objectiveTwo");
const objectiveThree = document.getElementById("objectiveThree");

const armyActive = document.getElementById("armyActive");
const armyFallen = document.getElementById("armyFallen");
const moraleFill = document.getElementById("moraleFill");

const playerUnits = document.querySelectorAll(".player-unit");
const enemyUnits = document.querySelectorAll(".enemy-unit");

if (!battlefield || !playerUnits.length || !enemyUnits.length) {
    // The rest of this script only applies when the Great War exists.
} else {

    /* =========================================================
       GAME STATE
    ========================================================= */

    let selectedUnit = null;
    let gameOver = false;
    let morale = 100;
    let outpostCaptured = false;
    let enemyInterval = null;
    let victoryTimer = null;

    const PLAYER_MAX_HP = 100;
    const ENEMY_MAX_HP = 100;

    const PLAYER_DAMAGE = 20;
    const ENEMY_DAMAGE = 15;

    const PLAYER_ATTACK_RANGE = 185;
    const ENEMY_ATTACK_RANGE = 125;

    const ENEMY_MOVE_SPEED = 6;
    const ENEMY_ATTACK_COOLDOWN = 1200;

    /* =========================================================
       HELPERS
    ========================================================= */

    function livingPlayerUnits() {
        return Array.from(playerUnits).filter(
            unit => !unit.classList.contains("defeated")
        );
    }

    function livingEnemyUnits() {
        return Array.from(enemyUnits).filter(
            unit => !unit.classList.contains("defeated")
        );
    }

    function getUnitPosition(unit) {
        return {
            x: unit.offsetLeft + unit.offsetWidth / 2,
            y: unit.offsetTop + unit.offsetHeight / 2
        };
    }

    function distanceBetween(a, b) {
        const posA = getUnitPosition(a);
        const posB = getUnitPosition(b);

        return Math.hypot(
            posB.x - posA.x,
            posB.y - posA.y
        );
    }

    function message(text) {
        if (battleMessage) {
            battleMessage.textContent = text;
        }
    }

    function updateMorale(amount) {
        morale = Math.max(
            0,
            Math.min(100, morale + amount)
        );

        if (moraleFill) {
            moraleFill.style.width = `${morale}%`;
        }
    }

    function updateArmyCount() {
        const active = livingPlayerUnits().length;
        const fallen = playerUnits.length - active;

        if (armyActive) {
            armyActive.textContent = String(active);
        }

        if (armyFallen) {
            armyFallen.textContent = String(fallen);
        }
    }

    /* =========================================================
       HP SYSTEM
       Same system for BLUE + RED
    ========================================================= */

    function createHPBar(unit, hp, isEnemy) {

        let bar = unit.querySelector(".unit-hp");

        if (!bar) {

            bar = document.createElement("div");

            bar.className = "unit-hp";

            bar.innerHTML = `
                <div class="unit-hp-fill"></div>
            `;

            unit.appendChild(bar);

            /* -----------------------------------------
               INLINE BAR STYLING
            ----------------------------------------- */

            bar.style.position = "absolute";
            bar.style.left = "50%";
            bar.style.top = "-14px";

            bar.style.transform =
                "translateX(-50%)";

            bar.style.width = "52px";
            bar.style.height = "5px";

            bar.style.background =
                "rgba(15, 8, 5, .92)";

            bar.style.border =
                "1px solid rgba(220, 190, 145, .7)";

            bar.style.boxSizing =
                "border-box";

            bar.style.overflow =
                "hidden";

            bar.style.pointerEvents =
                "none";

            bar.style.zIndex =
                "100";

            const fill =
                bar.querySelector(".unit-hp-fill");

            fill.style.display = "block";
            fill.style.width = "100%";
            fill.style.height = "100%";

            fill.style.margin = "0";
            fill.style.padding = "0";

            fill.style.transition =
                "width .35s linear";

            fill.style.background =
                isEnemy
                    ? "#8f3028"
                    : "#58748a";
        }

        const fill =
            bar.querySelector(".unit-hp-fill");

        if (fill) {

            fill.style.background =
                isEnemy
                    ? "#8f3028"
                    : "#58748a";

            fill.style.width =
                `${Math.max(
                    0,
                    Math.min(100, hp)
                )}%`;
        }

        return bar;
    }

  function updateHPBar(unit, hp) {

    const bar =
        unit.querySelector(".unit-hp");

    const fill =
        bar?.querySelector(".unit-hp-fill");

    if (!fill) {
        return;
    }

    const safeHP =
        Math.max(
            0,
            Math.min(100, hp)
        );

    fill.style.setProperty(
        "width",
        `${safeHP}%`,
        "important"
    );
}
    function removeHPBar(unit) {

        const bar =
            unit.querySelector(".unit-hp");

        if (bar) {
            bar.remove();
        }
    }

    function resetHPBars() {

        playerUnits.forEach(unit => {

            createHPBar(
                unit,
                PLAYER_MAX_HP,
                false
            );

        });

        enemyUnits.forEach(enemy => {

            createHPBar(
                enemy,
                ENEMY_MAX_HP,
                true
            );

        });
    }

    /* =========================================================
       SELECT PLAYER UNIT
    ========================================================= */

    playerUnits.forEach(unit => {

        unit.addEventListener("click", event => {

            event.stopPropagation();

            if (gameOver) {
                return;
            }

            if (
                unit.classList.contains("defeated")
            ) {
                return;
            }

            playerUnits.forEach(other => {

                other.classList.remove(
                    "selected"
                );

            });

            selectedUnit = unit;

            unit.classList.add("selected");

            const hp =
                parseInt(
                    unit.dataset.hp ||
                    PLAYER_MAX_HP,
                    10
                );

            message(
                `UNIT SELECTED — HP ${hp}%`
            );
        });

    });

    /* =========================================================
       PLAYER MOVEMENT
    ========================================================= */

    battlefield.addEventListener(
        "click",
        event => {

            if (
                gameOver ||
                !selectedUnit
            ) {
                return;
            }

            if (
                event.target.closest(
                    ".enemy-unit"
                )
            ) {
                return;
            }

            if (
                event.target.closest(
                    ".objective-point"
                )
            ) {
                return;
            }

            const rect =
                battlefield.getBoundingClientRect();

            const unitWidth =
                selectedUnit.offsetWidth;

            const unitHeight =
                selectedUnit.offsetHeight;

            let x =
                event.clientX -
                rect.left -
                unitWidth / 2;

            let y =
                event.clientY -
                rect.top -
                unitHeight / 2;

            const padding = 12;

            x = Math.max(
                padding,
                Math.min(
                    battlefield.clientWidth -
                    unitWidth -
                    padding,
                    x
                )
            );

            y = Math.max(
                padding,
                Math.min(
                    battlefield.clientHeight -
                    unitHeight -
                    padding,
                    y
                )
            );

            /* -----------------------------------------
               DETERMINE MOVEMENT DIRECTION
            ----------------------------------------- */

            const oldX =
                selectedUnit.offsetLeft;

            const direction =
                x >= oldX ? 1 : -1;

            selectedUnit.style.setProperty(
                "--soldier-direction",
                direction
            );

            selectedUnit.style.setProperty(
                "--player-direction",
                direction
            );

            selectedUnit.style.left =
                `${x}px`;

            selectedUnit.style.top =
                `${y}px`;

            /* -----------------------------------------
               MOVEMENT ANIMATION
            ----------------------------------------- */

            const movingUnit =
                selectedUnit;

            movingUnit.classList.remove(
                "moving"
            );

            void movingUnit.offsetWidth;

            movingUnit.classList.add(
                "moving"
            );

            setTimeout(() => {

                movingUnit.classList.remove(
                    "moving"
                );

            }, 540);

            message(
                "UNIT ADVANCING"
            );

            checkOutpostCapture();

            movingUnit.classList.remove(
                "selected"
            );

            selectedUnit = null;
        }
    );

    /* =========================================================
       PLAYER ATTACK
       CLICK A RED SOLDIER
    ========================================================= */

    enemyUnits.forEach(enemy => {

        enemy.addEventListener(
            "click",
            event => {

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

                const distance =
                    distanceBetween(
                        selectedUnit,
                        enemy
                    );

                if (
                    distance >
                    PLAYER_ATTACK_RANGE
                ) {

                    message(
                        "ENEMY OUT OF RANGE — MOVE CLOSER"
                    );

                    return;
                }

                const player =
                    selectedUnit;

                attackEnemy(
                    player,
                    enemy
                );

                player.classList.remove(
                    "selected"
                );

                selectedUnit = null;
            }
        );

    });

    /* =========================================================
       PLAYER ATTACK
    ========================================================= */

    function attackEnemy(
        player,
        enemy
    ) {

        if (gameOver) {
            return;
        }

        if (
            player.classList.contains(
                "defeated"
            )
        ) {
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
            player.dataset.attacking ===
            "true"
        ) {
            return;
        }

        player.dataset.attacking =
            "true";

        /* -----------------------------------------
           DETERMINE ATTACK DIRECTION
        ----------------------------------------- */

        const playerPosition =
            getUnitPosition(player);

        const enemyPosition =
            getUnitPosition(enemy);

        const dx =
            enemyPosition.x -
            playerPosition.x;

        const direction =
            dx >= 0 ? 1 : -1;

        player.style.setProperty(
            "--soldier-direction",
            direction
        );

        player.style.setProperty(
            "--player-direction",
            direction
        );

        player.style.setProperty(
            "--attack-direction",
            direction
        );

        player.style.setProperty(
            "--attack-lunge",
            direction
        );

        /* -----------------------------------------
           MAKE SURE ENEMY HAS HP BAR
        ----------------------------------------- */

        createHPBar(
            enemy,
            parseInt(
                enemy.dataset.hp ||
                ENEMY_MAX_HP,
                10
            ),
            true
        );

        /* -----------------------------------------
           ATTACK ANIMATION
        ----------------------------------------- */

        player.classList.remove(
            "attacking"
        );

        void player.offsetWidth;

        player.classList.add(
            "attacking"
        );

        message(
            "ENGAGING ENEMY"
        );

        /* -----------------------------------------
           END ATTACK ANIMATION
        ----------------------------------------- */

       setTimeout(() => {

    player.classList.remove(
        "attacking"
    );

    player.dataset.attacking =
        "false";

}, 900);
        /* -----------------------------------------
           DAMAGE LANDING
        ----------------------------------------- */

        setTimeout(() => {

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

            /* HIT REACTION */

            enemy.classList.remove(
                "hit"
            );

            void enemy.offsetWidth;

            enemy.classList.add(
                "hit"
            );

            setTimeout(() => {

                enemy.classList.remove(
                    "hit"
                );

            }, 360);

            /* BATTLEFIELD IMPACT */

            battlefield.classList.remove(
                "impact"
            );

            void battlefield.offsetWidth;

            battlefield.classList.add(
                "impact"
            );

            setTimeout(() => {

                battlefield.classList.remove(
                    "impact"
                );

            }, 220);

            /* ACTUAL DAMAGE */

            let hp =
                parseInt(
                    enemy.dataset.hp ||
                    ENEMY_MAX_HP,
                    10
                );

            hp =
                Math.max(
                    0,
                    hp - PLAYER_DAMAGE
                );

            enemy.dataset.hp =
                String(hp);

            updateHPBar(
                enemy,
                hp
            );

            message(
                `HIT — ENEMY ${hp}% HP`
            );

            /* -----------------------------------------
               ENEMY DEATH
            ----------------------------------------- */

            if (hp <= 0) {

                defeatEnemy(
                    enemy
                );

                return;
            }

            /* -----------------------------------------
               ENEMY RETALIATION
            ----------------------------------------- */

          setTimeout(() => {

    if (
        !gameOver &&
        !enemy.classList.contains(
            "defeated"
        ) &&
        !player.classList.contains(
            "defeated"
        ) &&
        distanceBetween(enemy, player) <= ENEMY_ATTACK_RANGE
    ) {

        enemyAttack(
            enemy,
            player
        );

    }

}, 260);



        }, 300);
    }

    /* =========================================================
       ENEMY DEFEAT
    ========================================================= */

    function defeatEnemy(enemy) {

        if (
            enemy.classList.contains(
                "defeated"
            )
        ) {
            return;
        }

        enemy.classList.remove(
            "attacking",
            "hit",
            "moving"
        );

        enemy.classList.add(
            "defeated"
        );

        enemy.style.pointerEvents =
            "none";

        enemy.dataset.attacking =
            "false";

        removeHPBar(
            enemy
        );

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

        if (gameOver) {
            return;
        }

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

            if (
                gameOver ||
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

            /* -----------------------------------------
               FIND CLOSEST PLAYER
            ----------------------------------------- */

            let closestPlayer = null;

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

            if (!closestPlayer) {
                return;
            }

            /* -----------------------------------------
               ATTACK IF CLOSE
            ----------------------------------------- */

            if (
                closestDistance <=
                ENEMY_ATTACK_RANGE
            ) {

                enemyAttack(
                    enemy,
                    closestPlayer
                );

                return;
            }

            /* -----------------------------------------
               MOVE TOWARD PLAYER
            ----------------------------------------- */

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
                Math.hypot(
                    dx,
                    dy
                );

            if (!length) {
                return;
            }

            /* -----------------------------------------
               DIRECTION
            ----------------------------------------- */

            const direction =
                dx >= 0 ? 1 : -1;

            enemy.style.setProperty(
                "--soldier-direction",
                direction
            );

            enemy.style.setProperty(
                "--enemy-direction",
                direction
            );

            enemy.style.setProperty(
                "--attack-direction",
                direction
            );

            /* -----------------------------------------
               MOVE
            ----------------------------------------- */

            const newX =
                enemy.offsetLeft +
                (dx / length) *
                ENEMY_MOVE_SPEED;

            const newY =
                enemy.offsetTop +
                (dy / length) *
                ENEMY_MOVE_SPEED;

            const padding = 8;

            enemy.style.left =
                `${Math.max(
                    padding,
                    Math.min(
                        battlefield.clientWidth -
                        enemy.offsetWidth -
                        padding,
                        newX
                    )
                )}px`;

            enemy.style.top =
                `${Math.max(
                    padding,
                    Math.min(
                        battlefield.clientHeight -
                        enemy.offsetHeight -
                        padding,
                        newY
                    )
                )}px`;

            /* -----------------------------------------
               DYNAMIC WALK / ADVANCE ANIMATION
            ----------------------------------------- */

            enemy.classList.remove(
                "moving"
            );

            void enemy.offsetWidth;

            enemy.classList.add(
                "moving"
            );

            setTimeout(() => {

                enemy.classList.remove(
                    "moving"
                );

            }, 540);

        });
    }

    /* =========================================================
       ENEMY ATTACK
    ========================================================= */

    function enemyAttack(
        enemy,
        player
    ) {

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
            player.classList.contains(
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

        /* -----------------------------------------
           ATTACK COOLDOWN
        ----------------------------------------- */

        const now =
            Date.now();

        const lastAttack =
            Number(
                enemy.dataset.lastAttack ||
                0
            );

        if (
            now - lastAttack <
            ENEMY_ATTACK_COOLDOWN
        ) {
            return;
        }

        enemy.dataset.lastAttack =
            String(now);

        enemy.dataset.attacking =
            "true";

        /* -----------------------------------------
           DETERMINE DIRECTION
        ----------------------------------------- */

        const enemyPosition =
            getUnitPosition(enemy);

        const playerPosition =
            getUnitPosition(player);

        const dx =
            playerPosition.x -
            enemyPosition.x;

        const direction =
            dx >= 0 ? 1 : -1;

        enemy.style.setProperty(
            "--soldier-direction",
            direction
        );

        enemy.style.setProperty(
            "--enemy-direction",
            direction
        );

        enemy.style.setProperty(
            "--attack-direction",
            direction
        );

        enemy.style.setProperty(
            "--attack-lunge",
            direction
        );

        /* -----------------------------------------
           MAKE SURE PLAYER HAS HP BAR
        ----------------------------------------- */

        createHPBar(
            player,
            parseInt(
                player.dataset.hp ||
                PLAYER_MAX_HP,
                10
            ),
            false
        );

        /* -----------------------------------------
           RED ATTACK ANIMATION
        ----------------------------------------- */

        enemy.classList.remove(
            "attacking"
        );

        void enemy.offsetWidth;

        enemy.classList.add(
            "attacking"
        );

        message(
            "ENEMY STRIKES — YOUR UNIT UNDER FIRE"
        );

        /* -----------------------------------------
           END RED ATTACK
        ----------------------------------------- */

        setTimeout(() => {

            enemy.classList.remove(
                "attacking"
            );

            enemy.dataset.attacking =
                "false";

        }, 680);

        /* -----------------------------------------
           DAMAGE LANDING
        ----------------------------------------- */

        setTimeout(() => {

            if (gameOver) {
                return;
            }

            if (
                player.classList.contains(
                    "defeated"
                )
            ) {
                return;
            }

            /* HIT ANIMATION */

            player.classList.remove(
                "hit"
            );

            void player.offsetWidth;

            player.classList.add(
                "hit"
            );

            setTimeout(() => {

                player.classList.remove(
                    "hit"
                );

            }, 360);

            /* BATTLEFIELD IMPACT */

            battlefield.classList.remove(
                "impact"
            );

            void battlefield.offsetWidth;

            battlefield.classList.add(
                "impact"
            );

            setTimeout(() => {

                battlefield.classList.remove(
                    "impact"
                );

            }, 220);

            /* ACTUAL DAMAGE */

            let hp =
                parseInt(
                    player.dataset.hp ||
                    PLAYER_MAX_HP,
                    10
                );

            hp =
                Math.max(
                    0,
                    hp - ENEMY_DAMAGE
                );

            player.dataset.hp =
                String(hp);

            updateHPBar(
                player,
                hp
            );

            updateMorale(
                -8
            );

            message(
                `ENEMY ATTACKS — YOUR UNIT ${hp}% HP`
            );

            /* -----------------------------------------
               PLAYER DEATH
            ----------------------------------------- */

            if (hp <= 0) {

                defeatPlayer(
                    player
                );

            }

        }, 300);
    }

    /* =========================================================
       PLAYER DEFEAT
    ========================================================= */

    function defeatPlayer(player) {

        if (
            player.classList.contains(
                "defeated"
            )
        ) {
            return;
        }

        player.classList.remove(
            "attacking",
            "moving",
            "selected",
            "hit"
        );

        player.classList.add(
            "defeated"
        );

        player.style.pointerEvents =
            "none";

        player.dataset.attacking =
            "false";

        removeHPBar(
            player
        );

        updateArmyCount();

        updateMorale(
            -15
        );

        if (
            selectedUnit === player
        ) {
            selectedUnit = null;
        }

        message(
            "YOUR UNIT HAS FALLEN"
        );

        if (
            !livingPlayerUnits().length
        ) {

            checkDefeat();

        }
    }

    /* =========================================================
       OUTPOST
    ========================================================= */

    function checkOutpostCapture() {

        if (
            !outpost ||
            outpostCaptured
        ) {
            return;
        }

        for (
            const unit of livingPlayerUnits()
        ) {

            if (
                distanceBetween(
                    unit,
                    outpost
                ) < 115
            ) {

                outpostCaptured =
                    true;

                if (objectiveOne) {

                    objectiveOne.textContent =
                        "✓";

                }

                message(
                    "OUTPOST CAPTURED"
                );

                updateMorale(
                    10
                );

                break;
            }
        }
    }

    /* =========================================================
       DEFEAT
    ========================================================= */

    function checkDefeat() {

        if (gameOver) {
            return;
        }

        if (
            livingPlayerUnits().length >
            0
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

        if (gameOver) {
            return;
        }

        if (
            livingEnemyUnits().length !==
            0
        ) {
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

        victoryTimer =
            setTimeout(
                showVictory,
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

        battlefield.classList.add(
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
            "visible"
        );

        const playAgain =
            document.getElementById(
                "playAgain"
            );

        if (playAgain) {

            playAgain.addEventListener(
                "click",
                resetGame
            );

        }
    }

    /* =========================================================
       RESET GAME
    ========================================================= */

    function resetGame() {

        if (victoryTimer) {

            clearTimeout(
                victoryTimer
            );

            victoryTimer = null;
        }

        gameOver = false;
        morale = 100;
        outpostCaptured = false;
        selectedUnit = null;

        battlefield.classList.remove(
            "battle-ended",
            "impact"
        );

        if (victoryScreen) {

            victoryScreen.classList.remove(
                "visible",
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

        if (armyActive) {
            armyActive.textContent =
                "3";
        }

        if (armyFallen) {
            armyFallen.textContent =
                "0";
        }

        if (moraleFill) {
            moraleFill.style.width =
                "100%";
        }

        /* -----------------------------------------
           RESET BLUE ARMY
        ----------------------------------------- */

        playerUnits.forEach(
            (unit, index) => {

                unit.classList.remove(
                    "defeated",
                    "selected",
                    "hit",
                    "moving",
                    "attacking"
                );

                unit.style.pointerEvents =
                    "";

                unit.dataset.hp =
                    String(
                        PLAYER_MAX_HP
                    );

                unit.dataset.attacking =
                    "false";

                const startingPositions = [

                    ["19%", "61%"],

                    ["27%", "70%"],

                    ["18%", "78%"]

                ];

                unit.style.left =
                    startingPositions[index][0];

                unit.style.top =
                    startingPositions[index][1];

                unit.style.setProperty(
                    "--soldier-direction",
                    "1"
                );

                unit.style.setProperty(
                    "--player-direction",
                    "1"
                );

                unit.style.setProperty(
                    "--attack-direction",
                    "1"
                );

            }
        );

        /* -----------------------------------------
           RESET RED ARMY
        ----------------------------------------- */

        enemyUnits.forEach(
            (enemy, index) => {

                enemy.classList.remove(
                    "defeated",
                    "hit",
                    "attacking",
                    "moving"
                );

                enemy.style.pointerEvents =
                    "";

                enemy.dataset.hp =
                    String(
                        ENEMY_MAX_HP
                    );

                enemy.dataset.attacking =
                    "false";

                enemy.dataset.lastAttack =
                    "0";

                const startingPositions = [

                    ["68%", "38%"],

                    ["78%", "53%"],

                    ["63%", "70%"]

                ];

                enemy.style.left =
                    startingPositions[index][0];

                enemy.style.top =
                    startingPositions[index][1];

                enemy.style.setProperty(
                    "--soldier-direction",
                    "-1"
                );

                enemy.style.setProperty(
                    "--enemy-direction",
                    "-1"
                );

                enemy.style.setProperty(
                    "--attack-direction",
                    "-1"
                );

            }
        );

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

        resetHPBars();

        updateArmyCount();

        message(
            "SELECT A UNIT"
        );

        startEnemyAI();
    }

    /* =========================================================
       ENEMY TIMER
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
       INITIALIZE
    ========================================================= */

    playerUnits.forEach(
        unit => {

            unit.dataset.hp =
                String(
                    PLAYER_MAX_HP
                );

            unit.dataset.attacking =
                "false";

            unit.style.setProperty(
                "--soldier-direction",
                "1"
            );

            unit.style.setProperty(
                "--player-direction",
                "1"
            );

            unit.style.setProperty(
                "--attack-direction",
                "1"
            );

        }
    );

    enemyUnits.forEach(
        enemy => {

            enemy.dataset.hp =
                String(
                    ENEMY_MAX_HP
                );

            enemy.dataset.attacking =
                "false";

            enemy.dataset.lastAttack =
                "0";

            enemy.style.setProperty(
                "--soldier-direction",
                "-1"
            );

            enemy.style.setProperty(
                "--enemy-direction",
                "-1"
            );

            enemy.style.setProperty(
                "--attack-direction",
                "-1"
            );

        }
    );

    resetHPBars();

    updateArmyCount();

    if (moraleFill) {

        moraleFill.style.width =
            "100%";

    }

    startEnemyAI();
}
