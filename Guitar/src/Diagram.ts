import {
    FingeringType,
    isEqualFretboardCoord,
    musicDefinition
} from "./MusicDefinitions.js";
import {
    musicData,
    Intervall,
    Instrument,
    Pitch,
    IntervallArray,
    ChordFingering,
    ScaleFingering,
    FretboardCoord
} from "./MusicDefinitions.js";

import {
    ScreenPos,
    Color, 
    Rect
} from "./types.js"

export enum MouseClickBehaviour {
    CUSTOM,
    SETCHORDFINGERING,
    CALLBACK
};
export enum FingerLabel {
    NONE, NOTE, FUNCTION
}

interface callbackMouseClickType {
    ( _coord : FretboardCoord, _pitch : Pitch | null ) : void;
}

interface callbackChangeType {
    (_dia: Diagram): void
}

export class Diagram {
    canvas: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null;
    instrument: Instrument;
    root: Pitch | null;
    chord: IntervallArray | null = null; // = musicData.scaleAt(0);
    scale: IntervallArray | null = null; // = musicData.scaleAt(0);
    chordFingering: ChordFingering | null = null;
    chordFingeringString: number = 0;
    chordFingeringFret: number = 0;
    scaleFingering: ScaleFingering | null = null;

    mouseClickBehaviour: MouseClickBehaviour = MouseClickBehaviour.CUSTOM; //'SETCHORDFINGERING
    callbackOnMouseClick : callbackMouseClickType | null = null;
    m_drawFingerLabel : FingerLabel = FingerLabel.NOTE;

    xPos: number = 0;
    yPos: number = 0;
    fretDelta: number = 50; // * window.devicePixelRatio;
    stringDelta: number = 32; // * window.devicePixelRatio;
    fingerWidth: number = 12; // * window.devicePixelRatio
    fingerColorCustom: Color = '#AAFFDD';
    fingerColorRoot: Color = '#FF5555';
    fingerColorChord: Color = '#BB99DD';
    fingerColorScale: Color = '#99DDDD';
    customCoordinates: FretboardCoord[] = [];
    // customCoordinates = [];
    chordFingeringCoordinates: FretboardCoord[] = []; //[[1,2], [3,4]]; //[];
    scaleFingeringCoordinates: FretboardCoord[] = [];

    fretboardLeft: number = 0;
    fretboardRight: number = 0;
    fretboardTop: number = 0;
    fretboardBottom: number = 0;

    m_width: number = 0;
    m_height: number = 0;

    // chordFingeringStringFret: number = 0;

    callbackOnChange: callbackChangeType | null = null;

    constructor(_canvas: HTMLCanvasElement | null, _instrument: Instrument) {
        if (_canvas != null) {
            this.canvas = _canvas;
            this.ctx = _canvas.getContext('2d');
            this.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
            // this.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
        }

        // use Data_Diagram class
        this.instrument = _instrument;
        this.root = musicDefinition.pitch(0)!;
        this.chord; // = musicData.scaleAt(0);
        this.scale; // = musicData.scaleAt(0);
        this.chordFingering;
        this.chordFingeringString = this.instrument.pitch().length - 1;
        this.chordFingeringFret = 0;
        this.mouseClickBehaviour = MouseClickBehaviour.CUSTOM; //'SETCHORDFINGERING'

        this.xPos = 0;
        this.yPos = 0;
        this.fretDelta = 50; // * window.devicePixelRatio;
        this.stringDelta = 32; // * window.devicePixelRatio;
        this.fingerWidth = 12; // * window.devicePixelRatio;

        this.fingerColorCustom = '#AAFFDD';
        this.fingerColorRoot = '#FF5555';
        this.fingerColorChord = '#BB99DD';
        this.fingerColorScale = '#99DDDD';

        this.updateDimension();
    }

setFingerLabelType( _fingLabel : FingerLabel ) {
    this.m_drawFingerLabel = _fingLabel;
}

    setMouseClickBehaviour(_behaviour: MouseClickBehaviour) {
        // console.log( "dia",  _behaviour );
        this.mouseClickBehaviour = _behaviour;
    }

    getInstrument(): Instrument {
        return this.instrument;
    }

    setCallbackOnChange(_function: callbackChangeType): void {
        // console.log("setCallbackOnChange");
        this.callbackOnChange = _function;
    }

    hasChanged(): void {
        if (this.callbackOnChange == undefined) return;
        // console.log("hasChanged");
        this.callbackOnChange(this);
    }

    setDiagram(_dia: Diagram): void {
        this.root = _dia.getRoot();
        // console.log( "setDia.chord ", _dia.getChord() );
        this.chord = _dia.getChord();
        this.scale = _dia.getScale();
        this.chordFingering = _dia.getChordFingering();
        this.chordFingeringFret = _dia.getChordFingeringFret();
        this.chordFingeringString = _dia.getChordFingeringString();
        this.scaleFingering = _dia.getScaleFingering();
        this.customCoordinates = _dia.getCustomCoordinates();
     
        // console.log( "setDia", this.chordFingering, this.chordFingeringFret, _dia.getChordFingeringFret(), this.chordFingeringString, _dia.getChordFingeringString() );
        this.chordFingeringCoordinates = [];
        this.createChordFingeringCoordinates();
        this.scaleFingeringCoordinates = [];
        this.createScaleFingeringCoordinates();
        this.update();
    }

    setRoot(_root: Pitch | null ): void {
        this.root = _root;
        this.createChordFingeringCoordinates();
        this.computeScaleFingeringCoordinates(this.chordFingeringFret, this.chordFingeringString);
        this.update();
        // this.hasChanged();
    }
    getRoot(): Pitch | null {
        return this.root;
    }
    setChord(_chord: IntervallArray | null ): void {
        this.chord = _chord;
        // console.log( "setChord ", _chord, this.chordFingering );
        if (_chord == null) {
            if( this.chordFingering == null || this.chordFingering?.getType() == FingeringType.CHORD) {
                this.chordFingeringCoordinates = [];
                this.chordFingering = null;
            }
            this.mouseClickBehaviour = MouseClickBehaviour.CUSTOM;
        } else {
            this.createChordFingeringCoordinates();
        }
        this.update();
        // this.hasChanged();
    }
    getChord(): IntervallArray | null {
        return this.chord;
    }
    setScale(_scale: IntervallArray | null ): void {
        // console.log( "Diagram.setScale", _scale );

        this.scale = _scale;

        if ( _scale == null) {
            if( this.chordFingering == null || this.chordFingering?.getType() == FingeringType.SCALE ) {
                this.chordFingeringCoordinates = [];
                this.chordFingering = null;
            }
            this.scaleFingering = null;
            this.scaleFingeringCoordinates = [];
            this.mouseClickBehaviour = MouseClickBehaviour.CUSTOM;
        } else {
            this.computeScaleFingeringCoordinates(this.chordFingeringFret, this.chordFingeringString);
        }

        this.update();
        // this.hasChanged();
    }

    getScale(): IntervallArray | null {
        return this.scale;
    }

    setChordFingering( _fing: ChordFingering | null ): void {
        this.chordFingering = _fing;
        // console.log( "dia.setChordFingering", _fing);
        if ( _fing == null ) {
            this.chordFingeringCoordinates = [];
            this.mouseClickBehaviour = MouseClickBehaviour.CUSTOM;
        } else {
            this.createChordFingeringCoordinates();
        }
        this.update();
    }

    getChordFingering(): ChordFingering | null {
        return this.chordFingering;
    }

    setChordFingeringString(_i: number): void {
        this.chordFingeringString = _i;
        // console.log("dia.setChordFingString", _i);
        this.createChordFingeringCoordinates();
        this.computeScaleFingeringCoordinates(this.chordFingeringFret, this.chordFingeringString);
        this.update();
    }

    getChordFingeringString(): number {
        // console.log("dia.getChordFingString", this.chordFingeringString);
        return this.chordFingeringString;
    }

    setChordFingeringFret(_i: number): void {
        this.chordFingeringFret = _i;
        // console.log("dia.setChordFingFret", _i);
        this.createChordFingeringCoordinates();
        this.computeScaleFingeringCoordinates(this.chordFingeringFret, this.chordFingeringString);
        this.update();
    }

    getChordFingeringFret(): number {
        // console.log("dia.getChordFingFret", this.chordFingeringFret);
        return this.chordFingeringFret;
    }

    getCustomCoordinates(): FretboardCoord[] {
        return this.customCoordinates;
    }

getScaleFingering() : ScaleFingering | null {
    return this.scaleFingering;
}

setScaleFingering( _fing: ScaleFingering | null ) : void {
this.scaleFingering = _fing;
}

    createChordFingeringCoordinates(): void {
        if( this.chordFingering == null ) return;
        let intervall: IntervallArray | null = null;
        // console.log("creteFing", this.chordFingering.getType() );
        if( this.chordFingering.getType() == FingeringType.CHORD ) {
            intervall = this.chord;
        } else if( this.chordFingering.getType() == FingeringType.SCALE ) {
            intervall = this.scale;
        }
        if( intervall == null ) return;
        this.computeChordFingeringCoordinates(this.chordFingeringFret, this.chordFingeringString, intervall.intervall() );
    }

    computeChordFingeringCoordinates( _fret: number, _string: number, _intervall: Intervall[] ): void {
        // console.log("------------------------start compute ChordFing fret:", _fret, _string, _intervall);

        if( this.root == null ) return;
        if (this.chordFingering == null) return;
        // if (this.chord == undefined) return;
        //         if (_string == undefined) {
        //             _string = this.getInstrument().pitch().length - 1;
        //         }

        // let min = Math.min( this.chord.intervall().length, this.chordFingering.fingering().length );
        // console.log( "min: ", this.chord.intervall().length, this.chordFingering.fingering().length );
        // _string = Math.max( _string, min-1 );

        //vvvv create chord pitches
        var pitches: number[] = [];
        for (var i = 0; i < _intervall.length; i++) {
            pitches.push((this.root.pitch() + _intervall[i]!.halfstep()) % 12);
        }
        // console.log(this.chordFingering.fingering(), " : ", pitches.toString());
        ////^^^

        var coords: FretboardCoord[] = [];

        ////vvvvv find startfret/-pitch
        var startPitch: Pitch | null = null;
        // var startFret: number = -1;
        var p;
        for (var fret = _fret; fret <= this.getInstrument().fretNum(); fret++) {
        if( this.instrument.pitchAt(_string) == null ) return;
            p = musicDefinition.pitch(this.instrument.pitchAt(_string)!.index() + fret);
            if( p == null ) continue;
            // console.log( "search start", p, p.pitch() );
            if (pitches.includes(p.pitch())) {
                startPitch = p;
                // startFret = fret;
                // coords.push([fret, _string]);
                // console.log("startpitch found: ", startPitch, " at fret ", startFret);
                break;
            }
        }
        ////^^^^^^
        if (startPitch == null) return;

        ///vvvvvvv build chord from startPitch
        var pIndex: number = pitches.indexOf(startPitch.pitch());
        var tempPitches: number[] = [];
        for (var i: number = 0; i < pitches.length; i++) {
            tempPitches.push(pitches[(pIndex + i) % pitches.length]!);
        }
        pitches = tempPitches;
        // console.log("rotated:", tempPitches);
        ///^^^^^^

        tempPitches = []; // temporary
        ///vvvvvvv order pitches to fingering
        // for (var i = 0; i < pitches.length; i++) {
        for (var i: number = 0; i < this.chordFingering.fingering().length; i++) {
            // console.log( this.chordFingering.fingeringAt(i % pitches.length) );
            if( this.chordFingering.fingeringAt(i % pitches.length) == null ) return;
            if( pitches[this.chordFingering.fingeringAt(i % pitches.length)!] == null ) continue;
            tempPitches.push(pitches[this.chordFingering.fingeringAt(i % pitches.length)!]!);
        }
        pitches = tempPitches;
        // console.log("rotated:", tempPitches);
        //////^^^^


        // console.log( "---------------------", _string );
        //////////find coords
        var pitchIndex: number = 0;
        for (var saite: number = _string; saite >= 0; saite--) {
            if( this.instrument.pitchAt(saite) == null ) continue;
            var stringIndex: number = this.instrument.pitchAt(saite)!.index();
            for (var fret: number = _fret; fret <= this.getInstrument().fretNum() && fret < _fret + 5; fret++) {
                // if( saite == 5 ) {
                // console.log( "check:", saite, fret, pitches[pitchIndex], musicDefinition.pitch( stringIndex + fret ).pitch() );
                // }
                if( musicDefinition.pitch(stringIndex + fret) == null ) continue;
                if (pitches[pitchIndex] == musicDefinition.pitch(stringIndex + fret)!.pitch()) {
                    coords.push({
                        fret: fret,
                        saite: saite
                    }); //[fret, saite]);
                    pitchIndex++;
                    break;
                }

            }
        }
        // console.log( coords.length, pitches.length );
        if( coords.length < pitches.length ) {
            this.chordFingeringFret++;
            return this.computeChordFingeringCoordinates( this.chordFingeringFret, this.chordFingeringString, _intervall );
        }
        // console.log( "dia.computeFIng", coords.toString() );

        this.chordFingeringCoordinates = coords;
    }

    createScaleFingeringCoordinates(): void {
        this.computeScaleFingeringCoordinates(this.chordFingeringFret, this.chordFingeringString);
    }

    computeScaleFingeringCoordinates(_fret: number, _string: number): void {

        if (this.chordFingering == null) return;
        if (this.scale == null) return;
        if (this.root == null) return;
        // console.log("------------------------start compute ScaleFing fret:", _fret, _string);

        //         if (_string == undefined) {
        //             _string = this.getInstrument().pitch().length - 1;
        //         }

        // let min = Math.min( this.chord.intervall().length, this.chordFingering.fingering().length );
        // console.log( "min: ", this.chord.intervall().length, this.chordFingering.fingering().length );
        // _string = Math.max( _string, min-1 );

        //vvvv create chord pitches
        var pitches: number[] = [];
        for (var i = 0; i < this.scale.intervall().length; i++) {
            pitches.push((this.root.pitch() + this.scale.intervallAt(i)!.halfstep()) % 12);
        }
        // console.log(this.chordFingering.fingering(), " : ", pitches.toString());
        ////^^^

        var coords: FretboardCoord[] = [];

        ////vvvvv find startfret/-pitch
        var startPitch: Pitch | null = null;
        // var startFret: number = -1;
        var p;
        for (var fret = _fret; fret <= this.getInstrument().fretNum(); fret++) {
        if( this.instrument.pitchAt(_string) == null ) return;
            p = musicDefinition.pitch(this.instrument.pitchAt(_string)!.index() + fret);
            if( p == null ) continue;
            // console.log( "search start", p, p.pitch() );
            if (pitches.includes(p.pitch())) {
                startPitch = p;
                // startFret = fret;
                // coords.push([fret, _string]);
                // console.log("startpitch found: ", startPitch, " at fret ", startFret);
                break;
            }
        }
        ////^^^^^^
        if (startPitch == null) return;

        ///vvvvvvv build chord from startPitch
        var pIndex: number = pitches.indexOf(startPitch.pitch());
        var tempPitches: number[] = [];
        for (var i: number = 0; i < pitches.length; i++) {
            tempPitches.push(pitches[(pIndex + i) % pitches.length]!);
        }
        pitches = tempPitches;
        // console.log("rotated:", tempPitches);
        ///^^^^^^

        tempPitches = []; // temporary
        ///vvvvvvv order pitches to fingering
        // for (var i = 0; i < pitches.length; i++) {
        for (var i: number = 0; i < this.chordFingering.fingering().length; i++) {
            // console.log( this.chordFingering.fingeringAt(i % pitches.length) );
            if( this.chordFingering.fingeringAt(i % pitches.length) == null ) return;
            if( pitches[this.chordFingering.fingeringAt(i % pitches.length)!] == null ) continue;
            tempPitches.push(pitches[this.chordFingering.fingeringAt(i % pitches.length)!]!);
        }
        pitches = tempPitches;
        // console.log("rotated:", tempPitches);
        //////^^^^


        // console.log( "---------------------", _string );
        //////////find coords
        var pitchIndex: number = 0;
        for (var saite: number = _string; saite >= 0; saite--) {
            if( this.instrument.pitchAt(saite) == null ) continue;
            var stringIndex: number = this.instrument.pitchAt(saite)!.index();
            for (var fret: number = _fret; fret <= this.getInstrument().fretNum() && fret < _fret + 5; fret++) {
                // if( saite == 5 ) {
                // console.log( "check:", saite, fret, pitches[pitchIndex], musicDefinition.pitch( stringIndex + fret ).pitch() );
                // }
                if( musicDefinition.pitch(stringIndex + fret) == null ) continue;
                if (pitches[pitchIndex] == musicDefinition.pitch(stringIndex + fret)!.pitch()) {
                    coords.push({
                        fret: fret,
                        saite: saite
                    }); //[fret, saite]);
                    pitchIndex++;
                    break;
                }

            }
        }
        // console.log( coords.length, pitches.length );
        // if( coords.length < pitches.length ) {
        //     this.chordFingeringFret++;
        //     return this.computeChordFingeringCoordinates( this.chordFingeringFret, this.chordFingeringString );
        // }
        // console.log( "dia.computeFIng", coords.toString() );

        this.scaleFingeringCoordinates = coords;
    }

    getName(): string {
        // console.log(this.getRoot());
        let name : string = "";
        if (this.getRoot() != null ) {
        name = this.getRoot()!.name();
        }
        if (this.getChord() != null ) {
            name += " " + this.getChord()!.name()
        }
        if (this.getScale() != null ) {
            name += " " + this.getScale()!.name();
        }
        return name;
    }
    handleMouse(_x: number, _y: number ) {
        var rect: Rect = this.getBoundingRect();
        // console.log( _x, _y, rect );
        if (_x < rect.x || _y < rect.y || _x > rect.w || _y > rect.h) {
            return false;
        }
        return true;
    }

setCallbackOnMouseClick( _func : callbackMouseClickType ) {
    this.callbackOnMouseClick = _func;
}

    mouseUp( _evt: MouseEvent ) {
        if( this.canvas == null ) return;
        var rect: DOMRect = this.canvas.getBoundingClientRect();
        let x: number = _evt.clientX - rect.left;
        let y: number = _evt.clientY - rect.top;

        if (!this.handleMouse(x, y)) {
            return;
        }

        let coord: FretboardCoord = this.posToCoord(x, y)
        // console.log( x, y, this.yPos, coord );

if( this.mouseClickBehaviour == MouseClickBehaviour.CALLBACK ) {
    if( this.callbackOnMouseClick != null ) {
        let pitch = musicDefinition.pitch( this.instrument.pitchAt( coord.saite )!.index() + coord.fret );
        this.callbackOnMouseClick( coord, pitch );
    }
    return;
}

        // this.mouseClickBehaviour = 'CUSTOM'; //'SETCHORDFINGERING'
        if (this.mouseClickBehaviour == MouseClickBehaviour.SETCHORDFINGERING) {
            // console.log( "SetChordFingFret");
            this.chordFingeringString = coord.saite;
            this.setChordFingeringFret(coord.fret);
            return;
        }

        let found: number = -1;
        for (let i: number = 0; i < this.customCoordinates.length; i++) {
            // console.log( coord, this.customCoordinates[i] );
            if (isEqualFretboardCoord(coord, this.customCoordinates[i]!)) {
                // console.log( "mouseDonw", "found" );
                found = i;
                break;
            }
        }
        if (found >= 0) {
            this.customCoordinates.splice(found, 1);
        } else {
            this.customCoordinates.push(coord);
        }

        this.update();
    }

    posToCoord(_x: number, _y: number): FretboardCoord {
        var coord: FretboardCoord = {
            fret: -1,
            saite: -1
        };
        if (_x < this.fretboardLeft) {
            _x = 0;
        } else {
            _x -= this.fretboardLeft;
            _x /= this.fretDelta;
            _x += 1
        }

        coord.fret = Math.floor(_x);

        _y -= this.fretboardTop;
        _y += this.stringDelta / 2;
        _y /= this.stringDelta;
        coord.saite = Math.floor(_y);
        return coord;
    }

    coordToPos(_coord: FretboardCoord): ScreenPos {
        var pos: ScreenPos = {
            x: -1,
            y: -1
        };
        if (_coord.fret == 0) {
            pos.x = this.fretboardLeft - this.fingerWidth;
        } else {
            pos.x = _coord.fret * this.fretDelta + this.fretboardLeft - this.fretDelta / 2;
        }
        pos.y = _coord.saite * this.stringDelta + this.fretboardTop;
        return pos;
    }

    updateDimension() {
        this.fretboardTop = this.fingerWidth + this.yPos;
        this.fretboardBottom = this.fretboardTop + (this.instrument.pitch().length - 1) * this.stringDelta;
        this.fretboardLeft = (this.fingerWidth * 2) + this.xPos;
        this.fretboardRight = this.fretboardLeft + this.instrument.fretNum() * this.fretDelta;

        this.m_width = this.fretboardRight - this.xPos;
        // this.m_width /= 2 ;
        this.m_height = this.fretboardBottom + this.fingerWidth;
        this.m_height -= this.fretboardTop - this.fingerWidth;
        // set attributes before drawing

        // const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        // console.log( "updateDim", width, this.m_width );

        // this.m_width = Math.min( width, width );

        if (this.canvas == undefined) return;
        this.canvas.setAttribute("width", this.m_width + "px");
        this.canvas.setAttribute("height", this.m_height + "px");
    }

    getBoundingRect() : Rect {
        var rect: Rect = {x: 0, y: 0, w: 0, h: 0 };
        rect.x = this.xPos;
        rect.y = this.yPos;
        rect.w = this.xPos + this.getWidth();
        rect.h = this.yPos + this.getHeight();
        return rect;
    }

    getHeight(): number {
        return this.m_height;
    }

    getWidth(): number {
        return this.m_width;
    }

    setXPos(_x: number): void {
        this.xPos = _x;
        this.updateDimension();
    }
    getXPos(): number {
        return this.xPos;
    }
    getYPos(): number {
        return this.yPos;
    }
    setYPos(_y: number) {
        this.yPos = _y;
        this.updateDimension();
    }

    drawFretboard(): void {
        if( this.ctx == null ) return;

        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'black';

        let x: number = this.fingerWidth * 2;
        let y: number = this.fingerWidth;
        x += this.xPos;
        y += this.yPos;

        // Zeichne die Bünde
        for (let i: number = 0; i <= this.instrument.fretNum(); i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, this.fretboardBottom);
            this.ctx.stroke();
            x += this.fretDelta;
        }

        // Zeichne die Saiten
        x = this.fingerWidth * 2;
        for (let i in this.instrument.pitch()) {
            // console.log(i);
            let name: string = this.instrument.pitch()[i]!.name();
            let charH: number = this.ctx.measureText(name).actualBoundingBoxAscent + this.ctx.measureText(name).actualBoundingBoxDescent;
            this.ctx.fillText(name, 0, y + (charH / 2));
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(this.fretboardRight, y);
            this.ctx.stroke();
            y += this.stringDelta;
        }

        //Inlays
        this.ctx.fillStyle = '#AAAAAA'; // Farbe der Inlays
        y = this.fretboardTop + (this.fretboardBottom - this.fretboardTop) / 2;
        var inlayDim: number = this.fingerWidth * 1;
        for (let i: number = 0; i <= this.instrument.fretNum(); i++) {
            let fret: number = i % 12;
            if (fret == 3 || fret == 5 || fret == 7 || fret == 9) {
                x = this.fretboardLeft + (i * this.fretDelta) - this.fretDelta / 2;

                this.ctx.beginPath();
                this.ctx.arc(x, y, inlayDim, 0, 2 * Math.PI);
                this.ctx.fill();

            } else if (i > 0 && fret == 0) {
                x = this.fretboardLeft + (i * this.fretDelta) - this.fretDelta / 2;
                this.ctx.roundRect(x - inlayDim, y - 2 * inlayDim, 2 * inlayDim, 4 * inlayDim, inlayDim);
                this.ctx.fill();
            }

        }
    }

    //all fingers
    drawFingers() {
        let x: number = 0;
        let y: number = this.fingerWidth;
        y += this.yPos;
        for (var i: number = 0; i < this.instrument.pitch().length; i++) {
            for (let j: number = 0; j < this.instrument.fretNum() + 1; j++) {
                if (j == 0) {
                    x = this.fretDelta / 2 - this.fingerWidth;
                    continue;
                } else if (j == 1) {
                    x = 2 * this.fingerWidth + this.fretDelta / 2;
                }
                x += this.xPos;
                if( this.instrument.pitchAt(i) == null || musicDefinition.pitch(this.instrument.pitchAt(i)!.index() + j) == null ) continue;
                let name: string = musicDefinition.pitch(this.instrument.pitchAt(i)!.index() + j)!.name();
                this.drawFinger(x, y, name, this.fingerColorCustom);

                x += this.fretDelta;
            }
            y += this.stringDelta;
        }
    }

    drawFinger(_x: number, _y: number, name: string, _color: Color) {
        if( this.ctx == null ) return;
        this.ctx.font = '16px Arial';

        this.ctx.beginPath();
        this.ctx.fillStyle = _color;
        this.ctx.arc(_x, _y, this.fingerWidth, 0, 2 * Math.PI);
        this.ctx.fill();

        if( this.m_drawFingerLabel == FingerLabel.NONE ) return;

        let charW = this.ctx.measureText(name).width;
        let charH = this.ctx.measureText(name).actualBoundingBoxAscent + this.ctx.measureText(name).actualBoundingBoxDescent;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(name, _x - (charW / 2), _y + (charH / 2));
    }

    drawCoords(_coords: FretboardCoord[], _color: Color) {
        let pos: ScreenPos;
        for (let i = 0; i < _coords.length; i++) {
            pos = this.coordToPos(_coords[i]!);
            //   console.log( "drawFinger", pos, this.customCoordinates[i] );
            if( this.instrument.pitchFromCoord(_coords[i]!) == null ) continue;
            this.drawFinger(pos.x, pos.y, this.instrument.pitchFromCoord(_coords[i]!)!.name(), _color);
        }
    }

    drawScale(_scale: IntervallArray, _color: Color) {
        if (_scale == null) return;
        if( this.root == null ) return;
        let pitches = [];
        // console.log( this.scale.intervall() );
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < _scale.intervall().length; j++) {
                //  console.log( "drawScale", this.scale.intervallAt(j) );
                if( _scale.intervallAt(j) == null ) continue;
                if (i == _scale.intervallAt(j)!.halfstep()) {
                    if( musicDefinition.pitch(this.root.index() + i) == null ) continue;
                    pitches.push( musicDefinition.pitch(this.root.index() + i )!.pitch());
                }
            }
        }
        // console.log( "drawScale", pitches );

        let x;
        let y = this.fingerWidth;
        y += this.yPos;
        let p;
        for (var i = 0; i < this.instrument.pitch().length; i++) {
            for (let j = 0; j < this.instrument.fretNum() + 1; j++) {
                if( this.instrument.pitchAt(i) == null ) continue;
                p = musicDefinition.pitch( this.instrument.pitchAt(i)!.index() + j )
                if( p == null ) continue;
                if (!pitches.includes( p.pitch() )) continue;


                if (j == 0) {
                    x = this.fretDelta / 2 - this.fingerWidth;
                } else {
                    x = this.fretboardLeft + (j * this.fretDelta) - (this.fretDelta / 2);
                }
                x += this.xPos;
                if( this.instrument.pitchAt(i) == null ) continue;
                if( musicDefinition.pitch(this.instrument.pitchAt(i)!.index() + j) == null ) continue;
                let name = musicDefinition.pitch(this.instrument.pitchAt(i)!.index() + j)!.name();
                this.drawFinger(x, y, name, _color);

                x += this.fretDelta;
            }
            y += this.stringDelta;
        }

    }

    update() {
        if (this.instrument == null) return;
        if( this.ctx == null ) return;
        // this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.clearRect(this.xPos, this.yPos, this.m_width, this.m_height);

        // this.updateDimension();
        this.drawFretboard();
        //   this.drawFingers();
        if( this.scale != null ) {
            this.drawScale(this.scale, this.fingerColorScale);
        }
        if( this.chord != null ) {
            this.drawScale(this.chord, this.fingerColorChord);
        }
        this.drawScale(musicData.rootArray(), this.fingerColorRoot);
        this.drawCoords(this.chordFingeringCoordinates, '#223366');
        // this.drawCoords(this.scaleFingeringCoordinates, '#44AA99');
        this.drawCoords(this.customCoordinates, this.fingerColorCustom);
    }

    deserialize( _json: string ) {

        var res: any = _json;
        var v: any;
        for (const key in res) {
            // console.log(key, res[key]);
            if (key == 'instrument') {
                // console.log("fdshjflsdfhjk");
                v = musicData.getInstrumentFromJson(res[key]);
                if( v != null ) {
                    this.instrument = v;
                }
                // console.log("dia.instr:", this.instrument );
            }
            if (key == 'root') {
                v = musicDefinition.getPitchFromJson(res[key]);
                if( v != null ) {
                    this.root = v;
                }
                // console.log("dia.root:", this.root );
            }
            if (key == 'chord') {
                v = musicData.getChordFromJson(res[key]);
                if( v != null ) {
                    this.chord = v;
                }
                // console.log("dia.chord:", this.chord );
            }
            if (key == 'scale') {
                v = musicData.getScaleFromJson(res[key]);
                if( v != null ) {
                    this.scale = v;
                }
                // console.log("dia.scale:", this.scale );
            }
            if (key == 'chordFingering') {
                v = musicData.getChordFingeringFromJson(res[key]);
                if( v != null ) {
                    this.chordFingering = v;
                }
            }
            if (key == 'chordFingeringString') {
                this.chordFingeringString = res[key];
            }
            if (key == 'chordFingeringFret') {
                this.chordFingeringFret = res[key];
            }
            if (key == 'scaleFingering') {
                v = musicData.getScaleFingeringFromJson(res[key]);
                // console.log( "fdsdf", res[key] );
                if( v != null ) {
                    this.scaleFingering = v;
                }
            }
            if (key == 'mouseClickBehaviour') {
                this.mouseClickBehaviour = res[key];
            }
            if (key == 'customCoordinates') {
                // console.log("custom", res[key] );
                this.customCoordinates = res[key];
            }
        }
    }


}

export function adaptDiagramWidth( _canvas: HTMLElement | null, _scroll: HTMLElement | null ) {
    if ( _canvas == null || _scroll == null) return;
    var windowW: number = document.body.clientWidth - 40; //window.innerWidth;
    // var scrollW = scrollDiagramCanvas.getBoundingClientRect().width;
    var canvasW: number = _canvas.getBoundingClientRect().width;
    // console.log( "logic dia editor.resize", windowW, scrollW, canvasW );
    if (windowW > canvasW) {
        // console.log("logicDiaEdit maxW");
        _scroll.style.width = canvasW + 'px';
    } else {
        // console.log("logicDiaEdit apaptW");
        _scroll.style.width = windowW + 'px';
    }
    // console.log( "adaptEditorSize" );
}