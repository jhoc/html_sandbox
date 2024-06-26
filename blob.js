let m_counter = 0;

function setup() {
    let w = 900;
    w = min( w, windowWidth );
    createCanvas( w, w / 2 );
}


function draw() {
    background( 150 );
    beginShape();
    stroke( 100 );
    noFill();
    angleMode(RADIANS);
    noiseDetail(3, 0.5);
    let ff = millis();
    for (let i = 0; i < 100; i++){
        let angle = map(i, 0, 100, 0, TWO_PI);
	let x = width / 2;
	let y = height / 2;
	let n = noise( ff*0.001, cos(angle) * 0.3, sin(angle) * 0.3 ) * 2 - 1;
	let radius = (height / 4) + n * 100;
	x += radius * cos( angle );
	y += radius * sin( angle );

        vertex( x, y );
    }
    endShape(CLOSE);

    m_counter++;

}


function windowResized() {
    let w = 900;
    w = min( w, windowWidth - 8 );
    resizeCanvas( w, w / 2 );
}
