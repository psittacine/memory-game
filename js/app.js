const deck = document.querySelector('.deck');
let openedCards = [];
let moves = 0;
let clockStopped = true;
let time = 0;
let clockTimer;
let matchedPairs = 0;
const totalPairs = 8;
const modal = document.querySelector('.modal');

// Shuffle deck on page load
shuffleDeck();

function shuffleDeck() {
    const deckOfCards = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(deckOfCards);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}

/*
 * Create a list that holds all of your cards
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Listen for clicks on cards
deck.addEventListener('click', function(event) {
    const clickedCard = event.target;

    if (clickedCard.classList.contains('card') && !clickedCard.classList.contains('match') && openedCards.length < 2 && !openedCards.includes(clickedCard)) {
        // Start clock when first card is clicked
        if (clockStopped) {
            startClock();
            clockStopped = false;
        }

        flipCard(clickedCard);
        addOpenedCard(clickedCard);

        if (openedCards.length === 2) {
            addMove();
            checkForMatch();
            movesToStars();
        }
    }
});

function flipCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addOpenedCard(clickedCard) {
    openedCards.push(clickedCard);
}

function checkForMatch() {
    // Matched
    if (openedCards[0].firstElementChild.className === openedCards[1].firstElementChild.className) {
        openedCards[0].classList.toggle('match');
        openedCards[1].classList.toggle('match');
        openedCards = [];
        matchedPairs++;
        if (matchedPairs === totalPairs) {
            gameOver();
        }
    } else {
        // Not Matched
        setTimeout(function() {
            flipCard(openedCards[0]);
            flipCard(openedCards[1]);
            openedCards = [];
        }, 1000);
    }
}

function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function movesToStars() {
    if (moves === 14 || moves === 18 || moves === 22) {
        subtractStar();
    }
}

function subtractStar() {
    const starPanel = document.querySelectorAll('.stars li i');
    for (star of starPanel) {
        if (star.classList.contains('fa')) {
            star.classList.replace('fa', 'far');
            break;
        }
    }
}

function startClock() {
    clockTimer = setInterval(function() {
        time++;
        clockText();
    }, 1000);
}

function stopClock() {
    clearInterval(clockTimer);
}

function clockText() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    clock.innerHTML = (seconds < 10) ? (`${minutes}:0${seconds}`) : (`${minutes}:${seconds}`);
}

function gameOver() {
    stopClock();
    modalGameResults();
    toggleModal();
}

function toggleModal() {
    modal.classList.toggle("show-modal");
}

// Game results for Modal
function modalGameResults() {
    const timeStat = document.querySelector('.modal-time');
    const clockTime =  document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal-moves');
    const starsStat = document.querySelector('.modal-stars');
    const stars = numOfStars();

    timeStat.innerHTML = `${clockTime}`;
    movesStat.innerHTML = `${moves}`;
    starsStat.innerHTML = `${stars}`;
}

// Get star count for modal info
function numOfStars() {
    stars = document.querySelectorAll('.stars li i');
    let starCount = 0;
    for (star of stars) {
        if (!star.classList.contains('far')) {
            starCount++;
        }
    }
    return starCount;
}

// Modal Close/Cancel button
document.querySelector('.modal-close').addEventListener('click', function() {
    toggleModal();
});

// Close modal when window is clicked
function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}
window.addEventListener("click", windowOnClick);

// Modal New Game button
document.querySelector('.modal-newGame').addEventListener('click', newGame);

// Restart arrow button above deck
document.querySelector('.restart').addEventListener('click', restartGame);

function newGame() {
    restartGame();
    toggleModal();
}

function restartGame() {
    resetTimeClock();
    resetStars();
    resetMoves();
    resetCards();
    shuffleDeck();
    matchedPairs = 0;
}

function resetTimeClock() {
    stopClock();
    clockStopped = true;
    time = 0;
    clockText();
}

function resetStars() {
    stars = 0;
    const starPanel = document.querySelectorAll('.stars li i');
    for (star of starPanel) {
        star.classList.replace('far', 'fa');
    }
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}
