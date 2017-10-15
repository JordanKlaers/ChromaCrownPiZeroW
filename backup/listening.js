  var Gpio = require('pigpio').Gpio
  var redLED = new Gpio(17, {mode: Gpio.OUTPUT})
  var greenLED = new Gpio(17, {mode: Gpio.OUTPUT})
  var blueLED = new Gpio(17, {mode: Gpio.OUTPUT})


  var pubnub = require('pubnub').init({
    　subscribe_key : 'sub-c-cf99383a-7714-11e7-98e2-02ee2ddab7fe',
    　publish_key   : 'pub-c-e868dd6e-aea2-4b32-9f05-b21bac0e6997'
    });

  var channel = 'theled';
  var theInterval = null

  pubnub.subscribe({
    channel: channel,
    callback: setLedColor,
    error: function(err) {console.log(err)}
  });

  pubnub.subscribe({
    channel: 'brightness',
    callback: setBrightness,
    error: function(err) {console.log(err)}
  });

  function setBrightness(value){
    // led.intensity(value);
  }



  var index = 0;
  var patternCall = 0;

  function setLedColor(m) {
    console.log(m);
    return
    var result = [];
    m = m.split(" ");
    for (var i = 0; i < m.length-1; i=i+3) {
      let color ={};
      let red = Number(m[i]);
      let green = Number(m[i+1]);
      let blue = Number(m[i+2]);
      color['red'] = red
      color['green'] = green
      color['blue'] = blue
      result.push(color);
    }
    console.log(result, "RESULT");
    index = 0;
    patternCall ++
    let currentCall = patternCall

    redLED.pwmWrite(0);
    greenLED.pwmWrite(0);
    blueLED.pwmWrite(0);
    setTimeout(()=>{six(result, currentCall)}, 500);

  }

function six(result, currentCall) {
  if(currentCall != patternCall){
    return;
  }
  var clone = result.slice()
  var firstColor = Object.assign({}, clone[index]);
  if(index == clone.length-1){
    var secondColor = Object.assign({}, clone[0]);
    index = 0;
  }
  else {
    var secondColor = Object.assign({}, clone[index+1]);
    index ++;
  }
  let firstCopy = firstColor;
  let incRed = (firstColor.red - secondColor.red);
  let incGreen = (firstColor.green - secondColor.green);
  let incBlue = (firstColor.blue - secondColor.blue);
  incRed = incRed/100;
  incGreen = incGreen/100;
  incBlue = incBlue/100;
  if(firstColor.red > secondColor.red){
    incRed = -Math.abs(incRed)
  }
  else{
    incRed = Math.abs(incRed)
  }
  if(firstColor.green > secondColor.green){
    incGreen = -Math.abs(incGreen)
  }
  else{
    incGreen = Math.abs(incGreen)
  }
  if(firstColor.blue > secondColor.blue){
    incBlue = -Math.abs(incBlue)
  }
  else{
    incBlue = Math.abs(incBlue)
  }
  let i=0;

  var theInterval = setInterval(function smooth(){
    if(currentCall != patternCall){
      return;
    }
    i++
    firstCopy.red += incRed
    firstCopy.green += incGreen
    firstCopy.blue += incBlue
    if(firstCopy.red > 255){
      firstCopy.red = 255;
    }
    else if(firstCopy.red < 0){
      firstCopy.red = 0;
    }
    if(firstCopy.green > 255){
      firstCopy.green = 255;
    }
    else if(firstCopy.green < 0){
      firstCopy.green = 0;
    }
    if(firstCopy.blue > 255){
      firstCopy.blue = 255;
    }
    else if(firstCopy.blue < 0){
      firstCopy.blue = 0;
    }
    redLED.pwmWrite(Math.floor(firstCopy.red));
    greenLED.pwmWrite(Math.floor(firstCopy.green));
    blueLED.pwmWrite(Math.floor(firstCopy.blue));
    // led.color({red: Math.floor(firstCopy.red), blue: Math.floor(firstCopy.blue), green: Math.floor(firstCopy.green)})
    if(i >= 100){
      clearInterval(theInterval);
      six(result, currentCall)
    }
  }, 10)

}

// });
