let m_counter = 0;

function setup() {
    createCanvas( 900, 450);
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
	let radius = 100 + n * 100;
	x += radius * cos( angle );
	y += radius * sin( angle );

        vertex( x, y );
    }
    endShape(CLOSE);

    m_counter++;

}
