$(document).ready(function(){

  (function() {
    var pubnub = PUBNUB.init({
      publish_key: 'pub-c-e868dd6e-aea2-4b32-9f05-b21bac0e6997',
 subscribe_key: 'sub-c-cf99383a-7714-11e7-98e2-02ee2ddab7fe'
    });
    var channel = 'theled';
    var red = document.getElementById('red');
    var green = document.getElementById('green');
    var blue = document.getElementById('blue');
    // Initial brightness state
    var brightness = {
      r: 0,
      g: 0,
      b: 0
    };
    // UI Reset: Subscribe data from all subscibers of the channel to set the state correctly
    pubnub.subscribe({
      channel: channel,
      message: resetSliders, // reset the slider UI every time a subscriber makes a change
      connect: initSliders // initialize the slider states for the fisrt time launching the app
    });

    function resetSliders(m) {
      red.value = brightness.r = m.r;
      green.value = brightness.g = m.g;
      blue.value = brightness.b = m.b;
    }

    function initSliders() {
      pubnub.history({
        channel: channel,
        count: 1,
        callback: function(messages) {
          messages[0].forEach(function(m) {
            console.log(m);
            resetSliders(m);
          });
        }
      });
    }

    function publishUpdate(data) {
      console.log(data);
      pubnub.publish({
        channel: channel,
        message: data
      });
    }
    // UI EVENTS
    red.addEventListener('change', function(e) {
      console.log("changing red");
      brightness.r = this.value;
      publishUpdate(brightness);
    }, false);
    green.addEventListener('change', function(e) {
      brightness.g = this.value;
      publishUpdate(brightness);
    }, false);
    blue.addEventListener('change', function(e) {
      brightness.b = this.value;
      publishUpdate(brightness);
    }, false);
  })();

})
