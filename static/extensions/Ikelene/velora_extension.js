// Velora Scratch Extension v1.1 (or something i stopped keeping track i think)
// https://velora.ikelene.net
(function () {
  'use strict';

  const SERVER_HTTP = 'https://velora.ikelene.net';
  const SERVER_WS   = 'wss://velora.ikelene.net';
  const EXT_ID      = 'ikelenepmvelora';

  // copy pasted from auth.js's SCOPES obj, gotta keep these two in sync by hand
  // since this file can't just require() the server code
  const SCOPES = {
    PROFILE_READ: 1,
    PROFILE_SENSITIVE: 2,
    PROJECT_AUTH: 4,
    ACCOUNT_WRITE: 8,
    STORAGE_READ: 16,
    STORAGE_WRITE: 32,
    VMAIL_READ: 64,
    VMAIL_SEND: 128,
    FRIENDS_READ: 256,
    FRIENDS_MANAGE: 512,
    CURRENCY_PAY: 1024,
    CHAT: 2048,
    MEDIA_UPLOAD: 4096,
    CURRENCY_READ: 8192,
  };
  const SCOPE_NAMES = {
    1: 'View Basic Profile',
    2: 'View Sensitive Info',
    4: 'Project Auth',
    8: 'Modify Settings',
    16: 'Read Storage',
    32: 'Write Storage',
    64: 'Read vMails',
    128: 'Send vMails',
    256: 'View Friends',
    512: 'Manage Friends',
    1024: 'Spend Credits',
    2048: 'Chat Messaging',
    4096: 'Upload Media',
    8192: 'View Subscriptions',
  };

  class VeloraExtension {
    constructor(runtime) {
      this.runtime = runtime;
      // just a few variables
      this._token = null;
      this._grantedScopes = 0;
      this._user = null;
      this._ws = null;
      this._wsReady = false;
      this._storageId = null;
      this._accountObj = {};
      this._friends = [];
      this._friendRequests = [];
      this._mail = [];
      this._badges = [];
      this._callData = {};
      this._username = '';

      this._authenticated = false;
      this._connected = false;
      this._intentionalDisconnect = false;
      this._pollInterval = null;

      this._evtConnected = false;
      this._evtDisconnected = false;
      this._evtAuthenticated = false;
      this._lastAuthResult = null;
      this._evtAccountUpdated = false;
      this._evtMailReceived = false;
      this._evtFriendRequest = false;
      this._evtFriendAccepted = false;
      this._evtUserJoined = false;
      this._evtUserLeft = false;
      this._evtCallIncoming = false;
      this._evtBalanceChanged = false;
      this._lastUserJoined = '';
      this._lastUserLeft = '';

      this._globalMessages = [];
      this._roomMessages   = {};
      this._typingUsers    = [];
      this._onlinePlayers  = [];
      this._status = 'online';

      this._evtGlobalMsg = false;
      this._evtRoomMsgMap = {};
      this._lastMsg = null;

      this._uploadStatus = 'idle';
      this._lastUploadUrl = '';
      this._uploadProgress = 0;

      this._lastActionOutput = '';
      this._lastActionSuccess = false;

      this._loginHistory = [];
      this._evtNewLogin = false;
      this._knownLoginCount = -1;

      this._notifications = [];
      this._evtNotification = false;
      this._lastNotifTitle = '';
      this._lastNotifBody = '';
      this._notifInterval = null;

      this._selectedFile = null;
      this._selectedFileUrl = '';
      this._selectedFileName = '';
      this._selectedFileSize = 0;
      this._fileSelected = false;

      this._lookedUpUser = {};
    }

    getInfo() {
      return {
        id: EXT_ID,
        name: 'Velora',
        color1: '#7c3aed',
        color2: '#5b21b6',
        color3: '#4c1d95',
        blocks: [

          // connection stuff
          { blockType: 'label', text: 'Connection' },
          { opcode: 'whenConnected',    blockType: 'hat',     text: 'when connected to server' },
          { opcode: 'whenDisconnected', blockType: 'hat',     text: 'when disconnected from server' },
          { opcode: 'serverOnline',     blockType: 'Boolean', text: 'account server online' },
          { opcode: 'isConnected',      blockType: 'Boolean', text: 'is connected to server?' },

          { blockType: 'label', text: 'Authentication' },
          { func: 'openPermissionsCalc', blockType: 'button', text: 'Generate Permissions Integer' },
          { opcode: 'openLoginPrompt',  blockType: 'command', text: 'sign in to Velora for [PROJECT_NAME] with permissions [PERMISSIONS]', arguments: { PROJECT_NAME: { type: 'string', defaultValue: 'My Project' }, PERMISSIONS: { type: 'string', defaultValue: '5' } } },
          { opcode: 'loginWithToken',   blockType: 'command', text: 'login with token [TOKEN]', arguments: { TOKEN: { type: 'string', defaultValue: '' } } },
          { opcode: 'logout',           blockType: 'command', text: 'logout' },
          { opcode: 'currentToken',     blockType: 'reporter',text: 'current token' },
          { opcode: 'isLoginOpen',      blockType: 'Boolean', text: 'is login window open?' },
          { opcode: 'authResult',       blockType: 'Boolean', text: 'was authentication [RESULT]',
            arguments: { RESULT: { type: 'string', menu: 'authResultMenu', defaultValue: 'successful' } } },
          { opcode: 'whenAuthenticated',blockType: 'hat',     text: 'when authenticated' },

          // acc info
          { blockType: 'label', text: 'Account Information' },
          { opcode: 'getAccountKey',    blockType: 'reporter',text: 'get [KEY]',
            arguments: { KEY: { type: 'string', menu: 'accountKeys', defaultValue: 'username' } } },
          { opcode: 'keyExists',        blockType: 'Boolean', text: 'key [KEY] exists',
            arguments: { KEY: { type: 'string', menu: 'accountKeys', defaultValue: 'username' } } },
          { opcode: 'getAllKeys',        blockType: 'reporter',text: 'get all keys' },
          { opcode: 'getAllValues',      blockType: 'reporter',text: 'get all values' },
          { opcode: 'getAccountObject', blockType: 'reporter',text: 'get account object' },
          { opcode: 'isUserBanned',     blockType: 'Boolean', text: 'is account banned?' },
          { opcode: 'whenAccountUpdated',blockType:'hat',     text: 'when account updated' },

          { blockType: 'label', text: 'Profile' },
          { opcode: 'uploadPfp',    blockType: 'command', text: 'upload image [DATA_URI] as profile picture and [MODE]', arguments: { DATA_URI: { type: 'string', defaultValue: '' }, MODE: { type: 'string', menu: 'uploadModeMenu', defaultValue: 'wait' } } },
          { opcode: 'setChatColor', blockType: 'command', text: 'set chat color to [COLOR]', arguments: { COLOR: { type: 'string', defaultValue: '#c084fc' } } },

          // per-project save data, scoped to whoever's logged in so ppl cant mess with each others stuff
          { blockType: 'label', text: 'Data Storage' },
          { opcode: 'setStorageId',     blockType: 'command', text: 'set storage ID to [ID]', arguments: { ID: { type: 'string', defaultValue: 'myProject' } } },
          { opcode: 'storageIdSet',     blockType: 'Boolean', text: 'storage ID has been set?' },
          { opcode: 'getStorageId',     blockType: 'reporter',text: 'storage ID' },
          { opcode: 'getStorage',       blockType: 'reporter',text: 'get value of key [KEY]', arguments: { KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'setStorage',       blockType: 'command', text: 'set key [KEY] to [VALUE] in storage', arguments: { KEY: { type: 'string', defaultValue: 'score' }, VALUE: { type: 'string', defaultValue: '0' } } },
          { opcode: 'storageKeyExists', blockType: 'Boolean', text: 'key [KEY] exists in storage', arguments: { KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'deleteStorageKey', blockType: 'command', text: 'delete key [KEY] from storage', arguments: { KEY: { type: 'string', defaultValue: 'score' } } },
          { opcode: 'getAllStorageKeys',  blockType: 'reporter',text: 'get all keys from storage' },
          { opcode: 'getAllStorageValues',blockType: 'reporter',text: 'get all values from storage' },
          { opcode: 'clearStorage',     blockType: 'command', text: 'clear storage' },

          { blockType: 'label', text: 'Storage Information' },
          { opcode: 'storageUsage',     blockType: 'reporter',text: 'storage usage (characters)' },
          { opcode: 'storageLimit',     blockType: 'reporter',text: 'storage limit (characters)' },
          { opcode: 'storageRemaining', blockType: 'reporter',text: 'storage remaining (characters)' },
          { opcode: 'storageBiggest',   blockType: 'reporter',text: 'all storage values ordered biggest to smallest' },

          // chat stuff, sends over the websocket (more chat app focused compared to cloudlink)
          { blockType: 'label', text: 'Messaging' },
          { opcode: 'sendGlobalMessage',blockType: 'command', text: 'send global message [MSG]', arguments: { MSG: { type: 'string', defaultValue: 'Hello!' } } },
          { opcode: 'getGlobalMessages',blockType: 'reporter',text: 'global messages' },
          { opcode: 'sendRoomMessage',  blockType: 'command', text: 'send [MSG] in room [ROOM]', arguments: { MSG: { type: 'string', defaultValue: 'Hello!' }, ROOM: { type: 'string', defaultValue: 'general' } } },
          { opcode: 'getRoomMessages',  blockType: 'reporter',text: 'messages in room [ROOM]', arguments: { ROOM: { type: 'string', defaultValue: 'general' } } },
          { opcode: 'joinRoom',         blockType: 'command', text: 'join room [ROOM]', arguments: { ROOM: { type: 'string', defaultValue: 'general' } } },
          { opcode: 'setTyping',        blockType: 'command', text: 'set typing [STATE]', arguments: { STATE: { type: 'string', menu: 'onOff', defaultValue: 'on' } } },
          { opcode: 'typingUsers',      blockType: 'reporter',text: 'typing users' },

          { blockType: 'label', text: 'Chat Events' },
          { opcode: 'whenGlobalMessageReceived', blockType: 'hat', text: 'when global chat message received' },
          { opcode: 'whenRoomMessageReceived',   blockType: 'hat', text: 'when message in room [ROOM] received',
            arguments: { ROOM: { type: 'string', defaultValue: 'general' } } },
          { opcode: 'lastMessageUser',    blockType: 'reporter', text: 'last message user' },
          { opcode: 'lastMessageContent', blockType: 'reporter', text: 'last message content' },
          { opcode: 'lastMessageUserJson',blockType: 'reporter', text: 'last message user JSON' },

          { blockType: 'label', text: 'Client Information' },
          { opcode: 'clientUsername',   blockType: 'reporter',text: 'client username' },
          { opcode: 'myClientObject',   blockType: 'reporter',text: 'my client object' },

          // whos online rn
          { blockType: 'label', text: 'Users' },
          { opcode: 'connectedUsers',   blockType: 'reporter',text: 'connected users' },
          { opcode: 'setStatus',        blockType: 'command', text: 'set status to [STATUS]', arguments: { STATUS: { type: 'string', menu: 'statusMenu', defaultValue: 'online' } } },
          { opcode: 'isUserConnected',  blockType: 'Boolean', text: 'is user [USER] connected?', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'whenUserJoins',    blockType: 'hat',     text: 'when a user connects' },
          { opcode: 'whenUserLeaves',   blockType: 'hat',     text: 'when a user disconnects' },
          { opcode: 'lastUserJoined',   blockType: 'reporter',text: 'last user to join' },
          { opcode: 'lastUserLeft',     blockType: 'reporter',text: 'last user to leave' },

          // dms basically
          { blockType: 'label', text: 'vMail' },
          { opcode: 'whenMailReceived', blockType: 'hat',     text: 'when vMail received' },
          { opcode: 'sendMail',         blockType: 'command', text: 'send vMail to [TO] subject [SUBJECT] message [MSG]', arguments: { TO: { type: 'string', defaultValue: 'username' }, SUBJECT: { type: 'string', defaultValue: 'Hello!' }, MSG: { type: 'string', defaultValue: 'Message here' } } },
          { opcode: 'getMailList',      blockType: 'reporter',text: 'get vMail list' },
          { opcode: 'getMailBody',      blockType: 'reporter',text: 'get body of vMail at index [N]', arguments: { N: { type: 'number', defaultValue: 1 } } },
          { opcode: 'deleteMail',       blockType: 'command', text: 'delete vMail at index [N]', arguments: { N: { type: 'number', defaultValue: 1 } } },
          { opcode: 'deleteAllMail',    blockType: 'command', text: 'delete all vMail' },

          // friends list stuff
          { blockType: 'label', text: 'Friends' },
          { opcode: 'getFriendsList',   blockType: 'reporter',text: 'get friends list' },
          { opcode: 'sendFriendRequest',blockType: 'command', text: 'send friend request to [USER]', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'acceptFriendReq',  blockType: 'command', text: 'accept friend request from [USER]', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'declineFriendReq', blockType: 'command', text: 'decline friend request from [USER]', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'removeFriend',     blockType: 'command', text: 'remove friend [USER]', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'whenFriendRequest',blockType: 'hat',     text: 'when friend request received' },
          { opcode: 'whenFriendAccepted',blockType:'hat',     text: 'when friend request accepted' },
          { opcode: 'getFriendRequests',blockType: 'reporter',text: 'get friend requests' },
          { opcode: 'getFriendStatus',  blockType: 'reporter',text: 'get friend status of [USER]', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'getFriendCount',   blockType: 'reporter',text: 'get friend count' },

          // private lil sticky notes on other ppl's profiles
          { blockType: 'label', text: 'Profile Notes' },
          { opcode: 'getProfileNote',    blockType: 'reporter', text: 'get note for [USER]',            arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'setProfileNote',    blockType: 'command',  text: 'set note for [USER] to [NOTE]',  arguments: { USER: { type: 'string', defaultValue: 'username' }, NOTE: { type: 'string', defaultValue: '' } } },
          { opcode: 'deleteProfileNote', blockType: 'command',  text: 'delete note for [USER]',         arguments: { USER: { type: 'string', defaultValue: 'username' } } },

          // money
          { blockType: 'label', text: 'Currency' },
          { opcode: 'getBalance',       blockType: 'reporter',text: 'get balance' },
          { opcode: 'transferCredits',  blockType: 'command', text: 'transfer [AMOUNT] credits to [USER]', arguments: { AMOUNT: { type: 'number', defaultValue: 10 }, USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'whenBalanceChanged',blockType:'hat',     text: 'when balance changed' },
          { opcode: 'getTransactions',  blockType: 'reporter',text: 'get transactions' },
          { opcode: 'subscribe',        blockType: 'command', text: 'subscribe [AMOUNT] to [USER] every [PERIOD] with note [NOTE]', arguments: { AMOUNT: { type: 'number', defaultValue: 5 }, USER: { type: 'string', defaultValue: 'username' }, PERIOD: { type: 'string', menu: 'periodMenu', defaultValue: 'monthly' }, NOTE: { type: 'string', defaultValue: '' } } },
          { opcode: 'cancelSubscription',blockType:'command', text: 'cancel subscription to [USER]', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'getOutgoingSubs',  blockType: 'reporter',text: 'get outgoing subscriptions' },
          { opcode: 'getIncomingSubs',  blockType: 'reporter',text: 'get incoming subscriptions' },

          // uploading pics/audio/video
          { blockType: 'label', text: 'Media Upload' },
          { opcode: 'uploadImage', blockType: 'command', text: 'upload image [DATA_URI] and [MODE]', arguments: { DATA_URI: { type: 'string', defaultValue: '' }, MODE: { type: 'string', menu: 'uploadModeMenu', defaultValue: 'wait' } } },
          { opcode: 'uploadAudio', blockType: 'command', text: 'upload audio [DATA_URI] and [MODE]', arguments: { DATA_URI: { type: 'string', defaultValue: '' }, MODE: { type: 'string', menu: 'uploadModeMenu', defaultValue: 'wait' } } },
          { opcode: 'uploadVideo', blockType: 'command', text: 'upload video [DATA_URI] and [MODE]', arguments: { DATA_URI: { type: 'string', defaultValue: '' }, MODE: { type: 'string', menu: 'uploadModeMenu', defaultValue: 'wait' } } },
          { opcode: 'uploadStatus',   blockType: 'reporter', text: 'upload status' },
          { opcode: 'lastUploadUrl',  blockType: 'reporter', text: 'last upload URL' },
          { opcode: 'uploadProgress', blockType: 'reporter', text: 'upload progress (%)' },

          // lets ppl pick a file off their computer, handles big files fine unlike some other extensions i wont name
          { blockType: 'label', text: 'File Picker' },
          { opcode: 'openFilePicker', blockType: 'command', text: 'open file selector for [TYPE]', arguments: { TYPE: { type: 'string', menu: 'fileTypeMenu', defaultValue: 'videos' } } },
          { opcode: 'fileWasSelected',     blockType: 'Boolean',   text: 'file was selected' },
          { opcode: 'selectedFileUri',     blockType: 'reporter',  text: 'selected file data URI' },
          { opcode: 'selectedFileName',    blockType: 'reporter',  text: 'selected file name' },
          { opcode: 'selectedFileSize',    blockType: 'reporter',  text: 'selected file size (bytes)' },

          { blockType: 'label', text: 'Login History' },
          { opcode: 'whenNewLoginDetected', blockType: 'hat',     text: 'when new login detected' },
          { opcode: 'fetchLoginHistory',    blockType: 'command',  text: 'fetch login history' },
          { opcode: 'loginHistoryCount',    blockType: 'reporter', text: 'login history count' },
          { opcode: 'loginHistoryJSON',     blockType: 'reporter', text: 'login history (JSON)' },
          { opcode: 'lastLoginDevice',      blockType: 'reporter', text: 'last login device' },
          { opcode: 'lastLoginIP',          blockType: 'reporter', text: 'last login IP' },

          { blockType: 'label', text: 'User Lookup' },
          { opcode: 'lookupUser',         blockType: 'command',  text: 'look up user [USER]', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'lookedUpUsername',   blockType: 'reporter', text: 'looked up username' },
          { opcode: 'lookedUpRank',       blockType: 'reporter', text: 'looked up rank' },
          { opcode: 'lookedUpBio',        blockType: 'reporter', text: 'looked up bio' },
          { opcode: 'lookedUpPfp',        blockType: 'reporter', text: 'looked up pfp URL' },
          { opcode: 'lookedUpCountry',    blockType: 'reporter', text: 'looked up country' },
          { opcode: 'lookedUpJSON',       blockType: 'reporter', text: 'looked up user (JSON)' },

          // not system notis, ur app notis
          { blockType: 'label', text: 'Notifications' },
          { opcode: 'whenNotificationReceived', blockType: 'hat',     text: 'when notification received' },
          { opcode: 'notificationCount',        blockType: 'reporter',text: 'notification count' },
          { opcode: 'getNotifications',         blockType: 'reporter',text: 'get notifications (JSON)' },
          { opcode: 'clearNotifications',       blockType: 'command', text: 'clear all notifications' },
          { opcode: 'lastNotificationTitle',    blockType: 'reporter',text: 'last notification title' },
          { opcode: 'lastNotificationBody',     blockType: 'reporter',text: 'last notification body' },

          { blockType: 'label', text: 'Badges' },
          { opcode: 'badgesLoaded',     blockType: 'Boolean', text: 'badges loaded successfully' },
          { opcode: 'allBadges',        blockType: 'reporter',text: 'all user badges' },
          { opcode: 'badgeCount',       blockType: 'reporter',text: 'total badge count' },
          { opcode: 'hasBadge',         blockType: 'Boolean', text: 'does user have badge [BADGE]', arguments: { BADGE: { type: 'string', defaultValue: 'early_adopter' } } },
          { opcode: 'badgeInfo',        blockType: 'reporter',text: 'badge info [BADGE]', arguments: { BADGE: { type: 'string', defaultValue: 'early_adopter' } } },

          // vc stuff, sometiems doesn't work idk
          { blockType: 'label', text: 'Voice Calling' },
          { opcode: 'callUser',         blockType: 'command', text: 'call user [USER]', arguments: { USER: { type: 'string', defaultValue: 'username' } } },
          { opcode: 'whenCallReceived', blockType: 'hat',     text: 'when call received' },
          { opcode: 'callData',         blockType: 'reporter',text: 'call data' },
          { opcode: 'acceptCall',       blockType: 'command', text: 'accept call' },
          { opcode: 'setMic',           blockType: 'command', text: 'set mic to [STATE]', arguments: { STATE: { type: 'string', menu: 'onOff', defaultValue: 'on' } } },
          { opcode: 'stopCall',         blockType: 'command', text: 'stop call' },

          // for debugging
          { blockType: 'label', text: 'Verbose' },
          { opcode: 'lastActionOutput',  blockType: 'reporter',text: 'last action output (JSON)' },
          { opcode: 'lastActionSuccess', blockType: 'Boolean', text: 'last action successful?' },
        ],
        menus: {
          authResultMenu: {
            acceptReporters: false,
            items: ['successful', 'failed'],
          },
          accountKeys: {
            acceptReporters: true,
            items: ['username','email','rank','pfp','banner','bio','timezone','country',
                    'standing','sys.warning_level',
                    'sys.badges','sys.currency','sys.id','sys.items','sys.last_login',
                    'sys.logins','sys.tos_accepted','sys.tos_time','sys.total_logins',
                    'sys.transactions','created'],
          },
          onOff: { acceptReporters: false, items: ['on', 'off'] },
          statusMenu: { acceptReporters: false, items: ['online', 'idle', 'dnd'] },
          periodMenu: { acceptReporters: false, items: ['weekly','biweekly','monthly','bimonthly','yearly'] },
          uploadModeMenu: { acceptReporters: false, items: ['wait', 'continue'] },
          fileTypeMenu: { acceptReporters: false, items: ['videos', 'images', 'audio files'] },
        },
      };
    }

    _connectWS() {
      if (this._ws && this._ws.readyState < 2) return;
      this._wsReady = false;
      this._ws = new WebSocket(SERVER_WS);

      this._ws.onopen = () => {
        this._wsReady = true;
        this._connected = true;
        this._evtConnected = true;
        this._evtDisconnected = false;
        if (this._token) this._wsAuth();
        this._getOnlinePlayers();
      };

      this._ws.onmessage = (e) => {
        let msg; try { msg = JSON.parse(e.data); } catch { return; }
        this._handleWS(msg);
      };

      this._ws.onclose = () => {
        this._wsReady = false;
        this._connected = false;
        this._authenticated = false;
        this._evtDisconnected = true;
        this._intentionalDisconnect = false;
      };

      this._ws.onerror = () => {};
    }

    _wsSend(obj) {
      if (this._ws && this._ws.readyState === 1) {
        this._ws.send(JSON.stringify(obj));
      }
    }

    _wsAuth() {
      if (!this._token) return;
      this._wsSend({ type: 'auth_token', token: this._token });
    }

    _handleWS(msg) {
      switch (msg.type) {
        case 'auth_success':
          this._user = msg.user;
          this._username = msg.user?.username || '';
          this._authenticated = true;
          this._evtAuthenticated = true;
          this._fetchAccount();
          this._fetchFriends();
          this._fetchMail();
          this._fetchBadges();
          this._pollLoginHistory();
          this._fetchNotifications();
          if (!this._notifInterval) {
            this._notifInterval = setInterval(() => {
              if (this._token) { this._pollLoginHistory(); this._fetchNotifications(); }
            }, 30000);
          }
          break;
        case 'auth_error':
          this._authenticated = false;
          this._token = null;
          break;
        case 'kicked':
          this._authenticated = false;
          this._wsReady = false;
          this._connected = false;
          this._evtDisconnected = true;
          break;
        case 'user_joined':
          this._lastUserJoined = msg.username;
          this._evtUserJoined = true;
          this._onlinePlayers = this._onlinePlayers.filter(p => p.username !== msg.username);
          this._onlinePlayers.push({ username: msg.username, rank: msg.rank, status: 'online' });
          break;
        case 'user_left':
          this._lastUserLeft = msg.username;
          this._evtUserLeft = true;
          this._onlinePlayers = this._onlinePlayers.filter(p => p.username !== msg.username);
          break;
        case 'status_changed': {
          const p = this._onlinePlayers.find(p => p.username === msg.username);
          if (p) p.status = msg.status || 'online';
          break;
        }
        case 'globalMessage':
        case 'imageMessage':
          this._globalMessages.push(msg);
          if (this._globalMessages.length > 500) this._globalMessages.shift();
          this._evtGlobalMsg = true;
          this._lastMsg = msg;
          break;
        case 'roomMessage':
          if (!this._roomMessages[msg.room]) this._roomMessages[msg.room] = [];
          this._roomMessages[msg.room].push(msg);
          if (this._roomMessages[msg.room].length > 1000) this._roomMessages[msg.room].shift();
          this._evtRoomMsgMap[msg.room] = true;
          this._lastMsg = msg;
          break;
        case 'roomHistory':
          this._roomMessages[msg.room] = msg.messages;
          break;
        case 'globalHistory':
          this._globalMessages = msg.messages;
          break;
        case 'onlinePlayers':
          this._onlinePlayers = msg.players;
          break;
        case 'typing':
          if (!this._typingUsers.includes(msg.user)) this._typingUsers.push(msg.user);
          break;
        case 'stopTyping':
          this._typingUsers = this._typingUsers.filter(u => u !== msg.user);
          break;
        case 'account_updated':
          this._evtAccountUpdated = true;
          this._fetchAccount();
          break;
        case 'mail_received':
          this._evtMailReceived = true;
          this._fetchMail();
          break;
        case 'friend_request':
          this._evtFriendRequest = true;
          this._fetchFriends();
          break;
        case 'friend_request_accepted':
          this._evtFriendAccepted = true;
          this._fetchFriends();
          break;
        case 'friend_online':
        case 'friend_offline':
          this._fetchFriends();
          break;
        case 'balance_changed':
          this._evtBalanceChanged = true;
          if (this._accountObj.sys) this._accountObj.sys.currency = (this._accountObj.sys.currency || 0) + (msg.delta || 0);
          break;
        case 'call_incoming':
          this._evtCallIncoming = true;
          this._callData = msg;
          break;
        case 'pong':
          break;
      }
    }

    _getOnlinePlayers() {
      this._wsSend({ type: 'getOnlinePlayers' });
    }

    async _http(path, method = 'GET', body = null) {
      const headers = { 'Content-Type': 'application/json' };
      if (this._token) headers['Authorization'] = `Bearer ${this._token}`;
      // skipping the fingerprint header here too, same reason as _wsAuth above
      const opts = { method, headers };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(SERVER_HTTP + path, opts);
      return res.json().catch(() => ({}));
    }

    // checks scopes on OUR end first so the block goes red instantly instead of
    // waiting on a network round trip. server double checks everything anyway
    // so this is just for a snappier error message, not actual security
    _requireScope(bit) {
      if (!this._authenticated) throw new Error('Not logged in');
      if ((this._grantedScopes & bit) !== bit) {
        const name = SCOPE_NAMES[bit] || `scope ${bit}`;
        throw new Error(`Missing permission: this block needs the '${name}' scope. Generate a new Permission Integer that includes it at velora.ikelene.net/permissions.`);
      }
    }

    _scopeErrorFromData(data) {
      if (data && data.error === 'insufficient_scope') {
        const name = SCOPE_NAMES[data.required_scope] || `scope ${data.required_scope}`;
        return new Error(`Missing permission: this block needs the '${name}' scope. Generate a new Permission Integer that includes it at velora.ikelene.net/permissions.`);
      }
      return null;
    }

    async _cmd(path, method = 'GET', body = null) {
      const data = await this._http(path, method, body);
      this._lastActionOutput = JSON.stringify(data);
      this._lastActionSuccess = !!data.success;
      if (data.error) throw (this._scopeErrorFromData(data) || new Error(data.error));
      return data;
    }

    async _validateSavedToken() {
      const data = await this._http('/auth/validate', 'POST', { token: this._token }).catch(() => ({}));
      if (data.valid) {
        this._user = data.user;
        this._grantedScopes = Number(data.user?.scopes ?? 0);
        this._username = data.user?.username || '';
        this._authenticated = true;
        this._wsAuth();
        this._evtAuthenticated = true;
        this._lastAuthResult = 'successful';
        this._fetchAccount();
        this._fetchFriends();
        this._fetchMail();
        this._fetchBadges();
        this._pollLoginHistory();
        this._fetchNotifications();
        if (!this._notifInterval) {
          this._notifInterval = setInterval(() => {
            if (this._token) { this._pollLoginHistory(); this._fetchNotifications(); }
          }, 30000);
        }
      } else {
        this._authenticated = false;
        this._lastAuthResult = 'failed';
        this._token = null;
        this._grantedScopes = 0;
        this._username = '';
      }
    }

    async _fetchAccount() {
      if (!this._token) return;
      const data = await this._http('/account/me').catch(() => ({}));
      if (data.sys) {
        this._accountObj = data;
        this._badges = data.sys.badges || [];
        if (data.sys.username) this._username = data.sys.username;
      }
    }

    async _fetchFriends() {
      if (!this._token) return;
      try {
        const data = await this._http('/friends');
        if (data.friends) this._friends = data.friends;
      } catch (e) {
        if (e.message === 'insufficient_scope') this._friends = 'Permission Denied';
      }
      try {
        const reqData = await this._http('/friends/requests');
        if (reqData.incoming) this._friendRequests = reqData.incoming;
      } catch (e) {
        if (e.message === 'insufficient_scope') this._friendRequests = 'Permission Denied';
      }
    }

    async _fetchMail() {
      if (!this._token) return;
      try {
        const data = await this._http('/mail');
        if (data.mail) this._mail = data.mail;
      } catch(e) {
        if (e.message === 'insufficient_scope') this._mail = 'Permission Denied';
      }
    }

    async _fetchBadges() {
      if (!this._token) return;
      const data = await this._http('/account/me').catch(() => ({}));
      if (data.sys?.badges) this._badges = data.sys.badges;
    }

    _openLoginPopup(args) {
      if (this._pollInterval) return;

      let projName = String(args?.PROJECT_NAME || args?.project_name || 'My Project').trim();
      let rawPerm = args?.PERMISSIONS !== undefined && args?.PERMISSIONS !== null ? args.PERMISSIONS : (args?.permissions !== undefined ? args.permissions : '');
      
      let cleanPerm = String(rawPerm).replace(/[^0-9]/g, '');
      let permInt = parseInt(cleanPerm, 10);

      // NOT defaulting to full access if this is empty/broken!! used to secretly
      // fall back to 65535 (literally every scope) which is baaaad. now it just
      // yells at you to go generate a real permission integer instead
      if (isNaN(permInt) || permInt <= 0) {
        if (typeof window !== 'undefined' && window.alert) {
          window.alert(
            'Velora Extension Error:\n\n' +
            'Invalid Permissions Integer!\n\n' +
            'Please visit https://velora.ikelene.net/permissions to select your project scopes and generate a valid permissions integer.'
          );
        }
        if (typeof window !== 'undefined' && window.open) {
          window.open('https://velora.ikelene.net/permissions', '_blank');
        }
        this._lastAuthResult = 'failed';
        return;
      }

      // flip this true right away, even before we've actually gotten a code back
      // from the server, so isLoginOpen() doesn't lag behind for a sec
      this._pollInterval = true;

      fetch(`${SERVER_HTTP}/auth/ext-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions_integer: permInt, project_name: projName })
      })
        .then(r => r.json())
        .then(data => {
          const code = data.code;
          if (!code) { this._pollInterval = null; return; }
          const popup = window.open(
            `${SERVER_HTTP}/login?code=${encodeURIComponent(code)}&project=${encodeURIComponent(projName)}&permissions=${permInt}`,
            'velora_login',
            'width=900,height=520,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes'
          );

          const doPoll = async () => {
            try {
              const r = await fetch(`${SERVER_HTTP}/auth/ext-code/status?code=${encodeURIComponent(code)}`);
              if (r.status === 404) { this._lastAuthResult = 'failed'; return true; }
              const d = await r.json();
              if (d.ready && d.token) {
                try { popup?.close(); } catch (_) {}
                this._token = d.token;
                await this._validateSavedToken();
                if (this._authenticated) this._connectWS();
                return true;
              }
            } catch (_) {}
            return false;
          };

          this._pollInterval = setInterval(async () => {
            if (await doPoll()) {
              clearInterval(this._pollInterval); this._pollInterval = null;
              clearInterval(watchClosed);
            }
          }, 1500);

          const openedAt = Date.now();
          let closedStreak = 0;
          const GRACE_MS = 4000;
          const REQUIRED_STREAK = 3;
          const watchClosed = setInterval(async () => {
            if (Date.now() - openedAt < GRACE_MS) return;
            if (popup && !popup.closed) { closedStreak = 0; return; }
            closedStreak++;
            if (closedStreak < REQUIRED_STREAK) return;
            clearInterval(watchClosed);
            if (!this._pollInterval) return;
            clearInterval(this._pollInterval);
            this._pollInterval = null;
            const success = await doPoll();
            if (!success) this._lastAuthResult = 'failed';
          }, 1000);
        })
        .catch(() => { this._pollInterval = null; });
    }

    openPermissionsCalc() {
      if (typeof window !== 'undefined' && window.open) {
        window.open('https://velora.ikelene.net/permissions', '_blank');
      }
    }

    openLoginPrompt(args) {
      this._openLoginPopup(args);
    }

    whenConnected()           { const v = this._evtConnected;      this._evtConnected = false;      return v; }
    whenDisconnected()        { const v = this._evtDisconnected;   this._evtDisconnected = false;   return v; }
    whenAuthenticated()       { const v = this._evtAuthenticated;  this._evtAuthenticated = false;  return v; }
    whenAccountUpdated()      { const v = this._evtAccountUpdated; this._evtAccountUpdated = false; return v; }
    whenMailReceived()        { const v = this._evtMailReceived;   this._evtMailReceived = false;   return v; }
    whenFriendRequest()       { const v = this._evtFriendRequest;  this._evtFriendRequest = false;  return v; }
    whenFriendAccepted()      { const v = this._evtFriendAccepted; this._evtFriendAccepted = false; return v; }
    whenUserJoins()           { const v = this._evtUserJoined;     this._evtUserJoined = false;     return v; }
    whenUserLeaves()          { const v = this._evtUserLeft;       this._evtUserLeft = false;       return v; }
    whenCallReceived()        { const v = this._evtCallIncoming;   this._evtCallIncoming = false;   return v; }
    whenBalanceChanged()      { const v = this._evtBalanceChanged; this._evtBalanceChanged = false; return v; }
    whenNewLoginDetected()    { const v = this._evtNewLogin;       this._evtNewLogin = false;       return v; }
    whenNotificationReceived(){ const v = this._evtNotification;   this._evtNotification = false;   return v; }
    whenGlobalMessageReceived() { const v = this._evtGlobalMsg; this._evtGlobalMsg = false; return v; }
    whenRoomMessageReceived({ ROOM }) { const v = !!this._evtRoomMsgMap[ROOM]; this._evtRoomMsgMap[ROOM] = false; return v; }

    isLoginOpen()          { return !!this._pollInterval; }
    authResult({ RESULT }) { return this._lastAuthResult === RESULT; }

    async serverOnline() {
      try {
        const r = await fetch(`${SERVER_HTTP}/health`, { signal: AbortSignal.timeout(4000) });
        return r.ok;
      } catch { return false; }
    }

    isConnected() { return this._ws?.readyState === 1; }

    isUserBanned()  { return (this._accountObj?.sys?.rank || '') === 'banned'; }
    storageIdSet()  { return this._storageId !== null; }
    badgesLoaded()  { return this._badges.length > 0; }

    isUserConnected({ USER }) {
      return this._onlinePlayers.some(p => p.username === USER);
    }

    hasBadge({ BADGE }) {
      return this._badges.some(b => b.name === BADGE);
    }

    keyExists({ KEY }) {
      return this._resolveAccountKey(KEY) !== '';
    }

    storageKeyExists({ KEY }) {
      this._requireScope(SCOPES.STORAGE_READ);
      return this._http(`/storage/${this._storageId}/${encodeURIComponent(KEY)}`).then(d => !d.error);
    }

    currentToken()      { return this._token || 'Not logged in'; }
    clientUsername()    { return this._username || this._user?.username || this._accountObj?.sys?.username || 'Not logged in'; }
    getStorageId()      { return this._storageId || ''; }
    lastUserJoined()    { return this._lastUserJoined; }
    lastUserLeft()      { return this._lastUserLeft; }
    callData()          { return JSON.stringify(this._callData); }
    typingUsers()       { return JSON.stringify(this._typingUsers); }
    getFriendCount()    { if (!this._authenticated) return 'Not logged in'; this._requireScope(SCOPES.FRIENDS_READ); return this._friends.length; }
    getFriendsList()    { if (!this._authenticated) return 'Not logged in'; this._requireScope(SCOPES.FRIENDS_READ); return JSON.stringify(this._friends); }
    getFriendRequests() { if (!this._authenticated) return 'Not logged in'; this._requireScope(SCOPES.FRIENDS_READ); return JSON.stringify(this._friendRequests); }
    allBadges()         { if (!this._authenticated) return 'Not logged in'; return JSON.stringify(this._badges); }
    badgeCount()        { if (!this._authenticated) return 'Not logged in'; return this._badges.length; }
    getMailList()       { if (!this._authenticated) return 'Not logged in'; this._requireScope(SCOPES.VMAIL_READ); return JSON.stringify(this._mail); }
    connectedUsers() {
      if (!this._connected) return 'Not connected';
      const obj = {};
      for (const p of this._onlinePlayers) obj[p.username] = { status: p.status || 'online', rank: p.rank || '' };
      return JSON.stringify(obj);
    }
    getAccountObject()  { if (!this._authenticated) return 'Not logged in'; return JSON.stringify(this._accountObj); }
    getAllKeys()         { if (!this._authenticated) return 'Not logged in'; return JSON.stringify(Object.keys(this._flatAccount())); }
    getAllValues()       { if (!this._authenticated) return 'Not logged in'; return JSON.stringify(Object.values(this._flatAccount())); }

    lastMessageUser()     { return this._lastMsg?.user || ''; }
    lastMessageContent()  { return this._lastMsg?.message || ''; }
    lastMessageUserJson() {
      const m = this._lastMsg;
      if (!m) return '{}';
      return JSON.stringify({ username: m.user, rank: m.rank, color: m.color });
    }

    uploadStatus()    { return this._uploadStatus; }
    lastUploadUrl()   { return this._lastUploadUrl; }
    lastActionOutput()  { return this._lastActionOutput; }
    lastActionSuccess() { return this._lastActionSuccess; }
    notificationCount()     { return this._notifications.length; }
    getNotifications()      { return JSON.stringify(this._notifications); }
    lastNotificationTitle() { return this._lastNotifTitle; }
    lastNotificationBody()  { return this._lastNotifBody; }

    myClientObject() {
      if (!this._authenticated) return 'Not logged in';
      return JSON.stringify({
        username: this.clientUsername(),
        rank: this._accountObj?.sys?.rank || this._user?.rank || '',
        pfp: this._accountObj?.profile?.pfp || '',
        status: this._status,
      });
    }

    _flatAccount() {
      const a = this._accountObj;
      if (!a.sys) return {};
      return {
        username: a.sys.username || '',
        email: a.profile?.email || '',
        rank: a.sys.rank || '',
        standing: a.sys.standing || 'good',
        pfp: a.profile?.pfp || '',
        banner: a.profile?.banner || '',
        bio: a.profile?.bio || '',
        timezone: a.profile?.timezone || '',
        country: a.profile?.country || '',
        created: a.sys.created || '',
        'sys.warning_level': a.sys.warning_level ?? '0',
        'sys.id': a.sys.id || '',
        'sys.currency': a.sys.currency ?? 0,
        'sys.badges': JSON.stringify(a.sys.badges || []),
        'sys.items': JSON.stringify(a.sys.items || []),
        'sys.last_login': a.sys.last_login || '',
        'sys.logins': JSON.stringify(a.sys.logins || []),
        'sys.tos_accepted': a.sys.tos_accepted || false,
        'sys.tos_time': a.sys.tos_time || '',
        'sys.total_logins': a.sys.total_logins || 0,
        'sys.transactions': JSON.stringify(a.sys.transactions || []),
      };
    }

    _resolveAccountKey(key) {
      const flat = this._flatAccount();
      const val = flat[key];
      if (val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    }

    getAccountKey({ KEY }) { if (!this._authenticated) return 'Not logged in'; return this._resolveAccountKey(KEY); }

    _waitForWS(ms = 5000) {
      if (this._wsReady) return Promise.resolve();
      return new Promise(resolve => {
        const deadline = Date.now() + ms;
        const id = setInterval(() => {
          if (this._wsReady || Date.now() > deadline) { clearInterval(id); resolve(); }
        }, 50);
      });
    }

    async loginWithToken({ TOKEN }) {
      this._token = TOKEN;
      await this._validateSavedToken();
      if (!this._authenticated) throw new Error('invalid_token');
      this._connectWS();
      await this._waitForWS();
    }

    async logout() {
      if (this._pollInterval) { clearInterval(this._pollInterval); this._pollInterval = null; }
      if (this._notifInterval) { clearInterval(this._notifInterval); this._notifInterval = null; }
      if (this._token) await this._http('/auth/logout', 'POST').catch(() => {});
      this._token = null;
      this._grantedScopes = 0;
      this._user = null;
      this._authenticated = false;
      this._accountObj = {};
      this._username = '';
      if (this._ws) {
        this._intentionalDisconnect = true;
        this._ws.close();
        this._ws = null;
      }
      this._wsReady = false;
      this._connected = false;
    }

    setStorageId({ ID }) { this._storageId = String(ID); }

    setStatus({ STATUS }) {
      this._status = STATUS;
      this._wsSend({ type: 'set_status', status: STATUS });
    }

    sendGlobalMessage({ MSG }) {
      this._requireScope(SCOPES.CHAT);
      this._wsSend({ type: 'globalMessage', message: MSG });
    }

    joinRoom({ ROOM }) {
      this._requireScope(SCOPES.CHAT);
      this._wsSend({ type: 'joinRoom', room: ROOM });
    }

    sendRoomMessage({ MSG, ROOM }) {
      this._requireScope(SCOPES.CHAT);
      this._wsSend({ type: 'roomMessage', room: ROOM, message: MSG });
    }

    setTyping({ STATE }) {
      this._wsSend({ type: STATE === 'on' ? 'typing' : 'stopTyping' });
    }

    getGlobalMessages() { this._requireScope(SCOPES.CHAT); return JSON.stringify(this._globalMessages.slice(-50)); }
    getRoomMessages({ ROOM }) { this._requireScope(SCOPES.CHAT); return JSON.stringify((this._roomMessages[ROOM] || []).slice(-50)); }

    async getStorage({ KEY }) {
      if (!this._storageId) return '';
      this._requireScope(SCOPES.STORAGE_READ);
      const data = await this._http(`/storage/${encodeURIComponent(this._storageId)}/${encodeURIComponent(KEY)}`).catch(() => ({}));
      return data.value ?? '';
    }

    async setStorage({ KEY, VALUE }) {
      if (!this._storageId) return;
      this._requireScope(SCOPES.STORAGE_WRITE);
      await this._cmd(`/storage/${encodeURIComponent(this._storageId)}/${encodeURIComponent(KEY)}`, 'PUT', { value: VALUE });
    }

    async deleteStorageKey({ KEY }) {
      if (!this._storageId) return;
      this._requireScope(SCOPES.STORAGE_WRITE);
      await this._cmd(`/storage/${encodeURIComponent(this._storageId)}/${encodeURIComponent(KEY)}`, 'DELETE');
    }

    async getAllStorageKeys() {
      if (!this._storageId) return '[]';
      this._requireScope(SCOPES.STORAGE_READ);
      const data = await this._http(`/storage/${encodeURIComponent(this._storageId)}/keys`).catch(() => ({}));
      return JSON.stringify(data.keys || []);
    }

    async getAllStorageValues() {
      if (!this._storageId) return '[]';
      this._requireScope(SCOPES.STORAGE_READ);
      const data = await this._http(`/storage/${encodeURIComponent(this._storageId)}/values`).catch(() => ({}));
      return JSON.stringify(data.values || []);
    }

    async clearStorage() {
      if (!this._storageId) return;
      this._requireScope(SCOPES.STORAGE_WRITE);
      await this._cmd(`/storage/${encodeURIComponent(this._storageId)}`, 'DELETE');
    }

    async storageUsage() {
      this._requireScope(SCOPES.STORAGE_READ);
      const data = await this._http('/storage-info/info/usage').catch(() => ({}));
      return data.usage ?? 0;
    }
    async storageLimit() {
      this._requireScope(SCOPES.STORAGE_READ);
      const data = await this._http('/storage-info/info/usage').catch(() => ({}));
      return data.limit ?? 5242880;
    }
    async storageRemaining() {
      this._requireScope(SCOPES.STORAGE_READ);
      const data = await this._http('/storage-info/info/usage').catch(() => ({}));
      return data.remaining ?? 0;
    }
    async storageBiggest() {
      this._requireScope(SCOPES.STORAGE_READ);
      const data = await this._http('/storage-info/info/usage').catch(() => ({}));
      return JSON.stringify(data.breakdown || []);
    }

    async sendMail({ TO, SUBJECT, MSG }) {
      this._requireScope(SCOPES.VMAIL_SEND);
      await this._cmd('/mail/send', 'POST', { to: TO, subject: SUBJECT, message: MSG });
    }

    getMailBody({ N }) {
      if (!this._authenticated) return 'Not logged in';
      this._requireScope(SCOPES.VMAIL_READ);
      const idx = parseInt(N) - 1;
      return this._mail[idx]?.body ?? '';
    }

    async deleteMail({ N }) {
      this._requireScope(SCOPES.VMAIL_SEND);
      const idx = parseInt(N) - 1;
      const mail = this._mail[idx];
      if (!mail) return;
      await this._cmd(`/mail/${mail.id}`, 'DELETE');
      this._mail.splice(idx, 1);
    }

    async deleteAllMail() {
      this._requireScope(SCOPES.VMAIL_SEND);
      await this._cmd('/mail', 'DELETE');
      this._mail = [];
    }

    async sendFriendRequest({ USER }) {
      this._requireScope(SCOPES.FRIENDS_MANAGE);
      await this._cmd('/friends/request', 'POST', { username: USER });
    }

    async acceptFriendReq({ USER }) {
      this._requireScope(SCOPES.FRIENDS_MANAGE);
      const req = this._friendRequests.find(r => r.from_username === USER);
      if (!req) return;
      await this._cmd(`/friends/request/${req.id}/accept`, 'PATCH');
      await this._fetchFriends();
    }

    async declineFriendReq({ USER }) {
      this._requireScope(SCOPES.FRIENDS_MANAGE);
      const req = this._friendRequests.find(r => r.from_username === USER);
      if (!req) return;
      await this._cmd(`/friends/request/${req.id}/decline`, 'PATCH');
      await this._fetchFriends();
    }

    async removeFriend({ USER }) {
      this._requireScope(SCOPES.FRIENDS_MANAGE);
      await this._cmd(`/friends/${encodeURIComponent(USER)}`, 'DELETE');
      await this._fetchFriends();
    }

    async getFriendStatus({ USER }) {
      if (!this._authenticated) return 'Not logged in';
      this._requireScope(SCOPES.FRIENDS_READ);
      const data = await this._http(`/friends/status/${encodeURIComponent(USER)}`).catch(() => ({}));
      return data.status ?? 'none';
    }

    async getProfileNote({ USER }) {
      if (!this._authenticated) return 'Not logged in';
      this._requireScope(SCOPES.FRIENDS_READ);
      const data = await this._http(`/account/notes/${encodeURIComponent(USER)}`).catch(() => ({}));
      if (data.error === 'plus_required') return 'Plus required';
      return data.note ?? '';
    }

    async setProfileNote({ USER, NOTE }) {
      this._requireScope(SCOPES.FRIENDS_MANAGE);
      await this._cmd(`/account/notes/${encodeURIComponent(USER)}`, 'PUT', { note: NOTE });
    }

    async deleteProfileNote({ USER }) {
      this._requireScope(SCOPES.FRIENDS_MANAGE);
      await this._cmd(`/account/notes/${encodeURIComponent(USER)}`, 'DELETE', {});
    }

    async getBalance() {
      if (!this._authenticated) return 'Not logged in';
      this._requireScope(SCOPES.CURRENCY_READ);
      const data = await this._http('/currency/balance').catch(() => ({}));
      return data.balance ?? 0;
    }

    async transferCredits({ AMOUNT, USER }) {
      this._requireScope(SCOPES.CURRENCY_PAY);
      await this._cmd('/currency/transfer', 'POST', { to: USER, amount: parseInt(AMOUNT) });
    }

    async getTransactions() {
      if (!this._authenticated) return 'Not logged in';
      this._requireScope(SCOPES.CURRENCY_READ);
      const data = await this._http('/currency/transactions').catch(() => ({}));
      return JSON.stringify(data.transactions || []);
    }

    async subscribe({ AMOUNT, USER, PERIOD, NOTE }) {
      this._requireScope(SCOPES.CURRENCY_PAY);
      await this._cmd('/currency/subscribe', 'POST', { to: USER, amount: parseInt(AMOUNT), period: PERIOD, note: NOTE });
    }

    async cancelSubscription({ USER }) {
      this._requireScope(SCOPES.CURRENCY_PAY);
      await this._cmd(`/currency/subscribe/user/${encodeURIComponent(USER)}`, 'DELETE');
    }

    async getOutgoingSubs() {
      if (!this._authenticated) return 'Not logged in';
      this._requireScope(SCOPES.CURRENCY_READ);
      const data = await this._http('/currency/subscriptions/outgoing').catch(() => ({}));
      return JSON.stringify(data.subscriptions || []);
    }

    async getIncomingSubs() {
      if (!this._authenticated) return 'Not logged in';
      this._requireScope(SCOPES.CURRENCY_READ);
      const data = await this._http('/currency/subscriptions/incoming').catch(() => ({}));
      return JSON.stringify(data.subscriptions || []);
    }

    _xhrUpload(path, body, isFormData, onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', SERVER_HTTP + path);
        if (this._token) xhr.setRequestHeader('Authorization', `Bearer ${this._token}`);
        if (!isFormData) xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round(e.loaded / e.total * 100);
            if (onProgress) onProgress(pct);
            else this._uploadProgress = pct;
          }
        };
        xhr.onload = () => {
          if (!onProgress) this._uploadProgress = 100;
          try { resolve(JSON.parse(xhr.responseText)); } catch { resolve({}); }
        };
        xhr.onerror = () => reject(new Error('xhr_error'));
        xhr.send(isFormData ? body : JSON.stringify(body));
      });
    }

    async _blobFromUrl(url) {
      const resp = await fetch(url);
      return resp.blob();
    }

    async uploadImage({ DATA_URI, MODE }) {
      this._requireScope(SCOPES.MEDIA_UPLOAD);
      this._uploadStatus = 'uploading'; this._uploadProgress = 0;
      const doUpload = async () => {
        let data;
        if (typeof DATA_URI === 'string' && DATA_URI.startsWith('blob:')) {
          const blob = await this._blobFromUrl(DATA_URI);
          const fd = new FormData();
          fd.append('file', blob, 'image.jpg');
          data = await this._xhrUpload('/media/image', fd, true);
        } else {
          data = await this._xhrUpload('/media/image', { data: DATA_URI }, false);
        }
        this._lastActionOutput = JSON.stringify(data);
        this._lastActionSuccess = !!data.url;
        if (data.url) { this._lastUploadUrl = data.url; this._uploadStatus = 'done'; }
        else { this._uploadStatus = 'error'; }
        if (data.error) throw new Error(data.error);
      };
      if (MODE === 'wait' || MODE === undefined) await doUpload();
      else doUpload().catch(() => { this._uploadStatus = 'error'; this._lastActionSuccess = false; });
    }

    async uploadAudio({ DATA_URI, MODE }) {
      this._requireScope(SCOPES.MEDIA_UPLOAD);
      this._uploadStatus = 'uploading'; this._uploadProgress = 0;
      const doUpload = async () => {
        let data;
        if (typeof DATA_URI === 'string' && DATA_URI.startsWith('blob:')) {
          const blob = await this._blobFromUrl(DATA_URI);
          const fd = new FormData();
          const ext = (blob.type || 'audio/mpeg').split('/')[1] || 'mp3';
          fd.append('file', blob, `audio.${ext}`);
          data = await this._xhrUpload('/media/audio', fd, true);
        } else {
          data = await this._xhrUpload('/media/audio', { data: DATA_URI }, false);
        }
        this._lastActionOutput = JSON.stringify(data);
        this._lastActionSuccess = !!data.url;
        if (data.url) { this._lastUploadUrl = data.url; this._uploadStatus = 'done'; }
        else { this._uploadStatus = 'error'; }
        if (data.error) throw new Error(data.error);
      };
      if (MODE === 'wait' || MODE === undefined) await doUpload();
      else doUpload().catch(() => { this._uploadStatus = 'error'; this._lastActionSuccess = false; });
    }

    async uploadVideo({ DATA_URI, MODE }) {
      this._requireScope(SCOPES.MEDIA_UPLOAD);
      this._uploadStatus = 'uploading'; this._uploadProgress = 0;
      const doUpload = async () => {
        let data;
        if (typeof DATA_URI === 'string' && DATA_URI.startsWith('blob:')) {
          // splits into 10 MB pieces to stay under cf's 100 mb limit (boo)
          // grabs the actual File object if we have it instead of re-fetching the
          // blob url, way faster and doesn't load the whole thing into memory twice
          const fileBlob = (this._selectedFile && this._selectedFileUrl === DATA_URI)
            ? this._selectedFile
            : await this._blobFromUrl(DATA_URI);

          const mimeType = fileBlob.type || 'video/mp4';
          const originalName = this._selectedFileName || 'video.mp4';
          const CHUNK = 10 * 1024 * 1024; // 10 MB per chunk
          const total = Math.ceil(fileBlob.size / CHUNK);
          const sessionId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

          for (let i = 0; i < total; i++) {
            const start = i * CHUNK;
            const chunk = fileBlob.slice(start, Math.min(start + CHUNK, fileBlob.size), mimeType);
            const fd = new FormData();
            fd.append('sessionId', sessionId);
            fd.append('chunkIndex', String(i));
            fd.append('totalChunks', String(total));
            fd.append('chunk', chunk, `chunk_${i}`);
            const chunkData = await this._xhrUpload('/media/video/chunk', fd, true, (pct) => {
              this._uploadProgress = Math.round((i / total + pct / 100 / total) * 95);
            });
            if (chunkData.error) throw new Error(chunkData.error);
          }

          this._uploadProgress = 97;
          data = await this._http('/media/video/finalize', 'POST', { sessionId, mimeType, originalName });
          this._uploadProgress = 100;
        } else {
          data = await this._xhrUpload('/media/video', { data: DATA_URI }, false);
        }
        this._lastActionOutput = JSON.stringify(data);
        this._lastActionSuccess = !!data.url;
        if (data.url) { this._lastUploadUrl = data.url; this._uploadStatus = 'done'; }
        else { this._uploadStatus = 'error'; }
        if (data.error) throw new Error(data.error);
      };
      if (MODE === 'wait' || MODE === undefined) await doUpload();
      else doUpload().catch(() => { this._uploadStatus = 'error'; this._lastActionSuccess = false; });
    }

    async uploadPfp({ DATA_URI, MODE }) {
      this._requireScope(SCOPES.ACCOUNT_WRITE);
      this._uploadStatus = 'uploading'; this._uploadProgress = 0;
      const doUpload = async () => {
        let data;
        if (typeof DATA_URI === 'string' && DATA_URI.startsWith('blob:')) {
          const blob = await this._blobFromUrl(DATA_URI);
          const fd = new FormData();
          fd.append('file', blob, 'pfp.jpg');
          data = await this._xhrUpload('/media/pfp', fd, true);
        } else {
          data = await this._xhrUpload('/media/pfp', { data: DATA_URI }, false);
        }
        this._lastActionOutput = JSON.stringify(data);
        this._lastActionSuccess = !!data.url;
        if (data.url) { this._lastUploadUrl = data.url; this._uploadStatus = 'done'; }
        else { this._uploadStatus = 'error'; }
        if (data.error) throw new Error(data.error);
      };
      if (MODE === 'wait' || MODE === undefined) await doUpload();
      else doUpload().catch(() => { this._uploadStatus = 'error'; this._lastActionSuccess = false; });
    }

    async setChatColor({ COLOR }) {
      this._requireScope(SCOPES.ACCOUNT_WRITE);
      await this._cmd('/account/update', 'PATCH', { color: COLOR });
    }

    uploadProgress() { return this._uploadProgress; }

    openFilePicker({ TYPE }) {
      const acceptMap = {
        'videos':      'video/mp4,video/webm,video/quicktime,video/x-matroska,.mkv,.mov',
        'images':      'image/*',
        'audio files': 'audio/*',
      };
      return new Promise((resolve) => {
        this._fileSelected = false;
        this._selectedFileName = '';
        this._selectedFileSize = 0;
        this._selectedFile = null;
        // gotta manually clean up the old blob url or it just sits in memory forever
        if (this._selectedFileUrl) { try { URL.revokeObjectURL(this._selectedFileUrl); } catch (_) {} }
        this._selectedFileUrl = '';

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = acceptMap[TYPE] || '*/*';
        input.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(input);

        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          window.removeEventListener('focus', onWindowFocus);
          try { document.body.removeChild(input); } catch (_) {}
          resolve();
        };

        input.addEventListener('cancel', finish);
        const onWindowFocus = () => setTimeout(() => { if (!done) finish(); }, 400);
        window.addEventListener('focus', onWindowFocus, { once: true });

        input.addEventListener('change', () => {
          window.removeEventListener('focus', onWindowFocus);
          const file = input.files && input.files[0];
          if (!file) { finish(); return; }

          // createObjectURL is basically instant no matter how big the file is,
          // it doesn't actually read the file into memory or anything
          this._selectedFile = file;
          this._selectedFileUrl = URL.createObjectURL(file);
          this._selectedFileName = file.name || '';
          this._selectedFileSize = file.size || 0;
          this._fileSelected = true;
          finish();
        });

        input.click();
      });
    }

    fileWasSelected()  { return this._fileSelected; }
    selectedFileUri()  { return this._selectedFileUrl; }
    selectedFileName() { return this._selectedFileName; }
    selectedFileSize() { return this._selectedFileSize; }

    async fetchLoginHistory() {
      if (!this._token) return;
      this._requireScope(SCOPES.PROFILE_SENSITIVE);
      const data = await this._cmd('/auth/login-history');
      this._loginHistory = data.history || [];
    }

    loginHistoryCount() { this._requireScope(SCOPES.PROFILE_SENSITIVE); return this._loginHistory.length; }
    loginHistoryJSON()  { this._requireScope(SCOPES.PROFILE_SENSITIVE); return JSON.stringify(this._loginHistory); }
    lastLoginDevice()   { this._requireScope(SCOPES.PROFILE_SENSITIVE); return this._loginHistory[0]?.browser_ua || ''; }
    // this isn't actually ur real ip!! its a hashed version, we don't keep raw ips
    // around anymore for privacy reasons. still useful for "is this the same
    // location as last time" type checks tho, just cant reverse it back into an ip
    lastLoginIP()       { this._requireScope(SCOPES.PROFILE_SENSITIVE); return this._loginHistory[0]?.ip_hash || ''; }

    async lookupUser({ USER }) {
      const data = await this._cmd(`/account/lookup/${encodeURIComponent(USER)}`);
      this._lookedUpUser = data;
    }

    lookedUpUsername() { return this._lookedUpUser.username || ''; }
    lookedUpRank()     { return this._lookedUpUser.rank || ''; }
    lookedUpBio()      { return this._lookedUpUser.bio || ''; }
    lookedUpPfp()      { return this._lookedUpUser.pfp_url || ''; }
    lookedUpCountry()  { return this._lookedUpUser.country_code || ''; }
    lookedUpJSON()     { return JSON.stringify(this._lookedUpUser); }

    badgeInfo({ BADGE }) {
      const b = this._badges.find(x => x.name === BADGE);
      return b ? JSON.stringify(b) : '';
    }

    async clearNotifications() {
      await this._cmd('/notifications/read-all', 'PATCH');
      this._notifications = [];
      this._lastNotifTitle = '';
      this._lastNotifBody = '';
    }

    async _pollLoginHistory() {
      if (!this._token) return;
      if ((this._grantedScopes & SCOPES.PROFILE_SENSITIVE) !== SCOPES.PROFILE_SENSITIVE) return;
      const data = await this._http('/auth/login-history').catch(() => ({}));
      const history = data.history || [];
      if (this._knownLoginCount === -1) {
        this._knownLoginCount = history.length;
      } else if (history.length > this._knownLoginCount) {
        this._knownLoginCount = history.length;
        this._evtNewLogin = true;
        this._loginHistory = history;
      }
    }

    async _fetchNotifications() {
      if (!this._token) return;
      const data = await this._http('/notifications').catch(() => ({}));
      const notifs = data.notifications || [];
      if (notifs.length > this._notifications.length && this._notifications.length >= 0) {
        const newest = notifs[0];
        if (newest) { this._lastNotifTitle = newest.title || ''; this._lastNotifBody = newest.body || ''; }
        this._evtNotification = true;
      }
      this._notifications = notifs;
    }

    callUser({ USER }) {
      const callId = Math.random().toString(36).slice(2);
      this._callData = { callId };
      this._wsSend({ type: 'call_user', to: USER, callId });
    }

    acceptCall() {
      if (this._callData?.from) {
        this._wsSend({ type: 'call_accept', to: this._callData.from, callId: this._callData.callId });
      }
    }

    setMic({ STATE }) {
      if (this._callData?.from || this._callData?.to) {
        const target = this._callData.from || this._callData.to;
        this._wsSend({ type: 'mic_state', to: target, muted: STATE === 'off', callId: this._callData.callId });
      }
    }

    stopCall() {
      const target = this._callData?.from || this._callData?.to;
      if (target) this._wsSend({ type: 'call_end', to: target, callId: this._callData.callId });
      this._callData = {};
    }
  }

  // and NOW we can register it, this took forever to build
  if (typeof Scratch !== 'undefined') {
    Scratch.extensions.register(new VeloraExtension(Scratch.vm.runtime));
  } else if (typeof window !== 'undefined') {
    window._VeloraExtension = VeloraExtension;
  }

})();
