let m_counter = 0;
var circ = [];
var num = 200;


function setup() {
    // put setup code here
    createCanvas( 900, 450);

    for (let i = 0; i < num; i++){
        let angle = map(i, 0, num, 0, TWO_PI);
	let x = width / 2;
	let y = height / 2;
	let radius = 200;
	x += radius * cos( angle );
	y += radius * sin( angle );
	circ.push( [ x, y ] );
        vertex( x, y );
    }
}


function draw() {
    background( 150 );
    
    stroke( 100 );
    noFill();
    angleMode(RADIANS);
    let x1, y1, x2, y2;
    var iter;
    for (let i = 0; i < num; i++){
	x1 = circ[i][0];
	y1 = circ[i][1];
	iter = Math.floor( (i * m_counter) % num );

	x2 = circ[ iter ][0];
	y2 = circ[ iter ][1];

	line( x1, y1, x2, y2 );
	circle( x1, y1, 3 );

    }

    m_counter += 0.01;


}