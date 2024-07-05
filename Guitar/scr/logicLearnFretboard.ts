import { createBurgerMenu, fillNavigation, GenericMenuBar } from './genericMenuBar.js';
import { adaptDiagramWidth, Diagram } from './Diagram.js';
import { musicData, Pitch, musicDefinition } from './MusicDefinitions.js';
///////////////////////////vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// var head = document.getElementById('menuheader') as MenuHeader;
var head = document.getElementById('menuheader') as GenericMenuBar;

// add button to headerbar
fillNavigation( head );
var burgerMenu : HTMLButtonElement = createBurgerMenu( head );
burgerMenu.addEventListener('click', function () : void {
    head.clearMenu();
    head.createMenuElement('124fd').addEventListener('click', function () {
        console.log("124fd");
    });
    head.createMenuElement('sdsdf78sdf78sdf').addEventListener('click', function () {
        console.log("1sdsdf78");
    });
    // menubar.addMenuElement( li );

    head.openMenu(burgerMenu);
})

/////////^^^^^^^^^^^^^^^^^^^^^^^^

const scrollDiagramCanvas: HTMLElement | null = document.getElementById('scroll-editor-diagram');
const diagramCanvas: HTMLCanvasElement | null = document.getElementById('editor-diagram') as HTMLCanvasElement;
let dia: Diagram = new Diagram(diagramCanvas, musicData.instrumentAt(0) !);
dia.update();

window.addEventListener('load', function () {
    // console.log('loadDiaEditor loaded')
    adaptDiagramWidth( diagramCanvas, scrollDiagramCanvas );
})
window.addEventListener('resize', function (event) {
    // console.log( "logic dia editor.resize", window.innerWidth, window.innerHeight)
    adaptDiagramWidth( diagramCanvas, scrollDiagramCanvas );
}, true);


/////////////////
const noteLabel : HTMLElement | null = document.getElementById("noteLabel");
const solutionButton = document.getElementById( "solutionButton")
var pitches : Pitch[] = [];
var p : Pitch = pitches[Math.floor(Math.random() * 12)]!;

for( let i : number = 0; i < 12; i++ ) {
    if( musicDefinition.pitch(i) != null ) {
        pitches.push( musicDefinition.pitch(i)! );
    }
}
solutionButton?.addEventListener( 'click', function() {
    console.log( "show Solution" );
    dia.setRoot( p );
    dia.update();
})

const nextButton = document.getElementById( "nextButton")
nextButton?.addEventListener( 'click', nextNote );

function nextNote() {
    // console.log( "next" );
    if( noteLabel == null ) return;
    
    var lastP = p;
    while( p == lastP ) {
        p = pitches[Math.floor(Math.random() * 12)]!;
    }
    lastP = p;
    noteLabel.innerHTML = p.name();

    dia.setRoot( null );
    dia.update();
}

// Timer
const timerButton : HTMLInputElement | null = document.getElementById( "timerButton") as HTMLInputElement | null;
const timerIntervall : HTMLInputElement | null = document.getElementById( "timerIntervall") as HTMLInputElement | null;
function myTimer() {
  nextNote();
  } 

  var intervallNum : number = 0;
function setTimer() {
    if( timerIntervall?.value == undefined ) return;
    clearInterval( intervallNum );
    intervallNum = setInterval(myTimer, 1000 * parseInt(timerIntervall?.value) );
    // console.log( "setTImer", intervallNum );
}

timerIntervall?.addEventListener( 'change', function() {
    if( timerButton?.checked ) {
        setTimer();
    }
} )

timerButton?.addEventListener( 'click', function() {
    // console.log( timerButton.checked);
    if( timerButton.checked ) {
        setTimer();
    } else {
        console.log( intervallNum );
        clearInterval( intervallNum );
    }
  
})



