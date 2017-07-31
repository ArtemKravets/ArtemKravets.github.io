// объект представления
var view = {
	// метод получает сообщение
	displayMessage: function(msg){
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");

	},
	displayHit: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	}
};

// объект модели
var model = {
	// размер сетки игрового поля
	boardSize: 7,
	// колличество кораблей в игре
	numShips: 3,
	// длина корабля в клетках
	shipLength: 3,
	// текущее значение короблей потопленных игроком
	shipsSunk: 0,
	// массив объектов кораблей, содержащие местоположение и попадания
	ships: [ { locations: [0, 0 , 0], hits:["", "", ""] },
					{ locations: [0, 0 , 0], hits:["", "", ""] },
					{ locations: [0, 0 , 0], hits:["", "", ""] } ],
	// метод проверки попадание выстарела
	fire: function(guess){
		for(var i = 0; i < this.numShips; i++){
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if(index >= 0){
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT");
				if(this.isSunk(ship)){
					view.displayMessage("Корабль был потоплен");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Вы промахнулись");
		return false;
	},
	//метод проверки потопления корабля
	isSunk: function(ship){
		for(var i = 0; i < this.shipLength; i++){
			if(ship.hits[i] !== "hits"){
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function(){
		var locations;
		for (var i = 0; i < this.numShips; i++){
			do{
				locations = this.generateShip(); // геним новые позиции
			}while(this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function(){
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		var newShipLocation = [];

		if(direction === 1){
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		}else{
			col = Math.floor(Math.random() * this.boardSize);
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		}
		
		for(var i = 0; i < this.shipLength; i++){
			if(direction === 1){
				newShipLocation.push(row + "" + (col + i));
			}else{
				newShipLocation.push((row + i) + "" + col);
			}
		}
		return newShipLocation;
	},

	collision: function(locations){
		for(var i = 0; i < this.numShips; i++){
			var ship = this.ships[i];
			for(var j = 0; j < locations.length; j++){
				if(ship.locations.indexOf(locations[j]) >= 0){
					return true;
				}
			}
		}
		return false;
	}

};

//объект контроллера
var controller = {
	guesses: 0,
	processGuess: function(guess){
		var location = parseGuess(guess);
		if(location){
			this.guesses++;
			var hit = model.fire(location);
			if(hit && model.shipsSunk === model.numShips){
				view.displayMessage("Вы потопили все корабли! Колличество выстрелов " + this.guesses);
			}
		}
	}
};

function parseGuess(guess){
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if(guess === null || guess.length !== 2){
		alert("Введите правильное значение");
	}else{
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if(isNaN(row) || isNaN(column)){
			alert("Введите правильное значение");
		}else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
			alert("Введите правильное значение");
		}else{
			return row + column;
		}
	}
	return null;
}

function init(){
	var fireButton = document.getElementById("fireButton"); 
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}

function handleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}

function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13){
		fireButton.click();
		return false;
	}
}

window.onload = init;











