class PMAPI {
  getInfo() {
    return {
      id: 'sammerpenguinapi',
      name: 'Pang API',
      color1: '#00b3ff',
      color2: '#0aa2cc',
      blocks: [
        {
          opcode: 'banned',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is [user] banned?',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Anonymoose547",
            },
          }
        },
        {
          opcode: 'viewable',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is [user] viewable?',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "griffpatch",
            },
          }
        },
        {
          opcode: 'rankup',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'can [user] rankup?',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "Mr_rudy",
            },
          }
        },
        {
          opcode: 'donator',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'has [user] donated?',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "TheShovel",
            },
          }
        },
        '---',
        {
          opcode: 'rank',
          blockType: Scratch.BlockType.REPORTER,
          text: 'rank of [user]',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "G1nX",
            },
          },
        },
        {
          opcode: 'follows',
          blockType: Scratch.BlockType.REPORTER,
          text: 'followers of [user]',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "SammerLOL",
            },
          },
        },
        {
          opcode: 'projectcount',
          blockType: Scratch.BlockType.REPORTER,
          text: 'project amount of [user]',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "know0your0true0color",
            },
          },
        },
        {
          opcode: 'badges',
          blockType: Scratch.BlockType.REPORTER,
          text: 'badges of [user]',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "JeremyGamer13",
            },
          }
        },
        {
          opcode: 'tb',
          blockType: Scratch.BlockType.REPORTER,
          text: 'thumbnail url of [id]',
          disableMonitor: true,
          arguments: {
            id: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "1099000118505",
            },
          }
        },
        {
          opcode: 'pfp',
          blockType: Scratch.BlockType.REPORTER,
          text: 'pfp url of [user]',
          disableMonitor: true,
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "MVBit",
            },
          }
        },
        {
          opcode: 'projects',
          blockType: Scratch.BlockType.REPORTER,
          text: 'all projects made by [user]',
          arguments: {
            user: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "poprockdev",
            },
          }
        },
        '---',
        {
          opcode: 'frontpage',
          blockType: Scratch.BlockType.REPORTER,
          text: 'current frontpage',
          disableMonitor: true,
        },
        {
          opcode: 'rnd',
          blockType: Scratch.BlockType.REPORTER,
          text: 'random project id',
          disableMonitor: true,
        },
        {
          opcode: 'latest',
          blockType: Scratch.BlockType.REPORTER,
          text: 'latest project',
          disableMonitor: true,
        },
      ]
    };
  }

  async badges(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch badges information');
      }

      const data = await response.json();

      const badges = data.badges;

      return JSON.stringify(badges);
    } catch (error) {
      console.error('Error fetching badges: ' + error);
      return '';
    }
  }

  async rank(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch rank information');
      }

      const data = await response.json();

      const rank = data.rank;

      return JSON.stringify(rank);
    } catch (error) {
      console.error('Error fetching ranks: ' + error);
      return '';
    }
  }

  async rnd() {
    try {
      const response = await fetch(`https://projects.penguinmod.com/api/projects/search?random=true`);

      if (!response.ok) {
        throw new Error('Failed to fetch random project ID');
      }

      const data = await response.json();

      const id = data.id;

      return JSON.stringify(id);
    } catch (error) {
      console.error('Error fetching project ID: ' + error);
      return '';
    }
  }

  async tb(args) {
    const id = args.id;
    return "https://projects.penguinmod.com/api/pmWrapper/iconUrl?id=" + id;
  }

  async pfp(args) {
    const user = args.user;
    return "https://trampoline.turbowarp.org/avatars/by-username/" + user;
  }

  async follows(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch followers');
      }

      const data = await response.json();

      const flws = data.followers;

      return JSON.stringify(flws);
    } catch (error) {
      console.error('Error fetching followers: ' + error);
      return '';
    }
  }

  async viewable(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch viewability');
      }

      const data = await response.json();

      const vw = data.viewable;

      return JSON.stringify(vw);
    } catch (error) {
      console.error('Error fetching viewability: ' + error);
      return '';
    }
  }

  async rankup(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch rank up permission');
      }

      const data = await response.json();

      const ru = data.canrankup;

      return JSON.stringify(ru);
    } catch (error) {
      console.error('Error fetching permission: ' + error);
      return '';
    }
  }

  async projectcount(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      const prj = data.projects;

      return JSON.stringify(prj);
    } catch (error) {
      console.error('Error fetching projects: ' + error);
      return '';
    }
  }

  async donator(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to check if donated');
      }

      const data = await response.json();

      const donator = data.donator;

      return JSON.stringify(donator);
    } catch (error) {
      console.error('Error fetching donator: ' + error);
      return '';
    }
  }

  async banned(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch ban');
      }

      const data = await response.json();

      const ban = data.banned;

      return JSON.stringify(ban);
    } catch (error) {
      console.error('Error fetching ban: ' + error);
      return '';
    }
  }

  async projects(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/projects/search?page=undefined&user=${encodeURIComponent(username)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      return JSON.stringify(data.projects);
    } catch (error) {
      console.error('Error fetching projects: ' + error);
      return '';
    }
  }

  async latest() {
    try {
      const response = await fetch(`https://projects.penguinmod.com/api/projects/search?page=undefined&featured=exclude`);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      // Check if there are projects in the array
      if (data.projects && data.projects.length > 0) {
        // Return the first project
        return JSON.stringify(data.projects[0]);
      } else {
        return 'No projects found';
      }
    } catch (error) {
      console.error('Error fetching projects: ' + error);
      return '';
    }
  }

  async frontpage() {
    try {
      const response = await fetch(`https://projects.penguinmod.com/api/projects/frontPage`);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      return JSON.stringify(data);
    } catch (error) {
      console.error('Error fetching projects: ' + error)
      return '';
    }
  }
}

Scratch.extensions.register(new PMAPI());
