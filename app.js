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

$(function () {
    animate();

    var top = parseInt($('#mark').css('top'));
    var left = parseInt($('#mark').css('left'));
    var tween = new TWEEN.Tween({x: '0%', y: '100%'})
            .to({x: '100%', y: '0%'}, 1000)
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
    
    setInterval(function () {
		TWEEN.update();
	}, 1);
});

var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-86951-7']);
		  _gaq.push(['_trackPageview']);

		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
		  })();

			var info = document.createElement( 'div' );
			info.style.position = 'absolute';
			info.style.top = '10px';
			info.style.width = '100%';
			info.style.fontFamily = 'Monospace';
			info.style.textAlign = 'center';
			info.innerHTML = 'click and win!';
			document.body.appendChild( info );

			var canvas = document.createElement( 'canvas' );
			canvas.style.position = 'absolute';
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			document.body.appendChild( canvas );

			var context = canvas.getContext( '2d' );

			var id = 52;

			var cwidth = 71, cwidthhalf = cwidth / 2;
			var cheight = 96, cheighthalf = cheight / 2;

			var particles = [];

			var Particle = function ( id, x, y, sx, sy ) {

				if ( sx === 0 ) sx = 2;

				var cx = ( id % 4 ) * cwidth;
				var cy = Math.floor( id / 4 ) * cheight;

				this.update = function () {

					x += sx;
					y += sy;

					if ( x < ( - cwidthhalf ) || x > ( canvas.width + cwidthhalf ) ) {

						var index = particles.indexOf( this );
						particles.splice( index, 1 );

						return false;

					}

					if ( y > canvas.height - cheighthalf ) {

						y = canvas.height - cheighthalf;
						sy = - sy * 0.85;

					}

					sy += 0.98;

					context.drawImage( image, cx, cy);

					return true;

				}

			}

			var image = document.createElement( 'img' );
			image.src = "ninja.png";

			var throwCard = function ( x, y ) {

				id > 0 ? id -- : id = 51;

				var particle = new Particle( id, x, y, Math.floor( Math.random() * 6 - 3 ) * 2, - Math.random() * 16 );
				particles.push( particle );

			}

			document.addEventListener( 'mousedown', function ( event ) {

				event.preventDefault();

				document.addEventListener( 'mousemove', onMouseMove, false );

			}, false );

			document.addEventListener( 'mouseup', function ( event ) {

				event.preventDefault();

				throwCard( event.clientX, event.clientY );

				document.removeEventListener( 'mousemove', onMouseMove, false );

			}, false );

			function onMouseMove( event ) {

				event.preventDefault();

				throwCard( event.clientX, event.clientY );

			}

			document.addEventListener( 'touchstart', function ( event ) {

				event.preventDefault();

				for ( var i = 0; i < event.changedTouches.length; i ++ ) {

					throwCard( event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY );

				}

			}, false );

			document.addEventListener( 'touchmove', function ( event ) {

				event.preventDefault();

				for ( var i = 0; i < event.touches.length; i ++ ) {

					throwCard( event.touches[ i ].pageX, event.touches[ i ].pageY );

				}

			}, false );

			setInterval( function () {

				var i = 0, l = particles.length;

				while ( i < l ) {

					particles[ i ].update() ? i ++ : l --;

				}

			}, 1000 / 60 );