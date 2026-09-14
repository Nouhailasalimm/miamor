/* =========================================================
   GREAT WAR — FINAL COMBAT + RESULT OVERRIDES
========================================================= */


/* =========================================================
   SOLDIER MOVEMENT
========================================================= */

.war-unit.moving {
    animation:
        soldierMove .38s ease-in-out !important;
}

@keyframes soldierMove {

    0% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-5px) scale(1.04);
    }

    100% {
        transform: translateY(0) scale(1);
    }

}


/* =========================================================
   PLAYER ATTACK
========================================================= */

.war-unit.attacking {
    animation:
        battleAttack .42s ease-in-out !important;

    z-index: 30 !important;
}

@keyframes battleAttack {

    0% {
        transform:
            translateX(0)
            scale(1);
    }

    35% {
        transform:
            translateX(9px)
            scale(1.08);
    }

    55% {
        transform:
            translateX(13px)
            scale(1.12);
    }

    100% {
        transform:
            translateX(0)
            scale(1);
    }

}


/* =========================================================
   HIT REACTION
========================================================= */

.war-unit.hit {
    animation:
        battleHit .32s ease !important;
}

@keyframes battleHit {

    0% {
        transform: translateX(0);
        filter: brightness(1);
    }

    25% {
        transform: translateX(-7px);
        filter: brightness(2);
    }

    50% {
        transform: translateX(6px);
        filter: brightness(1.45);
    }

    100% {
        transform: translateX(0);
        filter: brightness(1);
    }

}


/* =========================================================
   ATTACK FLASH
========================================================= */

.war-unit.attacking::after {

    content: "✦" !important;

    display: block !important;

    position: absolute !important;

    left: 62% !important;
    top: 17% !important;

    font-size: 27px !important;

    color:
        rgba(239, 220, 185, .95) !important;

    pointer-events: none !important;

    animation:
        slashFlash .42s ease-out
        forwards;

    z-index: 80 !important;

}

@keyframes slashFlash {

    0% {
        opacity: 0;
        transform:
            scale(.25)
            rotate(-20deg);
    }

    30% {
        opacity: 1;
        transform:
            scale(1.15)
            rotate(15deg);
    }

    100% {
        opacity: 0;
        transform:
            scale(1.5)
            rotate(35deg);
    }

}


/* =========================================================
   HP BARS
========================================================= */

.unit-hp {

    pointer-events: none !important;

    transition:
        transform .2s ease;

}

.unit-hp-fill {

    transition:
        width .35s ease !important;

}


/* =========================================================
   VICTORY SCREEN
========================================================= */

.victory-screen {

    background:
        radial-gradient(
            circle at center,
            rgba(76, 49, 29, .96),
            rgba(18, 10, 6, .985)
        ) !important;

    backdrop-filter:
        blur(2px);

    padding:
        55px 40px !important;

    overflow-y: auto;

}


/* parchment glow */

.victory-screen::before {

    content: "";

    position: absolute;

    width: 700px;
    height: 700px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(190, 150, 105, .10),
            transparent 65%
        );

    pointer-events: none;

}


/* =========================================================
   RESULT LABEL
========================================================= */

.victory-label {

    position: relative;

    font-size:
        10px !important;

    letter-spacing:
        6px !important;

    color:
        rgba(221, 193, 159, .72) !important;

}


/* =========================================================
   RESULT TITLE
========================================================= */

.victory-screen h3 {

    position: relative;

    margin-top:
        18px !important;

    font-size:
        clamp(42px, 6vw, 72px) !important;

    line-height:
        .95 !important;

    letter-spacing:
        1px !important;

    color:
        #eadcca !important;

    text-shadow:
        0 4px 25px
        rgba(0,0,0,.55);

}


/* =========================================================
   SUBTITLE
========================================================= */

.victory-subtitle {

    position: relative;

    margin-top:
        15px !important;

    font-family:
        "IM Fell English",
        Georgia,
        serif !important;

    font-size:
        18px !important;

    font-style:
        italic;

    color:
        rgba(225, 205, 182, .68)
        !important;

}


/* =========================================================
   DIVIDER
========================================================= */

.victory-divider {

    position: relative;

    margin:
        22px 0;

    color:
        rgba(211, 180, 145, .32);

    font-family:
        "Special Elite",
        monospace;

    font-size:
        9px;

}


/* =========================================================
   RESULT STATS
========================================================= */

.victory-stats {

    position: relative;

    width:
        min(100%, 560px);

    display:
        grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap:
        12px;

    margin:
        4px auto 0;

}


/* individual result card */

.victory-stat {

    padding:
        17px 20px;

    border:
        1px solid
        rgba(190, 157, 121, .22);

    background:
        rgba(12, 7, 4, .34);

    text-align:
        left;

}


/* stat label */

.victory-stat span {

    display:
        block;

    margin-bottom:
        7px;

    font-family:
        "Special Elite",
        monospace;

    font-size:
        7px;

    letter-spacing:
        2px;

    color:
        rgba(211, 182, 151, .48);

}


/* stat value */

.victory-stat strong {

    font-family:
        "IM Fell English",
        Georgia,
        serif;

    font-size:
        17px;

    font-weight:
        400;

    color:
        rgba(233, 216, 195, .84);

}


/* =========================================================
   JOKE
========================================================= */

.victory-screen .victory-joke {

    position:
        relative;

    max-width:
        500px;

    margin:
        25px auto 0;

    font-size:
        17px !important;

    line-height:
        1.55 !important;

    color:
        #c7aa90 !important;

}


/* =========================================================
   SPOILS BUTTON
========================================================= */

#claimSpoils {

    position:
        relative;

    margin-top:
        27px;

    border-radius:
        3px;

    padding:
        13px 24px;

    background:
        rgba(79, 50, 30, .55);

}


/* =========================================================
   SPOILS REVEAL
========================================================= */

.victory-spoils {

    position:
        relative;

    width:
        min(100%, 480px);

    max-height:
        0;

    overflow:
        hidden;

    opacity:
        0;

    transform:
        translateY(10px);

    transition:
        max-height .55s ease,
        opacity .4s ease,
        transform .4s ease;

}


/* revealed */

.victory-spoils.revealed {

    max-height:
        220px;

    opacity:
        1;

    transform:
        translateY(0);

    margin-top:
        24px;

    padding:
        20px;

    border:
        1px solid
        rgba(191, 158, 121, .22);

    background:
        rgba(13, 7, 4, .42);

}


/* spoils title */

.spoils-label {

    font-family:
        "Special Elite",
        monospace;

    font-size:
        8px;

    letter-spacing:
        3px;

    color:
        rgba(214, 184, 151, .58);

}


/* spoils text */

.victory-spoils p {

    margin-top:
        9px;

    font-family:
        "IM Fell English",
        Georgia,
        serif;

    font-size:
        16px;

    line-height:
        1.45;

    color:
        rgba(227, 208, 186, .67);

}


/* =========================================================
   PLAY AGAIN
========================================================= */

#playAgain {

    position:
        relative;

    margin-top:
        23px;

    border-radius:
        3px;

    padding:
        11px 22px;

    font-size:
        9px;

    opacity:
        .7;

}


/* =========================================================
   MOBILE RESULT
========================================================= */

@media (max-width: 700px) {

    .victory-screen {

        padding:
            35px 20px !important;

    }

    .victory-stats {

        grid-template-columns:
            1fr;

    }

    .victory-screen h3 {

        font-size:
            42px !important;

    }

}
