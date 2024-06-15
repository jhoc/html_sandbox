import {
    DiagramList
} from './diagramList.js'
import {
    musicData
} from "./MusicDefinitions.js";


const scrollDiagramListCanvas = document.getElementById('scroll-editor-diagramList')
const diagramListCanvas = document.getElementById('diagramList');
const diagramList = new DiagramList(diagramListCanvas, musicData.instrumentAt(0));
const diagramSelector = document.getElementById('diaList-diagramSelector');

document.getElementById('addDiagramToList').addEventListener('click', function () {
    // console.log( "addDiaToList" )
    diagramList.addDiagram(musicData.instrumentAt(0));
    adaptWidth();
    setPositionDiagramSelector(diagramList.getSelectedDiagramPos());
});

document.getElementById('removeDiagramFromList').addEventListener('click', function () {
    // console.log("removeDiaFromList")
    diagramList.removeDiagram(diagramList.getSelectedDiagramIndex());
    adaptWidth();
    setPositionDiagramSelector(diagramList.getSelectedDiagramPos());
});

function onRootChange(_root) {
    // console.log( "onRootChange", _root, diagramList );
    var dia = diagramList.getSelectedDiagram();
    dia.setRoot(_root);
    diagramList.setSelectedDiagram(dia);
}
diagramSelector.setCallbackOnRootChange(onRootChange);

function onChordChange(_chord) {
    // console.log( "onCHordChange", _chord );
    var dia = diagramList.getSelectedDiagram();
    dia.setChord(_chord);
    diagramList.setSelectedDiagram(dia);
}
diagramSelector.setCallbackOnChordChange(onChordChange);

function onScaleChange(_scale) {
    // console.log( "onScaleChange", _scale );
    var dia = diagramList.getSelectedDiagram();
    dia.setScale(_scale);
    diagramList.setSelectedDiagram(dia);
}
diagramSelector.setCallbackOnScaleChange(onScaleChange);

// callbacks connect dia and diaList
function setEditor(_dia) {
    diagramSelector.setDiagram(_dia);

    setPositionDiagramSelector(diagramList.getSelectedDiagramPos());

}
diagramList.setCallbackOnSelectDiagram(setEditor);


function setPositionDiagramSelector(_yPos) {
    if (_yPos == undefined) {
        diagramSelector.style.display = 'none';
        return;
    }
// console.log( "logiDiaList setPoSel", scrollDiagramListCanvas.scrollLeft );

    //diagramSelector ist in scroll div. 
    //div hat den style parameter(position: relative;), 
    //damit beziehen sich alle children mit dem style parameter(position: absolute;) auf den parent
    // deswegen reicht es die position des diagram auf dem canvas zu wissen
    let listProp = diagramList.getLayoutProperties();
    let rectDiaSel = diagramSelector.getBoundingClientRect();
    let x = (listProp[1]) + scrollDiagramListCanvas.scrollLeft;
    let y = _yPos;
    y += rectDiaSel.height / 2;
    diagramSelector.style.left = x + 'px';
    diagramSelector.style.top = y + 'px';

    diagramList.setScrollLeftAmount(scrollDiagramListCanvas.scrollLeft );
}

window.addEventListener('resize', function (event) {
    setPositionDiagramSelector(diagramList.getSelectedDiagramPos());
    adaptWidth();
}, true);

function adaptWidth() {


    const scrollbarWidthVer = scrollDiagramListCanvas.offsetHeight - scrollDiagramListCanvas .clientHeight;
    var windowH = window.innerHeight - diagramListCanvas.getBoundingClientRect().top;
    var canvasH = diagramListCanvas.getBoundingClientRect().height + scrollbarWidthVer;
    console.log( "logic dia editor.resize", windowH, canvasH, scrollDiagramListCanvas.getBoundingClientRect().height, scrollbarWidthVer );

    if( windowH > canvasH ) {
        scrollDiagramListCanvas.style.height = canvasH + 'px';
    } else {
        scrollDiagramListCanvas.style.height = windowH + 'px';
    }

    // console.log("logiDialist", window.innerHeight, windowH, canvasH );
    

    const scrollbarWidthHor = scrollDiagramListCanvas.offsetWidth - scrollDiagramListCanvas .clientWidth;
    console.log( scrollbarWidthHor );
    var windowW = document.body.clientWidth; //window.innerWidth;
    // var scrollW = scrollDiagramListCanvas.getBoundingClientRect().width;
    var canvasW = diagramListCanvas.getBoundingClientRect().width + scrollbarWidthHor;
    if (windowW > canvasW) {
        // console.log( "logicDiaEdit maxW");
        scrollDiagramListCanvas.style.width = canvasW + 'px';
    } else {
        // console.log( "logicDiaEdit apaptW");
        scrollDiagramListCanvas.style.width = windowW + 'px';
    }

   
}

window.addEventListener('load', function () {
    // console.log('All assets are loaded')
    adaptWidth();
    adaptWidth(); // 2 mal wg scrollbar, beim ersten mal noch nicht gesetzt
    setPositionDiagramSelector(diagramList.getSelectedDiagramPos());
})

scrollDiagramListCanvas.addEventListener( 'scroll', function() {
    // console.log( "scroll" );
    setPositionDiagramSelector(diagramList.getSelectedDiagramPos());
})

// diagramSelector.style.display = 'none';