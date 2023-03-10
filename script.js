const canvasElement = document.querySelector("canvas")
    const canvasContext = canvasElement.getContext("2d")
    const gapX = 10
    const mouse = {xMouse: 0, yMouse: 0}

    const field = {
      widthField: window.innerWidth,
      heightField: window.innerHeight,
      draw: function () {
        canvasContext.fillStyle = "#12217C"
        canvasContext.fillRect(0, 0, this.widthField, this.heightField) 
      }
    }
    const centerLine = {
      centerLineWidth: 15,
      centerLineHeight: field.heightField,
      draw: function () {
        canvasContext.fillStyle = "grey"
        canvasContext.fillRect(
          (field.widthField / 2 - this.centerLineWidth / 2), 
          0, 
          this.centerLineWidth, 
          this.centerLineHeight
        )
      }
    }
    const racketL = {
      xRacket: gapX,
      yRacket: 50,
      widthRacket: 20,
      heightRacket: 200,
      _move: function() {
        this.yRacket = mouse.yMouse - this.heightRacket / 2
      },
      draw: function () {
        canvasContext.fillStyle = "white"
        canvasContext.fillRect(this.xRacket, this.yRacket, this.widthRacket, this.heightRacket )
        this._move()
      }
    }
    const racketR  = {
      xRacket: field.widthField - centerLine.centerLineWidth - gapX,
      yRacket: 0,
      widthRacket: 20,
      heightRacket: 200,
      speed: 1,
      _move: function() {
        if(this.yRacket + this.heightRacket / 2 < ball.yBall + ball.r ) {
          this.yRacket += this.speed
        }else{
          this.yRacket -= this.speed
        }
        this.yRacket = ball.yBall - this.heightRacket / 2
      },
      speedUp: function() {
        if(this.speed < 5) {
          this.speed += 1
          console.log("Velocidade raquete oponente" + this.speed)
        }
      },
      draw: function () {
        canvasContext.fillStyle = "white"
        canvasContext.fillRect(this.xRacket, this.yRacket, this.widthRacket, this.heightRacket )
        this._move()
      }
    }
    const ball  = {
      xBall: 550,
      yBall: 100,
      rBall: 10,
      speed: 1.5,
      directionX: 1, 
      directionY: 1, 
      _pointUp: function() {

        this._speedUp()
        racketR.speedUp()
        this.xBall = field.widthField / 2
        this.yBall = field.heightField / 2
        scoreboard.winner()
      },
      _speedUp: function() {
        if(this.speed < 30){
          this.speed += 0.5
          console.log("Velocidade Bola: " + this.speed)
        }
      },
      _calcPosition: function() {
        //verify point player
        if(this.xBall > field.widthField - this.rBall - racketR.widthRacket + gapX){
          if(this.yBall + this.rBall > racketR.yRacket && this.yBall - this.rBall < racketR.yRacket + racketR.heightRacket){
            this.directionX *= -1
          }else{
            scoreboard.addPointPlayer()
            this._pointUp
          }
        }

        // verify point oponent
        if(this.xBall < this.rBall + racketL.widthRacket + gapX){
          if(this.yBall + this.rBall > racketL.yRacket && this.yBall - this.rBall < racketL.yRacket + racketL.heightRacket){
            this.directionX *= -1
          }else{
            scoreboard.addPointOponent()
            this._pointUp()
          }
        }

        if(((this.yBall - this.rBall) > field.heightField && this.directionY > 0) || ((this.yBall - this.rBall) < 0 && this.directionY < 0)){
          this.directionY *= -1
        }  

        if(((this.xBall - this.rBall) > field.widthField && this.directionX > 0) || ((this.xBall - this.rBall) < 0 && this.directionX < 0)) {
          this.directionX *= -1
        }
      },
      _move:function() {
        this.xBall += this.directionX * this.speed,
        this.yBall += this.directionY * this.speed
      },
      draw: function () {
        canvasContext.beginPath()
        canvasContext.fillStyle = "white"
        canvasContext.arc(this.xBall, this.yBall, this.rBall, (2 * Math.PI), false)
        canvasContext.fill()
        this._calcPosition()
        this._move()
      }
    }
    const scoreboard  = {
      player: 0,
      oponent: 0,
      winner: function() {
        if(this.player == 10 || this.oponent == 10){
          ball.speed = 0
          console.log("WINNER")
        }
      },
      addPointPlayer: function() {
        this.player += 1
      },
      addPointOponent: function() {
        this.oponent += 1
      },
      draw: function() {
        canvasContext.font= "bold 72px Arial"
        canvasContext.textAlign = "center"
        canvasContext.textBaseline = "top"
        canvasContext.fillStyle = "#10acea"
        canvasContext.fillText(this.player,(field.widthField / 4), 50)
        canvasContext.fillText(this.oponent,((field.widthField / 4) + (field.widthField / 2)), 50)
      }
    }

    function setup() {
      canvasElement.width = canvasContext.width = field.widthField
      canvasElement.height = canvasContext.height = field.heightField
    }

    function draw() {
      field.draw()
      centerLine.draw()
      scoreboard.draw()      
      racketL.draw()
      racketR.draw()
      ball.draw()
    }
   
    window.animateFrame = (function() {
      return(
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          return window.setTimeout(callback, 1000 / 60)
        }
      )
    })()
    
    function main() {
      animateFrame(main)
      draw()
    }
    setup()
    main()

    canvasElement.addEventListener('mousemove', function(e) {
      mouse.xMouse = e.pageX
      mouse.yMouse = e.pageY
    })