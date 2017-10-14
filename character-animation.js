class CharacterAnimation {
  
  static create(element) {
    return new CharacterAnimation(element);
  }
  
  constructor(element) {
    this.element = element;
    this.frames = [];
    this.frameRate = 250;
    
    this.nextAnimationFrame = null;

    this.statesConfig = {
      walking: {
        frameRate: 210,
        frames: ['0%', '20%', '40%', '60%']
      },
      standing: {
        frameRate: 400,
        frames: ['80%', '100%']
      }
    };

    this._setupState(this.statesConfig.walking);
  }
  
  start() {
    window.requestAnimationFrame(() => this._step());
  }
  
  stop(){
    if (this.nextAnimationFrame) {
      clearTimeout(this.nextAnimationFrame);
      this.nextAnimationFrame = null;
    }
  }

  walk() {
    this.stop();
    this._setupState(this.statesConfig.walking);
    this.start();
  }

  stand() {
    this.stop();
    this._setupState(this.statesConfig.standing);
    this.start();
  }
  
  _step() {
    // walk.classList.remove(...frames);
    const nextState = this.frames.shift();
    // walk.classList.add(nextState);
    this.frames.push(nextState);
    this.element.style.backgroundPosition = `${nextState} 0`;
    this.nextAnimationFrame = setTimeout(() => {
      window.requestAnimationFrame(() => this._step());
    }, this.frameRate);
  }
  
  _setupState(config) {
    this.frames = [...config.frames];
    this.frameRate = config.frameRate;
  }

}
  