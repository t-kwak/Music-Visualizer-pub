class MusicPlayer {
  constructor() {
    this.mode = 'paused';
    this.flippedMode = {};
    this.flippedMode['paused'] = 'play';
    this.flippedMode['play'] = 'paused';

    this.audio = $(".audio-source")[0];
    this.ctx = new (AudioContext || window.webkitAudioContext)();
    this.analyser = this.ctx.createAnalyser();

    this.analyser.fftSize = 2048;
    this.audioSrc = this.ctx.createMediaElementSource(this.audio);
    this.freqArray = new Float32Array(this.analyser.frequencyBinCount);

    this.audioSrc.connect(this.analyser);
    this.audioSrc.connect(this.ctx.destination);

    this.barCount = 128;
    this.heightMultiplier = 3;

    this.addListeners();
    this.addBars();

  }

  addBars() { // This is Test Function, this will move somewhere else
    let tempArray = [];
    for (let i = 0; i < this.barCount ; i++){
      tempArray.push($(`<div class="testDivs ${i}"></div>`));
    }
    tempArray.forEach(div => {
      $(".test").append(div);
    });
  }

  letThereBe() {
    this.analyser.getFloatFrequencyData(this.freqArray);
    this.processFreqArray().forEach( (height, ind) => {
        $(`.testDivs.${ind}`).height(height);
      }
    );
    this.timeoutId = setTimeout(this.letThereBe.bind(this), 16);
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
  }

  processFreqArray() {

    let tempArray = [];

    for (let i = 0; i<this.barCount ; i++) {
      let val = this.freqArray[i] + 140;
      let curveIntensity = (this.barCount - 1 - i) * (3/127) + 1;
      val = Math.pow(val, curveIntensity + 1)/Math.pow(140, curveIntensity) * this.heightMultiplier;
      tempArray.push(val);
    }

    return tempArray;
  }

  addListeners() {
    $(".play-button").click(this.togglePlay.bind(this));
  }

  togglePlay() {
    switch (this.mode) {
      case 'play':
        this.mode = this.flippedMode[this.mode];
        this.audio.pause();
        $(".play-button img").attr("src", "images/circular-play-button.svg");
        clearTimeout(this.timeoutId);
        break;
      case 'paused':
        this.mode = this.flippedMode[this.mode];
        this.audio.play();
        $(".play-button img").attr("src", "images/circular-pause-button.svg");
        this.timeoutId = setTimeout(this.letThereBe.bind(this), 16); // timeout enables Soundbar Visuals
        break;
    }
  }
}

export default MusicPlayer;
