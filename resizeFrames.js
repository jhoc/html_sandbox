function setup() {
    // console.log( "fdhslkjfhdljkfhjdklfhjsklgh");
    windowResized();
    
}

function windowResized() {
    let w = 900;
    w = min( w, windowWidth - 8 );
    if( w < 900 ) {
	const elem = document.getElementById("scriptFrames");
	let divChildren = elem.children;

	for (var i=0; i<divChildren.length; i++) {
	    divChildren[ i ].style.width = w + 'px';
	    divChildren[ i ].style.height = w / 2  + 'px';
	}
    }
    
}
