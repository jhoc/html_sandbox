
class Rainbow {
    constructor( colorNum, w, h ) {
	this.num = colorNum;
	this.width = w;
	this.height = h;
    }
    setPos( _x, _y ) {
	this.x = _x;
	this.y = _y;
    }
    draw() {
	noStroke();
	colorMode(HSB, 100);
	let dy = this.height / this.num;
	let y = this.y;
	for( let i = 0; i < this.num; i++ ) {
	    let hue = 100. * ( i / this.num );
	    fill( hue, 100, 255 );
	    rect( this.x, y, this.width, dy );
	    y += dy;
	}
    }
}




const rb1 = new Rainbow( 50, 100, 4000 );

function setup() {
    createCanvas( windowWidth, windowHeight);
}


function draw() {

    noStroke();

    rb1.setPos( width / 2 - 50, 0 );
    rb1.draw();

}

function windowResized() {
    let w = 900;
    w = min( w, windowWidth );
    resizeCanvas( w, 4000 );
}

