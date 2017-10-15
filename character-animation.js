class CharacterAnimation {
  
  static create(scene, character) {
    return new CharacterAnimation(scene, character);
  }
  
  constructor(scene, character) {
    this.character = character;
    this.scene = scene;
    this.sceneState = { x: 0 };

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

    this._setupSceneTweening();
    this._setupState(this.statesConfig.standing);
  }
  
  start() {
    window.requestAnimationFrame(() => this._step());
    if (this.sceneTween) {
      this.sceneTween.start();
    }
  }
  
  stop(){
    if (this.nextAnimationFrame) {
      clearTimeout(this.nextAnimationFrame);
      this.nextAnimationFrame = null;
    }
    if (this.sceneTween) {
      this.sceneTween.stop();
    }
  }

  walk() {
    this.stop();
    this._setupState(this.statesConfig.walking);
    this.sceneTween = this._makeTween(90000);
    this.start();
  }

  stand() {
    // this.sceneTween.stop();
    this.stop();
    this._setupState(this.statesConfig.standing);
    this.sceneTween = this._makeTween(1000000);
    this.start();
  }
  
  _step() {
    // walk.classList.remove(...frames);
    const nextState = this.frames.shift();
    // walk.classList.add(nextState);
    this.frames.push(nextState);
    this.character.style.backgroundPosition = `${nextState} 0`;
    this.nextAnimationFrame = setTimeout(() => {
      window.requestAnimationFrame(() => this._step());
    }, this.frameRate);
  }
  
  _setupState(config) {
    this.frames = [...config.frames];
    this.frameRate = config.frameRate;
  }

  _setupSceneTweening() {
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    animate();
  }

  _makeTween(duration) {
    const self = this;
    return new TWEEN.Tween(this.sceneState) // Create a new tween that modifies 'coords'.
      .to({ x: self.scene.offsetWidth }, duration)
      .repeat(Infinity)
      // .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => { // Called after tween.js updates 'coords'.
          self.scene.style.backgroundPosition = `-${self.sceneState.x}vw 0`;
      });
  }

}
  