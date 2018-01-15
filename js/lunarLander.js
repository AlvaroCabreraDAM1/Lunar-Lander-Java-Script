//ENTORNO
var g = 1.622;
var dt = 0.016683;
var timer=null;
var timerFuel=null;

//NAVE
var y = 5; // altura inicial y 0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
var v = 0;
var c = 100;
var cs = 100.1;
var a = g; //la aceleración cambia cuando se enciende el motor de a=g a a=-g (simplificado)

//DIFICULTAD
var f = null; //Formulario de seleccion
var aux = 0;
var d = 0; //Dificultad del juego, 0 = Dificil, 1 = Normal, 2 = Facil

//MARCADORES
var velocidad = null;
var altura = null;
var combustible = null;

//Play/Pause/Replay
var p = 0;
var r = 0;

window.onload = function(){
	
	velocidad = document.getElementById("velocidad");
	altura = document.getElementById("altura");
	combustible = document.getElementById("fuel");
	
	//definición de eventos
	
	//mostrar menú móvil
	document.getElementById("showm").onclick = function () {
		document.getElementsByClassName("c")[0].style.display = "block";		
		stop();
	}
	
	//ocultar menú móvil
	document.getElementById("hidem").onclick = function () {
		document.getElementsByClassName("c")[0].style.display = "none";
		start();
	}
	
	//encender/apagar el motor al hacer click en la pantalla
	document.getElementById("moon_img").onclick = function () {
		if (p == 0) {
			if (a==g){
				motorOn();
			} else {
				motorOff();
			}
		}
	}
	
	//encender/apagar al apretar/soltar una tecla
	document.onkeydown = motorOn;
	document.onkeyup = motorOff;
	
	//Empezar a mover la nave justo después de cargar la página
	start();
	
	//Reiniciar
	document.getElementById("replay_img").onclick = function () {
		reiniciar();
	}
	
	document.getElementById("win_exit").onclick = function () {
		reiniciar();
	}
	
	document.getElementById("lose_exit").onclick = function () {
		reiniciar();
	}
	
	//Play/Pause
	document.getElementById("play-pause_img").onclick = function () {
		if (p == 0){
			p = 1;
			document.getElementById("play-pause_img").src="img/play_button.png";
			motorOff();
			stop();
		} else {
			p = 0;
			document.getElementById("play-pause_img").src="img/pause_button.png";
			start();
		}		
	}
	
	//Cambiar dificultad
	document.getElementById("dificultad").onclick = function () {
        if (d == 0) {
            d = 1;
			cs = 100.1;
			document.getElementById("dificultad_text").innerHTML = "Dificultad seleccionada: Normal";
			reiniciar();
        } else {
			if (d == 1) {
				d = 2;
				cs = 50.1;
				document.getElementById("dificultad_text").innerHTML = "Dificultad seleccionada: Difícil";
				reiniciar();
			} else {
				if (d == 2) {
				d = 0;
				cs = 100.1;
				document.getElementById("dificultad_text").innerHTML = "Dificultad seleccionada: Fácil";
				reiniciar();
				}
			}
		}			
    }
}

//Definición de funciones

function start(){
	
	//cada intervalo de tiempo mueve la nave
	timer=setInterval(function(){ moverNave(); }, dt*1000);
	
}

function stop(){
	clearInterval(timer);
}

function moverNave(){
	
	if (y >= 5) {
		//cambiar velocidad y posicion
		v +=a*dt;
		y +=v*dt;
	
		//actualizar marcadores
		velocidad.innerHTML=v.toFixed(2);
		altura.innerHTML=(70.3-y).toFixed(0);
	
		//mover hasta que top sea un 70% de la pantalla
		if (y < 70){ 
			document.getElementById("nave").style.top = y + "%"; 
		} else {
			if (v < 5 && d == 0) {
				document.getElementById("win").style.display = "block";
			} else {
				if (v < 1 && d == 1) {
					document.getElementById("win").style.display = "block";
				} else {
					if (v < 1 && d == 2) {
						document.getElementById("win").style.display = "block";
					} else {
						document.getElementById("lose").style.display = "block";
					}
				}
			}
			stop();
		}
		
		if (v > 5 && d == 0 && a == g) {
			document.getElementById("nave_img").src="img/starship_R.png";
		} else {
			if (v > 1 && d == 1 && a == g) {
				document.getElementById("nave_img").src="img/starship_R.png";
			} else {
				if (v > 1 && d == 2 && a == g) {
					document.getElementById("nave_img").src="img/starship_R.png";
				} else {
					if (v > 5 && d == 0 && a == -g) {
						document.getElementById("nave_img").src="img/starship_R_1.png";
					} else { 
						if (v > 1 && d == 1 && a == -g) {
							document.getElementById("nave_img").src="img/starship_R_1.png";
						} else {
							if (v > 1 && d == 2 && a == -g) {
								document.getElementById("nave_img").src="img/starship_R_1.png";
							} else {
								if (a == -g) {
									document.getElementById("nave_img").src="img/starship_G_1.png";
								} else {
									document.getElementById("nave_img").src="img/starship_G.png";
								}
							}
						}
					}
				}
			}
		}
		
	} else {
		y = 5;
		v = 0;
		motorOff();
	}
}

function motorOn(){
	
	//el motor da aceleración a la nave
	
	a=-g;
	
	//mientras el motor esté activado gasta combustible
	if (timerFuel==null)
	timerFuel=setInterval(function(){ actualizarFuel(); }, 10);
	
	//impedir que el motor se encienda si no hay combustible
	if (c == 0) {
		motorOff();
	}
	
	//impedir que el motor se encienda si la nave ya ha aterrizado
	if (y > 70) {
		motorOff();
	}
	
	if (y < 5) {
		motorOff();
	} 
}

function motorOff(){
	//aceleracion de la nave igual a la gravedad
	a=g;
	clearInterval(timerFuel);
	timerFuel=null;
}

function actualizarFuel(){
	
	//restar combustible hasta que se agota
	if (r = 1) {
		c-=0.1;
	
		//evitar que que el combustible sea inferior a 0
		if (c < 0 ) {
			c = 0;
			motorOff();
		}
		
	} else {
		r = 0
	}
	
	//mostrar combustible en el panel de control
	combustible.innerHTML=c.toFixed(2);	
}

function reiniciar(){
		stop();
		document.getElementById("play-pause_img").src="img/pause_button.png";
		document.getElementsByClassName("c")[0].style.display = "none";
		document.getElementById("win").style.display = "none";
		document.getElementById("lose").style.display = "none";
		y = 5;
		v = 0;
		p = 0;
		r = 1;
		c = cs;
		motorOff();
		actualizarFuel();
		start();
}
