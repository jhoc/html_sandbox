
class Particle {
    constructor() {
	this.pos = createVector( 0, 0 );
	this.posPrev = createVector( 0, 0 );
	this.vel = createVector( 0, 0 );
	this.acc = createVector( 0, 0 );

	this.maxSpeed = 4;
	this.hue
    }

    setPos( x, y ) {
	this.pos.set( x, y );
	this.updatePrev();
    }

    setMaxSpeed( s ) {
	this.maxSpeed = s;
    }

    update() {
	this.vel.add( this.acc );
	this.vel.limit( this.maxSpeed );
	this.pos.add( this.vel );
	this.acc.mult( 0 );
    }

    follow( flowField, size, columns ) {
	let x = Math.floor( this.pos.x / size );
	let y = Math.floor( this.pos.y / size );
	let index = x + y * columns;
	if( index > flowField.length - 1 ) {
	    index = flowField.length - 1;
	}
	let force = createVector( flowField[index][0], flowField[index][1] );
	this.applyForce( force );
    }

    applyForce( f ) {
	this.acc.add( f );
    }

    draw() {
	line( this.pos.x, this.pos.y, this.posPrev.x, this.posPrev.y );
	this.updatePrev();
    }

    updatePrev() {
	this.posPrev.x = this.pos.x;
	this.posPrev.y = this.pos.y;
    }

    edges( width, height ) {
	if( this.pos.x > width ) {
	    this.pos.x = 0;
	    this.updatePrev();
	}
	if( this.pos.x < 0 ) {
	    this.pos.x = width;
	    this.updatePrev();
	}
	if( this.pos.y > height ) {
	    this.pos.y = 0;
	    this.updatePrev();
	}
	if( this.pos.y < 0 ) {
	    this.pos.y = height;
	    this.updatePrev();
	}
    }
}

var m_counter = 0;
var lastTime = 0;

var columns, rows;
var flowField = [];
var particles = [];
var cellSize = 20;
var particleNum = 80;

function setup() {
    let w = 900;
    w = min( w, windowWidth );

    // document.getElementById('content').style.height = '500px';
    createCanvas( w, w / 2 );

    background( 190, 250, 255 );

    columns = Math.floor( width / cellSize );
    rows = Math.floor( height / cellSize );

    for( let i = 0; i < columns * rows; i++ ) {
	flowField.push( Array( 2 ) );
    }

    for( let i = 0; i < particleNum; i++ ) {
	particles.push( new Particle() );
	particles[i].setPos( random( 0, width ), random( 0, height ) );
    }
}

function draw() {
    // colorMode(HSB, 100);
    // let hue = (m_counter * 100) % 100;
    // stroke( hue, 100, 100, 30 );
    
    stroke( 0, 0, 0, 20 );
    updateFlowField();
    // drawFlowField();
    updateParticles();
    mouseX = 500;
    mouseY = 500;
}

function updateFlowField() {
    let px, py;
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
	let xoff = 0;
	for (let x = 0; x < columns; x++) {
	    let index = Math.floor( x + y * columns );

	    let angle = noise(xoff, yoff, m_counter) * TWO_PI * 2;
	    v = createVector( sin( angle ), cos( angle ) );

	    v.setMag( 0.7 );
	    flowField[ index ][0] = v.array()[0];
	    flowField[ index ][1] = v.array()[1];
	    // xoff += 0.008;
	    xoff += mouseX / 10000;
	}
	// yoff += 0.008;
	yoff += mouseY / 10000;
	m_counter += 0.00005;
    }
}

function drawFlowField() {
    background( 255 );
    for (let y = 0; y < rows; y++) {
	for (let x = 0; x < columns; x++) {
	    let index = Math.floor( x + y * columns );
	    px = x * cellSize;
	    py = y * cellSize;
	    line( px, py, px + flowField[ index ][0] * cellSize, py + flowField[ index ][1] * cellSize );
	}
    }
}

function updateParticles() {
    for( let i = 0; i < particleNum; i++ ) {
	particles[i].follow( flowField, cellSize, columns );
	particles[i].update();
	particles[i].edges( width, height );
	particles[i].draw();
    }
}

function mouseClicked() {
    background( 190, 250, 255 );
    for( let i = 0; i < particleNum; i++ ) {
	particles.push( new Particle() );
	particles[i].setPos( random( 0, width ), random( 0, height ) );
    }
}

function windowResized() {
    let w = 900;
    w = min( w, windowWidth );
    resizeCanvas( w, w / 2 );


    document.getElementById('content').style.height = '500px';
}
