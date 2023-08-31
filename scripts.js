// when player plays 31, comp turn not initiated
// vvvvvvvvvvvbroken sequences!!vvvvvvvvvv
// p9 c3 pj c4 --> remaining cards in p:q,j remaining cards in c:5,5
let isCrib=false
let peggingUpdates=document.querySelector('p')
let p1beginningpegs=[]
let p2beginningpegs=[]
const p1pegs = document.querySelector('.p1pegs');
const p2pegs = document.querySelector('.p2pegs');
const p1PegArr=[]
const p2PegArr=[]
let round=1;
let toClear=false
for(i=61; i>-1; i--){
    const dot=document.createElement('div')
    dot.classList.add('pegHole')
    p1pegs.appendChild(dot);
    const dot2=document.createElement('div')
    dot2.classList.add('pegHole')
    p2pegs.appendChild(dot2);
    let pegData={
        el: dot,
    }
    let pegData2={
        el: dot2
    }
    let n=(i/2)-1
    let m=(i-3)/2
    if(i!=0 && i!=1 ){
        if((i+1)%2==0){
           // dot.innerHTML=(i-1)/2
            p1PegArr[(i-1)/2]=pegData
           // dot2.innerHTML=60-m
            p2PegArr[60-m]=pegData2
        }
        else{
            // dot.innerHTML=60-n 
            p1PegArr[60-n]=pegData
            // dot2.innerHTML=i/2
            p2PegArr[i/2]=pegData2
        }
    }else {
        pegData.el.classList.add('occupied');
        pegData2.el.classList.add('occupied2')
        p1beginningpegs.push(pegData)
        p2beginningpegs.push(pegData2)
    }

   
}

let butt

butt=document.createElement('button')
butt.innerHTML="nextround"
butt.addEventListener('click',deal)
let going=false
let pOldScore=0
let cOldScore=0
let pPeg =0
let cPeg =0
let playerScore=0;
let compScore=0;

let whoStarts // t means players turn f means comp turn

const cards = []; 
const rank = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'] 
const suit = ["♣","♦","♥","♠"]

let playerHand=[];
let compHand=[];
let loopCount=1;
let deck=[];
let counted=0
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
let toMatch;
let cutless=[];
let rankArr=[];
let runSet=[];

let crib=[];
let cutCard;
let newPlayerHand=[];
let newCompHand=[];
let SET=[]
let selectLim=2

   let playerPeg=[]
   let compPeg=[]
   let discard=[]
   let runningTotal=0;
   let lastScoredPosition = -1;
   let playableIndices=[];
   let Cgo=false;
   let Pgo=false;
   let cCount =0;
   let pCount=0;
//    let whoseTurn;

   let start;  // Declare these outside of the cut function
   let ok;
   let aCut
   let bCut
   let buttonHolder=document.querySelector('.buttonHolder')
   let button=document.createElement('button')
   button.id="button"
   buttonHolder.append(button)
   button.innerHTML="click here to cut deck"
   button.addEventListener('click',cut)
   let deckSpot=document.querySelector('#deck')
   let cribDiv=document.querySelector('.crib')
   let discardDiv=document.querySelector('#pegBox')
   let playerCardsDiv=document.querySelector('.playerCards')
   let x
   let y
   let info=document.querySelector('.info')
   let notiBox = document.querySelector('.notifications');
   let whoseCrib=document.querySelector('h4')


function makeDeck(){
for (let i = 0; i < 4; i++) { // 4 rows
    for (let j = 0; j < 13; j++) { // 13 columns
        let cardData={
            name:rank[j]+suit[i],
            rank:j+1,
            suit:suit[i],
            points:0,
            cut:false,
            keep:true,
            played:false,
            el:null,
            selected:false,
            
        }
        if(j>=9){
            cardData.points=10
        } else{cardData.points=j+1}
        deck.push(cardData)
        loopCount++;
    }
}
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function deal(){
   
    start.remove()
      if(round!=1){  
        // butt.removeEventListener('click',chooseCrib)
        // butt.remove()
        button.removeEventListener('click',deal)
        button.addEventListener('click',chooseCrib)
        button.innerHTML="put in crib"
        let cribKids=cribDiv.querySelectorAll('div')
        let playerCardsKids=playerCardsDiv.querySelectorAll('div')
        let discardDivKids=discardDiv.querySelectorAll('div')
        let opCardsDiv=document.querySelector('.opCards')
        let opCardsKids=opCardsDiv.querySelectorAll('div')
        clearSpace(cribDiv,cribKids)
        clearSpace(discardDiv,discardDivKids)
        clearSpace(opCardsDiv,opCardsKids)
        clearSpace(playerCardsDiv,playerCardsKids)

    //     for(i=0;i<4;i++){
    //     if(compPeg[i]!=undefined){
    //     compPeg[i].el.remove()}
    //     if(playerPeg[i]!=undefined){
    //     playerPeg[i].el.remove()}
    //     if(compHand[i]!=undefined){
    //         compHand[i].el.remove()} 
    //    if(crib[i]!=undefined){crib[i].el.remove()}
    //    if(playerHand[i]!=undefined){playerHand[i].el.remove()}
    //    if(newPlayerHand[i]!=undefined){newPlayerHand[i].el.remove()}
    //    if(newCompHand[i]!=undefined){newCompHand[i].el.remove()}
    // }
    cutCard.el.remove()
    cutCard={};
    crib=[];
    playerPeg=[]
    compPeg=[]
    newPlayerHand=[];
    newCompHand=[];
    playerHand=[];
    compHand=[];}
    
    for(i=0; i<6; i++){
       
        let cardEl=document.createElement('div')
        cardEl.classList.add('card-front')
         cardEl.innerHTML=deck[i].name
         cardEl.addEventListener('click',select)
         deck[i].el=cardEl
         if(deck[i].suit==="♦"||deck[i].suit==="♥"){
            deck[i].el.classList.add('red')
         }
         playerHand.push(deck[i])
        document.querySelector('.playerCards').appendChild(playerHand[i].el)

    }
    for(i=6; i<12; i++){
    
        let cardEl=document.createElement('div')
        cardEl.classList.add('card-back')
        deck[i].el=cardEl
        if(deck[i].suit==="♦"||deck[i].suit==="♥"){
            deck[i].el.classList.add('red')}
        compHand.push(deck[i])
        document.querySelector('.opCards').appendChild(compHand[i-6].el)
    }
    
    deck[12].el= document.createElement('div')
    if(deck[12].suit==="♦"||deck[12].suit==="♥"){deck[12].el.classList.add('red')}
    cutCard=deck[12]
    cutCard.cut=true;
    cutCard.el.classList.remove('card-front')
    // if(round !=1){
    //     let nextButton=document.createElement('button')
    //     nextButton.classList.add('button')
     
            
    //         butt.innerHTML="put in crib"
    //         butt.addEventListener('click',chooseCrib)
    //         buttonHolder.appendChild(butt)
        
    // }
    if(whoStarts==true){
        whoseCrib.innerHTML=" comp crib"
    }else{whoseCrib.innerHTML=" your crib"}
}
if(round==1){
makeDeck()
shuffle(deck)
}


if(round==1){
for(i=13; i<19;i++){
    if(deck[i].rank!=deck[i+1].rank){
        x=i
        y=i+1

    } 
}

}

function cut(e) {
    
    
    start = document.createElement('div');
    start.classList.add('popup');
 
    notiBox.appendChild(start);

    aCut = document.createElement('div');
    aCut.classList.add('card-front');
    aCut.innerHTML = deck[x].name;
    if(deck[x].suit==="♦"||deck[x].suit==="♥"){aCut.classList.add('red')}

    deck[x].el = aCut;
    start.innerHTML = "you cut this card:";
    start.append(aCut);

    ok = document.createElement('button');
    ok.classList.add('popupbutton');
    ok.innerHTML = "ok";
    start.append(ok);
    ok.addEventListener('click', compCut);
}

function compCut(e) {
    aCut.remove();
    start.innerHTML="the computer cut this card:"
    bCut = document.createElement('div');
    bCut.classList.add('card-front');
    bCut.innerHTML = deck[y].name;
    if(deck[y].suit==="♦"||deck[y].suit==="♥"){bCut.classList.add('red')}
    deck[y].el = bCut;
    start.append(bCut);
    ok = document.createElement('button');
    ok.classList.add('popupbutton');
    ok.innerHTML = "ok";
    start.append(ok);
    ok.addEventListener('click', whoGoesFirst);
}

function whoGoesFirst(e){
    if(deck[y].rank<deck[x].rank){
        start.innerHTML="the computer's card is lower, so it has the crib first. Select 2 cards to put in the crib. Select a card by clicking it. To deselect, click again."
        whoStarts=true
      
    }else {
        start.innerHTML="your card is lower, so it's your crib first. Select 2 cards to put in the crib. Select a card by clicking it. To deselect, click again."
        whoStarts=false
       
    }
    ok = document.createElement('button');
    ok.classList.add('popupbutton');
    ok.innerHTML = "ok";
    start.append(ok);
    button.innerHTML="put in crib"
    button.removeEventListener('click',cut)
    button.addEventListener('click',chooseCrib)
    ok.addEventListener('click', deal);
}
function select(e){
    let selected=document.getElementsByClassName('selected')
    let count=selected.length
    let target=e.target
    
    if(count<selectLim &&!target.classList.contains('selected')){
        target.classList.add('selected')
        
    }else if(target.classList.contains('selected')){
        target.classList.remove('selected')
    }
}

function chooseCrib(e){
  
   
    butt.remove()
    let selected=document.getElementsByClassName('selected')
    let count=selected.length
    if(count==2){
        whoseCrib.innerHTML=' '
     
        let toCrib=document.querySelectorAll('.selected')
        toCrib.forEach(function(element){
        element.innerHTML=" "
        element.classList.add('card-back')
        element.classList.remove('card-front')
        button.innerHTML="play"
        if(round!=1){
            buttonHolder.appendChild(button)
        }
        
        cribDiv.appendChild(element);
        crib = playerHand.filter(player => player.el.closest('.crib'));
      
        element.classList.remove('selected')
        element.removeEventListener('click',select)
        
    })
    compPeg=compChoice(compHand)
    newCompHand.push(cutCard)
    
    for(z=0; z<6; z++){
       
        if(!compChoice(compHand).includes(compHand[z])){
            crib.push(compHand[z])
            let cribcard=compHand[z].el
            cribDiv.appendChild(cribcard)
        }
    } 
    crib.push(cutCard)
    
    button.removeEventListener('click',chooseCrib)
    button.addEventListener('click',playerMove)
 
    for(i=0;i<6;i++){
        if (playerHand[i].el.classList.contains('card-front')){
            newPlayerHand.push(playerHand[i])
            playerPeg=newPlayerHand
        }
    }
    selectLim=1
    playerPeg= playerPeg.filter(peg => !areObjectsEqual(peg, cutCard));
    newPlayerHand.push(cutCard)
    // whoseTurn=whoStarts

    function areObjectsEqual(objA, objB) {
        return JSON.stringify(objA) === JSON.stringify(objB);
      }
    deckSpot.appendChild(cutCard.el)
    cutCard.el.classList.add('card-front')
    cutCard.el.innerHTML=cutCard.name
    if(!whoStarts){compMove()}
}}

function playerMove(e){
    
    
    let selected = playerPeg.filter(obj => obj.el.classList.contains('selected'));
    if(selected.length>0 && canPlay(selected)){
    if (canPlay(selected)){
        pegBox.appendChild(selected[0].el)
        let index=playerPeg.indexOf(selected[0])
    
        playerPeg[index].played=true
        selected[0].el.classList.remove('selected')
        selected[0].el.removeEventListener('click',select)
        discard.push(selected[0])
        runningTotal+=selected[0].points
        info.innerHTML=runningTotal
        pCount++
        console.log("p",selected[0].name,runningTotal)
        let tempScore=pOldScore
        pOldScore=playerScore
        playerScore+=get15()+getRun()+getPair()+lastCard()+get31()
        
        if(playerScore==pOldScore){peggingUpdates.innerHTML=" ";pOldScore=tempScore}
        console.log('playerscore:',playerScore)
        playerPegMove()
    }
   if(!canPlay(compPeg)&&cCount<4 &&runningTotal!=31 ){
    Pgo=true
    console.log('pgo is true')
    console.log('go from comp, play until you cant')
    peggingUpdates.innerHTML='comp says go'
    // forGo('comp')
        if(pCount==4){
            peggingUpdates.innerHTML+=' *1 for go'
            pOldScore=playerScore
            playerScore++
            console.log('go point for player')
            console.log('playerscore ',playerScore)
            playerPegMove()
            runningTotal=0; 
            compMove()
            
        }
   } 
   
   compMove()  
}  
}



async function compMove(){
   
    await sleep(700)
    
    
    if(canPlay(compPeg)){
        compPeg[playableIndices[0]].el.classList.add('card-front')
        compPeg[playableIndices[0]].el.classList.remove('card-back')
        compPeg[playableIndices[0]].el.innerHTML= compPeg[playableIndices[0]].name
        pegBox.appendChild(compPeg[playableIndices[0]].el)
        runningTotal+=compPeg[playableIndices[0]].points
        info.innerHTML=runningTotal
        compPeg[playableIndices[0]].played=true
        discard.push(compPeg[playableIndices[0]])
        cCount++
        console.log("c",compPeg[playableIndices[0]].name,runningTotal)
        let tempScore=cOldScore
        cOldScore=compScore
        compScore+=get15()+getRun()+getPair()+lastCard()+get31()
        if(get31()>0){await sleep(500)}
        if(compScore==cOldScore){peggingUpdates.innerHTML=" ";cOldScore=tempScore}
        compPegMove()
        console.log("compscore:",compScore)
    }
    
    if(!canPlay(playerPeg)&&pCount<4&&!Pgo && runningTotal!=31 && lastCard()<1){
        console.log('player says go to me and i play until i cant')
      
        //forGo("player")
       
        Cgo=true

    }
    
    if(!canPlay(playerPeg)&&!canPlay(compPeg) && pCount!=4 ){
        console.log('neither of us can go')
    
        if(Pgo){
            await sleep(400)
            peggingUpdates.innerHTML+=' *1 for go'
            pOldScore=playerScore
            playerScore++
            console.log('go point for player')
            console.log('playerscore ',playerScore)
            playerPegMove()
            runningTotal=0;
            compMove()
            
        }
        if(Cgo){
            await sleep(400)
            cOldScore=compScore
            compScore++
            console.log('compscore: ',compScore)
            compPegMove()
            peggingUpdates.innerHTML+=' *1 for go'
            // compMove()
        }
        Pgo=false
        Cgo=false
        discard=[]
        runningTotal=0
        info.innerHTML=runningTotal
    }
   
    // if(runningTotal==31){
    //     console.log('lets handle the 31 situation')
    //     if (Pgo){
    //         peggingUpdates.innerHTML+=' *1 for go'
    //         pOldScore=playerScore
    //         playerScore++
    //         console.log('go point for player')
    //         console.log('playerscore ',playerScore)
    //         playerPegMove()
    //         compMove()

    //     }
    //     if(Cgo){
    //         console.log('add a point for comp ')
    //     }
    //     runningTotal=0
    // }
    if(pCount==4 && cCount<4){
        if(!canPlay(compPeg)){
            await sleep(400)
            cOldScore=compScore
            compScore++
            console.log('compscore: ',compScore)
            compPegMove()
            peggingUpdates.innerHTML+=' *1 for go'
            runningTotal=0
            Pgo=false
            Cgo=false
            discard=[]
            info.innerHTML=runningTotal
        }
        compMove()
    }
    if(cCount+pCount==8){
        cCount=0
        pCount=0
        Pgo=false
        Cgo=false
        if(whoStarts==true){countPlayerHand()}else{countCompHand()}
    }

if(!canPlay(playerPeg)&& canPlay(compPeg)){compMove}   
}

function compChoice(hand){
    let keys =[];
        for (i=0; i<hand.length; i++){
            keys[i]=hand[i];
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

        var set=[] 
        let sum=0;
        let highest=-1;
        SET=set
    
        recursive(4, 0, []);
        for(x=0; x<15; x++){
       if(calculate(SET[x])[5]>highest){
        highest=calculate(SET[x])[5]
        newCompHand=SET[x]
        compPeg=newCompHand
        
    }
   }
   newCompHand.sort(function(a, b){return a.rank-b.rank});
    return newCompHand
    }
  
    function calculate(hand){    
        hand.sort(function(a, b){return a.rank-b.rank});
        function runs(){
           
            for (i=0; i<hand.length-1; i++){
                if(hand[i+1].rank===hand[i].rank){
                 hand[i].keep=false;
                 hand[i+1].keep=false;  
                }
    
            }
            for(i=0;i<hand.length;i++){
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
            
            for(i=0; i < hand.length; i++){
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
            for (i=0; i<hand.length; i++){
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
                for (i=0; i<hand.length; i++){
                    
                    sum+=hand[i].points;
                }
                if (sum==15){
                    fifteensPoints+=2;
                }
                
                
          finalPoints.push(fifteensPoints)
        }
        function flush(){
          
            
            for(i=0;i<hand.length;i++){
                if(hand[i].cut==false){
                suitArr.push(hand[i].suit)
                }else{cutt=hand[i].suit}
            }
          if (new Set(suitArr).size===1){
                if(isCrib===true ){
                    if(cutt===suitArr[0]){
                    flushPoints=5
                    }else{flushPoints=0}
                }
                if(isCrib===false){
                    if(cutt===suitArr[0]){
                        flushPoints=5
                        
                    }else{flushPoints=4}
                }
            }else{flushPoints=0}
            finalPoints.push(flushPoints)
        }
        function nobs(){
            
            for(i=0; i<hand.length; i++){
                if (hand[i].cut===true){
                    toMatch=hand[i].suit
                }else{cutless.push(hand[i])}
            }
            for(i=0; i<hand.length-1; i++){
                if (cutless[i].suit===toMatch && cutless[i].rank===11){
                    nobsPoints=1
                }
            }
            for(i=0; i<hand.length; i++){
                hand[i].cut=false;
            }
            finalPoints.push(nobsPoints)
    
        }
        function initVar(){
         
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
         toMatch=null;
         cutless=[];
        }
        
        
            runs();
            pairs();
            fifteens();
            flush();
            nobs();
            let array=finalPoints
            array.push(array[0]+array[1]+array[2]+array[3]+array[4])
            initVar();
            return array;
             
    }

// !!!! pegging calcs !!!
function getGo(){
    if(runningTotal!=31&&go&&lastCard()<1){
        console.log('go point added')

        return 1
       
    } else{return 0}
}
function get31(){
    if(runningTotal==31){
        console.log("thirtyone!")
        peggingUpdates.innerHTM+=' *31 for 2'
        runningTotal=0
        info.innerHTML=runningTotal
        if(Pgo || Cgo){peggingUpdates.innerHTM+=' *1 for go';return 3}

        if(!Pgo&& !Cgo){return 2}
    
       
        
    } else {return 0}
}

function getPair(){
    
    let pairCount=0
    for(i=discard.length-1; i>-1; i--){
        if(discard[i-1]!=undefined && discard[discard.length-1].rank!=discard[discard.length-2].rank){
            return 0;
        }
        if(discard[i-1]!=undefined){
            if(discard[i-1].rank==discard[discard.length-1].rank){
               pairCount++
            } 
            
        }
    }
    if(pairCount>0){peggingUpdates.innerHTML+=" *"+(pairCount+1)+" of a kind"}
    if(pairCount==0){return 0;}
    if (pairCount==1){return 2}
    if (pairCount==2){return 6}
    if (pairCount==3){return 12}
   
}
function lastCard(){
    let score=0;
    if(allPlayed()){
        score=1
        console.log('last')
        peggingUpdates.innerHTML+=' *last card for 1'
    }
    return score;
}
   function canPlay(a){ 
    playableIndices=[]
    let played=0
        for(x=0; x<a.length; x++){
            
            if(a[x].points+runningTotal<32 && a[x].played==false){ 
                playableIndices.push(x)
            }
            if(a[x].played==true){played++}

        }if(playableIndices.length>0 && played<4){return true}else{ return false}
    }
function allPlayed(){
    for(i=0; i<4; i++){
        if(compPeg[i].played==false||playerPeg[i].played==false){
            return false
        }
    }return true
}
   
function get15(){
    let score=0
    if(runningTotal==15){
        score=2
        
        peggingUpdates.innerHTML+=' *15 for 2'
    }
    return score
   }
   
function getRun(){
    let score=0;
            for (const card of discard) {
                const playedCards = discard.slice(0, discard.indexOf(card) + 1);
                const result = checkForRun(playedCards);
               
                if (result.runLength >= 3 && result.position > lastScoredPosition) {
                    score += result.runLength;
                    lastScoredPosition = result.position;
                    console.log('run')
                    peggingUpdates.innerHTML+=' *run of '+result.runLength
                    }                 
                }  
                return score
            }    
   
function isConsecutive(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].rank - arr[i - 1].rank !== 1) {
            return false;
        }
    }
    return true;
}
function checkForRun(playedCards) {
    let longestRun = 0;
    let endingPosition = -1;

    for (let i = 0; i < playedCards.length; i++) {
        for (let j = i + 3; j <= playedCards.length; j++) {
            const window = playedCards.slice(i, j).sort((a, b) => a.rank - b.rank);
            
            if (isConsecutive(window) && window.length > longestRun) {
                longestRun = window.length;
                endingPosition = j - 1;  // last card's position in the run
            }
        }
    }
    return { runLength: longestRun, position: endingPosition };
}
function clear(){
    start.remove()
    // if(counted==1&&whoStarts){countCompHand()}
    // if(counted==1&&!whoStarts){countPlayerHand}
    // if(counted==2){reset()}
   
}
async function countPlayerHand(){
    if(playerScore<121&&compScore<121){
    await sleep(500)
    peggingUpdates.innerHTML=" "
    if(counted==0){cutCard.el.remove()}
    for(i=0;i<4;i++){
        document.querySelector('.playerCards').appendChild(playerPeg[i].el)   
    }
    document.querySelector('.playerCards').appendChild(cutCard.el)   

// notiBox.appendChild(start)
// start.innerHTML="your hand is worth"+calculate(newPlayerHand)[5]
counted++
let tempScore=pOldScore
pOldScore=playerScore
playerScore+=calculate(newPlayerHand)[5]
if(pOldScore==playerScore){pOldScore=tempScore}
// alert('players hand is worth '+calculate(newPlayerHand)[5])
playerPegMove()
if(playerScore<121 && compScore<121){
start.remove()
notiBox.appendChild(start)
start.innerHTML='your hand is worth '+calculate(newPlayerHand)[5]+'.'

ok = document.createElement('button');
ok.classList.add('popupbutton');
ok.innerHTML = "ok";
start.append(ok);

// ok = document.createElement('button');
//     ok.classList.add('popupbutton');
//     ok.innerHTML = "ok";
//     start.append(ok);
//     ok.addEventListener('click', clear);
if(counted==1){
    ok.addEventListener('click',countCompHand)
}
if(counted==2){
    ok.addEventListener('click', countCrib)
}

    }}
}
async function countCompHand(){
   if(playerScore<121&&compScore<121){
   
    await sleep(500)
    peggingUpdates.innerHTML=" "
    start.remove()
    newCompHand.push(cutCard)
    for(i=0;i<4;i++){
        document.querySelector('.opCards').appendChild(compPeg[i].el)   
    }
    if(counted==0){cutCard.el.remove()}
    document.querySelector('.opCards').appendChild(cutCard.el) 
  
    // notiBox.appendChild(start)
    // start.innerHTML="comp hand is worth"+calculate(newCompHand)[5]
    if(cOldScore!=compScore){
    cOldScore=compScore}
    compScore+=calculate(newCompHand)[5]
    
    // alert('computer hand is worth'+calculate(newCompHand)[5])
    compPegMove()
    if(compScore<121 && playerScore<121){
      notiBox.appendChild(start)
    start.innerHTML='computer hand is worth '+calculate(newCompHand)[5]+'.'

    ok = document.createElement('button');
    ok.classList.add('popupbutton');
    ok.innerHTML = "ok";
    start.append(ok);
   
    counted++

if(counted==1){ ok.addEventListener('click', countPlayerHand)}
if(counted==2){ok.addEventListener('click', countCrib)}
   }}
}
function checkWin(){
    if(playerScore>120 || compScore>120){
        if(playerScore>120){
            notiBox.appendChild(start)
            start.innerHTML='You Win!!'
        
            ok = document.createElement('button');
            ok.classList.add('popupbutton');
            ok.innerHTML = "next game";
            start.append(ok); 
            ok.addEventListener('click',(e)=>location.reload())
        }
        if(compScore>120){
            notiBox.appendChild(start)
            start.innerHTML='Computer Wins!!'
        
            ok = document.createElement('button');
            ok.classList.add('popupbutton');
            ok.innerHTML = "next game";
            start.append(ok); 
            ok.addEventListener('click',(e)=>location.reload())
        }
    }else {return false}
}
function forGo(string){
    notiBox.appendChild(start)
    start.innerHTML=string+" says go"

    ok = document.createElement('button');
    ok.classList.add('popupbutton');
    ok.innerHTML = "ok";
    start.append(ok);
    ok.addEventListener('click', clear);
}
// function reset(){
//     console.log('next hand')
// }
// function compPegMove(){
//     console.log(' ')
// }
function playerPegMove(){
    if(playerScore!=0){
        let newSpot;
        let oldSpot
        // console.log('got to the inner layer of peg moving')
        if(playerScore%60!=0){ newSpot=playerScore%60}else{newSpot=60}
        if(pOldScore%60!=0){ oldSpot=pOldScore%60}else{oldSpot=60}
        // console.log('new:',newSpot,'old:',oldSpot)
        // console.log(p1PegArr[newSpot].el)
        p1PegArr[newSpot].el.classList.add('occupied')
        
        for(i=1;i<61;i++){
            if(p1PegArr[i].el.classList.contains('occupied')&& i!=newSpot && i!=oldSpot){
                p1PegArr[i].el.classList.remove('occupied')
            }
        }
    }
    if(playerScore!=0 && pOldScore==0){
        p1beginningpegs[1].el.classList.remove('occupied')
        p1beginningpegs[1].el.classList.add('grey')
       } 
       if(playerScore!=0 && pOldScore!=0){
        p1beginningpegs[0].el.classList.remove('occupied')
        p1beginningpegs[0].el.classList.add('grey')
       }
       checkWin()
}
function compPegMove(){
  
    if(compScore!=0) {
        // console.log('got to the inner layer of peg moving')

        let newSpot
        let oldSpot
        if(compScore%60!=0){newSpot=compScore%60}else{newSpot=60}
        if(cOldScore%60!=0){ oldSpot=cOldScore%60}else{oldSpot=60}
        // console.log('new:',newSpot,'old:',oldSpot)
        // console.log(p2PegArr[newSpot].el)
        p2PegArr[newSpot].el.classList.add('occupied2')
        
        for(i=1;i<61;i++){
            if(p2PegArr[i].el.classList.contains('occupied2')&& (i!=newSpot && i!=oldSpot)){
                p2PegArr[i].el.classList.remove('occupied2')
            }
        }
    }
   if(compScore!=0 && cOldScore==0){
    p2beginningpegs[0].el.classList.remove('occupied2')
    p2beginningpegs[0].el.classList.add('grey')
   } 
   if(compScore!=0 && cOldScore!=0){
    p2beginningpegs[1].el.classList.remove('occupied2')
    p2beginningpegs[1].el.classList.add('grey')
   }
   checkWin()
}
 function countCrib(){
    if(!checkWin()){
    isCrib=true
    peggingUpdates.innerHTML=" "
    cutCard.el.remove()
    start.remove()
    for(i=0; i<5; i++){
        if(crib[i].el.classList.contains('card-back')){
            crib[i].el.classList.remove('card-back')
            crib[i].el.classList.add('card-front')
            crib[i].el.innerHTML=crib[i].name
        }
    }
    cribDiv.appendChild(cutCard.el)
    if(whoStarts){
        let tempScore=cOldScore
        cOldScore=compScore
        compScore+=calculate(crib)[5]
        if(cOldScore==compScore){cOldScore=tempScore}
        // alert('computers crib is worth'+calculate(crib)[5])
        compPegMove()
        notiBox.appendChild(start)
    start.innerHTML='computer crib is worth '+calculate(crib)[5]+'. click ok for next round'

    ok = document.createElement('button');
    ok.classList.add('popupbutton');
    ok.innerHTML = "ok";
    start.append(ok);
    
    ok.addEventListener('click', reset)

    }else{
        let tempScore=pOldScore
        pOldScore=playerScore
        playerScore+=calculate(crib)[5]
        if(playerScore==pOldScore){pOldScore=tempScore}
        // alert('players crib is worth'+calculate(crib)[5])
        playerPegMove()
        notiBox.appendChild(start)
    start.innerHTML='your crib is worth '+calculate(crib)[5]+'. click ok for next round'

    ok = document.createElement('button');
    ok.classList.add('popupbutton');
    ok.innerHTML = "ok";
    start.append(ok);
    
    ok.addEventListener('click', reset)

    }
  isCrib=false
}
}
function reset(){
// butt.remove()
 going=false

pPeg =0
 cPeg =0

 whoStarts=!whoStarts // t means players turn f means comp turn

info.innerHTML=" "
peggingUpdates.innerHTML=" "
 loopCount=1;
 deck=[];
 counted=0
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
 toMatch;
 cutless=[];
 rankArr=[];
 runSet=[];

 
 
 
 SET=[]
 selectLim=2

   
    discard=[]
    runningTotal=0;
    lastScoredPosition = -1;
    playableIndices=[];
    Cgo=false;
    Pgo=false;
    cCount =0;
    pCount=0;
//    whoseTurn;
makeDeck()
shuffle(deck)

round++
// button.innerHTML="next round"
// button.removeEventListener('click',playerMove)
// button.addEventListener('click',deal)
deal()
}
function clearSpace(parDiv,kidDiv){
    for (var i = 0; i < kidDiv.length; i++) {
        parDiv.removeChild(kidDiv[i]);
    }
    
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

