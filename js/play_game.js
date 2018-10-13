
// ####################### Main Code ##########################################

// global variables
let openCards = []; // Any open card will be stored
let matchedCards = []; // all matched cards
let moves = 0;
let matches = 0;
let rating = 5;
let cards;
let reset_button;
let modal;
let seconds = 0;
let timeTaken;
let timerSet = 0;
let timer;
let scoresHtml;

const STARS = 5;
const emptyStarClass = "far";
const fullStarClass = "fas";

const upClass = "up";
const downClass = "down";
const matchClass = "match";

// start the game
start_game();

/**
* @description Main function to start the game and add event listeners on page
*/
function start_game() {
  //get all symbols in an array
  let symbols = [ "fas fa-apple-alt", "fas fa-ambulance", "fas fa-atom", "fas fa-air-freshener",
  "fas fa-anchor", "fas fa-bicycle", "fas fa-basketball-ball", "fas fa-brain", "fas fa-apple-alt",
  "fas fa-ambulance", "fas fa-atom", "fas fa-air-freshener",
  "fas fa-anchor", "fas fa-bicycle", "fas fa-basketball-ball", "fas fa-brain"];

  // Delete default card elements
  let cardDeck = document.querySelector('.cards');
  let deckChildNodes = cardDeck.childNodes;

  while (cardDeck.firstChild) {
    cardDeck.removeChild(cardDeck.firstChild);
  }

  // add shuffled cards in new order
  symbols = shuffle(symbols);
  let shuffledCards = createHTML(symbols);
  cardDeck.insertAdjacentHTML('afterbegin', shuffledCards);

  // add event listener on all cards
  cards = document.querySelectorAll('.card');
  for ( let card of cards )
  {
    // ToLearn: Event order:  https://www.quirksmode.org/js/events_order.html#link4
    card.addEventListener('click', game);
  }

  // Add event listener on reset button
  reset_button = document.querySelector('#reset-button');
  reset_button.addEventListener('click', game_reset);
}

// ####################### Other needed Functions ##########################################

/**
* @description Game logic sits in this function e.g. set timer, flip up card, flip down card
*/
function game(evt) {
  let card1 = evt.target;

  // Set timer only first time
  if (!timerSet) {
    timerSet = 1;
    timer = setInterval(myTimer, 1000); // triggers myTimer() every 1 second
  }

  // Learning: https://davidwalsh.name/event-delegate
  // Proceed only if card is not up
  if ( !(card1.isUp) && (card1.nodeName === "LI") ) { // For event delegation, we used card1.nodeName
    // If there is no card in array openCards yet
    if ( openCards.length === 0 ) {
      console.log("First card clicked");

      // flip the card up
      flipUp(card1);

      // push the card to openCards array
      openCards.push(card1);
    }

    // If there is one card in openCards array
    else if (openCards.length === 1 ) {
      let card2 = openCards[0]; // card already opened

      console.log("Second card clicked");

      // flip up this card
      flipUp(card1);

      // Update the moves counter
      moves += 1;
      updateMoves(moves);

      // if symbols on cards match
      if ( doCardsMatch(card1, card2) === true ){

        // push cards to the matchedCards array
        matchedCards.push(card1);
        matchedCards.push(card2);

        // Change the style of cards to show that they are already matched
        cardsMatched(card1, card2);

        // Clear the openCards array
        openCards.pop();

        // update matches on screen and add new matches count to text of that element
        matches += 1;
        updateMatches(matches);

        // update rating, increase rating by 1 if rating < 5
        if ( rating < 5 ){
          rating += 1;
          update_rating(rating);
        }

        // Remove event listener on these cards
        card1.removeEventListener('click', game);
        card2.removeEventListener('click', game);

      }
      // If cards are not matched
      else {
        setTimeout( () => {
          // flip down the cards again
          flipDown(card1);
          flipDown(card2);

          // Clear the openCards array
          openCards.pop();

          // update rating, decrease rating by 1 if rating > 0
          if ( rating > 0 ){
            rating -= 1;
            update_rating(rating);
          }
        }, 1000);
      }
    }
    console.log("open cards: ", openCards);
    console.log("matched cards: ", matchedCards);

    // If all card are matched with their pair
    if ( matchedCards.length === 16 )
    {
      timeTaken = seconds;
      clearInterval(timer);
      // end the game and display greetings
      game_won();
    }
  }
  else {
    console.log("same card is clicked again");
  }
}

// Timer's function, which increase counter every one second
function myTimer() {
  seconds++;
}

/**
* @description What to do when game is won
*/
function game_won() {
  // add event listener for close button
  let closeButton = document.querySelector(".close");
  closeButton.addEventListener('click', closeModal);

  // add event listener for play again button
  let playButton = document.querySelector(".play_again");
  playButton.addEventListener('click', playAgain);

  // Add scores before playButton
  scoresHtml = getScoresHtml();
  playButton.insertAdjacentHTML('beforebegin', scoresHtml);

  // display a modal with stats and greetings and with a "play again" button
  modal = document.getElementById('myModal');
  modal.style.display = "block";
}

/**
* @description Constructs HTML to display on modal, when game is won
*/
function getScoresHtml() {
  let scores = "";
  let ratingHtml = document.querySelector("li.star-rating").innerHTML;
  scores += `<p class="remove">Moves: ${moves}</p><p class="remove">Matches: ${matches}</p><p class="remove">Rating:</p> ${ratingHtml} <p class="remove">Time Taken: ${timeTaken} Seconds</p>`;
  return scores;
}

/**
* @description What to do if user clicks on play again
*/
function playAgain(evt) {
  // hide modal
  modal.style.display = "none";

  // remove HTML added to Modal
  // let modal = document.querySelector(".modal-content");
  // let modalScores = document.querySelectorAll(".remove");
  // for (let i in modalScores){
  //   modal.removeChild(modalScores[i]);
  // }
  // Restart game
  game_reset();
}

/**
* @description If user clicks on close modal after winning
*/
function closeModal() {
  // hide modal and show the game
  modal.style.display = "none";
}

/**
* @description Rest game logic
*/
function game_reset(){
  // remove "match" class from matched cards to make them normal
  for ( let card of matchedCards )
  {
    card.classList.remove(matchClass);
  }
  matchedCards = [];
  openCards = [];
  // all cards down
  for ( let card of cards )
  {
    flipDown(card);
  }

  matches = 0;
  moves = 0;

  // reset moves and matches to 0
  updateMatches(matches);
  updateMoves(moves);

  // reset ratings to 5 stars
  rating = 5;
  update_rating(rating);

  // clear timer and reset seconds and timeTaken
  clearInterval(timer);
  seconds = 0;
  timeTaken = 0;

  // add shuffled cards in new order
  // add event listener on all cards and reset button
  start_game();
}

/**
* @description Change the class of matched cards to show them differently
*/
function cardsMatched(card1, card2){
  card1.classList.add(matchClass);
  card2.classList.add(matchClass);
}

/**
* @description Flip the card up
*/
function flipUp(card) {
  // add "up" class to card
  card.classList.add(upClass);
  card.isUp = 1;
  if (card.isDown === 1){
    card.classList.toggle(downClass);
  }
  card.isDown = 0;
}

/**
* @description Flip the card down
*/
function flipDown(card) {
  // add "down" class to card
  card.classList.add(downClass);
  card.isDown = 1;
  if (card.isUp === 1){
    card.classList.toggle(upClass);
  }
  card.isUp = 0;
}

/**
* @description Logic to check if cards are matched
*/
function doCardsMatch(card1, card2){
  // match the classname of card's child(<i>) element e.g. cards[0].firstElementChild.className
  const class1 = card1.firstElementChild.className;
  const class2 = card2.firstElementChild.className;

  console.log("Symbols on cards: ", class1, "and", class2);

  if (class1 === class2 ){
    console.log("Symbols on cards match");
    // add match class to both cards
    return true;
  }
  console.log("Symbols on cards do not match");
  return false;
}

// create HTML from symbols in following format:
/* <li class="card">
      <i class="fas fa-brain"></i>
   </li> */
function createHTML(symbols) {
  var liNode = "";
  for ( let symbol of symbols ){
    liNode += `<li class="card">
      <i class="${symbol}"></i>
      </li>`;
  }
  return liNode;
}

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

/**
* @description Function to change star rating on page
*/
function update_rating(rating){
  let empty_stars_count;
  empty_stars_count = 5 - rating;

  let all_stars = document.querySelectorAll(".star-rating i");

  for (let i = 0; i < STARS - empty_stars_count; i++){
    // change last n stars in html, where n = empty_stars_count

    // class "fas" is for filled star and "far" is for empty star

    // In last n elements, remove "fas" and add "far"
    all_stars[i].classList.add(fullStarClass);
    all_stars[i].classList.remove(emptyStarClass);
  }

  for (let i = STARS - empty_stars_count; i < STARS; i++){
    // change last n stars in html, where n = empty_stars_count

    // class "fas" is for filled star and "far" is for empty star

    // In last n elements, remove "fas" and add "far"
    all_stars[i].classList.add(emptyStarClass);
    all_stars[i].classList.remove(fullStarClass);
  }
}

/**
* @description Update card matches on page
*/
function updateMatches(matches) {
  document.querySelector(".matches p").textContent = matches;
}

/**
* @description Updates user's moves on page
*/
function updateMoves(moves) {
  document.querySelector(".moves p").textContent = moves;
}
