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

