
var tblWidth= 100;
var tblHeight= 60;
var table = [];
var map = [];
var map2 = [];
var randomFillPercent = 40;
var wallColor = "brown";
var airColor = "white";
var waterColor = "blue";

var smoothIterations = 10;
var smoothIntervalId;

var rainIteration = 100000;
var rainIntervalId;


var capMaxWater = 7;

//Inicializa los arreglos para que no sean null
function iniTableNMap(p1,p2){
	table = new Array(p1);
	map2 = new Array(p1);
	map = new Array(p1);
	for(var i = 0 ; i < p2 ; i++){
		table[i] = new Array(p1);
		map2[i] = new Array(p1);
		map[i] = new Array(p1);
	}
}

function tableCreate(p1,p2) {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.style.borderCollapse = "collapse";
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < p2; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < p1; j++) {
            var td = document.createElement('td');
            
            td.width= "4";
            td.height= "4";
            td.text = "0";
            td.style.backgroundColor = "white";
            table[i][j] = td;
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}

//Asigna valores de forma randomica entre 1 y 0 (espacio abierto o pared) con un porcentaje de 
//randomFillPercent
function fillMap(){

	for (var y = 0; y < tblHeight; y ++) {
        for (var x = 0; x < tblWidth; x ++) {
            var random = Math.floor(Math.random()*100);
            if(random < randomFillPercent || y >= tblHeight - 2 ){

            	map[y][x] = 0;
            }else{
            	map[y][x] = 1;
            }
        }
    }
    paintTable();
}

//Aplica automata celular para suavizar las cavernas
function smoothMap(){
	for (var x = 0; x < tblHeight ; x++) {
        for (var y = 0; y < tblWidth; y++) {
           	var neighboursCount = getWallNeighbours(y,x);

            //Reglas AC
            if(neighboursCount > 4) {
            	map[x][y] = 0;
            }else if(neighboursCount < 4){ 
            	map[x][y] = 1;
            }
        }
    }
    paintTable();
	smoothIterations--;
	console.log(smoothIterations);
    if(smoothIterations <= 0){
    	clearInterval(smoothIntervalId);
    	airSpace();
    	rainIntervalId = setInterval(rain, 100);
    }
}

//Cuenta los vecinos que son paredes
function getWallNeighbours(x,y){
	var neighbours= 0;

	for(var i = x - 1; i <= x + 1 ; i++){
		for(var j = y - 1; j <= y + 1 ; j++){
			if (i >= 0 && i < tblWidth && j >= 0 && j < tblHeight ){
				if(map[j][i] == 0) {
					neighbours++;
				}
			}

		}
	}

	return neighbours;
}

//Crea el mapa y luego lo suaviza con AC
function generateMap(){
	fillMap();
	smoothIntervalId = setInterval(smoothMap, 1000);
}

function airSpace(){
	for (var y = 0; y < Math.floor(tblHeight/3); y ++) {
        for (var x = 0; x < tblWidth; x ++) {
            //table[y][x].style.backgroundColor = airColor;
           	map[y][x] = 1;
        }
    }
    paintTable();
}

//Pinta la tabla segun los valores de las celdas en map[][]
function paintTable(){
	for (var y = 0; y < tblHeight; y ++) {
        for (var x = 0; x < tblWidth; x ++) {
     		if (map[y][x] == 1){table[y][x].style.backgroundColor = airColor;}
     		else if (map[y][x] >= 2){
     			if(map[y][x] == 2){table[y][x].style.backgroundColor = 'rgb(' + 221 + ',' + 234 + ',' + 255 + ')';}
     			else if(map[y][x] == 3){table[y][x].style.backgroundColor = 'rgb(' + 147 + ',' + 173 + ',' + 214 + ')';}
     			else if(map[y][x] == 4){table[y][x].style.backgroundColor = 'rgb(' + 95 + ',' + 125 + ',' + 173 + ')';}
     			else if(map[y][x] == 5){table[y][x].style.backgroundColor = 'rgb(' + 45 + ',' + 78 + ',' + 132 + ')';}
     			else if(map[y][x] == 6){table[y][x].style.backgroundColor = 'rgb(' + 24 + ',' + 56 + ',' + 107 + ')';}
     			else if(map[y][x] == 7){table[y][x].style.backgroundColor = 'rgb(' + 2 + ',' + 33+ ',' + 84 + ')';}
     			}
     		else if (map[y][x] == 0){table[y][x].style.backgroundColor = wallColor;}
        }
    }
}

//Funcion de prueba para pintar con colores randomicos la tabla
function paintTableRandom(){
	for (var y = 0; y < tblHeight; y ++) {
        for (var x = 0; x < tblWidth; x ++) {
        	var r = Math.floor(Math.random()*255);
        	var g = Math.floor(Math.random()*255);
        	var b = Math.floor(Math.random()*255);
        	table[y][x].style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
        }
    }
}

//asigna a una celda map[][] el vlaor de agua en el AC de agua
function water(y,x){
	map2[y][x] = 2;
}

//asigna a una celda map[][] el vlaor de aire en el AC de agua
function aire(y,x){
	map2[y][x] = 1;
}

// Crea en 
function createRainDrop(){
		var position = Math.floor(Math.random()*tblWidth);
		map[0][position] = 7;
}

// Copia map a map2
function map1ToMap2(){
	for (var y = 0; y < tblHeight; y ++) {
        for (var x = 0; x < tblWidth; x ++) {
      		map2[y][x] = map[y][x];
        }
    }
}

// Copia map2 a map
function map2ToMap1(){
	for (var y = 0; y < tblHeight; y ++) {
        for (var x = 0; x < tblWidth; x ++) {
      		map[y][x] = map2[y][x];
        }
    }
}

// Funcion que se encarga de crear iterativamente lluvia
function rain(){
		console.log(rainIteration);
		createRainDrop();
		// createRainDrop();
		// createRainDrop();
		map1ToMap2();
		automaten();
		map2ToMap1();
		paintTable();
		rainIteration--;
		if (rainIteration <= 0) {clearInterval(rainIntervalId);}
}

function entregarAguaAbajo(x1,y1,x2,y2){
	var aguaEntregable = map[y1][x1] - 1;
    var aguaRecibible = capMaxWater - map[y2][x2] - 1;

    if(aguaRecibible>aguaEntregable){
		map2[y2][x2] += aguaEntregable;
    	map2[y1][x1] -=  aguaEntregable;
    }else{
    	map2[y2][x2] += aguaRecibible;
    	map2[y1][x1] -=  aguaRecibible;	
    }
}

function entregarAguaLado(x1,y1,x2,y2){
	var aguaEntregable = Math.min(1,Math.ceil((map[y1][x1] - 1)/2));
    var aguaRecibible = capMaxWater - map[y2][x2] - 1;

    if(aguaRecibible>aguaEntregable){
		map2[y2][x2] += aguaEntregable;
    	map2[y1][x1] -=  aguaEntregable;
    }else{
    	map2[y2][x2] += aguaRecibible;
    	map2[y1][x1] -=  aguaRecibible;	
    }
}

// Funcion que aplica las reglas del AC para el flujo de agua, esta mas o menos malo
function automaten(){
	for (var y = 0; y < tblHeight; y ++) {
        for (var x = 0; x < tblWidth; x ++) {
       //  	//si la celda es de agua
       //  	if(map[y][x] >=2){
       //  		//la celda de abajo es de agua con espacio o de aire
    			// if(map[y+1][x] >=1 && map[y+1][x] < capMaxWater){
    			// 		entregarAguaAbajo(x,y,x,y+1);
    			// }
    			// if(y+1 < tblHeight - 1 && (map[y+1][x] <1 || map[y+1][x] >=capMaxWater)){
       //  			//llenar las del lado si son de agua con espacio o aire
       //  			if( map[y][x+1] >=1 && map[y][x+1] <capMaxWater && map[y][x] > map[y][x+1] ){
       //  				entregarAguaLado(x,y,x+1,y);
       //  			}
       //  			// if(	x-1 >= 0 && map[y][x-1] >=1 && map[y][x-1] <capMaxWater){
       //  			// 	entregarAguaLado(x,y,x+1,y);
       //  			// }
       //  		}
       //  	}

       		if(y+1 < tblHeight && map[y+1][x] < capMaxWater  && map[y+1][x]>=1 && map[y][x] >= 2) {
       			entregarAguaAbajo(x,y,x,y+1);
       		}else if(map[y][x] >= 2 && (map[y+1][x] == 0 || map[y+1][x] >= capMaxWater)){
       			if(map[y][x+1]>=1 && map[y][x+1] < capMaxWater){
       				entregarAguaLado(x,y,x+1,y);
       			}
       			if(map[y][x] >= 2 && map[y][x-1]>=1 && map[y][x-1] < capMaxWater){
       				entregarAguaLado(x,y,x-1,y);
       			}
       		}
        }
    }
}



iniTableNMap(tblWidth,tblHeight);
tableCreate(tblWidth,tblHeight);
generateMap();



