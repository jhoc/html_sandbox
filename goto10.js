var m_doDRaw = false;

var x = 0;
var y = 0;
var spacing = 512;
var framerate = 2;
var draws = 1;
var c2;

function setup() {
    let w = 900;
    w = min( w, windowWidth );
    createCanvas( w, w / 2 );

    init();
}

function init() {
    x = 0;
    y = 0;
    spacing = 512;

    framerate = 10;
    draws = 1;
    frameRate( framerate );
    spacing = width / 4;
    
    c2 = color( 255, random( 0, 255 ), random( 0, 255 ), 255 );
}

function draw() {
    let c1 = color( 80, 170, 240, 20 );
    fill( c1 );
    rect( 0, 0, width, height );
    
    for( var i = 0; i < draws; i++ ) {
	drawG();
    }
}

function drawG() {
    if( y >= height ) {
	y = 0;
	spacing /= 2;
	framerate *= 2;
	frameRate( framerate );
	draws++;
	if( spacing < 20 ) {
	    init();
	}
    }
    stroke( c2 );
    if( random( 0, 10 ) < 5 ) {
	line( x, y, x + spacing, y + spacing);
    } else {
	line( x + spacing, y, x, y + spacing);
    }
    x += spacing;
    if( x > width ){
	x = 0;
	y += spacing;
    }

}

function windowResized() {
    let w = 900;
    w = min( w, windowWidth - 8 );
    resizeCanvas( w, w / 2 );
}
