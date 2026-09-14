/* =========================================================
   VICTORY
========================================================= */

function checkVictory() {

    /*
       Winning the battle = all enemies defeated.
       Capturing the outpost is now a bonus objective,
       not something that can prevent victory.
    */

    if (enemiesRemaining > 0) {
        return;
    }


    objectiveTwo.textContent = "☑";

    objectiveThree.textContent =
        outpostCaptured
            ? "☑"
            : "☐";


    gameOver = true;


    clearInterval(
        enemyTimer
    );


    message(
        "THE ENEMY HAS BEEN ABSOLUTELY FUCKING DESTROYED."
    );


    setTimeout(function () {

        showVictory();

    }, 900);

}
