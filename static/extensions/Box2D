// Box Physics by pooiod7

var b2Dscratch;
(function(Scratch) {
  'use strict';
// I know this is a hacky solution, but it's the best I could do
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Box2D can\'t run in the sandbox');
  }
  b2Dscratch = Scratch;
})(Scratch);

var b2Vec2, b2AABB, b2BodyDef, b2Body, b2FixtureDef, b2Fixture, b2World, b2MassData, b2PolygonShape, b2CircleShape, b2DebugDraw, b2MouseJointDef;
var b2Dworld, fixDef;
var b2Dzoom = 50;

var defSpring = {len:100, damp:0.7, freq: 5};

var box2dscript = box2dscript;
if (!box2dscript) { 
  box2dscript = document.createElement("script");
  box2dscript.type="text/javascript";
  box2dscript.src="https://pooiod7.neocities.org/projects/scratch/extensions/extras/js/box2Dlib.js";
  document.body.appendChild(box2dscript);
}

var noiniterror = "wait for script load";

var bodyDef;

var uid_seq = 0;
var ujid_seq = 0;

var bodies = {};
var joints = {};

var categorySeq = 1;
var categories = {'default':1}

var bodyCategoryBits = 1;
var bodyMaskBits = 1;
var noCollideSeq = 0;

const toRad = Math.PI / 180;

var simspeed = 0;

const blockIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiDQoJIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOmE9Imh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVTVkdWaWV3ZXJFeHRlbnNpb25zLzMuMC8iDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSItMy43IC0zLjcgNDAgNDAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTMuNyAtMy43IDQwIDQwIg0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPHJlY3QgeD0iOC45IiB5PSIxLjUiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzE2OUZCMCIgc3Ryb2tlLXdpZHRoPSIzIiB3aWR0aD0iMTQuOCIgaGVpZ2h0PSIxNC44Ii8+DQo8cmVjdCB4PSIxLjUiIHk9IjE2LjMiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzE2OUZCMCIgc3Ryb2tlLXdpZHRoPSIzIiB3aWR0aD0iMTQuOCIgaGVpZ2h0PSIxNC44Ii8+DQo8cmVjdCB4PSIxNi4zIiB5PSIxNi4zIiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiMxNjlGQjAiIHN0cm9rZS13aWR0aD0iMyIgd2lkdGg9IjE0LjgiIGhlaWdodD0iMTQuOCIvPg0KPC9zdmc+";
const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiDQoJIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOmE9Imh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVTVkdWaWV3ZXJFeHRlbnNpb25zLzMuMC8iDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSItMy43IC0zLjcgNDAgNDAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgLTMuNyAtMy43IDQwIDQwIg0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxkZWZzPg0KPC9kZWZzPg0KPHJlY3QgeD0iOC45IiB5PSIxLjUiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzE2OUZCMCIgc3Ryb2tlLXdpZHRoPSIzIiB3aWR0aD0iMTQuOCIgaGVpZ2h0PSIxNC44Ii8+DQo8cmVjdCB4PSIxLjUiIHk9IjE2LjMiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzE2OUZCMCIgc3Ryb2tlLXdpZHRoPSIzIiB3aWR0aD0iMTQuOCIgaGVpZ2h0PSIxNC44Ii8+DQo8cmVjdCB4PSIxNi4zIiB5PSIxNi4zIiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiMxNjlGQjAiIHN0cm9rZS13aWR0aD0iMyIgd2lkdGg9IjE0LjgiIGhlaWdodD0iMTQuOCIvPg0KPC9zdmc+";

class BoxPhys {
  constructor() {
    this.vm = b2Dscratch.vm;
    
    this.vm.runtime.on('PROJECT_STOP', () => {
      if (this.available()) {
        this.init({"SCALE":b2Dzoom,"GRAVITY":-10,"SCENE":"stage"});
      }
    });
    
    box2dscript.onload = function () {
      if (!b2Dzoom) {
        this.init({"SCALE":b2Dzoom,"GRAVITY":-10,"SCENE":"stage"});
      }
    };
  }
  getInfo() {
    return {
      id: 'P7BoxPhys',
      name: 'Box2D Physics',
      color1: "#2cb0c0",
      color2: '#4eb88a',
      menuIconURI: menuIconURI,
      /*blockIconURI: blockIconURI,*/
      docsURI: 'https://pooiod7.neocities.org/markdown/#/projects/scratch/extensions/other/markdown/box2D.md',
      blocks: [
        {
          opcode: 'available',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Box2D Loaded',
        },
        {
          opcode: 'init',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Init World, scale 1m: [SCALE]  gravity: [GRAVITY]  scene: [SCENE]',
          arguments: {
            SCALE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 50,
            },
            GRAVITY: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: -10,
            },
            SCENE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'sceneType',
              defaultValue: 'stage',
            },
          },
        },
        {
          opcode: 'setBodyAttrs',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Define Type [BODYTYPE]  Density [DENSITY]  Friction [FRICTION]  Bounce [BOUNCE]',
          arguments: {
            BODYTYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'BodyTypePK',
              defaultValue: 'dynamic',
            },
            DENSITY: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1.0,
            },
            FRICTION: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0.5,
            },
            BOUNCE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0.2,
            },
          },
        },
        {
          opcode: 'defineCircle',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Define Circle, size: [SIZE]',
          arguments: {
            SIZE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100,
            },
          },
        },
        {
          opcode: 'defineRect',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Define Box, width: [WIDTH] height: [HEIGHT]',
          arguments: {
            WIDTH: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100,
            },
            HEIGHT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100,
            },
          },
        },
        {
          opcode: 'definePoly',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Define Polygon, points: [POINTS]',
          arguments: {
            POINTS: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "0 50   40 -50   -40 -50",
            },
          },
        },
        {
          opcode: 'placeBody',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Create Body [NAME] at x: [X]  y: [Y]  dir: [DIR]',
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'name',
            },
            X: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            Y: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            DIR: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 90,
            },
          },
        },
        {
          opcode: 'createNoCollideSet',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Create no collide set [NAMES]',
          arguments: {
            NAMES: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'name1 name2',
            },
          },
        },
        {
          opcode: 'destroyBody',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Destroy Body [NAME]',
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'name',
            },
          },
        },
        {
          opcode: 'setBodyAttr',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Set [BODYATTR] of body [NAME] to [VALUE]',
          arguments: {
            BODYATTR: {
              type: Scratch.ArgumentType.STRING,
              menu: 'bodyAttr',
            },
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'name',
            },
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0.1,
            },
          },
        },
        {
          opcode: 'getBodyAttr',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get [BODYATTRREAD] from body [NAME]',
          arguments: {
            BODYATTRREAD: {
              type: Scratch.ArgumentType.STRING,
              menu: 'bodyAttrRead',
            },
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'name',
            },
          },
        },
        {
          opcode: 'getBodyIDAt',
          blockType: Scratch.BlockType.REPORTER,
          hideFromPalette: true, // wip block 
          text: 'Get id of body at x: [X]  y: [Y]',
          arguments: {
            X: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            Y: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
          },
        },
        {
          opcode: 'applyForceToBody',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Apply [FORCETYPE] to Body [NAME] at x: [X]  y: [Y]  power: [POWER]  dir: [DIR]',
          arguments: {
            FORCETYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'ForceType',
              defaultValue: 'Impulse',
            },
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'name',
            },
            X: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            Y: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            POWER: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 50,
            },
            DIR: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 90,
            },
          },
        },
        {
          opcode: 'applyAngForceToBody',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Apply Angular Impulse to Body [NAME] power: [POWER]',
          arguments: {
            ANGFORCETYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'AngForceType',
              defaultValue: 'Impulse',
            },
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'name',
            },
            POWER: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
          },
        },
        {
          opcode: 'defineSpring',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Define Spring Length: [LENGTH]  Damping: [DAMPING]  Freq: [FREQ]',
          arguments: {
            LENGTH: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100,
            },
            DAMPING: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0.7,
            },
            FREQ: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 5,
            },
          },
        },
        {
          opcode: 'createJointOfType',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Create Joint [JOINTID] of type [JOINTTYPE] between [BODY1] at [X1] [Y1] and [BODY2] at [X2] [Y2]',
          arguments: {
            JOINTID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Joint ID',
            },
            JOINTTYPE: {
              type: Scratch.ArgumentType.STRING,
              menu: 'JointType',
              defaultValue: 'Rotating',
            },
            BODY1: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'BodyID',
            },
            X1: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            Y1: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            BODY2: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'BodyID',
            },
            X2: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            Y2: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
          },
        },
        {
          opcode: 'destroyJoint',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Destroy Joint ID [JOINTID]',
          arguments: {
            JOINTID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Joint ID',
            },
          },
        },
        {
          opcode: 'setJointAttr',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Set Joint [JOINTATTR] of joint [JOINTID] to [VALUE]',
          arguments: {
            JOINTATTR: {
              type: Scratch.ArgumentType.STRING,
              menu: 'JointAttr',
              defaultValue: 'Motor On',
            },
            JOINTID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Joint ID',
            },
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
          },
        },
        {
          opcode: 'getJointAttr',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get Joint [JOINTATTRREAD] of joint [JOINTID]',
          arguments: {
            JOINTATTRREAD: {
              type: Scratch.ArgumentType.STRING,
              menu: 'JointAttrRead',
            },
            JOINTID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Joint ID',
            },
          },
        },
        {
          opcode: 'setJointTarget',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Set Mouse Joint Target [JOINTID] to x: [X]  y: [Y]',
          arguments: {
            JOINTID: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Joint ID',
            },
            X: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            Y: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
          },
        },
        {
          opcode: 'moveto',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Move object [NAME] to x [X] y [Y]',
          arguments: {
            X: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            Y: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "name",
            },
          },
        },
        {
          opcode: 'rotateto',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Set rotation of object [NAME] to [ROT]',
          arguments: {
            ROT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 90,
            },
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "name",
            },
          },
        },
        {
          opcode: 'clearvel',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Clear velocity of object [NAME]',
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "name",
            },
          },
        },
        {
          opcode: 'getsimspeed',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Slow motion',
        },
        {
          opcode: 'setsimspeed',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Set slow motion to [VALUE]',
          arguments: {
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 30,
            },
          },
        },
        {
          opcode: 'stepSimulation',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Step Simulation',
        },
      ],
      menus: {
        sceneType: ['stage', 'nothing'],
        BodyTypePK: ['dynamic', 'static'],
        bodyAttr: ['damping', 'rotational damping'],
        bodyAttrRead: ['x', 'y', 'Xvel', 'Yvel', 'Dvel', 'direction', 'awake'],
        ForceType: ['Impulse', 'World Impulse'],
        AngForceType: ['Impulse'],
        JointType: ['Rotating', 'Spring', 'Mouse'],
        JointAttr: ['Motor On', 'Motor Speed', 'Max Torque', 'Limits On', 'Lower Limit', 'Upper Limit'],
        JointAttrRead: ['Angle', 'Speed', 'Motor Torque', 'Reaction Torque'],
      },
    };
  }

  available() {
    try {
      return !!Box2D;
    } catch(e) {
      return false;
    }
  }

  clearvel(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }
    
    var body = bodies[args.NAME];
    if (!body) return '';
    
    body.SetLinearVelocity(new b2Vec2(0, 0));
    body.SetAngularVelocity(0);
  }

  js_reporter(args) {
    var javascript = eval(args.js);
    try {
      return JSON.stringify(javascript) || javascript;
    } catch (error) {
      return javascript;
    }
  }

  setsimspeed(args) {
    simspeed = args.VALUE;
  }

  getsimspeed() {
    return simspeed;
  }

  setJointTarget(args) {    
    var joint = joints[args.JOINTID];
    if (joint) {
      joint.SetTarget(new b2Vec2(args.X/b2Dzoom, args.Y/b2Dzoom));
    }
  }

  init(args) {    
    if (!this.available()) return 'false';
    
    b2Vec2 = Box2D.Common.Math.b2Vec2;
    b2AABB = Box2D.Collision.b2AABB;
    b2BodyDef = Box2D.Dynamics.b2BodyDef;
    b2Body = Box2D.Dynamics.b2Body;
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    b2Fixture = Box2D.Dynamics.b2Fixture;
    b2World = Box2D.Dynamics.b2World;
    b2MassData = Box2D.Collision.Shapes.b2MassData;
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

    b2Dworld = new b2World(
      new b2Vec2(0, args.GRAVITY)    // args.GRAVITY (10)
     ,  true                   // allow sleep
    );

    b2Dzoom = args.SCALE;

    fixDef = new b2FixtureDef;
    fixDef.density = 1.0;		    // 1.0
    fixDef.friction = 0.5;		 // 0.5
    fixDef.restitution = 0.2;	// 0.2

    bodyDef = new b2BodyDef;

    if (args.SCENE == 'stage') {

      // create ground
      bodyDef.type = b2Body.b2_staticBody;
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(250/b2Dzoom, 10/b2Dzoom);
      bodyDef.position.Set(0,-190/b2Dzoom);
      b2Dworld.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.position.Set(0,1000/b2Dzoom);
      b2Dworld.CreateBody(bodyDef).CreateFixture(fixDef);
      fixDef.shape.SetAsBox(10/b2Dzoom, 800/b2Dzoom);
      bodyDef.position.Set(-250/b2Dzoom,540/b2Dzoom);
      b2Dworld.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.position.Set(250/b2Dzoom,540/b2Dzoom);
      b2Dworld.CreateBody(bodyDef).CreateFixture(fixDef);
    }

    bodies = {};
    joints = {};
    uid_seq = 0;
    ujid_seq = 0;

    categorySeq = 1;
    categories = {'default':1}
    bodyCategoryBits = 1;
    noCollideSeq = 0;

    bodyDef.type = b2Body.b2_dynamicBody;
  }

  setBodyAttrs(args) {
    var stat = args.BODYTYPE;
    var dens = args.DENSITY;
    var fric = args.FRICTION;
    var rest = args.BOUNCE;

    if (!b2Dzoom) {
      return noiniterror;
    }
    
    bodyDef.type = stat==='static' ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
    fixDef.density = dens;		    // 1.0
    fixDef.friction = fric;		   // 0.5
    fixDef.restitution = rest;	// 0.2
  }

  defineCircle(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }
    
    fixDef.shape = new b2CircleShape;
    fixDef.shape.SetRadius( args.SIZE/2/b2Dzoom );
  }

  defineRect(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }
    
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox( args.WIDTH/2/b2Dzoom, args.HEIGHT/2/b2Dzoom );
  }

  definePoly(args) {
    fixDef.shape = new b2PolygonShape;

    if (!b2Dzoom) {
      return noiniterror;
    }

    try {
      var pts = args.POINTS.split(' ');
      for (var i = 0; i < pts.length; i++) {
        if (pts[i].length==0) {         
          pts.splice(i, 1);
          i--;
        }
      }
    
      var vertices = [];
      for (var i=pts.length; i>0;i-=2) {
        vertices.push( new b2Vec2(parseFloat(pts[i-2])/b2Dzoom, parseFloat(pts[i-1])/b2Dzoom) );
      }
      fixDef.shape.SetAsArray( vertices );
    } catch (error) {
      fixDef.shape = new b2CircleShape;
      fixDef.shape.SetRadius( 100/2/b2Dzoom );
      alert("Incorrect polly format");
    }
  }

  placeBody(args) {
    var id = args.NAME;

    if (!b2Dzoom) {
      return noiniterror;
    }
    
    if (bodies[id]) {
      b2Dworld.DestroyBody( bodies[id] );
    }

    fixDef.filter.categoryBits = bodyCategoryBits;
    fixDef.filter.maskBits = bodyMaskBits;

    bodyDef.position.x = args.X/b2Dzoom;
    bodyDef.position.y = args.Y/b2Dzoom;
    bodyDef.angle = (90-args.DIR)*toRad;
    var body = b2Dworld.CreateBody(bodyDef);
    body.uid = id;
    body.CreateFixture(fixDef);
    bodies[id] = body;
  }

  createNoCollideSet(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }
    
    noCollideSeq--;
    var bids = args.NAMES.split(' ');
    for (var i=0; i<bids.length; i++) {
      var bid = bids[i];
      if (bid.length>0) {
        var body = bodies[bid];
        if (body) {
          var fix = body.GetFixtureList();
          while (fix) {
            var fdata = fix.GetFilterData();
            fdata.groupIndex = noCollideSeq;
            fix.SetFilterData(fdata);
            fix = fix.GetNext();
          }
        }
      }
    }
  }

  destroyBody(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }
    
    if (bodies[args.NAME]) {
      b2Dworld.DestroyBody( bodies[args.NAME] );
      delete bodies[args.NAME];
    }
  }

  setBodyAttr(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }
    
    var bds = args.NAME.split(' ');
    for (var i=0; i<bds.length; i++) {
      var id = bds[i];
      if (id.length>0) {
        var body = bodies[id];
        if (body) {
          switch (args.BODYATTR) {
            case 'damping': body.SetLinearDamping( args.VALUE ); break;
            case 'rotational damping': body.GetAngularDamping( args.VALUE ); break;
          }
        }
      }
    }
  }

  getTouchingObjectNames(obj) {
    var contacts = obj.GetContactList();
    var touchingObjectNames = [];

    while (contacts) {
      if (contacts.contact.IsTouching()) {
        var otherFixture = contacts.contact.GetFixtureA() === obj ? contacts.contact.GetFixtureB() : contacts.contact.GetFixtureA();
        var otherBody = otherFixture.GetBody();
        var otherUserData = otherBody.GetUserData();

        if (otherUserData && otherUserData.name) {
          touchingObjectNames.push(otherUserData.name);
        }
      }

      contacts = contacts.next;
    }

    return touchingObjectNames;
  }

  getBodyAttr(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }
    
      var body = bodies[args.NAME];
      if (!body) return '';
      switch (args.BODYATTRREAD) {
        case 'x': return body.GetPosition().x * b2Dzoom;
        case 'y': return body.GetPosition().y * b2Dzoom;
        case 'direction': return 90-(body.GetAngle()/toRad);
        case 'Xvel': return body.GetLinearVelocity().x;
        case 'Yvel': return body.GetLinearVelocity().y;
        case 'Dvel': return body.GetAngularVelocity();
        case 'awake': return body.IsAwake() ? 1 : 0;
        //case 'touching': return JSON.stringify(this.getTouchingObjectNames(body));
      }
      return '';
  }

  moveto(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }

    var body = bodies[args.NAME];
    if (!body) return '';

    var desiredPosition = new b2Vec2(args.X/b2Dzoom, args.Y/b2Dzoom);
    body.SetPosition(desiredPosition);
    body.SetAwake(true)
  }

  rotateto(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }

    var body = bodies[args.NAME];
    if (!body) return '';

    // 90-(body.GetAngle()/toRad)
    // desiredAngleInDegrees * Math.PI / args.ROT

    var desiredRotation = (180-args.ROT-90)*toRad;
    body.SetAngle(desiredRotation);
    body.SetAwake(true)
  }

  getBodyIDAt(args) {
    var x = args.X;
    var y = args.Y;
    
    if (!b2Dzoom) {
      return noiniterror;
    }
    
    mousePVec = new b2Vec2(x/b2Dzoom, y/b2Dzoom);
    var aabb = new b2AABB();
    aabb.lowerBound.Set(mousePVec.x - 0.001, mousePVec.y - 0.001);
    aabb.upperBound.Set(mousePVec.x + 0.001, mousePVec.y + 0.001);

    // Query the b2Dworld for overlapping shapes.
    selectedBody = null;
    b2Dworld.QueryAABB(getBodyCB, aabb);

    return selectedBody ? selectedBody.uid : '';
  }

  applyAngForceToBody(args) {
    var ftype = /*args.ANGFORCETYPE*/ 'Impulse';
    var bodyID = args.NAME;
    var pow = args.POWER;

    if (!b2Dzoom) {
      return noiniterror;
    }

    var body = bodies[bodyID];
    if (!body)
      return;

    if (ftype==='Impulse') {
      body.ApplyTorque( -pow );			
    }
  }

  applyForceToBody(args) {
    var x = args.X;
    var y = args.Y;
    var ftype = args.FORCETYPE;
    var pow = args.POWER;
    var dir = args.DIR;

    if (!b2Dzoom) {
      return noiniterror;
    }
    
    var body = bodies[args.NAME];
    if (!body)
      return;

    dir = (90-dir)*toRad;

    if (ftype==='Impulse') {
      body.ApplyImpulse( {x:pow*Math.cos(dir),y:pow*Math.sin(dir)}, body.GetWorldPoint({x:x/b2Dzoom,y:y/b2Dzoom}) );			
    } else if (ftype==='World Impulse') {
      body.ApplyForce( {x:pow*Math.cos(dir),y:pow*Math.sin(dir)}, {x:x/b2Dzoom,y:y/b2Dzoom} );			
    }
  }

  defineSpring(args) {
    var len = args.LENGTH;
    var damp = args.DAMPING;
    var freq = args.FREQ;

    if (!b2Dzoom) {
      return noiniterror;
    }
    
    defSpring.len = len<0.1 ? 0.1 : len / b2Dzoom;
    defSpring.damp = damp<0 ? 0.7 : damp;
    defSpring.freq = freq>0 ? freq : 5;
  }

  createJointOfType(args) {
    var jName = args.JOINTID;
    var typ = args.JOINTTYPE;
    var bodyID = args.BODY1;
    var x = args.X1;
    var y = args.Y1;
    var bodyID2 = args.BODY2
    var x2 = args.X2;
    var y2 = args.Y2;

    if (!b2Dzoom) {
      return noiniterror;
    }
    
    if (jName.length>0) this.destroyJoint(jName);

    if (bodyID=='') bodyID = null;
    if (bodyID2=='') bodyID2 = null;
    if (!bodyID && !bodyID2) return '';

    var body = bodyID ? bodies[bodyID] : b2Dworld.GetGroundBody();
    var body2 = bodyID2 ? bodies[bodyID2] : b2Dworld.GetGroundBody();

    if (!body || !body2) return '';

    var md;
    switch (typ) {
      case 'Spring':
        md = new Box2D.Dynamics.Joints.b2DistanceJointDef();
        md.length = defSpring.len;
        md.dampingRatio = defSpring.damp;
        md.frequencyHz = defSpring.freq;
        md.bodyA = body;
        md.bodyB = body2;
        md.localAnchorA = {x:x/b2Dzoom, y:y/b2Dzoom};
        md.localAnchorB = {x:x2/b2Dzoom, y:y2/b2Dzoom};
        break;

      case 'Rotating':
        md = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
        md.bodyA = body;
        md.bodyB = body2;
        md.localAnchorA = {x:x/b2Dzoom, y:y/b2Dzoom};
        md.localAnchorB = {x:x2/b2Dzoom, y:y2/b2Dzoom};
        break;

      case 'Mouse':
        var md = new b2MouseJointDef();
        if (bodyID=='') {
          md.bodyB = body2;
          md.target.Set(x2/b2Dzoom, y2/b2Dzoom);
        } else {
          md.bodyB = body;
          md.target.Set(x/b2Dzoom, y/b2Dzoom);
        }
        md.bodyA = b2Dworld.GetGroundBody();
        md.collideConnected = true;
        md.maxForce = 300.0 * body.GetMass();
        break;
    }

    //md.collideConnected = true;
    //md.maxForce = 300.0 * body.GetMass();
    var joint = b2Dworld.CreateJoint(md);
    if (bodyID.length>0) {
      body.SetAwake(true);
    }
    if (bodyID2.length>0) {
      body2.SetAwake(true);
    }

    if (jName.length==0) jName = '_'+(++ujid_seq);
    joints[jName] = joint;
  }

  destroyJoint(args) {
    if (!b2Dzoom) {
      return noiniterror;
    }
    
    var joint = joints[args.JOINTID];
    if (joint) {
      b2Dworld.DestroyJoint(joint);
      delete joints[args.JOINTID];
    }
  }

  setJointAttr(args) {
    var attr = args.JOINTATTR;
    var jointID = args.JOINTID;
    var val = args.VALUE;

    if (!b2Dzoom) {
      return noiniterror;
    }

    // JointAttr: ['Motor On','Motor Speed','Max Torque', 'Limits On','Lower Limit','Upper Limit'],
    var jointids = jointID.split(' ');
    for (var i=0;i<jointids.length;i++) {
      var joint = joints[jointids[i]];
      if (joint) {
        switch(attr) {
        case 'Motor On': joint.EnableMotor(val>0); break;
        case 'Motor Speed': joint.SetMotorSpeed(val); break;
        case 'Max Torque': joint.SetMaxMotorTorque(val); break;

        case 'Limits On': joint.EnableLimit(val>0); break;
        case 'Lower Limit': joint.SetLimits(joint.GetJointAngle()+val*toRad, joint.GetUpperLimit()); break;
        case 'Upper Limit': joint.SetLimits(joint.GetLowerLimit(),joint.GetJointAngle()+val*toRad); break;
      }
      }
    }
  }

  getJointAttr(args) {
    var attr = args.JOINTATTRREAD;
    var jointID = args.JOINTID;

    if (!b2Dzoom) {
      return noiniterror;
    }
    
      // JointAttrRead: ['Angle','Speed','Motor Torque', 'Reaction Torque'],
    var joint = joints[jointID];
    if (joint) {
      switch(attr) {
        case 'Angle': return joint.GetJointAngle()/toRad;
        case 'Speed': return joint.GetJointSpeed();
        case 'Motor Torque': return joint.GetMotorTorque();
        case 'Reaction Torque': return joint.GetReactionTorque();

  //				case 'Lower Limit': return joint.GetLowerLimit()/toRad;
  //				case 'Upper Limit': return joint.GetUpperLimit()/toRad;
      }
      }
  }

  stepSimulation() {
    if (!b2Dzoom) {
      return noiniterror;
    }

    var secondsimspeed = Math.abs(simspeed+29);
    if (secondsimspeed == 0) {secondsimspeed = 1};
  
    b2Dworld.Step(1/secondsimspeed, 10, 10);
    b2Dworld.ClearForces();
  }
}

Scratch.extensions.register(new BoxPhys());
