(function (Scratch) {
  'use strict';

  if (!Scratch || !Scratch.extensions || !Scratch.extensions.register) {
    throw new Error('SmartVariables requires Scratch extension API.');
  }

  const B = Scratch.BlockType;
  const A = Scratch.ArgumentType;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const number = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="g" x2="1" y2="1">
        <stop stop-color="#a3e635"/>
        <stop offset="1" stop-color="#16a34a"/>
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="120" height="120" rx="27" fill="#172554"/>
    <rect x="25" y="25" width="78" height="78" rx="15" fill="url(#g)"/>
    <path d="M43 47h42M43 64h42M43 81h25"
      fill="none" stroke="#10231a" stroke-width="8" stroke-linecap="round"/>
    <circle cx="88" cy="83" r="12" fill="#facc15"/>
  </svg>`;

  const iconURI =
    'data:image/svg+xml;base64,' +
    (typeof btoa === 'function' ? btoa(icon) : '');

  class SmartVariables {
    constructor() {
      this.variables = new Map();
      this.version = 1;
      this.revision = 0;
      this.lastChanged = '';
      this.lastError = '';
    }

    getInfo() {
      return {
        id: 'gid12345609smartvars',
        name: 'Smart Variables',
        color1: '#65A30D',
        color2: '#4D7C0F',
        color3: '#365314',
        menuIconURI: iconURI,
        blockIconURI: iconURI,

        blocks: [
          {
            opcode: 'create',
            blockType: B.COMMAND,
            text: 'create variable [NAME] type [TYPE] default [VALUE]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' },
              TYPE: {
                type: A.STRING,
                menu: 'types'
              },
              VALUE: { type: A.STRING, defaultValue: '0' }
            }
          },
          {
            opcode: 'set',
            blockType: B.COMMAND,
            text: 'set variable [NAME] to [VALUE]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' },
              VALUE: { type: A.STRING, defaultValue: '100' }
            }
          },
          {
            opcode: 'setNumber',
            blockType: B.COMMAND,
            text: 'set number variable [NAME] to [VALUE]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' },
              VALUE: { type: A.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setBoolean',
            blockType: B.COMMAND,
            text: 'set Boolean variable [NAME] to [VALUE]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'enabled' },
              VALUE: { type: A.BOOLEAN, defaultValue: true }
            }
          },
          {
            opcode: 'change',
            blockType: B.COMMAND,
            text: 'change variable [NAME] by [VALUE]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' },
              VALUE: { type: A.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'calculate',
            blockType: B.COMMAND,
            text: 'calculate variable [NAME] [OP] [VALUE]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' },
              OP: { type: A.STRING, menu: 'operations' },
              VALUE: { type: A.NUMBER, defaultValue: 2 }
            }
          },
          {
            opcode: 'toggle',
            blockType: B.COMMAND,
            text: 'toggle Boolean variable [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'enabled' }
            }
          },
          {
            opcode: 'append',
            blockType: B.COMMAND,
            text: 'append [VALUE] to text variable [NAME]',
            arguments: {
              VALUE: { type: A.STRING, defaultValue: ' world' },
              NAME: { type: A.STRING, defaultValue: 'message' }
            }
          },
          {
            opcode: 'uppercase',
            blockType: B.COMMAND,
            text: 'uppercase text variable [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'message' }
            }
          },
          {
            opcode: 'lowercase',
            blockType: B.COMMAND,
            text: 'lowercase text variable [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'message' }
            }
          },
          {
            opcode: 'delete',
            blockType: B.COMMAND,
            text: 'delete variable [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' }
            }
          },
          {
            opcode: 'clear',
            blockType: B.COMMAND,
            text: 'delete all Smart Variables'
          },

          '---',

          {
            opcode: 'get',
            blockType: B.REPORTER,
            text: 'value of variable [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' }
            }
          },
          {
            opcode: 'getNumber',
            blockType: B.REPORTER,
            text: 'number value of [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' }
            }
          },
          {
            opcode: 'getBoolean',
            blockType: B.BOOLEAN,
            text: 'Boolean value of [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'enabled' }
            }
          },
          {
            opcode: 'exists',
            blockType: B.BOOLEAN,
            text: 'variable [NAME] exists?',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' }
            }
          },
          {
            opcode: 'getType',
            blockType: B.REPORTER,
            text: 'type of variable [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'score' }
            }
          },
          {
            opcode: 'count',
            blockType: B.REPORTER,
            text: 'Smart Variable count'
          },
          {
            opcode: 'length',
            blockType: B.REPORTER,
            text: 'length of variable [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'message' }
            }
          },
          {
            opcode: 'revision',
            blockType: B.REPORTER,
            text: 'Smart Variables revision'
          },
          {
            opcode: 'lastChanged',
            blockType: B.REPORTER,
            text: 'last changed variable name'
          },
          {
            opcode: 'lastError',
            blockType: B.REPORTER,
            text: 'last Smart Variables error'
          },

          '---',

          {
            opcode: 'push',
            blockType: B.COMMAND,
            text: 'push [VALUE] to list [NAME]',
            arguments: {
              VALUE: { type: A.STRING, defaultValue: 'item' },
              NAME: { type: A.STRING, defaultValue: 'inventory' }
            }
          },
          {
            opcode: 'pop',
            blockType: B.REPORTER,
            text: 'pop last item from list [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'inventory' }
            }
          },
          {
            opcode: 'item',
            blockType: B.REPORTER,
            text: 'item [INDEX] of list [NAME]',
            arguments: {
              INDEX: { type: A.NUMBER, defaultValue: 1 },
              NAME: { type: A.STRING, defaultValue: 'inventory' }
            }
          },
          {
            opcode: 'setItem',
            blockType: B.COMMAND,
            text: 'set item [INDEX] of list [NAME] to [VALUE]',
            arguments: {
              INDEX: { type: A.NUMBER, defaultValue: 1 },
              NAME: { type: A.STRING, defaultValue: 'inventory' },
              VALUE: { type: A.STRING, defaultValue: 'new item' }
            }
          },
          {
            opcode: 'removeItem',
            blockType: B.COMMAND,
            text: 'remove item [INDEX] from list [NAME]',
            arguments: {
              INDEX: { type: A.NUMBER, defaultValue: 1 },
              NAME: { type: A.STRING, defaultValue: 'inventory' }
            }
          },
          {
            opcode: 'listSize',
            blockType: B.REPORTER,
            text: 'number of items in list [NAME]',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'inventory' }
            }
          },
          {
            opcode: 'listJSON',
            blockType: B.REPORTER,
            text: 'list [NAME] as JSON',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'inventory' }
            }
          },

          '---',

          {
            opcode: 'setKey',
            blockType: B.COMMAND,
            text: 'set key [KEY] of dictionary [NAME] to [VALUE]',
            arguments: {
              KEY: { type: A.STRING, defaultValue: 'name' },
              NAME: { type: A.STRING, defaultValue: 'player' },
              VALUE: { type: A.STRING, defaultValue: 'Penguin' }
            }
          },
          {
            opcode: 'getKey',
            blockType: B.REPORTER,
            text: 'get key [KEY] from dictionary [NAME]',
            arguments: {
              KEY: { type: A.STRING, defaultValue: 'name' },
              NAME: { type: A.STRING, defaultValue: 'player' }
            }
          },
          {
            opcode: 'hasKey',
            blockType: B.BOOLEAN,
            text: 'dictionary [NAME] has key [KEY]?',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'player' },
              KEY: { type: A.STRING, defaultValue: 'name' }
            }
          },
          {
            opcode: 'deleteKey',
            blockType: B.COMMAND,
            text: 'delete key [KEY] from dictionary [NAME]',
            arguments: {
              KEY: { type: A.STRING, defaultValue: 'name' },
              NAME: { type: A.STRING, defaultValue: 'player' }
            }
          },
          {
            opcode: 'dictionaryJSON',
            blockType: B.REPORTER,
            text: 'dictionary [NAME] as JSON',
            arguments: {
              NAME: { type: A.STRING, defaultValue: 'player' }
            }
          },

          '---',

          {
            opcode: 'exportJSON',
            blockType: B.REPORTER,
            text: 'export all Smart Variables as JSON'
          },
          {
            opcode: 'importJSON',
            blockType: B.COMMAND,
            text: 'import Smart Variables from JSON [DATA]',
            arguments: {
              DATA: { type: A.STRING, defaultValue: '{}' }
            }
          }
        ],

        menus: {
          types: {
            acceptReporters: false,
            items: ['Auto', 'Number', 'Text', 'Boolean', 'List', 'Dictionary']
          },
          operations: {
            acceptReporters: false,
            items: [
              'add',
              'subtract',
              'multiply',
              'divide',
              'modulo',
              'power',
              'minimum',
              'maximum'
            ]
          }
        }
      };
    }

    _name(value) {
      return String(value == null ? '' : value).trim();
    }

    _record(name) {
      return this.variables.get(this._name(name));
    }

    _touch(name) {
      this.revision++;
      this.lastChanged = name;
      this.lastError = '';
    }

    _infer(value) {
      if (typeof value === 'number') return 'Number';
      if (typeof value === 'boolean') return 'Boolean';
      if (Array.isArray(value)) return 'List';
      if (value && typeof value === 'object') return 'Dictionary';
      return 'Text';
    }

    _parse(value, type) {
      const raw = String(value);

      switch (type) {
        case 'Number':
          return number(raw);

        case 'Boolean':
          return raw.toLowerCase() === 'true' ||
            raw === '1';

        case 'List':
        case 'Dictionary':
          try {
            const parsed = JSON.parse(raw);
            if (type === 'List' && !Array.isArray(parsed)) return [];
            if (type === 'Dictionary' &&
                (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))) {
              return {};
            }
            return parsed;
          } catch (e) {
            return type === 'List' ? [] : {};
          }

        case 'Text':
        case 'Auto':
        default:
          if (raw === 'true') return true;
          if (raw === 'false') return false;
          if (raw.trim() !== '' && Number.isFinite(Number(raw))) {
            return Number(raw);
          }
          return raw;
      }
    }

    _put(name, value, type) {
      name = this._name(name);
      if (!name) {
        this.lastError = 'Variable name cannot be empty.';
        return;
      }

      const actualType = type === 'Auto'
        ? this._infer(value)
        : type;

      this.variables.set(name, {
        type: actualType,
        value
      });

      this._touch(name);
    }

    create(args) {
      const name = this._name(args.NAME);
      const type = String(args.TYPE || 'Auto');
      const value = this._parse(args.VALUE, type);
      this._put(name, value, type);
    }

    set(args) {
      const name = this._name(args.NAME);
      const old = this._record(name);
      const type = old ? old.type : 'Auto';

      this._put(name, this._parse(args.VALUE, type), type);
    }

    setNumber(args) {
      this._put(this._name(args.NAME), number(args.VALUE), 'Number');
    }

    setBoolean(args) {
      this._put(this._name(args.NAME), !!args.VALUE, 'Boolean');
    }

    change(args) {
      const name = this._name(args.NAME);
      const old = this._record(name);
      const current = old ? number(old.value) : 0;

      this._put(name, current + number(args.VALUE), 'Number');
    }

    calculate(args) {
      const name = this._name(args.NAME);
      const old = this._record(name);
      const a = old ? number(old.value) : 0;
      const b = number(args.VALUE);

      let result = a;

      switch (args.OP) {
        case 'add': result = a + b; break;
        case 'subtract': result = a - b; break;
        case 'multiply': result = a * b; break;
        case 'divide':
          result = b === 0 ? 0 : a / b;
          break;
        case 'modulo':
          result = b === 0 ? 0 : a % b;
          break;
        case 'power': result = Math.pow(a, b); break;
        case 'minimum': result = Math.min(a, b); break;
        case 'maximum': result = Math.max(a, b); break;
      }

      if (!Number.isFinite(result)) result = 0;

      this._put(name, result, 'Number');
    }

    toggle(args) {
      const name = this._name(args.NAME);
      const old = this._record(name);

      this._put(name, !(old && old.value === true), 'Boolean');
    }

    append(args) {
      const name = this._name(args.NAME);
      const old = this._record(name);
      const value = old ? String(old.value) : '';

      this._put(name, value + String(args.VALUE), 'Text');
    }

    uppercase(args) {
      const name = this._name(args.NAME);
      const old = this._record(name);

      if (old) {
        this._put(name, String(old.value).toUpperCase(), 'Text');
      }
    }

    lowercase(args) {
      const name = this._name(args.NAME);
      const old = this._record(name);

      if (old) {
        this._put(name, String(old.value).toLowerCase(), 'Text');
      }
    }

    delete(args) {
      const name = this._name(args.NAME);

      if (this.variables.delete(name)) {
        this._touch(name);
      }
    }

    clear() {
      this.variables.clear();
      this._touch('*');
    }

    get(args) {
      const item = this._record(args.NAME);
      if (!item) return '';

      if (item.value === null || item.value === undefined) return '';
      if (typeof item.value === 'object') {
        return JSON.stringify(item.value);
      }

      return String(item.value);
    }

    getNumber(args) {
      const item = this._record(args.NAME);
      return item ? number(item.value) : 0;
    }

    getBoolean(args) {
      const item = this._record(args.NAME);
      return !!(item && item.value);
    }

    exists(args) {
      return this.variables.has(this._name(args.NAME));
    }

    getType(args) {
      const item = this._record(args.NAME);
      return item ? item.type : 'Undefined';
    }

    count() {
      return this.variables.size;
    }

    length(args) {
      const item = this._record(args.NAME);
      if (!item) return 0;

      if (
        typeof item.value === 'string' ||
        Array.isArray(item.value)
      ) {
        return item.value.length;
      }

      if (item.value && typeof item.value === 'object') {
        return Object.keys(item.value).length;
      }

      return String(item.value).length;
    }

    revision() {
      return this.revision;
    }

    lastChanged() {
      return this.lastChanged;
    }

    lastError() {
      return this.lastError;
    }

    _getList(name) {
      const item = this._record(name);

      if (!item || !Array.isArray(item.value)) {
        return null;
      }

      return item.value;
    }

    push(args) {
      const name = this._name(args.NAME);
      let list = this._getList(name);

      if (!list) {
        list = [];
      }

      list.push(args.VALUE);
      this._put(name, list, 'List');
    }

    pop(args) {
      const list = this._getList(args.NAME);
      if (!list || !list.length) return '';

      const value = list.pop();
      this._touch(this._name(args.NAME));

      return String(value);
    }

    item(args) {
      const list = this._getList(args.NAME);
      if (!list) return '';

      const index = Math.floor(number(args.INDEX)) - 1;

      if (index < 0 || index >= list.length) return '';

      const value = list[index];

      return typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);
    }

    setItem(args) {
      const name = this._name(args.NAME);
      const list = this._getList(name);
      if (!list) return;

      const index = Math.floor(number(args.INDEX)) - 1;

      if (index < 0 || index >= list.length) return;

      list[index] = args.VALUE;
      this._touch(name);
    }

    removeItem(args) {
      const name = this._name(args.NAME);
      const list = this._getList(name);
      if (!list) return;

      const index = Math.floor(number(args.INDEX)) - 1;

      if (index < 0 || index >= list.length) return;

      list.splice(index, 1);
      this._touch(name);
    }

    listSize(args) {
      const list = this._getList(args.NAME);
      return list ? list.length : 0;
    }

    listJSON(args) {
      const list = this._getList(args.NAME);
      return list ? JSON.stringify(list) : '[]';
    }

    _getDictionary(name) {
      const item = this._record(name);

      if (
        !item ||
        !item.value ||
        typeof item.value !== 'object' ||
        Array.isArray(item.value)
      ) {
        return null;
      }

      return item.value;
    }

    setKey(args) {
      const name = this._name(args.NAME);
      const dict = this._getDictionary(name) || {};

      dict[String(args.KEY)] = args.VALUE;
      this._put(name, dict, 'Dictionary');
    }

    getKey(args) {
      const dict = this._getDictionary(args.NAME);
      if (!dict) return '';

      const value = dict[String(args.KEY)];

      if (value === undefined || value === null) return '';

      return typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);
    }

    hasKey(args) {
      const dict = this._getDictionary(args.NAME);

      return !!dict &&
        Object.prototype.hasOwnProperty.call(
          dict,
          String(args.KEY)
        );
    }

    deleteKey(args) {
      const name = this._name(args.NAME);
      const dict = this._getDictionary(name);

      if (!dict) return;

      if (Object.prototype.hasOwnProperty.call(dict, String(args.KEY))) {
        delete dict[String(args.KEY)];
        this._touch(name);
      }
    }

    dictionaryJSON(args) {
      const dict = this._getDictionary(args.NAME);
      return dict ? JSON.stringify(dict) : '{}';
    }

    exportJSON() {
      const output = {};

      for (const [name, item] of this.variables) {
        output[name] = {
          type: item.type,
          value: item.value
        };
      }

      return JSON.stringify({
        version: this.version,
        variables: output
      });
    }

    importJSON(args) {
      try {
        const data = JSON.parse(String(args.DATA));

        if (
          !data ||
          typeof data !== 'object' ||
          !data.variables ||
          typeof data.variables !== 'object' ||
          Array.isArray(data.variables)
        ) {
          throw new Error('Invalid Smart Variables JSON.');
        }

        const imported = new Map();

        for (const [name, item] of Object.entries(data.variables)) {
          if (
            !item ||
            typeof item !== 'object' ||
            !['Number', 'Text', 'Boolean', 'List', 'Dictionary'].includes(item.type)
          ) {
            continue;
          }

          let value = item.value;

          if (item.type === 'List' && !Array.isArray(value)) {
            value = [];
          }

          if (
            item.type === 'Dictionary' &&
            (!value || typeof value !== 'object' || Array.isArray(value))
          ) {
            value = {};
          }

          if (item.type === 'Number') {
            value = number(value);
          }

          if (item.type === 'Boolean') {
            value = !!value;
          }

          imported.set(name, {
            type: item.type,
            value
          });
        }

        this.variables = imported;
        this._touch('*');
      } catch (e) {
        this.lastError = String(e.message || e);
      }
    }
  }

  Scratch.extensions.register(new SmartVariables());
})(Scratch);
