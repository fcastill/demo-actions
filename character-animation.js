class CharacterAnimation {
  
  static create(scene, character) {
    return new CharacterAnimation(scene, character);
  }
  
  constructor(scene, character) {
    this.totalFrames = 6;

    this.character = character;
    this.scene = scene;
    this.sceneState = { x: 0 };

    this.frames = [];
    this.frameRate = 250;
    
    this.nextAnimationFrame = null;

    this.statesConfig = {
      walking: {
        frameRate: 210,
        frames: [0, 1, 2, 3]
      },
      standing: {
        frameRate: 400,
        frames: [4, 5]
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
    const nextFrameIndex = this.frames.shift();
    this.frames.push(nextFrameIndex);
    const framePosition = 100 / (this.totalFrames - 1) * nextFrameIndex;
    // const framePosition = this.character.offsetWidth * nextFrameIndex;
    this.character.style.backgroundPosition = `${framePosition}% 0`;
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
  