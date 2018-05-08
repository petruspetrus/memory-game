// array for matched cards
 arrCardsOpen = {};
// array for card symbols
 var arrCardSymbols =['fa-anchor',
   'fa-bicycle',
   'fa-bolt',
   'fa-bomb',
   'fa-cube',
   'fa-diamond',
   'fa-leaf',
   'fa-paper-plane-o',
   'fa-anchor',
   'fa-bicycle',
   'fa-bolt',
   'fa-bomb',
   'fa-cube',
   'fa-diamond',
   'fa-leaf',
   'fa-paper-plane-o'];
// array for random numbers
var arrRandomNumbers = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
let totGoes=0;
let totMatches=0;
let gameTimer=0;
//-------------------------------------------------------------
// Shuffle an arraay of integers from 0 to 15
//-------------------------------------------------------------
function fcnShuffleArray(randomArray) {
    var currentIndex = randomArray.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = randomArray[currentIndex];
        randomArray[currentIndex] = randomArray[randomIndex];
        randomArray[randomIndex] = temporaryValue;
    }
    return randomArray;
}
//-------------------------------------------------------------
// initialise game
//-------------------------------------------------------------
function fcnInitialiseGame(){
  totGoes=0;
  totMatches=0;
  gameTimer=0;
  // shuffle the 16 numbers
  arrRandomNumbers = fcnShuffleArray(arrRandomNumbers);
  // each card element is has and id of the cardx where x is a number from
  // 0 to 15. We will index into the array of random numbers from 0 to 15,
  // select the random number in the i'th element to then point to the
  // symbol at the random number'th element of the symbol array. We will then
  // assign this to the n'th card in the DOM
  var i;
  for (i = 0; i < 16; i++) {
    // select the card node and <i> element containing the font awesome symbol
    var cardTile=document.getElementById('card'+i)
    var cardSymbol=cardTile.querySelector('i');
    // prime the card with the symbol indexed by the random number in the array
    cardSymbol.className="fa " + arrCardSymbols[arrRandomNumbers[i]];
    cardTile.className="card open";
  }
}
//-------------------------------------------------------------
// Set the class of a card item based on its matched status
//-------------------------------------------------------------
function setCardStatus(cardID, cardStatus){
  let cardTile=document.getElementById(cardID)
  let cardSymbol=cardTile.querySelector('i');
  switch(cardStatus) {
    case 'match':
        cardTile.className="card match";
        break;
    case 'miss':
        cardTile.className="card open";
        break;
    default:
        break;
      }
}
//-------------------------------------------------------------
// test the card clicked against any previous card clicked
//-------------------------------------------------------------
function fcnCardsOpen(cardID, cardSymbolSelected){
  // if there is no preliminary card clicked store this card for comparison
  if (arrCardsOpen[0]==null){
    arrCardsOpen[0]=cardID;
    arrCardsOpen[1]=cardSymbolSelected;
  }else{
    totGoes++;
    // if the we have two matching symbols....
    if (arrCardsOpen[1]==cardSymbolSelected){
      // and we have clicked two different cards then
      // set the two cards as matches and clear down the
      // comparison array
      if(cardID!==arrCardsOpen[0]){
        setCardStatus(cardID,'match');
        setCardStatus(arrCardsOpen[0],'match')
        arrCardsOpen[0]=null;
        arrCardsOpen[1]=null;
        totMatches++;
        console.log(totMatches);
        if (totMatches===8){
          alert('finished');
        }
      // if the symbols match but we have clicked on the same card twice ignore it
      }else{
        return;
      }
    // otherwise we have a miss
    }else{
      setCardStatus(cardID,'miss');
      setCardStatus(arrCardsOpen[0],'miss')
      arrCardsOpen[0]=null;
      arrCardsOpen[1]=null;
    }
  }
}
function fcnTestCards(evt,cardSymbolSelected){

}
function agpCardClicked(evt){
  //if we've clicked on a card
  if(evt.target.classList.contains('card')||evt.target.classList.contains('fa')){
    // if it's already matched just ignore it
    if (evt.target.classList.contains('match')){
      console.log('already matched');
    }else{
      // show the card
      evt.target.className='card open show'
      cardNumber=evt.target.id.replace('card','');
      var cardSymbolSelected=arrCardSymbols[arrRandomNumbers[cardNumber]];
      console.log(cardNumber + ' ' + cardSymbolSelected);
      // pause for a half second so that you can see the second card clicked before
      // deciding if a match
      setTimeout(function(){fcnCardsOpen(evt.target.id,cardSymbolSelected);},500);

    };
  };

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
document.addEventListener("DOMContentLoaded", function() {
    fcnInitialiseGame();
    let agpCardTable=document.querySelector('.deck');
    agpCardTable.addEventListener('click', function(){
      agpCardClicked(event);
      console.log(totMatches);
      })

    let agpRestart=document.querySelector('.restart');
    agpRestart.addEventListener('click',function(){
      fcnInitialiseGame();
    })
});
