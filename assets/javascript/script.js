//character stats
var obi = {
	hp: 120,
	attack: 8,
	counter: 15
};
var luke = {
	hp: 100,
	attack: 10,
	counter: 5
};
var sid = {
	hp: 150,
	attack: 6,
	counter: 20
};
var maul = {
	hp: 100,
	attack: 10,
	counter: 25
};

//indicators used for button logic below; defaults to false
var gameOver = false;
var characterSelected = false;
var defenderSelected = false;
var currentAttacker;
var currentAttackVal; //change this value
var currentHP;
var baseAttackVal;
var currentDefender;
var currentCounter;

$(document).ready(function() {

	//displays hp for all characters on page
	var healthUpdate = function() {
		$("#obi-health").text(obi.hp);
		$("#luke-health").text(luke.hp);
		$("#sid-health").text(sid.hp);
		$("#maul-health").text(maul.hp);
	};
	
	//prints out attach round info
	var actionStatus = function() {
		$("#status-text").empty();
		$("#status-text").append('<div>You attacked for ' + currentAttackVal + ' damage</div>'); 
		$("#status-text").append('<div>You were attacked for ' + currentCounter + ' damage</div>');
	};

	var inGameReset = function() {
		defenderSelected = false;
		currentDefender = "";
		currentCounter = "";
	}
	
	//saves temporary values from chracter objects above
	var commitAttacker = function() {
	 	if (currentAttacker == "obi") { 
			currentHP = obi.hp;
			currentAttackVal = obi.attack;
			baseAttackVal = obi.attack;
		}
		else if (currentAttacker == "luke") {
			currentHP = luke.hp;
			currentAttackVal = luke.attack;
			baseAttackVal = luke.attack;
		}
		else if (currentAttacker == "sid") {
			currentHP = sid.hp;
			currentAttackVal = sid.attack;
			baseAttackVal = sid.attack;
		}
		else {
			currentHP = maul.hp;
			currentAttackVal = maul.attack;
			baseAttackVal = maul.attack;
		};
	};
	
	//stores counter attack value from list of objects above
	var commitDefender = function() {
		if (currentDefender == "obi") { //switch or each could work here I think
				currentCounter = obi.counter;
			}
			else if (currentDefender == "luke") {
				currentCounter = luke.counter;
			}
			else if (currentDefender == "sid") {
				currentCounter = sid.counter;
			}
			else {
				currentCounter = maul.counter;
			};
		};

	//updates the defender's hp after attack - occurs before counterattack 
	var damgeToDefender = function() {
		if (currentDefender == "obi") { 
			obi.hp = obi.hp - currentAttackVal;
			if (obi.hp <= 0) {
				$("#obi").removeAttr("style").hide();
				inGameReset();
			};
		}
		else if (currentDefender == "luke") {
			luke.hp = luke.hp - currentAttackVal;
			if (luke.hp <= 0) {
				$("#luke").removeAttr("style").hide();
				inGameReset();
			};
		}
		else if (currentDefender == "sid") {
			sid.hp = sid.hp - currentAttackVal;
			if (sid.hp <= 0) {
				$("#sid").removeAttr("style").hide();
				inGameReset();
			};
		}
		else {
			maul.hp = maul.hp - currentAttackVal;
			if (maul.hp <= 0) {
				$("#maul").removeAttr("style").hide();
				inGameReset();
			};
		};
	};

	//updates the attacker's hp after attack - occurs after attack 
	var damageToAttacker = function() {
		if (currentAttacker == "obi") { 
			obi.hp = obi.hp - currentCounter;
			if (obi.hp < 1){
				endGame()
			}
			else if (luke.hp < 1 && sid.hp < 1 && maul.hp <1){
				winGame();
			};
		}
		else if (currentAttacker == "luke") {
			luke.hp = luke.hp - currentCounter;
			if (luke.hp < 1){
				endGame()
			}
			else if (obi.hp < 1 && sid.hp < 1 && maul.hp <1){
				winGame();
			};
		}
		else if (currentAttacker == "sid") {
			sid.hp = sid.hp - currentCounter;
			if (sid.hp < 1){
				endGame()
			}
			else if (luke.hp < 1 && obi.hp < 1 && maul.hp <1){
				winGame();
			};
		}
		else {
			maul.hp = maul.hp - currentCounter;
			if (maul.hp < 1){
				endGame()
			}
			else if (luke.hp < 1 && sid.hp < 1 && obi.hp <1){
				winGame();
			};
		};
	};

	var endGame = function() {
		gameOver = true;
		$("#status-text").empty();
		$("#status-text").append('<div>You lose! Click restart to play again</div>');
		$("#status-text").append($('<button id="retry">Retry</button>'));
		$("#retry").on("click",function(){
			location.reload(); //reloads page (hopefully)
		});
	};

	var winGame = function() {
		gameOver = true;
		$("#status-text").empty();
		$("#status-text").append('<div>You WIN!! Click restart to play again</div>');
		$("#status-text").append($('<button id="retry">Retry</button>'));
		$("#retry").on("click",function(){
			location.reload(); //reloads page (hopefully)
		});
		$("body").css('background-image','url(assets/images/win.jpg)');
	};
	
	//increments current attack as user moves through the game
	var updateAttack = function() {
		currentAttackVal += baseAttackVal;
	};


	healthUpdate();

	// start onclick event
	$(".option").on("click", function(){
		 if (characterSelected == false && defenderSelected == false && gameOver == false){
		 	currentAttacker = $(this).attr("id");
		 	console.log("Current attacker: " + currentAttacker);
		 	$(".image-box").detach().prependTo('#fight-options');
		 	$(this).detach().prependTo('#selected-character');
		 	$('#fight-options').children('div').addClass('enemy-image-box');
		 	commitAttacker();
		 	characterSelected = true;
		 	$("#status-text").empty();
		}
		else if (characterSelected == true && defenderSelected == false && $(this).parent().attr('id') == "fight-options") {
			$(this).detach().prependTo('#defender');
			$('#defender').children('div').removeClass('enemy-image-box').addClass('defender-image-box');
			currentDefender = $('#defender').children("div").attr("id");
			commitDefender();
			console.log("Current defender is: " + currentDefender)
			defenderSelected = true;
			$("#status-text").empty();
			}
			else {
				console.log("don't do anything");
			}
	});

	$("#attack-button").on("click", function(){
		if (gameOver == false){
			if (characterSelected == true && defenderSelected == true){
				damgeToDefender();
				damageToAttacker();
				healthUpdate();
				if (gameOver == false){
					actionStatus();
					updateAttack();
				};
			}
			else if (characterSelected == true && defenderSelected == false){
				$("#status-text").empty();
				$("#status-text").append('<div>Select a character to fight</div>'); 
			}
			else {
				$("#status-text").empty();
				$("#status-text").append('<div>Select your character first</div>'); 
			};
		}
		else if(gameOver == true){
			console.log("You still lost....")
		};
	});
});