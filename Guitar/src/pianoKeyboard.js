// const mtemplate = document.createElement('template')

// mtemplate.innerHTML = `
// <style>

// </style>
//    <div class="menubar">
//         <div class="background">
//           <div id="left-btn">
//              </div>
//             <div id="right-btn">
//           </div>
//         </div>
// <ul id="menu-box">
// </ul>
//     </div>

//  `

// export class PianoKeyboard extends HTMLElement {
//     constructor() {
//         super()

//     }

//     connectedCallback(): void {
//         this.attachShadow({
//             mode: 'open'
//         })
//         if (this.shadowRoot == null) return;
//         this.shadowRoot.appendChild(mtemplate.content.cloneNode(true))

//     }
// }

// customElements.define('jui-pianoKeyboard', PianoKeyboard);


///////////////////////////////////////
/**
 * https://github.com/annaneo/pianoKeyboard
 * Copyright notice
 *
 * (c) 2016
 * Anna Neovesky  Anna.Neovesky@adwmainz.de
 * Gabriel Reimers g.a.reimers@gmail.com
 *
 * Digital Academy www.digitale-akademie.de
 * Academy of Sciences and Literatur | Mainz www.adwmainz.de
 *
 * Licensed under The MIT License (MIT)
 */


var octaves = {
    C1: 0, //,,,
    C2: 1, //,,
    C3: 2, //,
    C4: 3, //'
    C5: 4, //''
    C6: 5, //'''
    C7: 6 //''''
}


var MAX_OCTAVES = octaves.C7;
var KEYS_PER_OCTAVE = 17;
var _displayedOctaves = 3;
var _startOctave = 3;


function numberOfDisplayedOctaves() {
    return _displayedOctaves
}


import {
    musicDefinition
} from "../built/MusicDefinitions.js"

export function resetKeyboardColors() {
    const elemKey = document.getElementById("PianoKeyboard");
    for (let i = 0; i < elemKey.children.length; i++) {
        if( elemKey.children[ i ].className == "whiteKey" ) {
            elemKey.children[ i ].style.background = '#fff'
        } else {
            elemKey.children[ i ].style.background = '#000'
        }
    }
}

export function setKeyboardKeyColor( _index, _color ) {
    // console.log( "setKey", _index, _color );
    const elemKey = document.getElementById("PianoKeyboard");
    elemKey.children[ _index ].style.background = _color;
}

function htmlForKeyboardWithOctaves(numberOfOctaves, startOctave, showLabels, withShiftButtons, withNoteSelection, withClefSelection) {
    if (typeof (numberOfOctaves) === 'undefined') numberOfOctaves = 3
    if (typeof (startOctave) === 'undefined') startOctave = octaves.C4
    if (typeof (showLabels) === 'undefined') showLabels = true
    if (typeof (withShiftButtons) === 'undefined') withShiftButtons = true
    if (typeof (withNoteSelection) === 'undefined') withNoteSelection = true
    if (typeof (withClefSelection) === 'undefined') withClefSelection = true

    //back keys are seperated to fields sharp and flat; this enables specific input
    _displayedOctaves = limitToRange(numberOfOctaves, 1, MAX_OCTAVES)
    _startOctave = limitToRange(startOctave, octaves.C1, octaves.C6)

    var currentOctave = _startOctave

    var keyhoardHTML = '\
        <ul id="PianoKeyboard" class="DA-PianoKeyboard">\n'
    for (var i = 0; i < _displayedOctaves; i++) {
        if (showLabels) {
            keyhoardHTML += '\
                <li class="whiteKey"><p>C</p></li>\n\
                <li class="blackKeySharp"><p>♯</p></li>\n'
        } else {
            keyhoardHTML += '\
                <li class="whiteKey"></li>\n\
                <li class="blackKeySharp"></li>\n'
        }

        keyhoardHTML += '\
                <li class="whiteKey"><p>D</p></li>\n\
                <li class="blackKeySharp"></li>\n\
                <li class="whiteKey"><p>E</p></li>\n\
                <li class="whiteKey"><p>F</p></li>\n\
                <li class="blackKeySharp"></li>\n\
                <li class="whiteKey"><p>G</p></li>\n\
                <li class="blackKeySharp"></li>\n\
                <li class="whiteKey"><p>A</p></li>\n\
                <li class="blackKeySharp"></li>\n\
                <li class="whiteKey"><p>B</p></li>\n'
        currentOctave++
    }
    // for (var i = 0; i < _displayedOctaves; i++) {
    //     if (showLabels) {
    //         keyhoardHTML += '\
    //         <li class="whiteKey"><p>C' + (currentOctave + 1) + '</p></li>\n\
    //         <li class="blackKeySharp"><p>♯</p></li>\n\
    //         <li class="blackKeyFlat"><p>♭</p></li>\n'
    //     } else {
    //         keyhoardHTML += '\
    //         <li class="whiteKey"></li>\n\
    //         <li class="blackKeySharp"></li>\n\
    //         <li class="blackKeyFlat"></li>\n'
    //     }

    //     keyhoardHTML += '\
    //         <li class="whiteKey"></li>\n\
    //         <li class="blackKeySharp"></li>\n\
    //         <li class="blackKeyFlat"></li>\n\
    //         <li class="whiteKey"></li>\n\
    //         <li class="whiteKey"></li>\n\
    //         <li class="blackKeySharp"></li>\n\
    //         <li class="blackKeyFlat"></li>\n\
    //         <li class="whiteKey"></li>\n\
    //         <li class="blackKeySharp"></li>\n\
    //         <li class="blackKeyFlat"></li>\n\
    //         <li class="whiteKey"></li>\n\
    //         <li class="blackKeySharp"></li>\n\
    //         <li class="blackKeyFlat"></li>\n\
    //         <li class="whiteKey"></li>\n'
    //     currentOctave++
    // }
    keyhoardHTML += '\
        </ul>\n'

    var html = '\
        <div class="DA-Keyboardcontainer">'
    if (withShiftButtons) {
        html += '\
            <button type="button" id="lowerOctave" onclick="lowerOctave()">˂</button>\n' +
            keyhoardHTML + '\n\
            <button type="button" id="raiseOctave" onclick="raiseOctave()">˃</button>\n'
    } else {
        html += keyhoardHTML
    }
    html += '\
        </div>'

    return html;
}

function bindKeysToFunction(callback) {
    // console.log( "bindKeysToFunc" );
    const elemKey = document.getElementById("PianoKeyboard");
    for (let i = 0; i < elemKey.children.length; i++) {
        // console.log( "bindKeysToFunc", i );
        elemKey.children[i].addEventListener('click', function () {
            // console.log("keyPress", musicDefinition.pitch(i), i );
            callback(musicDefinition.pitch(i));
        });
    }
}

function limitToRange(number, min, max) {
    return Math.min(Math.max(min, number), max)
}

var callbackOnNotePress = null;
export function setCallbackOnNotePress(_func) {
    // console.log( "set callback on note press", _func);
    callbackOnNotePress = _func;
    // bindKeysToFunction(callbackOnNotePress);
    bindKeysToFunction(callbackOnNotePress);
}

window.addEventListener('load', function () {
    const keyElem = document.getElementById("keyboardContainer")
    keyElem.style.display = 'none';
    const keyHtml = htmlForKeyboardWithOctaves(1, octaves.C4, true, false);
    // console.log( "keyboard.onLoad");
    if (keyElem != null) {
        keyElem.innerHTML = keyHtml;
        // console.log( callbackOnNotePress );
        if (callbackOnNotePress != null) {
            bindKeysToFunction(callbackOnNotePress);
        }
        // bindKeysToFunction(updatePreviewWithNote);
    }
})