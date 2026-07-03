// Name: Tags
// Description: Lets you create tags, attach them to sprites, and query which sprites
// have which tags.
// License: MIT
// By: GatocDev

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Tags extension must be run unsandboxed');
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;

  // tagName (lowercase key) -> { display: originalCasing, sprites: Set<spriteName> }
  const tags = new Map();

  // spriteName -> Set<tagName lowercase>
  const spriteTags = new Map();

  const norm = (s) => Scratch.Cast.toString(s).trim().toLowerCase();

  function ensureTag(rawName) {
    const key = norm(rawName);
    if (!key) return null;
    if (!tags.has(key)) {
      tags.set(key, { display: Scratch.Cast.toString(rawName).trim(), sprites: new Set() });
    }
    return key;
  }

  function tagExists(rawName) {
    return tags.has(norm(rawName));
  }

  function getAllSpriteNames() {
    return runtime.targets
      .filter((t) => t.isOriginal && !t.isStage)
      .map((t) => t.getName());
  }

  function findTargetByName(name) {
    return runtime.targets.find(
      (t) => t.isOriginal && !t.isStage && t.getName() === name
    );
  }

  // Resolves the "sprite" dropdown value (which may be a real sprite name,
  // "_myself_", or an arbitrary reporter string) down to a concrete sprite
  // name string. Falls back to just returning the string itself, so tags
  // can be attached to names of sprites that don't currently exist too.
  // TO DO:Fuh i forgot what i was supposed to do, i will update it when i remember what i has to so
  function resolveSpriteName(value, util) {
    const v = Scratch.Cast.toString(value);
    if (v === '_myself_') {
      return util.target.getName();
    }
    return v;
  }

  function addTagToSprite(spriteName, rawTag) {
    const key = ensureTag(rawTag);
    if (!key) return;
    tags.get(key).sprites.add(spriteName);

    if (!spriteTags.has(spriteName)) spriteTags.set(spriteName, new Set());
    spriteTags.get(spriteName).add(key);
  }

  function removeTagFromSprite(spriteName, rawTag) {
    const key = norm(rawTag);
    if (tags.has(key)) tags.get(key).sprites.delete(spriteName);
    if (spriteTags.has(spriteName)) spriteTags.get(spriteName).delete(key);
  }

  function deleteTag(rawTag) {
    const key = norm(rawTag);
    const entry = tags.get(key);
    if (!entry) return;
    for (const spriteName of entry.sprites) {
      if (spriteTags.has(spriteName)) spriteTags.get(spriteName).delete(key);
    }
    tags.delete(key);
  }

  class TagsExtension {
    getInfo() {
      return {
        id: 'tagsExtension',
        name: 'Tags',
        color1: '#fccb58',
        color2: '#e0ac3f',
        blocks: [
          {
            opcode: 'createTag',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create tag [TAG]',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' }
            }
          },
          {
            opcode: 'deleteTagBlock',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete tag [TAG]',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' }
            }
          },
          '---',
          {
            opcode: 'tagSprite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [SPRITE] to tag [TAG]',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'spriteMenu',
                defaultValue: '_myself_'
              },
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' }
            }
          },
          {
            opcode: 'untagSprite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove tag [TAG] from [SPRITE]',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' },
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'spriteMenu',
                defaultValue: '_myself_'
              }
            }
          },
          {
            opcode: 'clearSpriteTags',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear all tags from [SPRITE]',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'spriteMenu',
                defaultValue: '_myself_'
              }
            }
          },
          '---',
          {
            opcode: 'spriteHasTag',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[SPRITE] has tag [TAG]?',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'spriteMenu',
                defaultValue: '_myself_'
              },
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' }
            }
          },
          {
            opcode: 'tagHasSprites',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'tag [TAG] has any sprites?',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' }
            }
          },
          {
            opcode: 'doesTagExist',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'tag [TAG] exists?',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' }
            }
          },
          '---',
          {
            opcode: 'spritesWithTag',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sprites with tag [TAG]',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' }
            }
          },
          {
            opcode: 'tagsOfSprite',
            blockType: Scratch.BlockType.REPORTER,
            text: 'tags of [SPRITE]',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'spriteMenu',
                defaultValue: '_myself_'
              }
            }
          },
          {
            opcode: 'allTags',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all tags'
          },
          {
            opcode: 'countSpritesWithTag',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of sprites with tag [TAG]',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, defaultValue: 'enemy' }
            }
          }
        ],
        menus: {
          spriteMenu: {
            acceptReporters: true,
            items: 'getSpriteMenuItems'
          }
        }
      };
    }

    getSpriteMenuItems() {
      const items = [{ text: 'myself', value: '_myself_' }];
      for (const name of getAllSpriteNames()) {
        items.push({ text: name, value: name });
      }
      if (items.length === 1) {
        items.push({ text: '(no other sprites)', value: '_myself_' });
      }
      return items;
    }

    createTag(args) {
      ensureTag(args.TAG);
    }

    deleteTagBlock(args) {
      deleteTag(args.TAG);
    }

    tagSprite(args, util) {
      const spriteName = resolveSpriteName(args.SPRITE, util);
      addTagToSprite(spriteName, args.TAG);
    }

    untagSprite(args, util) {
      const spriteName = resolveSpriteName(args.SPRITE, util);
      removeTagFromSprite(spriteName, args.TAG);
    }

    clearSpriteTags(args, util) {
      const spriteName = resolveSpriteName(args.SPRITE, util);
      const set = spriteTags.get(spriteName);
      if (!set) return;
      for (const key of Array.from(set)) {
        if (tags.has(key)) tags.get(key).sprites.delete(spriteName);
      }
      spriteTags.delete(spriteName);
    }

    spriteHasTag(args, util) {
      const spriteName = resolveSpriteName(args.SPRITE, util);
      const set = spriteTags.get(spriteName);
      return !!set && set.has(norm(args.TAG));
    }

    tagHasSprites(args) {
      const entry = tags.get(norm(args.TAG));
      return !!entry && entry.sprites.size > 0;
    }

    doesTagExist(args) {
      return tagExists(args.TAG);
    }

    spritesWithTag(args) {
      const entry = tags.get(norm(args.TAG));
      if (!entry) return [];
      return Array.from(entry.sprites);
    }

    tagsOfSprite(args, util) {
      const spriteName = resolveSpriteName(args.SPRITE, util);
      const set = spriteTags.get(spriteName);
      if (!set) return [];
      return Array.from(set).map((key) =>
        tags.get(key) ? tags.get(key).display : key
      );
    }

    allTags() {
      return Array.from(tags.values()).map((e) => e.display);
    }

    countSpritesWithTag(args) {
      const entry = tags.get(norm(args.TAG));
      return entry ? entry.sprites.size : 0;
    }
  }

  Scratch.extensions.register(new TagsExtension());
})(Scratch);
