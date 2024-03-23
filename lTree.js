
var counter = 0;

function setup() {
    // put setup code here
    createCanvas(900, 400);
}

function draw() {
    // put drawing code here
    // background( 70, 70, 185 );

    background( 70, 70, 185, 30 )
    
    lFunc( width / 2, height, 90, 0.8, -PI/2, PI/18, 7);
  //  lFunc(ofGetWidth()/2, 750, 150, 0.8, -PI/2, (float)counter/100, 12);
    counter++;
}

function lFunc( _x, _y, _l, _s, _a, _b, n){
  var startX = _x;
  var startY = _y;
  var length = _l;
  var alpha = _a;
  var stretch = _s;

  var endX = length * cos(alpha) + startX;
  var endY = length * sin(alpha) + startY;
stroke( 255, 100, 255 );
  line(startX, startY, endX, endY);
  var radius = length / 20;
  circle(endX, endY, radius);

  length = length * stretch;

  // var off1 = sin( counter/30) * 0.5;
    // var off2 = sin( counter/23) * 0.5;
      var off1 = sin( counter/48) * 0.5;
  var off2 = sin( counter/36) * 0.5;
  
  n--;
  if(n > 0){
    // lFunc(endX, endY, length, _s, alpha + _b, _b, n);
    // lFunc(endX, endY, length, _s, alpha - _b, _b, n);

    //für assymetrischen Baum
    lFunc(endX, endY, length, _s, alpha + _b + off1, _b, n);
    lFunc(endX, endY, length, _s, alpha - _b + off2, _b, n);
  }
}
