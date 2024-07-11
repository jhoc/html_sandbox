import {
    Score
} from "./score.js"
import {
    musicData
} from "./MusicDefinitions.js";
// import {
//     MenuHeader
// } from "./menuHeader.js"
import {
    GenericMenuBar, fillNavigation, createBurgerMenu
} from "./genericMenuBar.js"


const scoreCanvas: HTMLCanvasElement = document.getElementById('scoreCanvas') as HTMLCanvasElement;
const score: Score = new Score(scoreCanvas, musicData.instrumentAt(0)!);
// console.log( scoreCanvas, score );
score.update();


////vvvvvvvvvvvvvvv menubar
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

// element = head.createButton('other', "./images/ic--round-plus.svg");
// head.addHeaderRightIcon(element);
// element.addEventListener('click', function () {
//     // console.log( "addDia" );
//     diagramList.addDiagram(musicData.instrumentAt(0)!);
//     adaptSize();
// })

var element: HTMLButtonElement = head.createButton('other', "./images/material-symbols--edit-square-outline-rounded.svg");
head.addHeaderLeftIcon(element);
element.addEventListener("click", e => {
console.log( "Edit" );
// document.getElementById( 'editor-diagramSelector').style.
});

// var element = head.createButton('other', "");
// head.addHeaderRightIcon(element);
// element.addEventListener('click', function () {
//     console.log("other");
// })
/////////^^^^^^^^^^^^^^^^^^^^^^^^
/////^^^^^^^^^^^


// var head: MenuHeader = document.getElementById('menuheader') as MenuHeader;
// var element: HTMLButtonElement = head.createButton('other', "./images/material-symbols--edit-square-outline-rounded.svg");
// head.addHeaderLeftIcon(element);
// element.addEventListener("click", e => {
// console.log( "Edit" );
// // document.getElementById( 'editor-diagramSelector').style.
// });