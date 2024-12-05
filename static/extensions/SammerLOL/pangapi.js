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
          },
          hideFromPalette: true
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
            page: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
        },
        {
          opcode: 'projectcount',
          hideFromPalette: true,
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
              defaultValue: "6293864331",
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
        {
          opcode: 'getstats',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get [stat] of project [id]',
          disableMonitor: true,
          arguments: {
            stat: {
              type: Scratch.ArgumentType.STRING,
              menu: 'stats',
              defaultValue: 'hearts',
            },
            id: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "6293864331",
            },
          }
        },
        {
          opcode: 'getMetadata',
          blockType: Scratch.BlockType.REPORTER,
          text: 'metadata of project [id]',
          disableMonitor: true,
          arguments: {
            id: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "6293864331",
            },
          }
        }
      ],
      menus: {
        stats: {
          acceptReporters: true,
          items: [
            "hearts",
            "votes",
            "views",
          ],
        },
      }
    };
  }

  async badges(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/v1/users/profile?target=${username}`);

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
      const response = await fetch(`https://projects.penguinmod.com/api/v1/users/profile?target=${username}`);

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
      const response = await fetch(`https://projects.penguinmod.com/api/v1/projects/getrandomproject`);

      if (!response.ok) {
        throw new Error('Failed to fetch random project ID');
      }

      const data = await response.json();

      const id = data.id;

      return id;
    } catch (error) {
      console.error('Error fetching project ID: ' + error);
      return '';
    }
  }

  async tb(args) {
    const id = args.id;
    return `https://projects.penguinmod.com/api/v1/projects/getproject?projectID=${id}&requestType=thumbnail`;
  }

  async pfp(args) {
    const user = args.user;
    return "https://projects.penguinmod.com/api/v1/users/getpfp?username=" + user;
  }

  async follows(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/v1/users/profile?target=${username}`);

      if (!response.ok) {
        throw new Error('Failed to fetch followers');
      }

      const data = await response.json();

      return data.followers;
    } catch (error) {
      console.error('Error fetching followers: ' + error);
      return '';
    }
  }

  async viewable(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/v1/users/profile?target=${username}`);

      if (!response.ok) {
        throw new Error('Failed to fetch viewability');
      }

      const data = await response.json();

      const vw = !data.privateProfile;

      return JSON.stringify(vw);
    } catch (error) {
      console.error('Error fetching viewability: ' + error);
      return '';
    }
  }

  async rankup(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/v1/users/profile?target=${username}`);

      if (!response.ok) {
        throw new Error('Failed to fetch rank up permission,', response.statusText);
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
    throw new Error("This block is temporarily disabled - theres not yet a way to get the project count of a user. This will be fixed soon.");

    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/users/profile?target=${username}`);

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
      const response = await fetch(`https://projects.penguinmod.com/api/v1/users/profile?target=${username}`);

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

  async banned() {
    throw new Error('This block is currently disabled as you can no longer check if a user is banned without being a moderator');
  }

  async projects(args) {
    const username = args.user;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/v1/projects/getprojectsbyauthor?authorUsername=${username}`);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      return JSON.stringify(data);
    } catch (error) {
      console.error('Error fetching projects: ' + error);
      return '';
    }
  }

  async latest() {
    try {
      const response = await fetch(`https://projects.penguinmod.com/api/v1/projects/getprojects`);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      // Check if there are projects in the array
      if (data && data.length > 0) {
        // Return the first project
        return JSON.stringify(data[0]);
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
      const response = await fetch(`https://projects.penguinmod.com/api/v1/projects/frontPage`);

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

  async getstats(args) {
    const stat = args.stat;
    const id = args.id;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/v1/projects/getproject?projectID=${id}&requestType=metadata`);

      if (!response.ok) {
        throw new Error('Failed to fetch project stats');
      }

      const data = await response.json();

      switch (stat) {
        case 'hearts':
          return data.loves;
        case 'votes':
          return data.votes;
        case 'views':
          return data.views;
        default:
          return '';
      }
    } catch (error) {
      console.error('Error fetching project stats: ' + error);
      return '';
    }
  }

  async getMetadata(args) {
    const id = args.id;

    try {
      const response = await fetch(`https://projects.penguinmod.com/api/v1/projects/getproject?projectID=${id}&requestType=metadata`);

      if (!response.ok) {
        throw new Error('Failed to fetch project metadata');
      }

      const data = await response.json();

      return JSON.stringify(data);
    } catch (error) {
      console.error('Error fetching project metadata: ' + error);
      return '';
    }
  }
}

Scratch.extensions.register(new PMAPI());
