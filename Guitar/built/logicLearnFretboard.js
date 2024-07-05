import { createBurgerMenu, fillNavigation } from './genericMenuBar.js';
import { adaptDiagramWidth, Diagram } from './Diagram.js';
import { musicData, musicDefinition } from './MusicDefinitions.js';
///////////////////////////vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// var head = document.getElementById('menuheader') as MenuHeader;
var head = document.getElementById('menuheader');
// add button to headerbar
fillNavigation(head);
var burgerMenu = createBurgerMenu(head);
burgerMenu.addEventListener('click', function () {
    head.clearMenu();
    head.createMenuElement('124fd').addEventListener('click', function () {
        console.log("124fd");
    });
    head.createMenuElement('sdsdf78sdf78sdf').addEventListener('click', function () {
        console.log("1sdsdf78");
    });
    // menubar.addMenuElement( li );
    head.openMenu(burgerMenu);
});
/////////^^^^^^^^^^^^^^^^^^^^^^^^
const scrollDiagramCanvas = document.getElementById('scroll-editor-diagram');
const diagramCanvas = document.getElementById('editor-diagram');
let dia = new Diagram(diagramCanvas, musicData.instrumentAt(0));
dia.update();
window.addEventListener('load', function () {
    // console.log('loadDiaEditor loaded')
    adaptDiagramWidth(diagramCanvas, scrollDiagramCanvas);
});
window.addEventListener('resize', function (event) {
    // console.log( "logic dia editor.resize", window.innerWidth, window.innerHeight)
    adaptDiagramWidth(diagramCanvas, scrollDiagramCanvas);
}, true);
/////////////////
const noteLabel = document.getElementById("noteLabel");
const solutionButton = document.getElementById("solutionButton");
var pitches = [];
var p = pitches[Math.floor(Math.random() * 12)];
for (let i = 0; i < 12; i++) {
    if (musicDefinition.pitch(i) != null) {
        pitches.push(musicDefinition.pitch(i));
    }
}
solutionButton === null || solutionButton === void 0 ? void 0 : solutionButton.addEventListener('click', function () {
    console.log("show Solution");
    dia.setRoot(p);
    dia.update();
});
const nextButton = document.getElementById("nextButton");
nextButton === null || nextButton === void 0 ? void 0 : nextButton.addEventListener('click', nextNote);
function nextNote() {
    // console.log( "next" );
    if (noteLabel == null)
        return;
    var lastP = p;
    while (p == lastP) {
        p = pitches[Math.floor(Math.random() * 12)];
    }
    lastP = p;
    noteLabel.innerHTML = p.name();
    dia.setRoot(null);
    dia.update();
}
// Timer
const timerButton = document.getElementById("timerButton");
const timerIntervall = document.getElementById("timerIntervall");
function myTimer() {
    nextNote();
}
var intervallNum = 0;
function setTimer() {
    if ((timerIntervall === null || timerIntervall === void 0 ? void 0 : timerIntervall.value) == undefined)
        return;
    clearInterval(intervallNum);
    intervallNum = setInterval(myTimer, 1000 * parseInt(timerIntervall === null || timerIntervall === void 0 ? void 0 : timerIntervall.value));
    // console.log( "setTImer", intervallNum );
}
timerIntervall === null || timerIntervall === void 0 ? void 0 : timerIntervall.addEventListener('change', function () {
    if (timerButton === null || timerButton === void 0 ? void 0 : timerButton.checked) {
        setTimer();
    }
});
timerButton === null || timerButton === void 0 ? void 0 : timerButton.addEventListener('click', function () {
    // console.log( timerButton.checked);
    if (timerButton.checked) {
        setTimer();
    }
    else {
        console.log(intervallNum);
        clearInterval(intervallNum);
    }
});
//# sourceMappingURL=logicLearnFretboard.js.map