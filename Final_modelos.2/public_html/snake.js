/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Variables globales
var velocidad = 180;
var tamano = 20;
var dir=4;
var elem=0;
var puntaje=0;
var tempo=50;
var game;

var cab_der = new Image();
cab_der.src = "img/cabeza.png";
var cab_iz = new Image();
cab_iz.src="img/cab_iz.png";
var cab_arr = new Image();
cab_arr.src="img/cab_arr.png";
var cab_ab = new Image();
cab_ab.src="img/cab_ab.png";

var cuerpo = new Image();
cuerpo.src = "img/cu_arr.png";


class objeto{
	constructor(){
		this.tamano = tamano;
	}
	choque(obj){
		var difx = Math.abs(this.x - obj.x);
		var dify = Math.abs(this.y - obj.y);
		if(difx >= -3 && difx < tamano-8 && dify >= -3 && dify < tamano-8){
			return true;
		} else {
			return false;
		}
	}
}

class Cola extends objeto {
	constructor(x,y){
		super();
                elem=elem+1;
                this.ele=elem;
		this.x = x;
		this.y = y;
		this.siguiente = null;
	}
	dibujar(ctx){
		if(this.siguiente != null){
			this.siguiente.dibujar(ctx);
		}
                if(this.ele==1){
                    if(dir==1){
                        ctx.drawImage(cab_arr, this.x, this.y);
                    }
                    if(dir==2){
                        ctx.drawImage(cab_ab, this.x, this.y);
                	}
                    if(dir==3){
                        ctx.drawImage(cab_iz, this.x, this.y);
        		}
                    if(dir==4){
                        ctx.drawImage(cab_der, this.x, this.y);
                    }
                }else{
                    ctx.drawImage(cuerpo, this.x, this.y);
                }
                
	}
	setxy(x,y){
		if(this.siguiente != null){
			this.siguiente.setxy(this.x, this.y);
		}
		this.x = x;
		this.y = y;
	}
	meter(){
		if(this.siguiente == null){
			this.siguiente = new Cola(this.x, this.y);
		} else {
			this.siguiente.meter();
		}
	}
	verSiguiente(){
		return this.siguiente;
	}
}

class Comida extends objeto {
	constructor(){
		super();
		this.x = this.generar();
		this.y = this.generar();
	}
	generar(){
		var num = (Math.floor(Math.random() * 59))*10;
		return num;
	}
	colocar(){
		this.x = this.generar();
		this.y = this.generar();
	}
	dibujar(ctx){
		ctx.fillStyle = "#FF0000";
		ctx.fillRect((this.x+10), (this.y+10), (this.tamano-8), (this.tamano-8));
                ctx.font = "bold 22px sans-serif";
                ctx.fillText("Puntaje:"+puntaje,450,20);
                if(puntaje==tempo){
                    if((velocidad-10)>=60){velocidad=velocidad-30;}
                    tempo=tempo+50;
                    clearInterval(game);
                    game=setInterval("main()",velocidad);
                }
	}
}
//Objetos del juego
var cabeza = new Cola(20,20);
var comida = new Comida();
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;
function movimiento(){
	var nx = cabeza.x+xdir;
	var ny = cabeza.y+ydir;
	cabeza.setxy(nx,ny);
}
function control(event){
	var cod = event.keyCode;
	if(ejex){
		if(cod == 38 || cod==87){
			ydir = -tamano;
			xdir = 0;
                        dir=1;
			ejex = false;
			ejey = true;
		}
		if(cod == 40 || cod==83){
			ydir = tamano;
			xdir = 0;
                        dir=2;
			ejex = false;
			ejey = true;
		}
	}
	if(ejey){
		if(cod == 37 || cod==65){
			ydir = 0;
			xdir = -tamano;
                        dir=3;
			ejey = false;
			ejex = true;
		}
		if(cod == 39 || cod==68){
			ydir = 0;
			xdir = tamano;
                        dir=4;
			ejey = false;
			ejex = true;
		}
	}
}

function findeJuego(){
        elem=0;
        puntaje=0;
        tempo=50;
        velocidad=180;
	xdir = 0;
	ydir = 0;
	ejex = true;
	ejey = true;
	cabeza = new Cola(20,20);
	comida = new Comida();
        clearInterval(game);
        game=setInterval("main()",180);
	alert("Perdiste");
}
function choquepared(){
	if(cabeza.x < 0 || cabeza.x > 590 || cabeza.y < 0 || cabeza.y > 590){
		findeJuego();
	}
}
function choquecuerpo(){
	var temp = null;
	try{
		temp = cabeza.verSiguiente().verSiguiente();
	}catch(err){
		temp = null;
	}
	while(temp != null){
		if(cabeza.choque(temp)){
			//fin de juego
			findeJuego();
		} else {
			temp = temp.verSiguiente();
		}
	}
}

function dibujar(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0, canvas.width, canvas.height);
	//aquí abajo va todo el dibujo
	cabeza.dibujar(ctx);
	comida.dibujar(ctx);
}



function main(){
	choquecuerpo();
	choquepared();
	dibujar();
	movimiento();
	if(cabeza.choque(comida)){
                puntaje=puntaje+10;
		comida.colocar();
		cabeza.meter();
	}
}
game=setInterval("main()",180);

