
/* When user clicks on a card, it changes:
1. State of card (flip up or flip down)
2. moves count
3. matches count (based on match)
4. Star rating (increase or decrease, bsae don match)
*/

// ####################### Main Code ##########################################

// global variables
let openCards = [];
let matchedCards = [];
let moves = 0;
let matches = 0;
let rating = 5;

const upClass = "up";
const downClass = "down";
const matchClass = "match";

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
let cards = document.querySelectorAll('.card');
for ( let card of cards )
{
  card.addEventListener('click', game);
}

// Add event listener on reset button
let reset_button = document.querySelector('#reset-button');
reset_button.addEventListener('click', game_reset);

// ####################### Functions ##########################################

function game(evt) {

  let card1 = evt.target;

  // If all card are matched with their pair
  if (matchedCards.length === 16)
  {
    // end the game and display greetings
  }

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
    document.querySelector(".moves p").textContent = moves;

    // TODO: what to do if same card clicked again
    if ( card1 === card2 ){
      console.log("Same card is clicked again");
    }

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
      document.querySelector(".matches p").textContent = matches;

      // Remove event listener on these cards
      card1.removeEventListener('click', game);
      card2.removeEventListener('click', game);

    }
    // If cards are not matched
    else {

      // flip down the cards again
      flipDown(card1);
      flipDown(card2);

      // Clear the openCards array
      openCards.pop();
    }
  }
  console.log("open cards: ", openCards);
  console.log("matched cards: ", matchedCards);
}

function game_reset(evt){
  // all cards down

  // shuffle all cards

  // add event listener on all cards

  // reset moves and matches to 0

  // reset ratings to 5 stars
}

function cardsMatched(card1, card2){
  card1.classList.add(matchClass);
  card2.classList.add(matchClass);
}

// flip the card up
function flipUp(card) {
  // add "up" class to card
  card.classList.add(upClass);
  card.isUp = 1;
  if (card.isDown === 1){
    card.classList.toggle(downClass);
  }
}

// flip the card up
function flipDown(card) {
  // add "down" class to card
  card.classList.add(downClass);
  card.isDown = 1;
  if (card.isUp === 1){
    card.classList.toggle(upClass);
  }
}

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
