
class Grid {
    constructor(rowNum, colNum, w, h) {
        this.rows = rowNum;
        this.columns = colNum;
        this.width = w;
        this.height = h;

        this.cellWidth = this.width / this.rows;
        this.cellHeight = this.height / this.columns;

	this.xFac = 0.2;
	this.yFac = 0.2;
    }

    rowNum(){
	return this.rows;
    }

    columnNum() {
	return this.columns;
    }

    cellWidth() {
        return this.cellWidth;
    }

    cellHeight() {
        return this.cellHeight;
    }

    setXFac( xFac ) {
	this.xFac = xFac;
    }
    setYFac( yFac ) {
	this.yFac = yFac;
    }
    draw() {
	colorMode(HSB, 100);
     	let noiseValue
	let x = 0;
	let y = 0;
	let rectW = this.cellWidth;
	let rectH = this.cellHeight;
	let count = (millis() / 1000.);
	let color;

	noStroke();
	for( let i = 0; i < this.columns + 1; i++ ) {
	    for( let j = 0; j < this.rows; j++ ) {
		noiseValue = noise( i * this.xFac, j * this.yFac, count );
		
		let hue = noiseValue * 100;
		fill( hue, 100, 100, 100 );
		circle( x +rectW/2, y + rectH/2, rectW * noiseValue);
		
		x = (j * this.cellWidth);
	    }
	    y =  (i * this.cellHeight);
	}
    }

}

//////////////////////////////////////////////////////////////////////////

var grid = new Grid(50, 25, 900, 450);

function setup() {    
    let w = 900;
    w = min( w, windowWidth );
    createCanvas( w, w / 2 );
    grid = new Grid(50, 25, w, w / 2);
    background(100);
}

function draw() {
    background(100, 0, 10);
    grid.draw();
}

function mouseMoved() {
    grid.setXFac( mouseX / width );
    grid.setYFac( mouseY / height );
}

function windowResized() {
    let w = 900;
    w = min( w, windowWidth - 8 );
    grid = new Grid(50, 25, w, w / 2);
    background(100);
    resizeCanvas( w, w / 2 );
}
