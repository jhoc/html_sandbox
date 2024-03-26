function setup() {
    // console.log( "fdhslkjfhdljkfhjdklfhjsklgh");
    windowResized();
    
}

function windowResized() {
     console.log( "Resize" );
    let w = 900;
    w = min( w, windowWidth );
    if( w < 900 ) {
	const elem = document.getElementById("scriptFrames");
	let divChildren = elem.childNodes;
	for (var i=0; i<divChildren.length; i++) {
	    if (divChildren.hasOwnProperty( divChildren[ i ] )) {
		divChildren[ i ].style.width = w + 'px';
		divChildren[ i ].style.height = w / 2  + 'px';
		// iFrames[i].style.height = divChildren[ i ].contentWindow.document.body.offsetHeight + 'px';}
	    }
	}
    }
    
}
