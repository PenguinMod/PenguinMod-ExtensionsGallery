(function (Scratch) {
    "use strict";

class Locate {
  getInfo() {
    return {
      id: 'cockatiel', // This type of bird is so underrated, so why not use it?
      name: 'Location',
      color1: '#FFA500', // Yellow - Cockatiel reference!!! :))
      color2: '#FFD700', // Another yellow ._.
      blocks: [
        {
          opcode: 'myIP',
          blockType: Scratch.BlockType.REPORTER,
          text: 'my IP address [version]',
          arguments: {
            version: {
              type: Scratch.ArgumentType.STRING,
              menu: 'ipVersionMenu'
            }
          }
        },
        {
          opcode: 'longitude',
          blockType: Scratch.BlockType.REPORTER,
          text: 'longitude'
        },
        {
          opcode: 'latitude',
          blockType: Scratch.BlockType.REPORTER,
          text: 'latitude'
        },
        {
          opcode: 'myInfo',
          blockType: Scratch.BlockType.REPORTER,
          text: 'my [info]',
          arguments: {
            info: {
              type: Scratch.ArgumentType.STRING,
              menu: 'infoMenu'
            }
          }
        },
        {
          opcode: 'isUsingVPN',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is using VPN?'
        },
        {
          opcode: 'publicIP',
          blockType: Scratch.BlockType.REPORTER,
          text: 'public IP address'
        },
        {
          opcode: 'myTimezone',
          blockType: Scratch.BlockType.REPORTER,
          text: 'my timezone'
        },
        {
          opcode: 'distanceBetweenIPs',
          blockType: Scratch.BlockType.REPORTER,
          text: 'distance between IP [ip1] and IP [ip2]',
          arguments: {
            ip1: {
              type: Scratch.ArgumentType.STRING
            },
            ip2: {
              type: Scratch.ArgumentType.STRING
            }
          }
        },
        {
          opcode: 'storeCurrentIP',
          blockType: Scratch.BlockType.COMMAND,
          text: 'store current IP address'
        },
        {
          opcode: 'getStoredIP',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get stored IP address'
        }
      ],
      menus: {
        ipVersionMenu: {
          items: ['IPv4', 'IPv6']
        },
        infoMenu: {
          items: ['country', 'ISP', 'region', 'city']
        }
      }
    };
  }

  async myIP(args) {
    const version = args.version;
    let url = 'https://api.ipify.org?format=json'; // Default to IPv4
    if (version === 'IPv6') {
      url = 'https://api64.ipify.org?format=json'; // For IPv6
    }
    try {
      const response = await Scratch.fetch(url);
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'Error fetching IP';
    }
  }

  async longitude() {
    try {
      const response = await Scratch.fetch('https://ipwhois.app/json/');
      const data = await response.json();
      return data.longitude || 'Not available';
    } catch (error) {
      return 'Error fetching longitude';
    }
  }

  async latitude() {
    try {
      const response = await Scratch.fetch('https://ipwhois.app/json/');
      const data = await response.json();
      return data.latitude || 'Not available';
    } catch (error) {
      return 'Error fetching latitude';
    }
  }

  async myInfo(args) {
    const info = args.info;
    try {
      const response = await Scratch.fetch('https://ipwhois.app/json/');
      const data = await response.json();
      switch (info) {
        case 'country':
          return data.country || 'Not available';
        case 'ISP':
          return data.isp || 'Not available';
        case 'region':
          return data.region || 'Not available';
        case 'city':
          return data.city || 'Not available';
        default:
          return 'Invalid option';
      }
    } catch (error) {
      return 'Error fetching info';
    }
  }

  async isUsingVPN() {
    try {
      const response = await Scratch.fetch('https://ipwhois.app/json/');
      const data = await response.json();
      return data.is_vpn || false; // Adjust based on the service's actual response
    } catch (error) {
      return false; // Default to false if there is an error
    }
  }

  async publicIP() {
    try {
      const response = await Scratch.fetch('https://api.ipify.org?format=json'); // Always fetch IPv4
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'Error fetching public IP';
    }
  }

  async myTimezone() {
    try {
      const response = await Scratch.fetch('https://ipwhois.app/json/');
      const data = await response.json();
      return data.timezone || 'Not available';
    } catch (error) {
      return 'Error fetching timezone';
    }
  }

  async distanceBetweenIPs(args) {
    const { ip1, ip2 } = args;
    const location1 = await this.fetchLocation(ip1);
    const location2 = await this.fetchLocation(ip2);

    if (location1.latitude && location1.longitude && location2.latitude && location2.longitude) {
      return this.haversineDistance(location1.latitude, location1.longitude, location2.latitude, location2.longitude);
    } else {
      return 'No results found ';
    }
  }

  async fetchLocation(ip) {
    try {
      const response = await Scratch.fetch(`https://ipwhois.app/json/${ip}`);
      const data = await response.json();
      return {
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      return {
        latitude: null,
        longitude: null
      };
    }
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  async storeCurrentIP() {
    try {
      const ip = await this.myIP({ version: 'IPv4' }); // Store IPv4 IP
      localStorage.setItem('currentIP', ip);
      return 'IP stored successfully';
    } catch (error) {
      return 'Error storing IP'; // Thể's an error. :((
    }
  }

  getStoredIP() {
    const ip = localStorage.getItem('currentIP');
    if (ip) {
      return ip;
    } else {
      return 'No IP stored'; // Fuck you IP address storer
    }
  }
}

Scratch.extensions.register(new Locate());
})(Scratch); // Fuck myself, SharkPool told me to fix this in one day
