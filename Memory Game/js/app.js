var card = document.getElementsByClassName("card");
var cards = [...card] ;
var openedCards = [];
var matchedCard = document.getElementsByClassName("match");
var deck = document.getElementById("card-deck");
var moves = 0;
var count = document.querySelector(".moves");
var stars = document.querySelectorAll(".fa-star");
var starsList = document.querySelectorAll(".stars li");
var modal = document.getElementById("popup1");
var closeicon = document.querySelector(".close");
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
// @description shuffles cards
// @param {array}
// @returns shuffledarray
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
};


// @description shuffles cards when page is refreshed / loads
document.body.onload = OnGameStart();


//Intlize the game objects at the begining
function OnGameStart(){
  openedCards =[] ;
    cards = shuffle(cards);
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    moves = 0;
    count.innerHTML = moves;
    for (var i= 0; i < stars.length; i++){
        stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    second = 0;
    minute = 0;
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}


// Shows or flip the card by adding this class
var ShowCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};


// add opened cards to OpenedCards list and check if cards are match or not
function OpenCard() {
    openedCards.push(this);
    var temp = openedCards.length;
    if(temp === 2){
        CountMove();
        if(openedCards[0].type === openedCards[1].type){
            Matching();
        } else {
            unMatching();
        }
    }
};


// when cards match
function Matching(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}


// when cards don't match
function unMatching(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    Hold();
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        Release();
        openedCards = [];
    },1100);
}


//  disable cards temporarily for selecting
function Hold(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


//  enable cards and disable matched cards
function Release(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}


//  count player's moves
function CountMove(){
    moves++;
    count.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }
    // setting rates based on moves
    if (moves > 8 && moves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "collapse";
            }
        }
    }
}


//  game timer

function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}

// Win when all cards match, show modal and moves, time and rating
function Win(){
    if (matchedCard.length == 16){
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // show Win modal
        modal.classList.add("show");

        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        //closeicon on modal
        closeModal();
    };
}


// @description close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        OnGameStart();
    });
}


// @desciption for user to play Again
function playAgain(){
    modal.classList.remove("show");
    OnGameStart();
}


// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", ShowCard);
    card.addEventListener("click", OpenCard);
    card.addEventListener("click",Win);
};
