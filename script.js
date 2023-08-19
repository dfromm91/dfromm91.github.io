const cardContainer = document.querySelector('.cardContainer');
const cards = []; 
const rank = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'] 
const suit = ["♣","♦","♥","♠"]

const slot1 = document.querySelector('.slot1')
const slot2 = document.querySelector('.slot2')
const slot3 = document.querySelector('.slot3')
const slot4 = document.querySelector('.slot4')
const cut = document.querySelector('.cut')


let beingDragged;
let hand=[];
let deck=[];
let containerSlots=[];
let target;
let duplicates=[];
let noduplicates=[];
let seqPoints=0;
let runPoints=0;
let multiplier=1;
let fifteensPoints=0;
let finalPoints=[] //runs,pairs,15s,flush,nobs
let suitArr=[];
let cutt;
let flushPoints=0;
let pairPoints=0;
let nobsPoints=0;
var checkbox = document.getElementById("crib");
var crib = checkbox.checked;
let toMatch;
let cutless=[];
let rankArr=[];
let runSet=[];

checkbox.addEventListener("click", function() {

    if (crib) {
        crib=false;
    } else {crib=true}
    
});


for (let i = 0; i < 4; i++) { // 4 rows
    for (let j = 0; j < 13; j++) { // 13 columns
        const containerSlot= document.createElement('div')
        containerSlot.classList.add('containerSlot')
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML=rank[j]+suit[i]; 
        card.setAttribute('draggable','true')
        cardContainer.appendChild(containerSlot);
        containerSlot.appendChild(card);
        
        if (i===1 || i===2){
            card.classList.add('redCard')
        }
      
        let cardData={
            element:card,
            home:containerSlot,
            slot:null,
            rank:j+1,
            suit:suit[i],
            inHand:false,
            points:0,
            cut:false,
            keep:true,
        }
        if(j>=9){
            cardData.points=10
        } else{cardData.points=j+1}
        cards.push(cardData)
    }
}

for (i=0; i<52; i++){
    cards[i].element.addEventListener('dragstart', dragStart)

}

function dragStart(e) {
    beingDragged=e.target
}
function dragDrop(e){
    let slot1Bool=slot1.classList.contains('occupied')
    let slot2Bool=slot2.classList.contains('occupied')
    let slot3Bool=slot3.classList.contains('occupied') 
    let slot4Bool=slot4.classList.contains('occupied') 
    let cutBool=cut.classList.contains('occupied') 
    
    
    target=e.target
    
    
     if(target===slot1&&!slot1Bool ||target===slot2&&!slot2Bool ||target===slot3&&!slot3Bool||
                 target===slot4&&!slot4Bool|| target===cut&&!cutBool){
        e.target.innerHTML=""
        e.target.append(beingDragged)
        beingDragged.classList.add('inSlot')
        for (i=0;i<52;i++){
            if (cards[i].element===beingDragged){
                if(cards[i].slot !=null){
                    cards[i].slot.classList.remove('occupied')
                    textBack();
                }
                cards[i].slot=e.target
                
            }
        }
        target.classList.add('occupied')
    }}

  function dragOver(e){
    e.preventDefault();
  }

slot1.addEventListener('drop', dragDrop)
slot1.addEventListener('dragover', dragOver)
slot2.addEventListener('drop', dragDrop)
slot2.addEventListener('dragover', dragOver)
slot3.addEventListener('drop', dragDrop)
slot3.addEventListener('dragover', dragOver)
slot4.addEventListener('drop', dragDrop)
slot4.addEventListener('dragover', dragOver)
cut.addEventListener('drop', dragDrop)
cut.addEventListener('dragover', dragOver)

cardContainer.addEventListener('dragenter', putBack)
function textBack(){
    if (cards[i].slot===slot1){
        cards[i].slot.innerHTML="card 1"
   }
   if (cards[i].slot===slot2){
    cards[i].slot.innerHTML="card 2"
    }
    if (cards[i].slot===slot3){
        cards[i].slot.innerHTML="card 3"
   }
   if (cards[i].slot===slot4){
    cards[i].slot.innerHTML="card 4"
    }
    if (cards[i].slot===cut){
        cards[i].slot.innerHTML="cut"
    } 
}

function putBack(e){
    if(beingDragged.classList.contains('inSlot')){
        beingDragged.classList.remove('inSlot')
        for(i=0; i<52; i++){
            if(cards[i].element===beingDragged){
                cards[i].home.appendChild(beingDragged)
                cards[i].slot.classList.remove('occupied')
                textBack();
                cards[i].slot=null
              
            }
       
        }
    }
}

function calculate(){
    
    
    function getHand(){
    for(i=0; i<52; i++){
        if(cards[i].slot!=null){
            if(cards[i].slot==cut){cards[i].cut=true;}
            hand.push(cards[i])
        }
    }
    hand.sort(function(a, b){return a.rank-b.rank});
    }
    
    function runs(){
       
        for (i=0; i<4; i++){
            if(hand[i+1].rank===hand[i].rank){
             hand[i].keep=false;
             hand[i+1].keep=false;  
            }

        }
        for(i=0;i<5;i++){
            if(hand[i].keep===false){
                duplicates.push(hand[i].rank)
            }
            rankArr.push(hand[i].rank)
        }
        noduplicates=[...new Set(rankArr)]

        if(noduplicates.length>2){
            for(i=0; i<noduplicates.length-2; i++){
                if(noduplicates[i+2]- noduplicates[i+1]==1 && noduplicates[i+1] - noduplicates[i]==1){
                    seqPoints++;
                    runSet.push(noduplicates[i])
                    runSet.push(noduplicates[i+1])
                    runSet.push(noduplicates[i+2])
                }
            }
            if(duplicates.length>0  && runSet.includes(duplicates[0]) ){
                multiplier=duplicates.length}
            
            if(seqPoints>0){runPoints=(seqPoints+2)*multiplier}
                
        }else{runPoints=0}
        
        for(i=0; i<5; i++){
            hand[i].keep=true
         }
       finalPoints.push(runPoints)
    }

    function pairs(){
        if(new Set(duplicates).size==1){
            if(duplicates.length==2){pairPoints=2}
            if(duplicates.length==3){pairPoints=6}
            if(duplicates.length==4){pairPoints=12}
        }
        if(new Set(duplicates).size==2 &&duplicates.length==4)
            {pairPoints=4}

        if(new Set(duplicates).size==2 &&duplicates.length==5)
            {pairPoints=8}            
        if(duplicates.length=0){
            pairPoints=0
        }
        finalPoints.push(pairPoints)
    }
    function fifteens(){
        let keys=[];
        let sum=0;
        for (i=0; i<5; i++){
            keys[i]=hand[i].points;
        }
        function recursive(need, s, a) {
            if(need==0) {
                var b = a.slice(0);
                set.push(b);
                return;
            }
            for( var i=s; i < keys.length; i++ ){
                var b = a.slice(0);
                b.push(keys[i]); 
                recursive(need-1, i+1, b);
            }
        }

            var set = []; 
            recursive(2, 0, []);
            for (i=0; i<set.length;i++){
                if(set[i][0]+set[i][1]==15){
                    fifteensPoints+=2;
                }
            }
            recursive(3, 0, []);
            for(i=0; i<set.length; i++){
                if (set[i][0]+set[i][1]+set[i][2]==15){
                    fifteensPoints+=2;
                }
            }
            recursive(4, 0, []);
            for(i=0; i<set.length; i++){
                if (set[i][0]+set[i][1]+set[i][2]+set[i][3]==15){
                    fifteensPoints+=2;
                }
            }
            for (i=0; i<5; i++){
                
                sum+=hand[i].points;
            }
            if (sum==15){
                fifteensPoints+=2;
            }
      finalPoints.push(fifteensPoints)
    }
    function flush(){
        for(i=0;i<5;i++){
            if(hand[i].cut==false){
            suitArr.push(hand[i].suit)
            }else{cutt=hand[i].suit}
        }
      if (new Set(suitArr).size===1){
            if(crib===true ){
                if(cutt===suitArr[0]){
                flushPoints=5
                }else{flushPoints=0}
            }
            if(crib===false){
                if(cutt===suitArr[0]){
                    flushPoints=5
                }else{flushPoints=4}
            }
        }else{flushPoints=0}
        finalPoints.push(flushPoints)
    }
    function nobs(){
        for(i=0; i<5; i++){
            if (hand[i].cut===true){
                toMatch=hand[i].suit
            }else{cutless.push(hand[i])}
        }
        for(i=0; i<4; i++){
            if (cutless[i].suit===toMatch && cutless[i].rank===11){
                nobsPoints=1
            }
        }
        for(i=0; i<5; i++){
            hand[i].cut=false;
        }
        finalPoints.push(nobsPoints)

    }
    function initVar(){
     beingDragged=null;
     hand=[];
     deck=[];
     containerSlots=[];
     target;
     rankArr=[];
     duplicates=[];
     noduplicates=[];
     seqPoints=0;
     runPoints=0;
     multiplier=1;
     fifteensPoints=0;
     finalPoints=[] //runs,pairs,15s,flush,nobs
     suitArr=[];
     cutt;
     flushPoints=0;
     pairPoints=0;
     nobsPoints=0;
     checkbox = document.getElementById("crib");
     isChecked = false;
     toMatch=null;
     cutless=[];
    }
    function printPoints (){
        document.getElementById('runs').innerHTML="points from runs: "+finalPoints[0]
        document.getElementById('pairs').innerHTML="points from pairs: "+finalPoints[1]
        document.getElementById('fifteens').innerHTML="points from fifteens: "+finalPoints[2]
        document.getElementById('flushes').innerHTML="points from flushes: "+finalPoints[3]
        document.getElementById('nobs').innerHTML="points from nobs: "+finalPoints[4]
        document.getElementById('final').innerHTML="total points: "+(finalPoints[4]+finalPoints[3]+finalPoints[2]+finalPoints[1]+finalPoints[0])
        }

    getHand();
    
    if(hand.length>4){
        runs();
        pairs();
        fifteens();
        flush();
        nobs();
        printPoints();
        initVar();
    } else {
        document.getElementById('runs').innerHTML="Fill in all card slots first!"
        document.getElementById('pairs').innerHTML=" "
        document.getElementById('fifteens').innerHTML=" "
        document.getElementById('flushes').innerHTML=" "
        document.getElementById('nobs').innerHTML=" "
        document.getElementById('final').innerHTML=" " 
        initVar();  
    }
}

// new stuff for mobile
var DragDropTouch;
(function (DragDropTouch_1) {
    'use strict';
    /**
     * Object used to hold the data that is being dragged during drag and drop operations.
     *
     * It may hold one or more data items of different types. For more information about
     * drag and drop operations and data transfer objects, see
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer">HTML Drag and Drop API</a>.
     *
     * This object is created automatically by the @see:DragDropTouch singleton and is
     * accessible through the @see:dataTransfer property of all drag events.
     */
    var DataTransfer = (function () {
        function DataTransfer() {
            this._dropEffect = 'move';
            this._effectAllowed = 'all';
            this._data = {};
        }
        Object.defineProperty(DataTransfer.prototype, "dropEffect", {
            /**
             * Gets or sets the type of drag-and-drop operation currently selected.
             * The value must be 'none',  'copy',  'link', or 'move'.
             */
            get: function () {
                return this._dropEffect;
            },
            set: function (value) {
                this._dropEffect = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "effectAllowed", {
            /**
             * Gets or sets the types of operations that are possible.
             * Must be one of 'none', 'copy', 'copyLink', 'copyMove', 'link',
             * 'linkMove', 'move', 'all' or 'uninitialized'.
             */
            get: function () {
                return this._effectAllowed;
            },
            set: function (value) {
                this._effectAllowed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataTransfer.prototype, "types", {
            /**
             * Gets an array of strings giving the formats that were set in the @see:dragstart event.
             */
            get: function () {
                return Object.keys(this._data);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Removes the data associated with a given type.
         *
         * The type argument is optional. If the type is empty or not specified, the data
         * associated with all types is removed. If data for the specified type does not exist,
         * or the data transfer contains no data, this method will have no effect.
         *
         * @param type Type of data to remove.
         */
        DataTransfer.prototype.clearData = function (type) {
            if (type != null) {
                delete this._data[type];
            }
            else {
                this._data = null;
            }
        };
        /**
         * Retrieves the data for a given type, or an empty string if data for that type does
         * not exist or the data transfer contains no data.
         *
         * @param type Type of data to retrieve.
         */
        DataTransfer.prototype.getData = function (type) {
            return this._data[type] || '';
        };
        /**
         * Set the data for a given type.
         *
         * For a list of recommended drag types, please see
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
         *
         * @param type Type of data to add.
         * @param value Data to add.
         */
        DataTransfer.prototype.setData = function (type, value) {
            this._data[type] = value;
        };
        /**
         * Set the image to be used for dragging if a custom one is desired.
         *
         * @param img An image element to use as the drag feedback image.
         * @param offsetX The horizontal offset within the image.
         * @param offsetY The vertical offset within the image.
         */
        DataTransfer.prototype.setDragImage = function (img, offsetX, offsetY) {
            var ddt = DragDropTouch._instance;
            ddt._imgCustom = img;
            ddt._imgOffset = { x: offsetX, y: offsetY };
        };
        return DataTransfer;
    })();
    DragDropTouch_1.DataTransfer = DataTransfer;
    /**
     * Defines a class that adds support for touch-based HTML5 drag/drop operations.
     *
     * The @see:DragDropTouch class listens to touch events and raises the
     * appropriate HTML5 drag/drop events as if the events had been caused
     * by mouse actions.
     *
     * The purpose of this class is to enable using existing, standard HTML5
     * drag/drop code on mobile devices running IOS or Android.
     *
     * To use, include the DragDropTouch.js file on the page. The class will
     * automatically start monitoring touch events and will raise the HTML5
     * drag drop events (dragstart, dragenter, dragleave, drop, dragend) which
     * should be handled by the application.
     *
     * For details and examples on HTML drag and drop, see
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations.
     */
    var DragDropTouch = (function () {
        /**
         * Initializes the single instance of the @see:DragDropTouch class.
         */
        function DragDropTouch() {
            this._lastClick = 0;
            // enforce singleton pattern
            if (DragDropTouch._instance) {
                throw 'DragDropTouch instance already created.';
            }
            // listen to touch events
            if ('ontouchstart' in document) {
                var d = document, ts = this._touchstart.bind(this), tm = this._touchmove.bind(this), te = this._touchend.bind(this);
                d.addEventListener('touchstart', ts);
                d.addEventListener('touchmove', tm);
                d.addEventListener('touchend', te);
                d.addEventListener('touchcancel', te);
            }
        }
        /**
         * Gets a reference to the @see:DragDropTouch singleton.
         */
        DragDropTouch.getInstance = function () {
            return DragDropTouch._instance;
        };
        // ** event handlers
        DragDropTouch.prototype._touchstart = function (e) {
            var _this = this;
            if (this._shouldHandle(e)) {
                // raise double-click and prevent zooming
                if (Date.now() - this._lastClick < DragDropTouch._DBLCLICK) {
                    if (this._dispatchEvent(e, 'dblclick', e.target)) {
                        e.preventDefault();
                        this._reset();
                        return;
                    }
                }
                // clear all variables
                this._reset();
                // get nearest draggable element
                var src = this._closestDraggable(e.target);
                if (src) {
                    // give caller a chance to handle the hover/move events
                    if (!this._dispatchEvent(e, 'mousemove', e.target) &&
                        !this._dispatchEvent(e, 'mousedown', e.target)) {
                        // get ready to start dragging
                        this._dragSource = src;
                        this._ptDown = this._getPoint(e);
                        this._lastTouch = e;
                        e.preventDefault();
                        // show context menu if the user hasn't started dragging after a while
                        setTimeout(function () {
                            if (_this._dragSource == src && _this._img == null) {
                                if (_this._dispatchEvent(e, 'contextmenu', src)) {
                                    _this._reset();
                                }
                            }
                        }, DragDropTouch._CTXMENU);
                    }
                }
            }
        };
        DragDropTouch.prototype._touchmove = function (e) {
            if (this._shouldHandle(e)) {
                // see if target wants to handle move
                var target = this._getTarget(e);
                if (this._dispatchEvent(e, 'mousemove', target)) {
                    this._lastTouch = e;
                    e.preventDefault();
                    return;
                }
                // start dragging
                if (this._dragSource && !this._img) {
                    var delta = this._getDelta(e);
                    if (delta > DragDropTouch._THRESHOLD) {
                        this._dispatchEvent(e, 'dragstart', this._dragSource);
                        this._createImage(e);
                        this._dispatchEvent(e, 'dragenter', target);
                    }
                }
                // continue dragging
                if (this._img) {
                    this._lastTouch = e;
                    e.preventDefault(); // prevent scrolling
                    if (target != this._lastTarget) {
                        this._dispatchEvent(this._lastTouch, 'dragleave', this._lastTarget);
                        this._dispatchEvent(e, 'dragenter', target);
                        this._lastTarget = target;
                    }
                    this._moveImage(e);
                    this._dispatchEvent(e, 'dragover', target);
                }
            }
        };
        DragDropTouch.prototype._touchend = function (e) {
            if (this._shouldHandle(e)) {
                // see if target wants to handle up
                if (this._dispatchEvent(this._lastTouch, 'mouseup', e.target)) {
                    e.preventDefault();
                    return;
                }
                // user clicked the element but didn't drag, so clear the source and simulate a click
                if (!this._img) {
                    this._dragSource = null;
                    this._dispatchEvent(this._lastTouch, 'click', e.target);
                    this._lastClick = Date.now();
                }
                // finish dragging
                this._destroyImage();
                if (this._dragSource) {
                    if (e.type.indexOf('cancel') < 0) {
                        this._dispatchEvent(this._lastTouch, 'drop', this._lastTarget);
                    }
                    this._dispatchEvent(this._lastTouch, 'dragend', this._dragSource);
                    this._reset();
                }
            }
        };
        // ** utilities
        // ignore events that have been handled or that involve more than one touch
        DragDropTouch.prototype._shouldHandle = function (e) {
            return e &&
                !e.defaultPrevented &&
                e.touches && e.touches.length < 2;
        };
        // clear all members
        DragDropTouch.prototype._reset = function () {
            this._destroyImage();
            this._dragSource = null;
            this._lastTouch = null;
            this._lastTarget = null;
            this._ptDown = null;
            this._dataTransfer = new DataTransfer();
        };
        // get point for a touch event
        DragDropTouch.prototype._getPoint = function (e, page) {
            if (e && e.touches) {
                e = e.touches[0];
            }
            return { x: page ? e.pageX : e.clientX, y: page ? e.pageY : e.clientY };
        };
        // get distance between the current touch event and the first one
        DragDropTouch.prototype._getDelta = function (e) {
            var p = this._getPoint(e);
            return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
        };
        // get the element at a given touch event
        DragDropTouch.prototype._getTarget = function (e) {
            var pt = this._getPoint(e), el = document.elementFromPoint(pt.x, pt.y);
            while (el && getComputedStyle(el).pointerEvents == 'none') {
                el = el.parentElement;
            }
            return el;
        };
        // create drag image from source element
        DragDropTouch.prototype._createImage = function (e) {
            // just in case...
            if (this._img) {
                this._destroyImage();
            }
            // create drag image from custom element or drag source
            var src = this._imgCustom || this._dragSource;
            this._img = src.cloneNode(true);
            this._copyStyle(src, this._img);
            this._img.style.top = this._img.style.left = '-9999px';
            // if creating from drag source, apply offset and opacity
            if (!this._imgCustom) {
                var rc = src.getBoundingClientRect(), pt = this._getPoint(e);
                this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
                this._img.style.opacity = DragDropTouch._OPACITY.toString();
            }
            // add image to document
            this._moveImage(e);
            document.body.appendChild(this._img);
        };
        // dispose of drag image element
        DragDropTouch.prototype._destroyImage = function () {
            if (this._img && this._img.parentElement) {
                this._img.parentElement.removeChild(this._img);
            }
            this._img = null;
            this._imgCustom = null;
        };
        // move the drag image element
        DragDropTouch.prototype._moveImage = function (e) {
            var _this = this;
            requestAnimationFrame(function () {
                var pt = _this._getPoint(e, true), s = _this._img.style;
                s.position = 'absolute';
                s.pointerEvents = 'none';
                s.zIndex = '999999';
                s.left = Math.round(pt.x - _this._imgOffset.x) + 'px';
                s.top = Math.round(pt.y - _this._imgOffset.y) + 'px';
            });
        };
        // copy properties from an object to another
        DragDropTouch.prototype._copyProps = function (dst, src, props) {
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                dst[p] = src[p];
            }
        };
        DragDropTouch.prototype._copyStyle = function (src, dst) {
            // remove potentially troublesome attributes
            DragDropTouch._rmvAtts.forEach(function (att) {
                dst.removeAttribute(att);
            });
            // copy canvas content
            if (src instanceof HTMLCanvasElement) {
                var cSrc = src, cDst = dst;
                cDst.width = cSrc.width;
                cDst.height = cSrc.height;
                cDst.getContext('2d').drawImage(cSrc, 0, 0);
            }
            // copy style
            var cs = getComputedStyle(src);
            for (var i = 0; i < cs.length; i++) {
                var key = cs[i];
                dst.style[key] = cs[key];
            }
            dst.style.pointerEvents = 'none';
            // and repeat for all children
            for (var i = 0; i < src.children.length; i++) {
                this._copyStyle(src.children[i], dst.children[i]);
            }
        };
        DragDropTouch.prototype._dispatchEvent = function (e, type, target) {
            if (e && target) {
                var evt = document.createEvent('Event'), t = e.touches ? e.touches[0] : e;
                evt.initEvent(type, true, true);
                evt.button = 0;
                evt.which = evt.buttons = 1;
                this._copyProps(evt, e, DragDropTouch._kbdProps);
                this._copyProps(evt, t, DragDropTouch._ptProps);
                evt.dataTransfer = this._dataTransfer;
                target.dispatchEvent(evt);
                return evt.defaultPrevented;
            }
            return false;
        };
        // gets an element's closest draggable ancestor
        DragDropTouch.prototype._closestDraggable = function (e) {
            for (; e; e = e.parentElement) {
                if (e.hasAttribute('draggable')) {
                    return e;
                }
            }
            return null;
        };
        /*private*/ DragDropTouch._instance = new DragDropTouch(); // singleton
        // constants
        DragDropTouch._THRESHOLD = 5; // pixels to move before drag starts
        DragDropTouch._OPACITY = 0.5; // drag image opacity
        DragDropTouch._DBLCLICK = 500; // max ms between clicks in a double click
        DragDropTouch._CTXMENU = 900; // ms to hold before raising 'contextmenu' event
        // copy styles/attributes from drag source to drag image element
        DragDropTouch._rmvAtts = 'id,class,style,draggable'.split(',');
        // synthesize and dispatch an event
        // returns true if the event has been handled (e.preventDefault == true)
        DragDropTouch._kbdProps = 'altKey,ctrlKey,metaKey,shiftKey'.split(',');
        DragDropTouch._ptProps = 'pageX,pageY,clientX,clientY,screenX,screenY'.split(',');
        return DragDropTouch;
    })();
    DragDropTouch_1.DragDropTouch = DragDropTouch;
})(DragDropTouch || (DragDropTouch = {}));
//# sourceMappingURL=DragDropTouchNoWijmo.js.map


