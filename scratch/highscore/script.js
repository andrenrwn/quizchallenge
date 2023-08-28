// -----------------
// Localstore Tables
// -----------------
// This javascript implements a list of data stored in local storage
//
// g_hiscore - global high score
// l_hiscore - last high score
// highscores  - list of key pairs { initial: "", hiscore, ""}

var highscores = {};
var yourscore = 0;

// populate local store high scores with dummy data ( for debugging )
function populatehighscores() {
    for (var i=0; i< 10; i++) {
        highscores[String.fromCharCode(i+97)] = "0." + i.toString();
    }
    storehighscores();
}

function randomscore(){
    yourscore = Math.random();
    document.querySelector("#yourscore").textContent = yourscore;
    refreshhiscores();
}

function resetscores() {
    highscores = {};
    localStorage.setItem("highscores","");
    localStorage.setItem("hiscore",0);
    document.querySelector("#hiscore").textContent = "0";
    yourscore = 0;
    document.querySelector("#yourscore").textContent = yourscore;
    refreshhiscores();
}

function refreshhiscores() {
    var scorerow = "<tr><th>Name</th><th>High Score</th></tr>";

    gethighscores();

    for(var i in highscores){
        scorerow += "<tr>";
        scorerow += "<td>" + i + "</td>";
        scorerow += "<td>" + highscores[i] + "</td></tr>";
    }

    document.getElementById("scoretable").innerHTML = scorerow;
}

function gethighscores() {
    var hstr=localStorage.getItem("highscores");
    if ( hstr != "" ) {
        highscores = JSON.parse(hstr);
    };
}

function storehighscores() {
    localStorage.setItem("highscores",JSON.stringify(highscores));
}

// Finish the quiz, store high scores
function finishquiz() {
    var initials = document.querySelector("#initials");

    if (initials.value) {
        if (!(initials.value in highscores)) {
            highscores[initials.value] = yourscore;
        } else {
            if (highscores[initials.value] < yourscore) {
                highscores[initials.value]=yourscore;
            }
        }
        storehighscores();
    }

    if (document.querySelector("#initials").value < yourscore) {
        localStorage.setItem(document.querySelector("#initials").value,yourscore);
    };
    refreshhiscores();
}

// Begin to execute the game
populatehighscores(); //debugging

gethighscores();
refreshhiscores();

// Display hi-score on page refresh
if (! localStorage.getItem("hiscore")) {
    localStorage.setItem("hiscore",0);
}

document.querySelector("#hiscore").textContent = localStorage.getItem("hiscore");
document.querySelector("#yourscore").textContent = yourscore;
