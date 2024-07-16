import { createBurgerMenu, fillNavigation } from './genericMenuBar.js';
import { adaptDiagramWidth, Diagram, FingerLabel, MouseClickBehaviour } from './Diagram.js';
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
var switchState = "noteToDia";
const switchButton = head.createButton("Switch", "");
head.addHeaderRightIcon(switchButton);
switchButton.addEventListener("click", function (_evt) {
    // return;
    // console.log("Switch", switchState);
    const container = document.getElementById("container");
    const solButRow = document.getElementById("solutionParams");
    const noteLabel = document.getElementById("noteLabel");
    const diagram = document.getElementById("scroll-editor-diagram");
    const keyboard = document.getElementById("keyboardContainer");
    if (container == null || solButRow == null || noteLabel == null || diagram == null || keyboard == null) {
        console.log("switch, somthing null", keyboard);
        return;
    }
    if (switchState == "noteToDia") {
        switchState = "diaToNote";
        keyboard.style.display = '';
        noteLabel.style.display = 'none';
        // container.insertBefore(solButRow, noteLabel);
        container.insertBefore(diagram, solButRow);
        dia.setFingerLabelType(FingerLabel.NONE);
    }
    else {
        switchState = "noteToDia";
        container.insertBefore(solButRow, diagram);
        container.insertBefore(noteLabel, solButRow);
        dia.setFingerLabelType(FingerLabel.NOTE);
        keyboard.style.display = 'none';
        noteLabel.style.display = '';
    }
    nextNote();
    // console.log( switchState );
});
/////////^^^^^^^^^^^^^^^^^^^^^^^^
var timeOnStart = 0;
const scrollDiagramCanvas = document.getElementById('scroll-editor-diagram');
const diagramCanvas = document.getElementById('editor-diagram');
let dia = new Diagram(diagramCanvas, musicData.instrumentAt(0));
dia.setRoot(null);
dia.setMouseClickBehaviour(MouseClickBehaviour.CALLBACK);
function callbackOnMouseClick(_coord, _pitch) {
    // console.log( "MyClick", _coord, _pitch );
    if (_pitch == null)
        return;
    if (switchState == "noteToDia") {
        checkSolution(p, _pitch);
    }
    else {
    }
}
dia.setCallbackOnMouseClick(callbackOnMouseClick);
dia.update();
window.addEventListener('load', function () {
    // console.log('loadDiaEditor loaded')
    adaptDiagramWidth(diagramCanvas, scrollDiagramCanvas);
});
window.addEventListener('resize', function (event) {
    // console.log( "logic dia editor.resize", window.innerWidth, window.innerHeight)
    adaptDiagramWidth(diagramCanvas, scrollDiagramCanvas);
}, true);
var evalClosed = false;
const evalLabel = document.getElementById("evalSol");
const correctLabel = document.getElementById("labelCorrectNum");
const wrongLabel = document.getElementById("labelWrongNum");
var correctNum = 0;
var wrongNum = 0;
function checkSolution(_solution, _guess) {
    // console.log( "checkSolution",  Date.now() - timeOnStart, evalClosed );
    if (evalClosed)
        return;
    if (switchState == "noteToDia") {
        dia.setRoot(_solution);
        dia.update();
        // setKeyboardKeyColor( p.pitch(), '#FF0000');
    }
    else {
        if (noteLabel == null)
            return;
        noteLabel.innerHTML = p.name();
        setKeyboardKeyColor(p.pitch(), '#FF0000');
    }
    if (_solution.name() == (_guess === null || _guess === void 0 ? void 0 : _guess.name())) {
        correctNum++;
        if (evalLabel != null) {
            evalLabel.innerHTML = "Correct";
        }
    }
    else {
        wrongNum++;
        if (evalLabel != null) {
            evalLabel.innerHTML = "Wrong";
        }
    }
    if (correctLabel != null) {
        correctLabel.innerHTML = correctNum.toString();
    }
    if (wrongLabel != null) {
        wrongLabel.innerHTML = wrongNum.toString();
    }
    // console.log( "checkSolution B",  Date.now() - timeOnStart );
    evalClosed = true;
    clearTimeout(timerNum);
    timerNum = setTimeout(nextNote, 2000);
}
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
    // console.log( "show Solution" );
    checkSolution(p, null);
});
const timerButton = document.getElementById("timerButton");
const timerIntervall = document.getElementById("timerIntervall");
const nextButton = document.getElementById("nextButton");
nextButton === null || nextButton === void 0 ? void 0 : nextButton.addEventListener('click', nextNote);
function nextNote() {
    // console.log( "next",  Date.now() - timeOnStart );
    evalClosed = false;
    resetKeyboardColors();
    if (noteLabel == null)
        return;
    var lastP = p;
    while (p == lastP) {
        p = pitches[Math.floor(Math.random() * 12)];
    }
    lastP = p;
    if (switchState == "noteToDia") {
        noteLabel.innerHTML = p.name();
        dia.setRoot(null);
        dia.update();
    }
    else {
        noteLabel.innerHTML = "";
        dia.setRoot(p);
        dia.update();
    }
    if (evalLabel != null) {
        evalLabel.innerHTML = "?";
    }
    if (timerButton === null || timerButton === void 0 ? void 0 : timerButton.checked) {
        // setTimer();
        if ((timerIntervall === null || timerIntervall === void 0 ? void 0 : timerIntervall.value) != undefined) {
            clearTimeout(timerNum);
            timerNum = setTimeout(myTimer, 1000 * parseInt(timerIntervall === null || timerIntervall === void 0 ? void 0 : timerIntervall.value));
        }
    }
}
// Timer
function myTimer() {
    // console.log("myTimer",  Date.now() - timeOnStart );
    if (!evalClosed) {
        checkSolution(p, null);
        return;
    }
    nextNote();
}
var timerNum = 0;
timerIntervall === null || timerIntervall === void 0 ? void 0 : timerIntervall.addEventListener('change', function () {
    if (timerButton === null || timerButton === void 0 ? void 0 : timerButton.checked) {
        // setTimer();
    }
});
timerButton === null || timerButton === void 0 ? void 0 : timerButton.addEventListener('click', function () {
    // console.log( timerButton.checked);
    if (timerButton.checked) {
        // setTimer();
        if (timeOnStart === 0) {
            timeOnStart = Date.now();
        }
        if ((timerIntervall === null || timerIntervall === void 0 ? void 0 : timerIntervall.value) != undefined) {
            clearTimeout(timerNum);
            timerNum = setTimeout(myTimer, 1000 * parseInt(timerIntervall === null || timerIntervall === void 0 ? void 0 : timerIntervall.value));
        }
    }
    else {
        clearTimeout(timerNum);
        // console.log( intervallNum );
        // clearInterval(intervallNum);
    }
});
function callbackOnNotePress(_note) {
    // console.log( "fds", _note.name() );
    if (switchState == "noteToDia") {
    }
    else {
        checkSolution(p, _note);
    }
}
import { resetKeyboardColors, setCallbackOnNotePress, setKeyboardKeyColor } from './pianoKeyboard.js';
window.addEventListener('load', function () {
    let elem = document.getElementById("noteLabel");
    if (elem == null)
        return;
    elem.style.opacity = "1";
    nextNote();
    setCallbackOnNotePress(callbackOnNotePress);
});
//# sourceMappingURL=logicLearnFretboard.js.map