var view = {
  displayMessage : function(msg) {
    var messageArea = document.getElementById("message-area");
    messageArea.innerHTML = msg;


  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.classList.add("hit");
  },
  displayMiss : function(location) {
    var cell = document.getElementById(location);
      cell.classList.add("miss");
  },
  displayScore : function(score){
    var scoreArea = document.getElementById("score-area");
    scoreArea.innerHTML = controller.score;
  }
};


var model = {
  boardSize : 4,
  numShips : 3,
  shipLength : 1,
  shipsSunk : 0,
  score: 0,

  ships : [
    { locations: [0, 0, 0], hits : ["", "", ""] },
    { locations: [0, 0, 0], hits : ["", "", ""] },
    { locations: [0, 0, 0], hits : ["", "", ""] },
    ],

  fire : function(guess) {
        for (var i = 0; i < this.numShips; i++) {
          var ship = this.ships[i];
          var index = ship.locations.indexOf(guess);
          if (ship.hits[index] === "hit") {
            view.displayMessage("Oops! You already hit that location!");
            return true;
          } else if (index >= 0) {
            ship.hits[index] = "hit";
            view.displayHit(guess);
            view.displayMessage("HIT!");
            return true;
          }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed!");
        return false;
  },

  generateShipsLocations : function () {
    var locations;
    for (var i = 0; i < this.numShips; i++){
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
        this.ships[i].locations = locations;
    }
    console.log("ships array:");
    console.log(this.ships);
  },

  generateShip : function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    //if horizontal
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * this.boardSize - this.shipLength + 1);

    } else { // if vertical
      row = Math.floor(Math.random() * this.boardSize - this.shipLength + 1);
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        if (row < 0) {
          row = row * 1;
        } else if (col < 0) {
          col = col * 1;
        }
        newShipLocations.push(row + "" + (col + i));
      } else {
        if (row < 0) {
          row = row * 1;
        } else if (col < 0) {
          col = col * 1;
        }
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },

  collision : function(locations) {
    for (var i = 0; i < this.numShips; i++){
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0){
          return true;
        }
      }
    }
    return false;
  }
};


var controller = {
  guesses : 0,
  score: 0,
  processGuess : function(guess) {
    var location = parseGuess(guess);
    if(location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " + this.guesses + "guesses!" );
      }
    }
  }
};


function parseGuess(guess){
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2) {
    alert("Oops! Please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if(isNaN(row) || isNaN(column)){
      alert("Oops! that wasn't on the board.");
    } else if(row < 0 || row >= model.boardSize ||
      column < 0 || column >= model.boardSize) {
      alert("Oops! That's off the board!");
    } else {
      return row + column;
    }
  }

  return null;

}
function init() {
  model.generateShipsLocations();

  function generateScore1(){
     if(view.displayMessage === "HIT!"){
       controller.score += 1000;
     }
     console.log(view.displayScore(controller.score));
   }

    //when there are any number of class "hit", then add 1000 to score
    function generateScore(){
      var score = 0;
      if($("body").hasClass("hit"))
        $("hit").each(function(){
          score *= 1000;
        });
        console.log(score);
    }

    function gameOver(){
      var classHitNumber = $(".hit").length;
      if (classHitNumber >= 3){
        console.log("game over!");
        view.displayMessage("Game over bitches!");
      }
    }

    function animateText(){
      //  $("#message-area").animate({width: "70%", fontSize: "5rem"},
      //                        {specialEasing: "swing", height: "easeOutBounce"}, 500);
      $("#message-area").removeClass("animateText").addClass("animateText");
      }

    $(".number").on('click', function(eventObj){
        model.fire(eventObj.target.id);
        gameOver();
        // view.displayHit(eventObj.target.id);
        // view.displayMiss(eventObj.target.id);
        generateScore1();
        animateText();

      }

);
}

window.onload = init;


// retrieve the element
element = document.getElementById("logo");

// reset the transition by...
element.addEventListener("click", function(e) {
  e.preventDefault;

  // -> removing the class
  element.classList.remove("run-animation");

  // -> triggering reflow /* The actual magic */
  // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
  element.offsetWidth = element.offsetWidth;

  // -> and re-adding the class
  element.classList.add("run-animation");
}, false);

function animation() {
    animate();

    var top = parseInt($('#mark').css('top'));
    var left = parseInt($('#mark').css('left'));
    var tween = new TWEEN.Tween({x: 0, y: 0})
            .to({x: 200, y: 200}, 500)
            .easing(TWEEN.Easing.Elastic.InOut)
            .onUpdate(function () {
                var mark = document.getElementById('mark');
                mark.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';

                var clone = $('#mark').clone().css({
                    transform: '',
                    position: 'absolute',
                    top: (top + this.y) + 'px',
                    left: (left + this.x) + 'px'
                }).attr('id', 'mark-' + this.y + '-' + this.x);
                $('#wrap').append(clone);
            })
            .start();

    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update();
    }
});