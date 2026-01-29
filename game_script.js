  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  let blockL = 50;
// color of main table
  function reDrawGrid(){
    drawBorder()
    ctx.clearRect(50,50,800,800);
    ctx.fillStyle = 'rgb( 0 0 0 / 50% )';
    ctx.fillRect(50,50,800,800);
// make grid system and make everything based on it 
    for (let i = 50; i <= 800; i += blockL){
        for (let j = 50; j <= 800; j += blockL){
          ctx.strokeStyle = 'rgb( 0 0 0 / 50% )';
          // ctx.strokeStyle = 'rgb( 255 255 255 / 70% )';
          ctx.strokeRect(i,j,blockL,blockL);
          // ctx.fillText(`(${i},${j})`,i,j);
        }
    }
  }

//
  function drawBorder(){
    ctx.fillStyle = 'rgb(55 55 55)'
    ctx.fillRect(0,0,900,900)
  }

// x coor convert
  function xCoorConversion(inputXCoor){
    outputXCoor = inputXCoor * blockL + 50
    return outputXCoor
  }
// y coor convert
  function yCoorConversion(inputYCoor){
    
    outputYCoor = inputYCoor * blockL +50
    return outputYCoor
  }
  
// what about making a whole snake using an obj then 
  let snakeCoor = [[3,8],[4,8],[5,8]]                         //snake list with coor of blocks
  let xCoor
  let yCoor
  function drawSnake(){
    for (let i = 0; i<snakeCoor.length; i++){
      xCoor = snakeCoor[i][0]                           //transfer value to draw
      yCoor = snakeCoor[i][1]
      // console.log(xCoor,yCoor)
      // console.log(xCoorConversion(xCoor),yCoorConversion(yCoor))
      ctx.fillStyle = "rgb(113 188 32)"
      ctx.fillRect(
        xCoorConversion(xCoor)+(snakeCoor.length-i)/2 +1,
        yCoorConversion(yCoor)+(snakeCoor.length-i)/2 +1,
        blockL-(snakeCoor.length-i)-2,
        blockL-(snakeCoor.length-i)-2)
    }
  }
  // console.log(snakeCoor[0])
  // console.log(snakeCoor[1])

// food obj
//next is scoring
let foodLocationX = 10
let foodLocationY = 8
function drawFood(){
  ctx.fillStyle = "rgb(169 55 61)"
  ctx.fillRect(xCoorConversion(foodLocationX)+1,yCoorConversion(foodLocationY)+1,blockL-2,blockL-2)
}
// and game over function to keep everything short, there is 2 condition anyway 
function gameOver(){
  document.removeEventListener('keydown',drawInProgress)
  clearInterval(intervalId)
//make game-over screen        
  ctx.fillStyle='rgb(0 0 0/50%)'
  ctx.fillRect(0,0,900,900)
  ctx.fillStyle='rgb(255 255 255)'
  ctx.font = "bold italic 128px Helvetica";
  ctx.fillText("GAME OVER",50,300);
  ctx.font = "italic 32px Helvetica";
  ctx.fillText("Click the food to restart",100,350);
}
                                                                                                          //
// moving
  let intervalId;
  let currentKeyHold;
  // let nextKeyHold
  let speed = 12                               // affect speed between 10 -> 15

  let counterKeeper = 0 //keep counter
//shortening by moving function
  function moving(direction){
    clearInterval(intervalId)
    intervalId = setInterval(()=>{
      counterKeeper++
      // console.log(currentKeyHold)

//movement mechanics 
      if(counterKeeper === speed ){                               
        let cutpiece = snakeCoor.shift()                               
        if(direction === kdown || direction === ks){
          yCoor +=1
        } else if (direction === kup || direction === kw){
          yCoor -=1
        } else if (direction === kright || direction === kd){
          xCoor +=1
        } else if (direction === kleft || direction === ka){
          xCoor -=1
        }
        snakeCoor.push([xCoor,yCoor])
        reDrawGrid()                                    
        drawSnake()  

// make game end or stop
        let headPairNum = snakeCoor.length-1
        if (((currentKeyHold === kdown || currentKeyHold === ks )&& snakeCoor[headPairNum][1]>15)||((currentKeyHold === kup ||currentKeyHold === kw) && snakeCoor[headPairNum][1]<0)||
        ((currentKeyHold === kright || currentKeyHold === kd )&& snakeCoor[headPairNum][0]>15)||((currentKeyHold === kleft || currentKeyHold === ka) && snakeCoor[headPairNum][0]<0)){
          // console.log(snakeCoor[1])
          gameOver()
        }

// scoring up here because need to  
        drawFood()
        let headSnakeX = snakeCoor[headPairNum][0]
        let headSnakeY = snakeCoor[headPairNum][1]
        if (headSnakeX===foodLocationX && headSnakeY===foodLocationY){
          snakeCoor.unshift(cutpiece)
          ctx.clearRect(xCoorConversion(foodLocationX),yCoorConversion(foodLocationY),blockL,blockL)
          foodLocationX = Math.floor(Math.random()*16)
          foodLocationY = Math.floor(Math.random()*16)
          //add if so that food can't spawn on snake
          for (let i = 0; i< snakeCoor.length; i++){
            if (foodLocationX === snakeCoor[i][0] && foodLocationY === snakeCoor[i][1]){ 
              foodLocationX = Math.floor(Math.random()*16)
              foodLocationY = Math.floor(Math.random()*16)
            }
          }
        }

// prevent self eating.                   ----- done
        let ifSelfEat = []
        for (let i = 0; i < snakeCoor.length; i += 1){
          if (snakeCoor[i][0] === snakeCoor[headPairNum][0] && snakeCoor[i][1] === snakeCoor[headPairNum][1] ){
            ifSelfEat.push(snakeCoor[i])
          }
        }
        if (ifSelfEat.length >= 2){
          gameOver()
        }

//show score
        changeOutputScore();

// counter
        counterKeeper = 0     
        // console.log(snakeCoor.length - 3)       
      }
    },10)
  }
// var for arrows to make my life easier 
  const kdown = 'ArrowDown' 
  const kup = 'ArrowUp'  
  const kright = 'ArrowRight' 
  const kleft = 'ArrowLeft' 
  const kw = 'w'
  const ks = 's'
  const kd = 'd'
  const ka = 'a'
//event listener, main moving mechanics
  // setInterval(()=>{
    document.addEventListener('keydown',drawInProgress)
    // if (keysTaken === 2 && counterKeeper <= speed){
    //   keysTaken = 0
    //   document.removeEventListener('keydown',drawInProgress)
    // }
  // },10)
  // let timeSinceLastKey = 0
  // let keysTaken = 0
  function drawInProgress(event){
    if(event.key === kdown || event.key === kup || event.key === kright || event.key === kleft || event.key === ks || event.key === kw || event.key === kd || event.key === ka){
      event.preventDefault()  
      // if (keysTaken === 0){
      //   keysTaken = 1
        if ((event.key === kdown && currentKeyHold !== kup && currentKeyHold !== kdown) || 
        ((event.key === ks && currentKeyHold !== kw && currentKeyHold !== ks) || 

        (event.key === kup && currentKeyHold !== kdown && currentKeyHold !== kup) || 
        (event.key === kw && currentKeyHold !== ks && currentKeyHold !== kw) || 

        (event.key === kright && currentKeyHold !== kleft && currentKeyHold !== kright) || 
        (event.key === kd && currentKeyHold !== ka && currentKeyHold !== kd) || 

        (event.key === kleft && currentKeyHold !== kright && currentKeyHold !== kleft && currentKeyHold !== undefined)) ||
        (event.key === ka && currentKeyHold !== kd && currentKeyHold !== ka && currentKeyHold !== undefined)){
          // console.log(nextKeyHold)
          // moving(nextKeyHold)
          currentKeyHold = event.key                        //stop printing multiple interval 
          moving(currentKeyHold)                            // ^ prevent continious new loop each time key press and going opposite way
        }
        // if (keysTaken === 1 && currentKeyHold !== nextKeyHold){
        //   keysTaken = 2
        //   nextKeyHold = event.key
        //   console.log(nextKeyHold)
        // }
      // } 
    }
  } 
  


//remember to shorten the print food code ------ done

//die when eat self ----- done

//bug, bumping wall, delay, eat itself ----- somewhat completed ? 
// make it so that it only take 1 key input per seconds or sth like that
// but then u'll need buffer key  

// key input fixing ----- might be done 

// add score counter and speed change 
function changeOutputScore(){
  let outputScore = document.getElementById('current_point')
  outputScore.innerHTML = snakeCoor.length-3
}

function changeSpeed(inputSpeed){
  speed = inputSpeed
  let hasChangeSpeed = document.getElementById("speed_changed")
  hasChangeSpeed.innerHTML = "Speed changed successfully"
  setTimeout(()=>{
    hasChangeSpeed.innerHTML = ''
  },1000)
}
//make restart button, fix the side panel
function restart(){ 
  let gameRestarted = document.getElementById("game_restart")
  gameRestarted.innerHTML = " The game has restarted"
  setTimeout(()=>{
    gameRestarted.innerHTML = ''
  },1000)
  currentKeyHold = undefined
  snakeCoor = [[3,8],[4,8],[5,8]]
  foodLocationX = 10
  foodLocationY = 8
  document.addEventListener('keydown',drawInProgress)
  reDrawGrid()
  drawSnake()
  drawFood()
  drawStartScreen()
}
document.addEventListener('click',(event)=>{
    if(event.offsetX > xCoorConversion(foodLocationX) && event.offsetX < xCoorConversion(foodLocationX) + blockL &&
     event.offsetY > yCoorConversion(foodLocationY) && event.offsetY < yCoorConversion(foodLocationY) + blockL){
        restart()
    }
})
//make game screen----- done 
//opening screen
function drawStartScreen(){
  ctx.fillStyle='rgb(0 0 0/50%)'
  ctx.fillRect(0,0,900,900)
  ctx.fillStyle='rgb(255 255 255 / 80% )'
  ctx.font = "bold italic 128px Helvetica";
  ctx.fillText("Start Game",100,200)
  ctx.beginPath();
  ctx.roundRect(110,360,80,80,8)
  ctx.roundRect(210,360,80,80,8)
  ctx.roundRect(310,360,80,80,8)
  ctx.roundRect(210,260,80,80,8)

  ctx.roundRect(110,660,80,80,8)
  ctx.roundRect(210,660,80,80,8)
  ctx.roundRect(310,660,80,80,8)
  ctx.roundRect(210,560,80,80,8)

  ctx.roundRect(530,260,200,80,8)//slow
  ctx.roundRect(510,560,220,80,8)//medium
  ctx.roundRect(530,710,200,80,8)//fast
  ctx.fill();
  ctx.beginPath()
  ctx.fillStyle='rgb(201 230 253/ 80% )'
  ctx.roundRect(510,410,220,80,8)//default
  ctx.fill();


  ctx.fillStyle='rgb(0 0 0/50%)'
  ctx.font = "bold italic 48px Helvetica";
  ctx.fillText("A",130,420)
  ctx.fillText("S",230,420)
  ctx.fillText("D",330,420)
  ctx.fillText("W",220,320)
  
  ctx.beginPath();
  ctx.moveTo(250,575);//up
  ctx.lineTo(225,625);
  ctx.lineTo(275,625);
  ctx.closePath();
  ctx.moveTo(250,725);//down
  ctx.lineTo(225,675);
  ctx.lineTo(275,675);
  ctx.closePath();
  ctx.moveTo(125,700);//left
  ctx.lineTo(175,675);
  ctx.lineTo(175,725);
  ctx.closePath();
  ctx.moveTo(375,700);//right
  ctx.lineTo(325,675);
  ctx.lineTo(325,725);
  ctx.closePath();
  ctx.fill();

  ctx.fillText("Slow",575,320)
  ctx.fillText("Default",525,470)
  ctx.fillText("Medium",525,620)
  ctx.fillText("Fast",575,770)
  document.addEventListener('click',(event)=>{
    if(event.offsetX > 530 && event.offsetX < 730 &&
     event.offsetY > 260 && event.offsetY < 340){
        changeSpeed(14)
    }
    if(event.offsetX > 510 && event.offsetX < 730 &&
     event.offsetY > 410 && event.offsetY < 490){
        changeSpeed(12)
    }
    if(event.offsetX > 510 && event.offsetX < 730 &&
     event.offsetY > 560 && event.offsetY < 640){
        changeSpeed(10)
    }
    if(event.offsetX > 530 && event.offsetX < 730 &&
     event.offsetY > 710 && event.offsetY < 790){
        changeSpeed(8)
    }
  })
}
//make pause button

//draw here 
  reDrawGrid()
  drawSnake()
  drawFood()
  drawStartScreen()