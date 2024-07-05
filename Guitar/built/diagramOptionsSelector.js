import { musicData, FingeringType } from "./MusicDefinitions.js";
import { MouseClickBehaviour } from "./Diagram.js";
const template = document.createElement('template');
template.innerHTML = `
<style>
#chordFingeringFret {
width: 40px;
}

 .mydropdown{
         display:inline;max-width:20%;
         font-weight: 600;
         cursor: pointer;  
    }
    .mydropdown:hover , .myoption:active , .myoption:checked{
       //  border:2px dotted green;
    }
.myOptionItalic{
font-weight: 100;
 font-style: italic;
}

    .myoption{
         font-style: normal;
         font-weight: 200;
    }
    .mydropdown .myoption:checked,
    .mydropdown .myoption:hover ,
    .mydropdown .myoption:active {
        font-weight: 600;
     }

</style>
  <select class="mydropdown" id="chordFingering"></select>
  <select class="mydropdown" id="chordFingeringString"></select>
  <input type="number" id="chordFingeringFret" min="0" max="24" value = "0" />

  <select class="mydropdown" id="scaleFingering"></select>
  `;
// create a class, and clone the content of the template into it
export class DiagramOptionsSelector extends HTMLElement {
    constructor() {
        super();
        this.chordFingeringSelect = null;
        this.chordFingeringStringSelect = null;
        this.chordFingeringFretInput = null;
        this.scaleFingeringSelect = null;
        this.mouseBehaviourSelect = null;
        this.instrument = null;
        this.callbackOnChordFingeringChange = null;
        this.callbackOnChordStringChange = null;
        this.callbackOnChordFretChange = null;
        this.callbackOnScaleFingeringChange = null;
        this.callbackOnScaleChange = null;
        this.callbackOnMouseBehaviourChange = null;
        // console.log("DiagramOptionsSelector");
    }
    connectedCallback() {
        this.attachShadow({
            mode: 'open'
        });
        if (this.shadowRoot == null)
            return;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        // console.log("DiagramOptionsSelector.connected");
        this.chordFingeringSelect = this.shadowRoot.getElementById('chordFingering');
        this.chordFingeringSelect.addEventListener('change', this.onChordFingeringChange.bind(this), false);
        this.chordFingeringStringSelect = this.shadowRoot.getElementById('chordFingeringString');
        this.chordFingeringStringSelect.addEventListener('change', this.onChordStringChange.bind(this), false);
        this.chordFingeringFretInput = this.shadowRoot.getElementById('chordFingeringFret');
        this.chordFingeringFretInput.addEventListener('change', this.onChordFretChange.bind(this), false);
        this.scaleFingeringSelect = this.shadowRoot.getElementById('scaleFingering');
        this.scaleFingeringSelect.addEventListener('change', this.onScaleFingeringChange.bind(this), false);
        this.mouseBehaviourSelect = this.shadowRoot.getElementById('mouseBehaviour');
        this.shadowRoot.addEventListener('change', this.onMouseBehaviourChange.bind(this), false);
        this.fillChordFingeringContent();
        this.fillChordStringContent();
        this.fillScaleFingeringContent();
    }
    setInstrument(_instr) {
        // console.log( _instr );
        this.instrument = _instr;
        this.fillChordStringContent();
    }
    setCallbackOnChordFingeringChange(_function) {
        this.callbackOnChordFingeringChange = _function;
    }
    onChordFingeringChange() {
        if (this.chordFingeringSelect == null)
            return;
        const index = parseInt(this.chordFingeringSelect.value);
        // console.log( "onCHordFingChange ", index );
        // if (this.mouseBehaviourSelect != null) {
        //     if (index < 0) {
        //         this.mouseBehaviourSelect.disabled = true;
        //         this.mouseBehaviourSelect.selectedIndex = 0;
        //     } else {
        //         this.mouseBehaviourSelect.disabled = false;
        //     }
        // }
        if (index < 0) {
            this.setChordFingeringStringSelectDisabled(true);
            this.setMouseBehaviourSelectDisabled(true);
            this.chordFingeringSelect.style.fontStyle = "italic";
            this.chordFingeringSelect.style.fontWeight = "100";
        }
        else {
            this.setChordFingeringStringSelectDisabled(false);
            this.setMouseBehaviourSelectDisabled(false);
            this.chordFingeringSelect.style.fontStyle = "normal";
            this.chordFingeringSelect.style.fontWeight = "600";
        }
        if (this.callbackOnChordFingeringChange == null)
            return;
        if (musicData.chordFingeringAt(index) == null) {
            this.callbackOnChordFingeringChange(null);
        }
        else {
            this.callbackOnChordFingeringChange(musicData.chordFingeringAt(index));
        }
    }
    setCallbackOnChordFingeringStringChange(_function) {
        this.callbackOnChordStringChange = _function;
    }
    onChordStringChange() {
        // const index = this.chordSelect.selectedIndex - 1;
        if (this.chordFingeringStringSelect == null)
            return;
        const index = parseInt(this.chordFingeringStringSelect.value);
        if (this.callbackOnChordStringChange == null)
            return;
        this.callbackOnChordStringChange(index);
    }
    setCallbackOnChordFingeringFretChange(_function) {
        this.callbackOnChordFretChange = _function;
    }
    onChordFretChange() {
        // console.log("fret chnge");
        // const index = this.chordSelect.selectedIndex - 1;
        if (this.chordFingeringFretInput == null)
            return;
        const index = parseInt(this.chordFingeringFretInput.value);
        if (this.callbackOnChordFretChange == null)
            return;
        this.callbackOnChordFretChange(index);
    }
    setCallbackOnScaleFingeringChange(_function) {
        this.callbackOnScaleFingeringChange = _function;
    }
    onScaleFingeringChange() {
        // console.log("Never used");
        if (this.scaleFingeringSelect == null)
            return;
        const index = parseInt(this.scaleFingeringSelect.value);
        // console.log( "Never used", index );
        // if( )
        // this.callbackOnScaleChange( musicData.scaleAt(index) );
        if (this.callbackOnScaleFingeringChange != null) {
            this.callbackOnScaleFingeringChange(musicData.scaleFingeringAt(index));
        }
        if (this.scaleFingeringSelect == null)
            return;
        if (index < 0) {
            this.scaleFingeringSelect.style.fontStyle = "italic";
            this.scaleFingeringSelect.style.fontWeight = "100";
        }
        else {
            this.scaleFingeringSelect.style.fontStyle = "normal";
            this.scaleFingeringSelect.style.fontWeight = "600";
        }
    }
    setCallbackOnMouseBehaviourChange(_function) {
        // console.log( "diaOptSel.setCallbackonMouseBehav");
        this.callbackOnMouseBehaviourChange = _function;
    }
    onMouseBehaviourChange() {
        // console.log( "diaOptSel.onMouseBehav");
        // const v = this.mouseBehaviourSelect.value as MouseClickBehaviour;
        // console.log( v );
        if (this.mouseBehaviourSelect == null)
            return;
        var v = MouseClickBehaviour.CUSTOM;
        // switch ( v ) {
        switch (this.mouseBehaviourSelect.value) {
            case 'SETCHORDFINGERING': {
                v = MouseClickBehaviour.SETCHORDFINGERING;
                break;
            }
            case 'CUSTOM': {
                v = MouseClickBehaviour.CUSTOM;
                break;
            }
        }
        if (this.callbackOnMouseBehaviourChange == null)
            return;
        this.callbackOnMouseBehaviourChange(v);
    }
    fillChordFingeringContent() {
        if (this.chordFingeringSelect == null)
            return;
        const elem = this.chordFingeringSelect;
        var opt = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.setAttribute("class", "myOptionItalic");
        opt.innerHTML = "Chord Fingering";
        elem.add(opt);
        for (var i = 0; i < musicData.chordFingering().length; i++) {
            var opt = document.createElement("option");
            // opt.setAttribute("value", i);
            if (musicData.chordFingeringAt(i) == null)
                continue;
            opt.setAttribute("value", musicData.chordFingeringAt(i).index().toString());
            opt.setAttribute("class", "myoption");
            opt.innerHTML = musicData.chordFingeringAt(i).name() + " (" + musicData.chordFingeringAt(i).getType() + ")";
            elem.add(opt);
        }
    }
    filterChordFingeringContent(_hasChord, _hasScale) {
        // console.log( "filterChordFingering", _hasChord, _hasScale );
        if (this.chordFingeringSelect == null)
            return;
        this.chordFingeringSelect.options.length = 0;
        const elem = this.chordFingeringSelect;
        var opt = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.innerHTML = "Chord Fingering";
        opt.setAttribute("class", "myOptionItalic");
        elem.add(opt);
        for (var i = 0; i < musicData.chordFingering().length; i++) {
            var opt = document.createElement("option");
            // opt.setAttribute("value", i);
            if (musicData.chordFingeringAt(i) == null)
                continue;
            let fing = musicData.chordFingeringAt(i);
            if (!_hasChord && fing.getType() == FingeringType.CHORD || !_hasScale && fing.getType() == FingeringType.SCALE)
                continue;
            opt.setAttribute("value", fing.index().toString());
            opt.setAttribute("class", "myoption");
            opt.innerHTML = fing.name() + " (" + fing.getType() + ")";
            elem.add(opt);
        }
    }
    fillChordStringContent() {
        if (this.instrument == null || this.chordFingeringStringSelect == null) {
            return;
        }
        const elem = this.chordFingeringStringSelect;
        for (var i = 0; i < this.instrument.pitch().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            if (this.instrument.pitchAt(i) == null)
                continue;
            opt.innerHTML = this.instrument.pitchAt(i).name();
            elem.add(opt);
        }
    }
    fillScaleFingeringContent() {
        if (this.scaleFingeringSelect == null)
            return;
        const elem = this.scaleFingeringSelect;
        var opt = document.createElement("option");
        opt.setAttribute('value', '-1');
        opt.setAttribute("class", "myOptionItalic");
        opt.innerHTML = "Scale Fingering";
        elem.add(opt);
        for (var i = 0; i < musicData.scaleFingering().length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i.toString());
            // opt.setAttribute("value", musicData.scaleFingeringAt(i) !.toString());
            opt.setAttribute("class", "myoption");
            if (musicData.scaleFingeringAt(i) == null)
                continue;
            opt.innerHTML = musicData.scaleFingeringAt(i).toString();
            elem.add(opt);
        }
    }
    setDiagram(_dia) {
        // console.log("setDia", _dia.getChord(), _dia.getScale(), _dia.getChordFingering());
        this.updateChordFingeringSelect(_dia);
        this.updateChordFingeringStringSelect(_dia);
        this.updateMouseBehaviourSelect(_dia);
        this.updateScaleFingeringSelect(_dia);
        if (this.chordFingeringStringSelect != null) {
            this.chordFingeringStringSelect.value = _dia.getChordFingeringString().toString();
        }
        if (this.chordFingeringFretInput != null) {
            this.chordFingeringFretInput.value = _dia.getChordFingeringFret().toString();
        }
    }
    updateChordFingeringSelect(_dia) {
        var _a, _c;
        if (_dia.getChord() != null || _dia.getScale() != null) {
            if (this.chordFingeringSelect == null)
                return;
            // this.chordFingeringSelect.disabled = false;
            this.setChordFingeringSelectDisabled(false);
            let hasChord = false;
            if (_dia.getChord() != null)
                hasChord = true;
            let hasScale = false;
            if (_dia.getScale() != null)
                hasScale = true;
            this.filterChordFingeringContent(hasChord, hasScale);
            if (_dia.getChordFingering() != null) {
                if (((_a = _dia.getChordFingering()) === null || _a === void 0 ? void 0 : _a.getType()) == FingeringType.CHORD && _dia.getChord() == null ||
                    ((_c = _dia.getChordFingering()) === null || _c === void 0 ? void 0 : _c.getType()) == FingeringType.SCALE && _dia.getScale() == null) {
                    this.chordFingeringSelect.value = '-1';
                    _dia.setChordFingering(null);
                    this.chordFingeringSelect.style.fontStyle = "italic";
                    this.chordFingeringSelect.style.fontWeight = "100";
                }
                else {
                    this.chordFingeringSelect.value = _dia.getChordFingering().index().toString();
                    this.chordFingeringSelect.style.fontStyle = "normal";
                    this.chordFingeringSelect.style.fontWeight = "600";
                }
            }
        }
        else {
            this.setChordFingeringSelectDisabled(true);
        }
    }
    setChordFingeringSelectDisabled(_b) {
        if (this.chordFingeringSelect == null)
            return;
        this.chordFingeringSelect.disabled = _b;
        if (_b) {
            this.chordFingeringSelect.value = '-1';
            this.chordFingeringSelect.style.fontStyle = "italic";
            this.chordFingeringSelect.style.fontWeight = "100";
        }
    }
    updateChordFingeringStringSelect(_dia) {
        if (_dia.getChordFingering() == null) {
            this.setChordFingeringStringSelectDisabled(true);
        }
        else {
            this.setChordFingeringStringSelectDisabled(false);
        }
        if (this.chordFingeringFretInput != null) {
            this.chordFingeringFretInput.setAttribute("max", _dia.getInstrument().fretNum().toString());
        }
    }
    setChordFingeringStringSelectDisabled(_b) {
        if (this.chordFingeringStringSelect != null) {
            this.chordFingeringStringSelect.disabled = _b;
        }
        if (this.chordFingeringFretInput != null) {
            this.chordFingeringFretInput.disabled = _b;
        }
    }
    updateScaleFingeringSelect(_dia) {
        if (_dia.getScale() == null) {
            this.setScaleFingeringSelectDisabled(true);
        }
        else {
            this.setScaleFingeringSelectDisabled(false);
            if (this.scaleFingeringSelect == null)
                return;
            if (_dia.getScaleFingering() == null) {
                this.scaleFingeringSelect.value = '-1';
                this.scaleFingeringSelect.style.fontStyle = "italic";
                this.scaleFingeringSelect.style.fontWeight = "100";
            }
            else if (this.scaleFingeringSelect != null) {
                this.scaleFingeringSelect.value = musicData.scaleFingeringIndexFromName(_dia.getScaleFingering().toString()).toString();
                this.scaleFingeringSelect.style.fontStyle = "normal";
                this.scaleFingeringSelect.style.fontWeight = "600";
            }
        }
    }
    setScaleFingeringSelectDisabled(_b) {
        if (this.scaleFingeringSelect == null)
            return;
        this.scaleFingeringSelect.disabled = _b;
        if (_b) {
            this.scaleFingeringSelect.value = '-1';
            this.scaleFingeringSelect.style.fontStyle = "italic";
            this.scaleFingeringSelect.style.fontWeight = "100";
        }
    }
    updateMouseBehaviourSelect(_dia) {
        if (_dia.getChordFingering() == null) {
            this.setMouseBehaviourSelectDisabled(true);
        }
        else {
            this.setMouseBehaviourSelectDisabled(false);
        }
    }
    setMouseBehaviourSelectDisabled(_b) {
        if (this.mouseBehaviourSelect == null)
            return;
        this.mouseBehaviourSelect.disabled = _b;
        if (_b) {
            this.mouseBehaviourSelect.selectedIndex = 0;
            // this.mouseBehaviourSelect.value = '-1';
        }
    }
}
// define a custom element called 'nav-bar' using the navBar class
customElements.define('jui-diagramoptionsselector', DiagramOptionsSelector);
//# sourceMappingURL=diagramOptionsSelector.js.map