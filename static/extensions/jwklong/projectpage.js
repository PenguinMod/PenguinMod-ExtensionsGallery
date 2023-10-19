class ProjectPage {
  getInfo() {
    return {
      id: 'jwklongprojectpage',
      name: 'Project Page',
      color1: '#999999',
      color2: '#777777',
      blocks: [
        {
          opcode: 'changeProjectName',
          blockType: Scratch.BlockType.COMMAND,
          text: 'change project name to [STR]',
          disableMonitor: true,
          arguments: {
            STR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "trolling"
            },
          }
        },
        {
          opcode: 'changeProjectAuthor',
          blockType: Scratch.BlockType.COMMAND,
          text: 'change project author to [STR]',
          disableMonitor: true,
          arguments: {
            STR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "trolling"
            },
          }
        },
        "---",
        {
          opcode: 'setBodyStyle',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set html custom style to [STR]',
          disableMonitor: true,
          arguments: {
            STR: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "filter: contrast(2);"
            },
          }
        },
      ],
    }
  }
  changeProjectName(args) {
    const name = document.querySelector(".interface_project-metadata_1yR_m h2")
    if (name) name.innerText = args.STR
  }

  changeProjectAuthor(args) {
    const name = document.querySelector(".interface_project-metadata_1yR_m a")
    if (name) name.innerText = args.STR
  }

  setBodyStyle(args) {
    document.body.setAttribute('style', "width:100%;position:absolute!important;"+args.STR)
  }
}

Scratch.extensions.register(new ProjectPage())
