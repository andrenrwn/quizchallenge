//let $stackedCards = $('.stacked-cards');
stackedCards = document.querySelector(".stacked-cards");

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

/*
function addCard(cardContent) {
	let $newCard = $(cardContent);
	$stackedCards.append($newCard);
	setTimeout(() => {
		requestAnimationFrame(() => {
			$newCard.addClass('card--added');
		});
	}, 10);
}

$().ready(() => {
	addCard('<div class="card"><h2 class="heading-beta">A Card!</h2></div>');
});

$('#js-add-card').on('click', () => {
	addCard('<div class="card"><h2 class="heading-beta">Another Card!</h2></div>');
});
*/

document.getElementById("js-add-card").addEventListener("click", addCard);

/*
$('#js-add-tall-card').on('click', () => {
	addCard('<div class="card"><h2 class="heading-beta">A<br />Tall<br />Card!</h2></div>');
});
*/

document.getElementById("js-add-tall-card").addEventListener("click", addCard);

/*
$('#js-remove-card').on('click', () => {
	let $activeCard = $stackedCards.children().slice(-1);
	$activeCard.removeClass('card--added');
	setTimeout(() => {
		requestAnimationFrame(() => {
			$activeCard.remove();
		});
	}, 400); // Match CSS transition time
});
*/
document.getElementById("js-remove-card").addEventListener("click",
	() => {
		let activeCard = stackedCards.children[stackedCards.children.length-1];
		activeCard.classList.remove("card--added");
		setTimeout(() => {
			requestAnimationFrame(() => {
				activeCard.remove();
			});
		}, 400); // Match CSS transition time
	}
)

