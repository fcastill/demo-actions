
const app = new Vue({
  el: '#app',
  data: {
    ws: null,
    host: 'localhost:8090',
    connStatus: 'offline',
    lastMessage: null,
    settings: {
      isOpen: true,
      newHost: null,
    },
    animation: null,
  },
  mounted() {
    this.settings.newHost = this.host;

    characterEl = document.getElementById('character');
    sceneEl = document.getElementById('scene');
    this.animation = CharacterAnimation.create(scene, character);
    this.animation.start();

    // maintain aspect ratio for character
    const onResize = () => {
      characterEl.style.width = `${characterEl.offsetHeight * 1.6745}px`;
    }
    window.addEventListener('resize', onResize);
    onResize();

  },
  computed: {
    status() {
      if (this.lastMessage) {
        return Object.keys(this.lastMessage).reduce((mostProbable, action) => {
          if (this.lastMessage[action] > mostProbable.probability) {
            mostProbable = {
              name: action,
              probability: this.lastMessage[action]
            };
          }
          return mostProbable;
        }, {
          name: null,
          probability: Number.NEGATIVE_INFINITY
        });
      }
      return {
        name: 'unknown 🤔'
      };
    },
    isWalking() {
      return this.status && this.status.name == 'walking';
    },
    connectionClass() {
      return {
        'is-success': this.connStatus === 'online',
        'is-warning': this.connStatus === 'connecting',
        'is-danger': this.connStatus === 'offline',
      };
    }
  },
  watch: {
    status(status, oldStatus) {
      console.log('statusChanged', status, oldStatus);
      if (!status || !oldStatus || status.name === oldStatus.name) {
        return;
      }
      if (status.name === 'walking') {
        this.animation.walk();
      } else {
        this.animation.stand();
      }
    }
  },
  methods: {
    openSettings() {
      this.settings.newHost = this.host;
      this.settings.isOpen = true;
    },
    closeSettings() {
      this.settings.isOpen = false;
    },
    saveSettings() {
      this.settings.isOpen = false;
      const newHost = this.settings.newHost;
      this.host = newHost.startsWith('ws://') ? newHost : `ws://${newHost}`;
      this.connect();
    },
    onMessage(event) {
      console.groupCollapsed('wsReceivedMessage');
      console.log(event.data);
      console.groupEnd();
      let msg;
      try {
        msg = JSON.parse(event.data);
        this.lastMessage = msg;
      } catch (error) {
        console.error('Ignoring malformed json');
      }
    },
    probToPercentage(probability) {
      let prob = 0;
      if (probability > 0) {
        prob = probability < 1 ? probability : 1;
      }
      return `${prob*100}%`; 
    },
    onConnectionOpen() {
      console.log('Connection open');
      this.connStatus = 'online';
    },
    onConnectionClose() {
      console.log('Connection closed');
      this.connStatus = 'offline';
    },
    connect() {
      console.log(`Connecting to "${this.host}"...`);
      if (this.ws) {
        // clean old connection
        this.ws.cleanListeners();
        this.ws.close();
      }

      this.connStatus = 'connecting';
      try {
        this.ws = new WebSocket(this.host);
      } catch (e) {
        this.connStatus = 'offline';
        console.error(e);
        return;
      }

      let messageHandler = this.onMessage.bind(this);
      this.ws.addEventListener('message', messageHandler);

      let openHandler = this.onConnectionOpen.bind(this);
      this.ws.addEventListener('open', openHandler);

      let closeHandler = this.onConnectionClose.bind(this);
      this.ws.addEventListener('close', closeHandler);

      this.ws.cleanListeners = function () {
        this.removeEventListener('message', messageHandler);
        this.removeEventListener('open', openHandler);
        this.removeEventListener('close', closeHandler);
      };
    },
  }
});
