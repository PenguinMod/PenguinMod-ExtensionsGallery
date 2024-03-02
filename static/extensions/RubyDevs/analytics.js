let countAPI = 'https://api.rubyteam.tech';
let id = '';

function validID(inputString) {
  // Define the pattern using a regular expression
  const pattern = /^RUBY_[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

  // Test the input string against the pattern
  return pattern.test(inputString);
}

let analyticsSettings = {
  clickCanvas: false,
  flagClick: false,
  projectStop: false,
  keyPresses: false,
};

async function counterSet(keyname) {
  if (analyticsSettings[keyname] && id != '') {
    const response = await fetch(`${countAPI}/counter/set?keyname=${id}_${keyname}`);
    console.log(`${countAPI}/counter/set?keyname=${id}_${keyname}`)
    const data = await response.json();
    return data;
  }
}

async function getAnalytics(keyname) {
  return await fetch(`${countAPI}/counter/get?keyname=${id}_${keyname}`)
    .then(response => response.json())
    .then(response => {
      return response['count'] ?? 0;
    })
    .catch(err => {
      console.error(err);
      return 0;
    });
}

function toSettingKey(setting) {
  switch (setting) {
    case 'total clicks':
      return 'clickCanvas';
    case 'total flag clicks':
      return 'flagClick';
    case 'total project stops':
      return 'projectStop';
    case 'total key presses':
      return 'keyPresses';
    default:
      return;
  }
}

(function(Scratch) {
  const vm = Scratch.vm;
  const runtime = vm.runtime;

  Scratch.renderer.canvas.addEventListener('click', function() {
    counterSet('clickCanvas');
  });

  vm.on('PROJECT_START', function() {
    counterSet('flagClick');
  });

  runtime.on('PROJECT_STOP_ALL', function() {
    console.log('project stopped');
    counterSet('projectStop');
  });

  runtime.on('KEY_PRESSED', function() {
    console.log('key pressed');
    counterSet('keyPresses');
  });

  class Analytics {
    getInfo() {
      return {
        id: 'rubyanalytics',
        name: 'Ruby Analytics',
        color1: '#8034bc',
        blocks: [
          {
            opcode: 'rubydevs',
            blockType: Scratch.BlockType.LABEL,
            text: 'Made by Ruby Devs',
          },
          {
            opcode: 'makeid',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Make an ID',
          },
          {
            opcode: 'statsonline',
            blockType: Scratch.BlockType.BUTTON,
            text: 'See stats of any project online',
          },
          '---',
          {
            opcode: 'set_analytics_id',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set analytics ID to [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'RUBY_YOUR-ID-GOES-HERE',
              }
            },
          },
          {
            opcode: 'toggle_measure',
            blockType: Scratch.BlockType.COMMAND,
            text: '[TOGGLE] measuring of [ANALYTIC]',
            arguments: {
              TOGGLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'TOGGLE'
              },
              ANALYTIC: {
                type: Scratch.ArgumentType.STRING,
                menu: 'PROJECT_ANALYTICS_ALL'
              }
            },
          },
          {
            opcode: 'measure_enabled',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'measuring [ANALYTIC] enabled?',
            disableMonitor: true,
            arguments: {
              ANALYTIC: {
                type: Scratch.ArgumentType.STRING,
                menu: 'PROJECT_ANALYTICS'
              }
            },
          },
          {
            opcode: 'get_project_analytics',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get project\'s [ANALYTICS] analytic',
            disableMonitor: true,
            arguments: {
              ANALYTICS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'PROJECT_ANALYTICS'
              }
            },
          }
        ],
        menus: {
          TOGGLE: {
            acceptReporters: false,
            items: ['start', 'stop'],
          },
          PROJECT_ANALYTICS: {
            acceptReporters: false,
            items: ['total clicks', 'total flag clicks', 'total project stops', 'total key presses'],
          },
          PROJECT_ANALYTICS_ALL: {
            acceptReporters: false,
            items: ['all analytics','total clicks', 'total flag clicks', 'total project stops', 'total key presses'],
          },
        }
      };
    }

    set_analytics_id(args) {
      if (validID(args.ID)) {
        id = args.ID;
      } else {
        alert('"' + args.ID + '" is not a valid ID. Please make sure you entered the ID correctly.');
      }
    }

    toggle_measure(args) {
      const toggle = args.TOGGLE;
      const analytic = args.ANALYTIC;

      if (analytic == 'all analytics') {
        if (toggle == 'start') {
          for (const item in analyticsSettings) {
            analyticsSettings[item] = true;
          }
        } else if (toggle == 'stop') {
          for (const item in analyticsSettings) {
            analyticsSettings[item] = false;
          }
        }
        return;
      }

      const SSA = toSettingKey(analytic);

      if (toggle == 'start') {
        analyticsSettings[SSA] = true;
      } else if (toggle == 'stop') {
        analyticsSettings[SSA] = false;
      }
    }

    get_project_analytics(args) {
      const analytic = args.ANALYTICS;
      const GA = toSettingKey(analytic);
      return getAnalytics(GA);
    }

    measure_enabled(args) {
      const analytic = args.ANALYTIC;
      const GSA = toSettingKey(analytic);
      return analyticsSettings[GSA];
    }

    makeid() {
      window.open("https://rubyteam.tech/analytics/newid.html", '_blank');
    }

    statsonline() {
      window.open("https://rubyteam.tech/analytics/stats.html", '_blank');
    }
  }
  Scratch.extensions.register(new Analytics());
})(Scratch);