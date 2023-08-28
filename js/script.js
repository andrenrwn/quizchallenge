// --------------
// Quiz Challenge
// --------------
// This javascript implements a quiz challenge game
//
// Questions and answers are taken from an array of .card class elements.
// Each .card can have a .start, .finish, or .quiz class.
// .start and .finish cards displays text and prompts users before going forward
// .quiz cards contain a question and multiple-choice answers in <li> elements.
//    "data-answer" attribute (if exists) signifies the correct answer.
//    "data-answer" attribute values contain the score for the answer.

var cards = document.querySelectorAll(".card");
var currentcard = 0;
var order = Array.from(Array(cards.length).keys());
var yourscore = 0;

var highscores = {};

// Fisher-Yates shuffle, adapted from https://javascript.info/task/shuffle
// shuffle the order only for quiz cards
function shuffle(arr) {
    for (let i = arr.length - 1; i > 1; i--) {
        if (cards[i].getAttribute("class").split(' ').includes('quiz')) {
            let j = 1 + Math.floor(Math.random() * (i));
            while (!cards[i].getAttribute("class").split(' ').includes('quiz')) {
                let j = 1 + Math.floor(Math.random() * (i));
            }
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}

function resetscores() {
    highscores = {};
    localStorage.setItem("highscores", "");
    localStorage.setItem("hiscore", 0);
    document.querySelector("#hiscore").textContent = "0";
    yourscore = 0;
    document.querySelector("#yourscore").textContent = yourscore;
    refreshhiscores();
}

// evaluate answers and add score
function evaluatequiz(quizcard, choice) {
    var evaluation = "";
    if (choice.getAttribute("data-answer") == null) {
        evaluation = "Your choice: " + choice.textContent + ", is incorrect";
        console.log(evaluation);
    } else if (choice.getAttribute("data-answer") == "" || choice.getAttribute("data-answer") == "1") {
        evaluation = "Your choice: " + choice.textContent + ", is correct";
        console.log(evaluation);
        yourscore++;
        document.querySelector("#yourscore").textContent = yourscore;
    } else {
        evaluation = "Your choice: " + choice.textContent + ", is only partially correct";
        yourscore += parseFloat(choice.getAttribute("data-answer"));
        document.querySelector("#yourscore").textContent = yourscore;
    }
    return evaluation;
}

// return card classes string
function cardtype(event) {
    return event.currentTarget.parentNode.parentNode.getAttribute("class").split(' ');
}
/* return next card type --- unused for now
function nextcardtype() {
    if (cards[order[currentcard+1]]) {
        return cards[order[currentcard+1]].getAttribute("class").split(' ');
    } else {
        return "";
    }
    //return event.currentTarget.parentNode.parentNode.nextElementSibling.getAttribute("class").split(' ');
}*/

// take action on clicked event
function nextcard(event) {

    var thiscardtype = cardtype(event);
    var result = "";

    // if this is a quiz card, evaluate it
    if (thiscardtype.includes('quiz')) {
        result = evaluatequiz(event.currentTarget, event.target);
    }

    // if this is a start card, reset the score
    if (thiscardtype.includes('start')) {
        yourscore = 0;
        document.querySelector("#yourscore").textContent = yourscore;
    }

    if (thiscardtype.includes('finish')) {
        var initials = document.querySelector("#initials");
        console.log("initials: " + initials.value);
        finishquiz();
    }

    // hide this card
    event.currentTarget.parentNode.parentNode.setAttribute("style", "display: none;");
    // unsure why but assigning innerHTML always NULLS the result
    //console.log(event.currentTarget.parentNode.parentNode.innerHTML + "<p>" + result + "</p>");
    //event.target.parentNode.innerHTML = "<p> HELLO ================================= </p>";
    //console.log(event.target.parentNode.innerHTML);

    result = "<p>" + result + "</p>";
    document.getElementById("resultcard").innerHTML = result;

    // copy this card to the previous card area
    document.getElementById("previouscard").innerHTML = event.currentTarget.parentNode.parentNode.innerHTML;

    // choose the next card
    currentcard++;
    console.log("card advanced to " + currentcard);
    if (cards[order[currentcard]] != null) {
        cards[order[currentcard]].setAttribute("style", "display:flex;");
        // use this if to order from DOM
        //if (event.currentTarget.parentNode.parentNode.nextElementSibling != null) {
        //  event.currentTarget.parentNode.parentNode.nextElementSibling.setAttribute("style", "display:flex;");

        // if the next card is a finish card, check high score
        if (cards[order[currentcard]].getAttribute("class").split(' ').includes('finish')) {
            var l_hiscore = parseFloat(localStorage.getItem("hiscore"));
            document.querySelector("#scoremsg").textContent = "Your score is: " + yourscore;
            if (l_hiscore < yourscore) {
                localStorage.setItem("hiscore", yourscore);
                document.querySelector("#congratsmsg").textContent = "Congratulations! You have the High Score!";
            }
            document.querySelector("#hiscore").textContent = localStorage.getItem("hiscore");
        }

    } else {
        // no more cards, end of quiz
        // document.querySelector("#yourscore").textContent = localStorage.getItem("yourscore");
        alert("Thanks for playing! Let's go again!")
        location.reload();
    }
}

function refreshhiscores() {
    var scorerow = "<tr><th>Name</th><th>High Score</th></tr>";

    gethighscores();

    for (var i in highscores) {
        scorerow += "<tr>";
        scorerow += "<td>" + i + "</td>";
        scorerow += "<td>" + highscores[i] + "</td></tr>";
    }

    document.getElementById("scoretable").innerHTML = scorerow;
}

function gethighscores() {
    var hstr = localStorage.getItem("highscores");
    if (hstr != "") {
        highscores = JSON.parse(hstr);
    };
}

function storehighscores() {
    localStorage.setItem("highscores", JSON.stringify(highscores));
}

// Finish the quiz, store high scores
function finishquiz() {
    var initials = document.querySelector("#initials");
    console.log("initials: " + initials.value);
    if (initials.value != null) {
        if (!(initials.value in highscores)) {
            highscores[initials.value] = yourscore;
        } else {
            if (highscores[initials.value] < yourscore) {
                highscores[initials.value] = yourscore;
            }
        }
        storehighscores();
    }

    if (document.querySelector("#initials").value < yourscore) {
        localStorage.setItem(document.querySelector("#initials").value, yourscore);
    };
    refreshhiscores();
}


// Accordion class from https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
// https://codepen.io/Mamboleoo/pen/QWEpLqm

class Accordion {
    constructor(el) {
        // Store the <details> element
        this.el = el;
        // Store the <summary> element
        this.summary = el.querySelector('summary');
        // Store the <div class="content"> element
        this.content = el.querySelector('.content');

        // Store the animation object (so we can cancel it if needed)
        this.animation = null;
        // Store if the element is closing
        this.isClosing = false;
        // Store if the element is expanding
        this.isExpanding = false;
        // Detect user clicks on the summary element
        this.summary.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(e) {
        // Stop default behaviour from the browser
        e.preventDefault();
        // Add an overflow on the <details> to avoid content overflowing
        this.el.style.overflow = 'hidden';
        // Check if the element is being closed or is already closed
        if (this.isClosing || !this.el.open) {
            this.open();
            // Check if the element is being openned or is already open
        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }

    shrink() {
        // Set the element as "being closed"
        this.isClosing = true;

        // Store the current height of the element
        const startHeight = `${this.el.offsetHeight}px`;
        // Calculate the height of the summary
        const endHeight = `${this.summary.offsetHeight}px`;

        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }

        // Start a WAAPI animation
        this.animation = this.el.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });

        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(false);
        // If the animation is cancelled, isClosing variable is set to false
        this.animation.oncancel = () => this.isClosing = false;
    }

    open() {
        // Apply a fixed height on the element
        this.el.style.height = `${this.el.offsetHeight}px`;
        // Force the [open] attribute on the details element
        this.el.open = true;
        // Wait for the next frame to call the expand function
        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        // Set the element as "being expanding"
        this.isExpanding = true;
        // Get the current fixed height of the element
        const startHeight = `${this.el.offsetHeight}px`;
        // Calculate the open height of the element (summary height + content height)
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

        // If there is already an animation running
        if (this.animation) {
            // Cancel the current animation
            this.animation.cancel();
        }

        // Start a WAAPI animation
        this.animation = this.el.animate({
            // Set the keyframes from the startHeight to endHeight
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'
        });
        // When the animation is complete, call onAnimationFinish()
        this.animation.onfinish = () => this.onAnimationFinish(true);
        // If the animation is cancelled, isExpanding variable is set to false
        this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
        // Set the open attribute based on the parameter
        this.el.open = open;
        // Clear the stored animation
        this.animation = null;
        // Reset isClosing & isExpanding
        this.isClosing = false;
        this.isExpanding = false;
        // Remove the overflow hidden and the fixed height
        this.el.style.height = this.el.style.overflow = '';
    }
}

// /Accordion class
// add an accordion to all <details> sections
document.querySelectorAll('details').forEach((el) => {
    new Accordion(el);
});



// Add a "click" event listener on each <li> choice element
for (var i of cards) {
    i.setAttribute("style", "display:none;");
    for (var j of i.querySelectorAll("li")) {
        j.addEventListener("click", nextcard);
    }
}

// Begin to execute the game
gethighscores();
refreshhiscores();

// shuffle quiz card order
shuffle(order);

// Display first card
cards[0].setAttribute("style", "display:flex;");

// Display hi-score on page refresh
if (!localStorage.getItem("hiscore")) {
    localStorage.setItem("hiscore", 0);
}

document.querySelector("#hiscore").textContent = localStorage.getItem("hiscore");
document.querySelector("#yourscore").textContent = yourscore;
