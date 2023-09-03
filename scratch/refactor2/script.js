// ----------------
// global variables
// ----------------
var stackedCards = document.querySelector(".stacked-cards"); // cards of displayed questions
var quizdata = document.querySelector("#quizdata").children; // all quiz questions from HTML
var order = Array.from(Array(quizdata.length).keys()); // track question order
var currentcard = 0; // tracks question to ask

var highscores = {};
var yourscore = 0;

var timeleft; // maximum time
var timededuct = parseFloat(document.getElementById("timededuct").textContent);
var timedispEl = document.getElementById("timerdisplay");
var timerObj = null;

// Fisher-Yates shuffle, adapted from https://javascript.info/task/shuffle
// shuffle the order only for quiz cards
function shuffle(arr) {
	for (let i = arr.length - 1; i > 1; i--) {
		if (quizdata[i].classList.contains('quiz')) {
			let j = 1 + Math.floor(Math.random() * (i));
			while (!quizdata[i].classList.contains('quiz')) {
				let j = 1 + Math.floor(Math.random() * (i));
			}
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}
}

// Draw stacked cards
//   pullup: false --- draw stacked cards
//   pullup: true --- draw a pulled up card with the rest pushed down
//   Idea from colin: https://codepen.io/colin/pen/bdxoZL
function stackcards(pullup) {
	var allstackedcards = document.querySelectorAll(".card--added");
	var z = -allstackedcards.length;
	var opacity = 1;
	var yposition = 0;
	var zposition = 0;

	for (var i of allstackedcards) {
		// stack cards
		opacity = (1.0 + ((z + 1) / 10.0));
		yposition = ((z + 1) * 10);
		zposition = (z + 1) * 32;
		if (!pullup) {
			// render stacked cards
			i.style = "transform: translate3d(0, " + yposition + "px," + zposition + "px) scale(1); opacity: " + opacity + ";";
		} else {
			// pull up clicked card from stack, push down other stacked cards
			if (i.classList.contains("pulled-up")) {
				i.style = "transform: translate3d(0, " + (-90 + yposition) + "px," + zposition + "px) scale(1); opacity: 1; min-height:550px;";
			} else {
				i.style = "transform: translate3d(0, " + (400 + yposition) + "px," + zposition + "px) scale(1); opacity: " + opacity + ";";
			}
		}
		z++;
	}
}

// lay out all quiz cards for review
function layoutcards() {
	var quizdisplay = document.getElementsByClassName("stacked-cards");
	var allstackedcards = document.getElementsByClassName("card--added");

	quizdisplay[0].style = "height: auto; transform: scale(0.5); transform-origin: 50% 0;";
	quizdisplay[0].parentElement.style = "height:auto;";

	for (var i of allstackedcards) {
		//i.setAttribute('style', "background-color: green; position: relative; opacity: 1; transform: translate3d(0px,0px,0px);");
		i.style = "position: relative; opacity: 1; margin-bottom: 5px;";
	}
}

// display a new quiz card (currentcard)
function quizcard() {
	let newcard = document.createElement("div");
	newcard.innerHTML = quizdata[order[currentcard]].innerHTML;
	newcard.classList.add("card");
	let frontcard = stackedCards.appendChild(newcard);

	frontcard.addEventListener("click", nextcard);
	// add event listeners when users click a choice
	/*
	for (var j of frontcard.querySelectorAll("li")) {
		j.addEventListener("click", nextcard, { once:true });
	};
	*/
	setTimeout(() => {
		requestAnimationFrame(() => {
			frontcard.classList.add("card--added");
			stackcards(false);
		});
	}, 10);
	return frontcard;
}

// render a pulled up card
function pullupcard(event) {
	//event.preventDefault();

	// toggle pullup
	event.currentTarget.classList.toggle("pulled-up");

	if (event.currentTarget.classList.contains("pulled-up")) {
		stackcards(true);
	} else {
		stackcards(false);
	}
}

// Evaluate a user's answer when they click on <li> items and add score
// Correct answers earn the data-answer value if specified, or 1 point if unspecified
function evaluatequiz(event) {
	var evaluation = "";
	if (!event.target.hasAttribute("data-answer")) {
		evaluation = "Your choice: " + event.target.textContent + ", is incorrect";
		timeleft -= timededuct;
	} else if (event.target.dataset.answer === "") {
		evaluation = "Your choice: " + event.target.textContent + ", is correct";
		yourscore++;
		document.querySelector("#yourscore").textContent = yourscore.toFixed(2);
	} else {
		evaluation = "Your choice: " + event.target.textContent + ", is only partially correct";
		yourscore += parseFloat(event.target.dataset.answer);
		document.querySelector("#yourscore").textContent = yourscore.toFixed(2);
	}

	let resultdiv = document.createElement("div");
	resultdiv.classList.add("result");
	resultdiv.innerHTML = "<hr><i>" + evaluation + "</i>";
	return resultdiv;
}

// countdown timer function is called periodically by timerObj's setinterval
function countdown() {
	timedispEl.innerHTML = timeleft.toFixed(2);
	timeleft -= 0.10; // ten times a second

	// have we reached the finish card?
	if ((currentcard >= (order.length - 1)) || (timeleft <= 0)) {
		if (timeleft <= 0) {
			timeleft = 0;
			timedispEl.innerHTML = timeleft.toFixed(2);
			currentcard = order.length - 1;
			quizcard();
			stackcards(false);
		}
		clearInterval(timerObj);
	}
}

// Main quiz user-interface handler
//   Handles user clicks on displayed quiz cards
function nextcard(event) {
	event.preventDefault();
	event.stopPropagation(); // stop the click from triggering other events?

	// pullup card if clicked anywhere else than the <li> options
	if (!(event.target.nodeName === 'LI' || event.target.nodeName === 'INPUT') ||
		event.currentTarget.classList.contains("pulled-up")) {
		if (event.currentTarget.nextSibling !== null) { // don't pullup front card
			pullupcard(event);
		}
		return;
	}

	var thiscardtype = quizdata[order[currentcard]].classList;
	var result; // result of quiz evaluation

	// if this is a quiz card, evaluate it
	if (thiscardtype.contains('quiz')) {
		result = evaluatequiz(event);
		event.currentTarget.append(result);
	}

	// if this is a start card, reset the score and start timer
	if (thiscardtype.contains('start')) {
		yourscore = 0;
		document.querySelector("#yourscore").textContent = yourscore.toFixed(2);

		// start timer once user starts quiz
		if (event.target.nodeName === 'LI') {
			timerObj = setInterval(countdown, 100);
		}
	}

	// finish the quiz and collect initials
	if (thiscardtype.contains('finish')) {
		var initials = document.querySelector("#initials");

		if (event.target.nodeName == "LI") {
			finishquiz();
			return; // goto out - do not refresh with stacked cards
		}
	} else {
		// advance quiz question index only if this isn't a finish card
		currentcard++;

		// console.log("card advancing to " + currentcard + "order index" + order[currentcard]);

		quizcard();
	}

	stackcards(false); // refresh page
}

// Debug tools - Popout card system
//   Adapted from colin: https://codepen.io/colin/pen/bdxoZL
/*
function addCard(event) {
	var addstring = "";
	if (event.target.id == "js-add-card") {
		addstring = "A Card!";
	} else if (event.target.id == "js-add-tall-card") {
		addstring = "A <br />Tall<br />Card!";
	};
	let newCard = document.createElement("div");
	newCard.innerHTML = '<h2 class="heading-beta">' + addstring + '</h2>';
	newCard.classList.add("card");
	let lastCard = stackedCards.appendChild(newCard);
	setTimeout(() => {
		requestAnimationFrame(() => {
			lastCard.classList.add("card--added");
		});
	}, 10);
}

// Event listener buttons for debugging
/*
document.getElementById("js-add-card").addEventListener("click", addCard);

document.getElementById("js-add-tall-card").addEventListener("click", addCard);

document.getElementById("js-remove-card").addEventListener("click",
	() => {
		let activeCard = stackedCards.children[stackedCards.children.length - 1];
		activeCard.classList.remove("card--added");
		setTimeout(() => {
			requestAnimationFrame(() => {
				activeCard.remove();
			});
		}, 400); // Match CSS transition time
	}
)
*/

// --------------------
/* High score system */

// clear high scores from localstorage and refresh highscore display
function resetscores() {
	highscores = {};
	localStorage.setItem("highscores", "");
	localStorage.setItem("hiscore", 0);
	document.querySelector("#hiscore").textContent = "0.00";
	yourscore = 0;
	document.querySelector("#yourscore").textContent = yourscore.toFixed(2);
	refreshhiscores();
}

// redraw highscore table
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

// get highscore from localstorage
function gethighscores() {
	var hstr = localStorage.getItem("highscores");
	var unsorted = {};
	if (hstr != "") {
		unsorted = JSON.parse(hstr);
	};

	// sort for ES10 from
	// https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
	highscores = Object.fromEntries(
		Object.entries(unsorted).sort(([, a], [, b]) => b - a));
}

function storehighscores() {
	localStorage.setItem("highscores", JSON.stringify(highscores));
}

// ----------------------------------
// Finish the quiz, store high scores
function finishquiz() {

	layoutcards();

	var initials = document.querySelector("#initials");
	if (initials.value !== null && initials.value !== "") {
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

	if (confirm("Quiz finished. Ok to Restart. Cancel to Review.")) {
		location.reload();
	};
}

// ----------------------
// Accordion object class
// Taken from https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
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

// Add accordion to all <details> sections to animate them
document.querySelectorAll('details').forEach((el) => {
	new Accordion(el);
});

/* Debug tools - high score
// populate local store high scores with dummy data ( for debugging )
function populatehighscores() {
	for (var i = 0; i < 10; i++) {
		highscores[String.fromCharCode(i + 97)] = "0." + i.toString();
	}
	storehighscores();
}
populatehighscores();
*/

// --------------------
// Start quiz execution
function init() {
	// set up high scores from localstore
	gethighscores();
	refreshhiscores();

	// get timer from HTML
	timeleft = parseFloat(document.getElementById("timetotal").textContent);

	// shuffle quiz card order
	shuffle(order);

	// add first card
	quizcard();
}

init();