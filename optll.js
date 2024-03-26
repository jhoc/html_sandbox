
var x = 1;
var y = 1;
var easing = 0.05;
var width = 900;
var height = 400;
var frameCount = 0;

var x, y, w, h;
var s = 20;
var f = 0;
var dW =  width / (s - 1);
function setup() {
    let w = 900;
    w = min( w, windowWidth );
    createCanvas( w, w / 2 );
}

function draw() {
    f = frameCount % (dW * 2);
    frameCount++;

    translate(width / 2, height / 2);
    rotate( frameCount / 1200);
    translate(-width / 2, -height / 2);

    x = width/2;
    y = height/2;
    
    for ( var i = s; i >= 0; i--) {
	var fac = i / s;
	if( (i % 2) == 0 ) {
	    fill( color( 250 * fac , 50, 200 ) );
	} else {
	    fill( color( 120 * fac, 100, 250 ) );
	}
	f = f % width;

	rect( x - ( ( f + (i * dW) ) / 2 ),
              y - ( ( f + (i * dW) ) / 2 ),
              f + ( i * dW),
              f + ( i * dW)
            );
    }
}  

function windowResized() {
    let w = 900;
    w = min( w, windowWidth - 8 );
    dW =  w / (s - 1);
    
    resizeCanvas( w, w / 2 );
}
