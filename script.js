const enterBtn = document.getElementById("enterBtn");

const evidenceBtn = document.getElementById("evidenceBtn");


/* =========================
   ENTER THE WEBSITE
========================= */

enterBtn.addEventListener("click", function () {

    document.querySelector(".intro").style.display = "none";

    document.querySelector(".welcome").style.display = "flex";

});


/* =========================
   SHOW THE EVIDENCE
========================= */

evidenceBtn.addEventListener("click", function () {

    document.querySelector(".evidence").scrollIntoView({
        behavior: "smooth"
    });

});

const secretCard = document.getElementById("secretCard");

secretCard.addEventListener("click", function () {
    secretCard.classList.toggle("revealed");
});