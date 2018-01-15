var rpg = {

//character stats
	characters: {
		obi: {
			hp: 120,
			attack: 8,
			counter: 15
		},
		luke: {
			hp: 100,
			attack: 10,
			counter: 5
		},
		sid: {
			hp: 150,
			attack: 6,
			counter: 20
		},
		maul: {
			hp: 100,
			attack: 10,
			counter: 25
		}
	},

	//indicators used for button logic below; defaults to false
	gameOver: false,
	characterSelected: false,
	defenderSelected: false,
	currentAttacker: '',
	currentAttackVal: '', //change this value
	currentHP: '',
	baseAttackVal: '',
	currentDefender: '',
	currentCounter: '',
	vanquished: 0,

	// Game functions

	//displays hp for all characters on page
	healthUpdate: function() {
		$("#obi-health").text(rpg.characters.obi.hp);
		$("#luke-health").text(rpg.characters.luke.hp);
		$("#sid-health").text(rpg.characters.sid.hp);
		$("#maul-health").text(rpg.characters.maul.hp);
	},

	//prints out attach round info
	actionStatus: function() {
		$("#status-text").empty();
		$("#status-text").append('<div>You attacked for ' + rpg.currentAttackVal + ' damage</div>'); 
		$("#status-text").append('<div>You were attacked for ' + rpg.currentCounter + ' damage</div>');
	},

	//resets game
	inGameReset: function() {
		rpg.defenderSelected = false;
		rpg.currentDefender = "";
		rpg.currentCounter = "";
	},

	//saves temporary values from chracter objects above
	commitAttacker: function() {
		rpg.currentHP = rpg.characters[rpg.currentAttacker].hp;
		rpg.currentAttackVal = rpg.characters[rpg.currentAttacker].attack;
		rpg.baseAttackVal = rpg.characters[rpg.currentAttacker].attack;
	},

	//stores counter attack value from list of objects above
	commitDefender: function() {
		rpg.currentCounter = rpg.characters[rpg.currentDefender].counter;
		},

	//updates the defender's hp after attack - occurs before counterattack 
	damgeToDefender: function() {
		rpg.characters[rpg.currentDefender].hp = rpg.characters[rpg.currentDefender].hp - rpg.currentAttackVal
		if (rpg.characters[rpg.currentDefender].hp <= 0) {
			$('#' + rpg.currentDefender).removeAttr('style').hide();
			rpg.inGameReset();
			rpg.vanquished++;
			if (rpg.vanquished === 3){
				rpg.winGame();
			};
		};
	},

	//updates the attacker's hp after attack - occurs after attack 
	damageToAttacker: function() {
		rpg.characters[rpg.currentAttacker].hp = rpg.characters[rpg.currentAttacker].hp - rpg.currentCounter;
		if (rpg.characters[rpg.currentAttacker].hp < 1) {
			rpg.loseGame();
		};
	},

	//ends game - provides user option to play again
	loseGame: function() {
		rpg.gameOver = true;
		$("#status-text").empty();
		$("#status-text").append('<div>You lose! Click restart to play again</div>');
		$("#status-text").append($('<button id="retry">Retry</button>'));
		$("#retry").on("click",function(){
			location.reload(); //reloads page (hopefully)
		});
	},

	//wins the game!
	winGame: function() {
		rpg.gameOver = true;
		$("#status-text").empty();
		$("#status-text").append('<div>You WIN!! Click restart to play again</div>');
		$("#status-text").append($('<button id="retry">Retry</button>'));
		$("#retry").on("click",function(){
			location.reload(); //reloads page (hopefully)
		});
		$("body").css('background-image','url(assets/images/win.jpg)');
	},

	//increments current attack as user moves through the game
	updateAttack: function() {
		rpg.currentAttackVal += rpg.baseAttackVal;
	},

	exeAttack: function(){
		if (rpg.gameOver == false){
			if (rpg.characterSelected == true && rpg.defenderSelected == true){
				rpg.damgeToDefender();
				rpg.damageToAttacker();
				rpg.healthUpdate();
				if (rpg.gameOver == false){
					rpg.actionStatus();
					rpg.updateAttack();
				};
			}
			else if (rpg.characterSelected == true && rpg.defenderSelected == false){
				$("#status-text").empty();
				$("#status-text").append('<div>Select a character to fight</div>'); 
			}
			else {
				$("#status-text").empty();
				$("#status-text").append('<div>Select your character first</div>'); 
			};
		}
		else if(rpg.gameOver == true){
			console.log("You still lost....")
		};
	},

	clickAction: function(){
		 if (rpg.characterSelected == false && rpg.defenderSelected == false && rpg.gameOver == false){
		 	rpg.currentAttacker = $(this).attr("id");
		 	console.log("Current attacker: " + rpg.currentAttacker);
		 	$(".image-box").detach().prependTo('#fight-options');
		 	$(this).detach().prependTo('#selected-character');
		 	$('#fight-options').children('div').addClass('enemy-image-box');
		 	rpg.commitAttacker();
		 	rpg.characterSelected = true;
		 	$("#status-text").empty();
		}
		else if (rpg.characterSelected == true && rpg.defenderSelected == false && $(this).parent().attr('id') == "fight-options") {
			$(this).detach().prependTo('#defender');
			$('#defender').children('div').removeClass('enemy-image-box').addClass('defender-image-box');
			rpg.currentDefender = $('#defender').children("div").attr("id");
			rpg.commitDefender();
			console.log("Current defender is: " + rpg.currentDefender)
			rpg.defenderSelected = true;
			$("#status-text").empty();
			};
	}

}; //end of game "rpg" object

$(document).ready(function() {

	rpg.healthUpdate();

	// start onclick event
	$(".option").on("click", rpg.clickAction);

	// when attack button is clicked, run the attach function
	$("#attack-button").on("click", rpg.exeAttack);
});