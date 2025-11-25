// Name: Pang API
// ID: sammerpenguinapi
// Description: Fetch information from the PenguinMod API
// By: SammerLOL
// Rewritten By: SharkPool

// Version V.1.1.0

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Pang API must run unsandboxed");

  const Cast = Scratch.Cast;

  const apiURL = "https://projects.penguinmod.com/api/v1/";

  /*
    prevent server spam by using a cache system,
    each cache will expire after 1-10 minutes
  */
  const cache = new Map();

  class PMAPI {
    getInfo() {
      return {
        id: "sammerpenguinapi",
        name: "Pang API",
        color1: "#00b3ff",
        blocks: [
          { blockType: Scratch.BlockType.LABEL, text: "Profiles" },
          {
            opcode: "viewable",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is [user] viewable?",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "griffpatch",
              },
            }
          },
          {
            opcode: "rankup",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "can [user] rankup?",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "SammerLOL",
              },
            }
          },
          {
            opcode: "donator",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "has [user] donated?",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "TheShovel",
              },
            }
          },
          "---",
          {
            opcode: "rank",
            blockType: Scratch.BlockType.REPORTER,
            text: "rank of [user]",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "SharkPool",
              },
            },
          },
          {
            opcode: "follows",
            blockType: Scratch.BlockType.REPORTER,
            text: "followers of [user]",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "joe",
              },
              page: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "badges",
            blockType: Scratch.BlockType.REPORTER,
            text: "badges of [user]",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "JeremyGamer13",
              },
            }
          },
          {
            opcode: "pfp",
            blockType: Scratch.BlockType.REPORTER,
            text: "pfp of [user]",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "anonygoose",
              },
            }
          },
          { blockType: Scratch.BlockType.LABEL, text: "Projects" },
          {
            opcode: "projects",
            blockType: Scratch.BlockType.REPORTER,
            text: "all projects made by [user]",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "jwklong",
              },
            }
          },
          {
            opcode: "tb",
            blockType: Scratch.BlockType.REPORTER,
            text: "thumbnail of [id]",
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "5713128876",
              },
            }
          },
          {
            opcode: "getstats",
            blockType: Scratch.BlockType.REPORTER,
            text: "get [stat] of project [id]",
            arguments: {
              stat: {
                type: Scratch.ArgumentType.STRING,
                menu: "stats",
              },
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "5713128876",
              },
            }
          },
          {
            opcode: "getMetadata",
            blockType: Scratch.BlockType.REPORTER,
            text: "metadata of project [id]",
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "5713128876",
              },
            }
          },
          "---",
          {
            opcode: "frontpage",
            blockType: Scratch.BlockType.REPORTER,
            text: "current frontpage",
            disableMonitor: true
          },
          {
            opcode: "rnd",
            blockType: Scratch.BlockType.REPORTER,
            text: "random project id",
            disableMonitor: true
          },
          {
            opcode: "latest",
            blockType: Scratch.BlockType.REPORTER,
            text: "latest project",
            disableMonitor: true,
          },
          /* deprecated */
          {
            opcode: "banned",
            hideFromPalette: true,
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is [user] banned?",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Anonymoose547",
              },
            },
          },
          {
            opcode: "projectcount",
            hideFromPalette: true,
            blockType: Scratch.BlockType.REPORTER,
            text: "project amount of [user]",
            arguments: {
              user: {
                type: Scratch.ArgumentType.STRING,
              },
            },
          },
        ],
        menus: {
          stats: {
            acceptReporters: true,
            items: ["hearts", "votes", "views"],
          },
        }
      };
    }

    // util funcs
    generateIdWithArgs(type, args) {
      return type + Object.values(args).join(".");
    }

    getCached(id) {
      const cached = cache.get(id);
      if (!cached) return null;
      
      if (Date.now() > cached.expires) {
        cache.delete(id);
        return null;
      }
      return cached.value;
    }

    setCached(id, value, optUseMinute) {
      if (this.getCached(id) !== null) return;

      const timer = optUseMinute ? 60000 : 600000;
      cache.set(id, { value, expires: Date.now() + timer });
    }

    // block funcs
    async badges(args) {
      const id = this.generateIdWithArgs("profile", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const username = Cast.toString(args.user);
          const response = await fetch(`${apiURL}users/profile?target=${username}`);
          if (!response.ok) throw new Error("Failed to fetch badges");
          data = await response.json();
        }

        this.setCached(id, data);
        return JSON.stringify(data.badges);
      } catch {
        return "[]";
      }
    }

    async rank(args) {
      const id = this.generateIdWithArgs("profile", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const username = Cast.toString(args.user);
          const response = await fetch(`${apiURL}users/profile?target=${username}`);
          if (!response.ok) throw new Error("Failed to fetch rank");
          data = await response.json();
        }

        this.setCached(id, data);
        return data.rank;
      } catch {
        return "";
      }
    }

    async follows(args) {
      const id = this.generateIdWithArgs("profile", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const username = Cast.toString(args.user);
          const response = await fetch(`${apiURL}users/profile?target=${username}`);
          if (!response.ok) throw new Error("Failed to fetch followers");
          data = await response.json();
        }

        this.setCached(id, data);
        return data.followers;
      } catch {
        return "";
      }
    }

    async viewable(args) {
      const id = this.generateIdWithArgs("profile", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const username = Cast.toString(args.user);
          const response = await fetch(`${apiURL}users/profile?target=${username}`);
          if (!response.ok) throw new Error("Failed to fetch viewability");
          data = await response.json();
        }

        this.setCached(id, data);
        return !data.privateProfile;
      } catch {
        return false;
      }
    }

    async rankup(args) {
      const id = this.generateIdWithArgs("profile", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const username = Cast.toString(args.user);
          const response = await fetch(`${apiURL}users/profile?target=${username}`);
          if (!response.ok) throw new Error("Failed to fetch rank up");
          data = await response.json();
        }

        this.setCached(id, data);
        return data.canrankup;
      } catch {
        return false;
      }
    }

    async donator(args) {
      const id = this.generateIdWithArgs("profile", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const username = Cast.toString(args.user);
          const response = await fetch(`${apiURL}users/profile?target=${username}`);
          if (!response.ok) throw new Error("Failed to fetch donator");
          data = await response.json();
        }

        this.setCached(id, data);
        return data.donator;
      } catch {
        return false;
      }
    }

    pfp(args) {
      return `${apiURL}users/getpfp?username=${Cast.toString(args.user)}`;
    }
  
    async projects(args) {
      const id = this.generateIdWithArgs("userProjects", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const username = Cast.toString(args.user);
          const response = await fetch(`${apiURL}projects/getprojectsbyauthor?authorUsername=${username}`);
          if (!response.ok) throw new Error("Failed to fetch projects");
          data = await response.json();
        }

        this.setCached(id, data);
        return JSON.stringify(data);
      } catch {
        return "[]";
      }
    }

    tb(args) {
      return `${apiURL}projects/getproject?projectID=${Cast.toString(args.id)}&requestType=thumbnail`;
    }

    async rnd() {
      try {
        const response = await fetch(`${apiURL}projects/getrandomproject`);
        if (!response.ok) throw new Error("Failed to fetch random project");
        let data = await response.json();

        return data.id;
      } catch {
        return "";
      }
    }

    async latest() {
      const id = this.generateIdWithArgs("latestProject", {});
      let data = this.getCached(id);

      try {
        if (data === null) {
          const response = await fetch(`${apiURL}projects/getprojects`);
          if (!response.ok) throw new Error("Failed to fetch latest project");
          data = await response.json();
        }

        // Check if there are projects in the array
        if (data && data.length) data = JSON.stringify(data[0]);
        else return "{}";

        this.setCached(id, data, true);
        return data;
      } catch {
        return "{}";
      }
    }

    async frontpage() {
      const id = this.generateIdWithArgs("frontPage", {});
      let data = this.getCached(id);

      try {
        if (data === null) {
          const response = await fetch(`${apiURL}projects/frontPage`);
          if (!response.ok) throw new Error("Failed to fetch front page");
          data = await response.json();
        }

        this.setCached(id, data);
        return JSON.stringify(data);
      } catch {
        return "{}";
      }
    }

    async getstats(args) {
      const id = this.generateIdWithArgs("project", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const projID = Cast.toString(args.id);
          const response = await fetch(`${apiURL}projects/getproject?projectID=${projID}&requestType=metadata`);
          if (!response.ok) throw new Error("Failed to fetch project statistics");
          data = await response.json();
        }

        this.setCached(id, data);
        switch (Cast.toString(args.stat)) {
          case "hearts": return data.loves;
          case "votes": return data.votes;
          case "views": return data.views;
          default: return "";
        }
      } catch {
        return "";
      }
    }

    async getMetadata(args) {
      const id = this.generateIdWithArgs("project", args);
      let data = this.getCached(id);

      try {
        if (data === null) {
          const projID = Cast.toString(args.id);
          const response = await fetch(`${apiURL}projects/getproject?projectID=${projID}&requestType=metadata`);
          if (!response.ok) throw new Error("Failed to fetch project metadata");
          data = await response.json();
        }

        this.setCached(id, data);
        return JSON.stringify(data);
      } catch {
        return "{}";
      }
    }

    /* deprecated */
    projectcount() {
      throw new Error("This block is disabled as you can use the get projects block and count the length");
    }
    banned() {
      throw new Error("This block is currently disabled as you can no longer check if a user is banned without being a moderator");
    }
  }

  Scratch.extensions.register(new PMAPI());
})(Scratch);
