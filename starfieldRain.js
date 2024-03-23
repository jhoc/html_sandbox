let m_counter = 0;

var stars = [];

class Star {
    constructor( x, y ) {
	this.x = x;
	this.y = y;

	this.died = false;
	this.lifeTime = 1200;
	this.dLife = 9;
	this.bumpSpeed = 0.6;
	this.dFade = 1.4;
    }

    isDead() {
	return this.died;
    }
    
    draw() {

	push();
	if( this.lifeTime > 0 ) {
	    fill( 200 );
	    translate( 0, 0, this.lifeTime );
	    circle( this.x, this.y, 6 );
	    this.lifeTime -= this.dLife;
	} else {
	    noFill();
	    translate( 0, 0, this.lifeTime + 0 );
	    var colVal = 255 + this.lifeTime;
	    let c = color( colVal, colVal, colVal );
	    stroke( c );
	    circle( this.x, this.y, this.lifeTime * this.bumpSpeed );
	    if( colVal < 0 ) {
		this.death = true;
	    }
	    this.lifeTime -= this.dFade;

	}
	pop();
    }
}

function setup() {
    // put setup code here
    frameRate( 60 );
    createCanvas( 900, 450, WEBGL);
    background( 10 );
}


function draw() {
    background( 10 );

    push();
    // translate( width / 2, height / 2 );
    rotateZ( m_counter / 100 );
    if( random( 0, 100) > 40 ) {
	stars.push( new Star( random( -width / 1, width / 1 ), random( -height / 1, height / 1 ) ) );
    }

    for( let i = 0; i < stars.length; i++ ) {
	stars[ i ].draw();
	if( stars[i].isDead() ) {
	    stars.splice( i, 1 );
	    console.log( "kill" );
	}
    }
    pop()
    m_counter++;
}
