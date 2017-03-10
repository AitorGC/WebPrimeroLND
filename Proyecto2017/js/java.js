

//---------------------------------------------------------------------------//

/*JUEGO DE LA SERPIENTE*/
$(document).ready(function(){
	//El rollo de Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	//Ponemos el tamaño de celda fijo
	var cw = 10;
	var d;
	var food;
	var score;

	//Aquí creo a Smaug
	var snake_array;

	function init()
	{
		d = "right"; //dirección de salida (derecha)
		create_snake();
		create_food(); //La comida será un cuadrado por ahí perdido
		score = 0; //el marcador a cero

		//La serpiente se moverá ahora con un temporizador que la moverá de sitio
		//cada 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}
	init();

	function create_snake()
	{
		var length = 5; //Longitud de la serpiente
		snake_array = [];
		for(var i = length-1; i>=0; i--)
		{
			//Creamos la serpiente empezando a la punta de arriba izquierda
			snake_array.push({x: i, y:0});
		}
	}

	//Creamos la comida
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
		//Creamos una celda x/y entre 0-44
		//Porque hay 45 posiciones (450/10)
	}

	//Pintamos la serpiente
	function paint()
	{
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		//Sacar el color de la última celda para ponerlo en la de delante
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		//Incrementamos la posición para meterle la celda delante
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;

		//Reiniciamos el juego cuando la serpiente toca el muro
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//reiniciar juego
			init();
			return;
		}

		//Si la nueva posición coincide con la comida,
		//se crea una nueva cabeza en vez de borrar la cola
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//crear comida
			create_food();
		}
		else
		{
			tail = snake_array.pop(); //quita la última celda
			tail.x = nx; tail.y = ny;
		}
		//Ahora puede comerse la comida

		snake_array.unshift(tail); //ponemos la cola de nuevo en la primera celda

		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			//pintamos una celda de 10px
			paint_cell(c.x, c.y);
		}

		//pintamos la comida
		paint_cell(food.x, food.y);
		//pintamos el marcador
		var score_text = "Resultado: " + score;
		ctx.fillText(score_text, 5, h-5);
	}

	//creamos una función para pintar celdas
	function paint_cell(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function check_collision(x, y, array)
	{
		//Esta función controla si las coordenadas x/y existen
		//en el array de las celdas o no
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}

	//controles del teclado
	$(document).keydown(function(e){
		var key = e.which;

		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})
})
