/*
* Title:        Memory Game
* Description:  A simple tile matching game
*/
/*--------------------------------------------------------------
* Initialise variable stack
* --------------------------------------------------------------
*/
//array for matched cards
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
// totals
let totGoes=0;                  // total turns taken
let totMatches=0;               // total matches
// game timer variables
let gameElapsed=0;              // time variable for elapsed time
let gameStart=0;                // time variable for start time
let elapsedMinutes=0;           // elapsed minutes
let elapsedSeconds=0;           // elapsed seconds
let elapsedHundredths=0;        // elapsed hundredths
let gameTimerInterval=100;      // timer interval (100 equiv to 100'th second)
let gameTimer=null;             // object for timer interval counter
// booleans
let gameEnded=false;            // boolean for game ended
//
/*--------------------------------------------------------------
* Objective:  Shuffle an arraay of integers from 0 to 15 which will be
*             used to randomise the game tile images
* Parameters: none
* Returns:    array of 16 randomised numbers
* --------------------------------------------------------------
*/
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
/*--------------------------------------------------------------
* Objective:  Set the css classes for a given card based on its matched
*             status
* Parameters: cardID      - identifies the specific tile that was clicked
*             cardStatus  - the card's matched status
* Returns:    nothing
* --------------------------------------------------------------
*/
function agpSetCardStatus(cardID, cardStatus){
  let cardTile=document.getElementById(cardID);
  let cardSymbol=cardTile.querySelector('i');
  switch(cardStatus){
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
/*--------------------------------------------------------------
* Objective:  Determine what to with the last card clicked based on whether
*             there is already a card showing and whether it matches. If not,
*             save the card symbol for matching to a subsequent selected card
* Parameters: cardID              - identifies the specific tile that was clicked
*             cardSymbolSelected  - the card's symbol
* Returns:    nothing
* --------------------------------------------------------------
*/
function agpCardsOpen(cardID, cardSymbolSelected){
  /* if there is no preliminary card clicked store this card for comparison
  *  purposes and exit routine
 */
  if (arrCardsOpen[0]==null){
    arrCardsOpen[0]=cardID;
    arrCardsOpen[1]=cardSymbolSelected;
  }else{
    /* we have another card already showing so lets compare
    *  if we have two matching symbols....
 */
    if (arrCardsOpen[1]==cardSymbolSelected){
      /* and we have haven't clicked the same card twice */
      if(cardID!==arrCardsOpen[0]){
        /* set the two cards as matches and clear down the
        *  comparison array ready for the next card pair
 */
        agpSetCardStatus(cardID,'match');
        agpSetCardStatus(arrCardsOpen[0],'match')
        arrCardsOpen[0]=null;
        arrCardsOpen[1]=null;
        /* increment the total matches */
        totMatches++;
        /* test for game over straight away and stop the timer */
        if (totMatches===8){
          /* stop game, display results, determine next steps */
          agpGameOver();
        }
      /* if symbols match but we've clicked on same card twice ignore it */
      }else{
        return;
      }
    /* otherwise, it's a miss */
    }else{
      /* reset the status of both cards to cause them to flip back
      *  over to hide their faces
 */
      agpSetCardStatus(cardID,'miss');
      agpSetCardStatus(arrCardsOpen[0],'miss');
      /* clear down the comparison array to await next two cards clicked */
      arrCardsOpen[0]=null;
      arrCardsOpen[1]=null;
    }
  }
}
/*--------------------------------------------------------------
* Objective:  Adjust the player's star rating based on number of
*             clicks taken
* Parameters: totGoes             - number of clicks taken so far
*             cardSymbolSelected  - the card's symbol
* Returns:    nothing
* --------------------------------------------------------------
*/
function agpToggleStar(totGoes){
  /* if we already have lowest rating just exit */
  if(totGoes>35) {
    return
  }else{
    /* element number points to which star we are going to 'turn off'
    *  three being the rightmost star and one the leftmost
 */
    let elementNumber=0
    if(totGoes>34) {
      elementNumber=1;
    }
    else if(totGoes>26) {
      elementNumber=2;
    }
    else if (totGoes>18) {
      elementNumber=3;
    }
    /* we could try and test whether we have already set the star
    * but it's actually quicker just to rewrite it
 */
    if(elementNumber>0){
      movesStarsBase=document.querySelector(".stars");
      movesStars=movesStarsBase.querySelectorAll('i');
      el=movesStars[elementNumber-1];
      el.classList.remove("fa-star");
      el.classList.add("fa-star-o");
    }
  }
}
/*--------------------------------------------------------------
* Objective:  Games finihed so display the scores and see whether
*             player wants another game or to quit
* Parameters: none
* Returns:    nothing
* --------------------------------------------------------------
*/
function agpGameOver(){
    gameEnded=true;
    /* set the button listeners on the modal
    /* if we get 'play again' lets start the game over */
    let btnPlayAgain =document.querySelector(".play-again");
    btnPlayAgain.addEventListener('click', function() {
      modal.style.display = "none";
      fcnInitialiseGame();
    });
    /* if we get 'quit' then bring proceedings to a close */
    let btnQuit = document.querySelector(".quit-game");
    btnQuit.addEventListener('click', function() {
      modal.style.display = "none";
      close();
    });

    /* set up the modal content based on player's performance */
    var modal = document.getElementById('modal-game-end');
    var modalText = document.querySelector('.modal-text');
    modalText.innerHTML="Congratulations - you completed the quiz in " +
                          totGoes + " total moves and in a time of " +
                          elapsedMinutes + "m" +
                          elapsedSeconds + "." +
                          elapsedHundredths + "s";
    /* display it */
    modal.style.display = "block";
}
/*--------------------------------------------------------------
* Objective:  Process the clicked card and determine what to do
* Parameters: evt - the trigerred event
* Returns:    nothing
* --------------------------------------------------------------
*/
function agpCardClicked(evt){
  /* if we've clicked on a card */
  if(evt.target.classList.contains('card')||evt.target.classList.contains('fa')){
    /* increment total moves counter */
    totGoes++;
    /* see if this is the first click and if so, set the timer running */
    if(totGoes==1){
      let gameDate = new Date();
      gameStart=gameDate.getTime();
      agpStartTimer()
      }
    /* increment the moves counter on the screen */
    movesCounter=document.querySelector(".moves");
    movesCounter.innerHTML=totGoes;
    /* amend star rating as necessary */
    agpToggleStar(totGoes);

    /* work out what to do with the card clicked
    *  if the card it is already matched just ignore it */
    if (evt.target.classList.contains('match')){
      }
    /* if the card it is already turned over just ignore it */
    else if (evt.target.classList.contains('show')){
      }
    else{
      /* show the card */
      evt.target.className='card open show'
      /* work out which card was pressed based on its id of the form cardnn */
      cardNumber=evt.target.id.replace('card','');
      /* use the card number as the pointer into the array of card symbols
      *  to see what symbol has been selected */
      var cardSymbolSelected=arrCardSymbols[arrRandomNumbers[cardNumber]];
      /* pause for a half second so that player can see the second card clicked before
      *  deciding what to do with it */
      setTimeout(function(){agpCardsOpen(evt.target.id,cardSymbolSelected);},500);
    };
  };
};
/*--------------------------------------------------------------
* Objective:  Set the timer running until game stopped
* Parameters: nothing
* Returns:    nothing
* --------------------------------------------------------------
*/
function agpStartTimer(){
  gameTimer = setInterval(function() {

  /* Get todays date and time */
  let gameDate=new Date();
  gameElapsed = gameDate.getTime();

  /* Find the elapsed time between now and the start time */
  var elapsedTime = gameElapsed - gameStart;

  /* Extract the elapsed minutes, seconds and one hundredths */
  elapsedMinutes = Math.trunc((elapsedTime / 1000 )/60);
  elapsedSeconds = Math.trunc((elapsedTime / 1000)-(elapsedMinutes*60));
  elapsedHundredths=Math.trunc((elapsedTime /100)-(elapsedSeconds*10)-(elapsedMinutes*600));

  /* If the game is still happening update timer */
  if (!gameEnded==true) {
      document.querySelector(".timer").innerHTML = elapsedMinutes + "m " + elapsedSeconds + ":" + elapsedHundredths + "s";
      }
  /* otherwise, close the timer down */
  else{
      clearInterval(gameTimer);
    }
  }, gameTimerInterval);
}
/*--------------------------------------------------------------
* Objective:  Initilise the game
* Parameters: nothing
* Returns:    nothing
* --------------------------------------------------------------
*/
function fcnInitialiseGame(){
  /* reset counters, timers and game ended flag */
  totGoes=0;
  totMatches=0;
  gameEnded=false;
  /* shuffle the 16 numbers */
  arrRandomNumbers = fcnShuffleArray(arrRandomNumbers);
  /* each card element has an id of the form cardxx where xx is a number from
  *  0 to 15. We will index into the array of random numbers from 0 to 15,
  *  select the random number in the i'th element and then point to the
  * symbol at the random number'th element of the symbol array. We will then
  * assign this to the n'th card in the DOM */
  var i;
  for (i = 0; i < 16; i++) {
    /* select the card node and <i> element containing the font awesome symbol */
    var cardTile=document.getElementById('card'+i)
    var cardSymbol=cardTile.querySelector('i');
    /* prime the card with the symbol indexed by the random number in the array */
    cardSymbol.className="fa " + arrCardSymbols[arrRandomNumbers[i]];
    cardTile.className="card open";
  }
  /* reset the moves counter to 0 */
  movesCounter=document.querySelector(".moves");
  movesCounter.innerHTML=0;
  /* reset the stars ranking */
  let movesStarsBase=document.querySelector(".stars");
  movesStars=movesStarsBase.querySelectorAll('i');
  for (let el of movesStars){
    el.classList.remove("fa-star-o");
    el.classList.add("fa-star");
  }
  /* reset the timer display */
  document.querySelector(".timer").innerHTML ="0m 0.0s";
}
/*--------------------------------------------------------------
* Objective:  Reset the game as user has pressed reset button.
*             Assume user wants to play again so re-initialise game
* Parameters: nothing
* Returns:    nothing
* --------------------------------------------------------------
*/
function agpResetGame(){
  /* turn on the boolean to say we've ended */
  gameEnded=true;
  /* stop the timer event */
  clearInterval(gameTimer);
  /* reinitialise the game */
  fcnInitialiseGame();
}
/*--------------------------------------------------------------
* Objective:  Mainline controller
*             Wait for document load.
*             Listen for card click and restart events
* Parameters: nothing
* Returns:    nothing
* --------------------------------------------------------------
*/
/* wait for the document load */
document.addEventListener("DOMContentLoaded", function() {
  /* initialise all of the counters, board, etc */
  fcnInitialiseGame();
  /* set the event listener for a click on the card deck area */
  let agpCardTable=document.querySelector('.deck');
  agpCardTable.addEventListener('click', function(){
    /* process the card click and see what to do */
    agpCardClicked(event);
    });
  /* set the event listener for a reset click */
  let agpRestart=document.querySelector('.restart');
  agpRestart.addEventListener('click',function(){
    /* reset the game */
    agpResetGame();
  });
});
