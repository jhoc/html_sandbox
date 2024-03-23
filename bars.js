let m_counter = 0;


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


class StripeOscMeetSineOff {
    constructor( _num, _gap ) {
	this.rectNum = _num;
	this.yGap = _gap;
	this.x = 0;
	this.y = 0;
	this.width = 100;
	this.height = 100;
	this.speed = 3;
	this.seed = 0;
    }
    setPos( _x, _y ) {
	this.x = _x;
	this.y = _y;
    }
    setRect( _w, _h ) {
	this.width = _w;
	this.height = _h;
    }
    setSpeed( _s ) {
	this.speed = _s;
    }
    setSeed( _s ) {
	this.seed = _s;
    }
    draw( _counter ) { 
	let rectH = ( this.height - ( this.yGap * (this.rectNum + 1) )) / this.rectNum;
	let ySin = sin( _counter / 100. ) * rectH;
	let y = this.yGap;
	let s = _counter * this.speed;
	translate( this.x, this.y );
	for( let i = 0; i < this.rectNum; i++ ) {
	    let o = sin( this.seed + (y + s) / 300. ) * this.width;
	    o = abs( o );
	    rect( 0, y, o, rectH );
	    rect( this.width - o, y, o, rectH );
	    y += ( rectH + this.yGap );
	}
	translate( -this.x, -this.y );
    }
}


const rb1 = new Rainbow( 40, 100, 800 );
const rb2 = new Rainbow( 10, 100, 800 );
const stripeSine2= new StripeOscMeetSineOff( 10, 4 );

function setup() {
    // put setup code here
    createCanvas( windowWidth, windowHeight);

    stripeSine2.setPos( 350, 100 );
    stripeSine2.setRect( 200, 500 );
    stripeSine2.setSeed( 2 );
    stripeSine2.setSpeed( 10 );
}


function stripeOscMeet( _counter ) {
    let rectNum = 34;
    let yGap = 8;
    let rectH = (windowHeight - ( yGap * (rectNum + 1) )) / rectNum;
    background( 240, 220, 240 );
    fill( 50, 80, 255, 100 );
    noStroke();

    let ySin = sin( _counter / 100. ) * rectH;
    let y = yGap;
    let s = _counter * 2;
    s = s % ( windowWidth * 6);

    if( s < windowWidth ) {
	for( let i = 0; i < rectNum; i++ ) {
	    rect( 0, y, s, rectH );
	    rect( windowWidth - s, y, s, rectH );
	    y += ( rectH + yGap );
	}
    } else {
	let sa = s - windowWidth;
	for( let i = 0; i < rectNum; i++ ) {
	    rect( sa, y, windowWidth - sa, rectH );
	    rect( 0, y, windowWidth - sa, rectH );   
	    y += ( rectH + yGap );
	}
    }
}

function stripeOscMeetAlternate( _counter ) {
    let rectNum = 34;
    let yGap = 8;
    let rectH = (windowHeight - ( yGap * (rectNum + 1) )) / rectNum;
    background( 240, 220, 240 );
    fill( 50, 80, 255, 100 );
    noStroke();

    let ySin = sin( _counter / 100. ) * rectH;
    let y = yGap;
    let s = _counter * 6;
    s = s % ( windowWidth * 2);
    
    if( s < windowWidth ) {
	for( let i = 0; i < rectNum; i++ ) {
	    if( i % 2 == 0 ) {
		rect( 0, y, s, rectH );
	    } else {
		rect( windowWidth - s, y, s, rectH );
	    }
	    y += ( rectH + yGap );
	}
    } else {
	let sa = s - windowWidth;
	for( let i = 0; i < rectNum; i++ ) {
	    if( i % 2 == 0 ) {
		rect( sa, y, windowWidth - sa, rectH );
	    } else {
		rect( 0, y, windowWidth - sa, rectH );
	    }   
	    y += ( rectH + yGap );
	}
    }

}

// var stripeOscMeetSineOff = {
//     x: 0,
//     y: 0,
//     width: 100,
//     height: 100,
//     rectNum: 14,
//     yGap: 8,

//     draw: function( _counter ) { 
// 	let rectH = ( this.height - ( this.yGap * (this.rectNum + 1) )) / this.rectNum;
// 	background( 240, 220, 240 );
// 	fill( 50, 80, 255, 100 );
// 	noStroke();

// 	let ySin = sin( _counter / 100. ) * rectH;
// 	let y = this.yGap;
// 	let s = _counter * 3;
// //	s = s % ( this.width * 2);

// 	/////// sine offset
// 	translate( this.x, this.y );
// 	for( let i = 0; i < this.rectNum; i++ ) {
// 	    let o = sin( (y + s) / 300. ) * this.width;
// 	    o = abs( o );
// 	    rect( 0, y, o, rectH );
// 	    rect( this.width - o, y, o, rectH );
// 	    y += ( rectH + this.yGap );
// 	}
// 	translate( -this.x, -this.y );
// 	///////
//     }
// }


function draw() {
    // stripeOscMeet( m_counter );
    // stripeOscMeetAlternate( m_counter );

    background( 20, 20, 80);

    fill( 50, 220, 255, 100 );
    noStroke();

                        
    const stripeSine1 = new StripeOscMeetSineOff( 10, 4 );
    stripeSine1.setPos( 0, 0 );
    stripeSine1.setRect( 445, 400 );
    stripeSine1.draw( m_counter );

    fill( 50, 80, 255, 100 );
    stripeSine2.setPos( 455, 0 );
    stripeSine2.setRect( 445, 400 );
    stripeSine2.draw( m_counter );
    
     //rb1.setPos( 20, 100 );
     //rb1.draw();

     //rb2.setPos( 180, 100 );
     //rb2.draw();
    
    // stripeOscMeetSineOff.x = 100;
    // stripeOscMeetSineOff.y = 100;
    // stripeOscMeetSineOff.width = 300;
    // stripeOscMeetSineOff.height = 300;
    // stripeOscMeetSineOff.rectNum = 5;
    // stripeOscMeetSineOff.draw( m_counter );

    m_counter++;
}
