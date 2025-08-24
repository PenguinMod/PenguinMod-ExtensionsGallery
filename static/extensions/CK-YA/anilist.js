//by ckya
//umm rest api anilist extension to get info for anime,manga etc

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  class AniListExtension {
    constructor() {
      this.cache = {};
      this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
      this.regionCodes = {
        'Any': null,
        'Japanese': 'JP',
        'Korean': 'KR',
        'Chinese': 'CN',
        'Taiwanese': 'TW'
      };
    }

    getInfo() {
      return {
        id: 'anilistUltimate',
        name: 'AniList Ultimate',
        color1: '#02A9FF',
        color2: '#0177CC',
        blocks: [
          {
            opcode: 'searchMedia',
            blockType: Scratch.BlockType.REPORTER,
            text: 'search [REGION] [TYPE] title [TITLE]',
            arguments: {
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Attack on Titan' }
            }
          },
          {
            opcode: 'searchMultiple',
            blockType: Scratch.BlockType.REPORTER,
            text: 'search multiple [REGION] [TYPE] title [TITLE] limit [LIMIT]',
            arguments: {
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Attack on Titan' },
              LIMIT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: 'getDescription',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get description of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getGenres',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get genres of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getCoverImage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get cover image of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getScore',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get score of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getCharacters',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get characters of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getCharacterImage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get character image of [CHARACTER] from [REGION] [TYPE] [TITLE]',
            arguments: {
              CHARACTER: { type: Scratch.ArgumentType.STRING, defaultValue: 'Jinwoo' },
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Solo Leveling' }
            }
          },
          {
            opcode: 'getStudios',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get studios of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getFormat',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get format of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getStatus',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get status of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getEpisodes',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get episodes of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getYear',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get release year of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'getPopularity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get popularity of [REGION] [TYPE] [TITLE]',
            arguments: { 
              REGION: { type: Scratch.ArgumentType.STRING, menu: 'regionType' },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: 'mediaType' },
              TITLE: { type: Scratch.ArgumentType.STRING }
            }
          },
          {
            opcode: 'clearCache',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear cache'
          }
        ],
        menus: {
          mediaType: {
            acceptReporters: true,
            items: ['ANIME', 'MANGA']
          },
          regionType: {
            acceptReporters: true,
            items: ['Any', 'Japanese', 'Korean', 'Chinese', 'Taiwanese']
          }
        }
      };
    }

    getCacheKey(title, type, region) {
      const regionKey = region && region !== 'Any' ? region : 'ANY';
      return regionKey + ':' + (type || 'ANIME') + ':' + (title || '').toLowerCase().trim();
    }

    isCacheValid(entry) {
      return entry && (Date.now() - entry.timestamp) < this.cacheTimeout;
    }

    async fetchMedia(title, type, region) {
      if (!title || title.trim() === '') return null;

      const cacheKey = this.getCacheKey(title, type, region);
      const cached = this.cache[cacheKey];
      
      if (this.isCacheValid(cached)) {
        return cached.data;
      }

      const countryCode = this.regionCodes[region] || null;
      
      // First try to find exact match with region filter
      let media = null;
      if (countryCode) {
        media = await this.fetchMediaWithRegion(title, type, countryCode);
      }
      
      // If no regional match found, try general search
      if (!media) {
        media = await this.fetchMediaGeneral(title, type);
        
        // If region was specified and we found something, check if it matches
        if (media && countryCode && media.countryOfOrigin !== countryCode) {
          // Try to find a better match
          const regionalMatch = await this.findRegionalMatch(title, type, countryCode);
          if (regionalMatch) {
            media = regionalMatch;
          }
        }
      }

      if (media) {
        this.cache[cacheKey] = {
          data: media,
          timestamp: Date.now()
        };
      }

      return media;
    }

    async fetchMultipleResults(title, type, region, limit) {
      if (!title || title.trim() === '') return null;

      const countryCode = this.regionCodes[region] || null;
      limit = Math.min(Math.max(parseInt(limit) || 5, 1), 25); // Limit between 1-25

      const query = `
        query ($search: String, $type: MediaType, $country: CountryCode, $perPage: Int) {
          Page(page: 1, perPage: $perPage) {
            media(search: $search, type: $type, countryOfOrigin: $country) {
              id
              title { romaji english native }
              format
              averageScore
              countryOfOrigin
              status
              startDate { year }
            }
          }
        }
      `;

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query,
            variables: { 
              search: title.trim(), 
              type: type, 
              country: countryCode,
              perPage: limit 
            }
          })
        });

        const json = await response.json();
        return json.data && json.data.Page && json.data.Page.media;
      } catch (error) {
        console.error('Multiple results fetch error:', error);
        return null;
      }
    }

    async fetchMediaWithRegion(title, type, countryCode) {
      const query = `
        query ($search: String, $type: MediaType, $country: CountryCode) {
          Page(page: 1, perPage: 5) {
            media(search: $search, type: $type, countryOfOrigin: $country) {
              id
            }
          }
        }
      `;

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query,
            variables: { search: title.trim(), type: type, country: countryCode }
          })
        });

        const json = await response.json();
        const results = json.data && json.data.Page && json.data.Page.media;
        
        if (results && results.length > 0) {
          return await this.fetchMediaById(results[0].id);
        }

        return null;
      } catch (error) {
        console.error('Regional search error:', error);
        return null;
      }
    }

    async findRegionalMatch(title, type, countryCode) {
      const query = `
        query ($search: String, $type: MediaType) {
          Page(page: 1, perPage: 10) {
            media(search: $search, type: $type) {
              id
              countryOfOrigin
              title { romaji english native }
            }
          }
        }
      `;

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query,
            variables: { search: title.trim(), type: type }
          })
        });

        const json = await response.json();
        const results = json.data && json.data.Page && json.data.Page.media;
        
        if (results) {
          // Find first match with correct country
          const match = results.find(media => media.countryOfOrigin === countryCode);
          if (match) {
            return await this.fetchMediaById(match.id);
          }
        }

        return null;
      } catch (error) {
        console.error('Regional match search error:', error);
        return null;
      }
    }

    async fetchMediaGeneral(title, type) {
      const query = `
        query ($search: String, $type: MediaType) {
          Media(search: $search, type: $type) {
            id
            title { romaji english native }
            description(asHtml: false)
            format
            episodes
            chapters
            status
            genres
            averageScore
            popularity
            countryOfOrigin
            coverImage { large medium }
            startDate { year month day }
            studios { nodes { name } }
            characters(perPage: 20) {
              edges {
                role
                node {
                  name { full }
                  image { large medium }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query,
            variables: { search: title.trim(), type: type }
          })
        });

        if (!response.ok) {
          throw new Error('Network error: ' + response.status);
        }

        const json = await response.json();
        
        if (json.errors) {
          console.error('GraphQL errors:', json.errors);
          return null;
        }

        return json.data && json.data.Media;
      } catch (error) {
        console.error('General fetch error:', error);
        return null;
      }
    }

    async fetchMediaById(id) {
      const query = `
        query ($id: Int) {
          Media(id: $id) {
            id
            title { romaji english native }
            description(asHtml: false)
            format
            episodes
            chapters
            status
            genres
            averageScore
            popularity
            countryOfOrigin
            coverImage { large medium }
            startDate { year month day }
            studios { nodes { name } }
            characters(perPage: 20) {
              edges {
                role
                node {
                  name { full }
                  image { large medium }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query,
            variables: { id: id }
          })
        });

        const json = await response.json();
        return json.data && json.data.Media;
      } catch (error) {
        console.error('Fetch by ID error:', error);
        return null;
      }
    }

    cleanText(text) {
      if (!text) return '';
      return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    }

    findCharacter(characters, searchName) {
      if (!characters || !characters.edges || !searchName) return null;
      
      const search = searchName.toLowerCase().trim();
      
      for (const edge of characters.edges) {
        const name = edge.node.name.full || '';
        if (name.toLowerCase().includes(search) || search.includes(name.toLowerCase())) {
          return edge.node;
        }
      }
      
      return null;
    }

    getRegionDisplay(region) {
      const code = this.regionCodes[region];
      return code ? '[' + code + ']' : '';
    }

    // Block implementations
    async searchMedia(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media) return 'No results found';
      
      const title = media.title.english || media.title.romaji || media.title.native;
      const origin = media.countryOfOrigin ? ' [' + media.countryOfOrigin + ']' : '';
      return 'Found: ' + title + ' (' + media.format + ')' + origin;
    }

    async searchMultiple(args) {
      const results = await this.fetchMultipleResults(args.TITLE, args.TYPE, args.REGION, args.LIMIT);
      if (!results || results.length === 0) return 'No results found';
      
      const resultList = results.map(function(media, index) {
        const title = media.title.english || media.title.romaji || media.title.native;
        const year = media.startDate && media.startDate.year ? ' (' + media.startDate.year + ')' : '';
        const score = media.averageScore ? ' [' + media.averageScore + '/100]' : '';
        const origin = media.countryOfOrigin ? ' [' + media.countryOfOrigin + ']' : '';
        return (index + 1) + '. ' + title + year + score + origin;
      });
      
      return resultList.join(' | ');
    }

    async getDescription(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.description) return 'No description available';
      return this.cleanText(media.description);
    }

    async getGenres(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.genres || media.genres.length === 0) return 'No genres listed';
      return media.genres.join(', ');
    }

    async getCoverImage(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.coverImage) return 'No image available';
      return media.coverImage.large || media.coverImage.medium || 'No image available';
    }

    async getScore(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.averageScore) return 'No score available';
      return media.averageScore + '/100';
    }

    async getCharacters(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.characters || !media.characters.edges) return 'No characters available';
      
      const names = media.characters.edges.slice(0, 5).map(function(edge) {
        return edge.node.name.full + ' (' + edge.role + ')';
      });
      
      return names.join(', ');
    }

    async getCharacterImage(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.characters) return 'No characters found';
      
      const character = this.findCharacter(media.characters, args.CHARACTER);
      if (!character) {
        const available = media.characters.edges.slice(0, 3).map(function(edge) {
          return edge.node.name.full;
        });
        return 'Character not found. Available: ' + available.join(', ');
      }
      
      if (!character.image) return 'No image for ' + character.name.full;
      return character.image.large || character.image.medium || 'No image available';
    }

    async getStudios(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.studios || !media.studios.nodes) return 'No studios listed';
      
      const names = media.studios.nodes.map(function(studio) {
        return studio.name;
      });
      
      return names.join(', ');
    }

    async getFormat(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      return media && media.format ? media.format : 'Unknown format';
    }

    async getStatus(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.status) return 'Unknown status';
      return media.status.replace(/_/g, ' ').toLowerCase();
    }

    async getEpisodes(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media) return 'Unknown';
      
      if (media.episodes) return media.episodes + ' episodes';
      if (media.chapters) return media.chapters + ' chapters';
      return 'Unknown episode count';
    }

    async getYear(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.startDate || !media.startDate.year) return 'Unknown year';
      return media.startDate.year.toString();
    }

    async getPopularity(args) {
      const media = await this.fetchMedia(args.TITLE, args.TYPE, args.REGION);
      if (!media || !media.popularity) return 'No popularity data';
      return media.popularity.toString();
    }

    clearCache() {
      this.cache = {};
      return 'Cache cleared';
    }
  }

  Scratch.extensions.register(new AniListExtension());
})(Scratch);
