(function (Scratch) {
  'use strict';
  // I LOVE CATS
  
  const catFacts = [
    "Cats have five toes on their front paws, but only four toes on their back paws.",
    "Cats can make over 100 different sounds.",
    "Cats sleep for about 70% of their lives.",
    "The average cat runs at a speed of 30 miles per hour for short distances.",
    "Cats have a specialized collarbone that allows them to always land on their feet.",
    "The world's oldest cat lived to be 38 years old.",
    "Cats have a special reflective layer behind their retinas, which helps them see better in low light.",
    "A group of cats is called a clowder.",
    "Cats can rotate their ears 180 degrees.",
    "The average cat spends about 70% of its life indoors.",
    "Cats have a unique nose print, much like a human's fingerprint.",
    "Cats have whiskers on the backs of their front legs as well as on their faces.",
    "Cats have a specialized jaw that allows them to only move their jaws up and down, not side to side.",
    "Cats have a higher body temperature than humans, averaging around 101.5 degrees Fahrenheit.",
    "Cats have a strong aversion to citrus scents.",
    "Cats have retractable claws that they only extend when needed.",
    "Cats have a specialized grooming tongue covered in tiny, hook-like structures called papillae.",
    "Cats have a highly developed sense of balance, which helps them navigate narrow spaces.",
    "Cats can rotate their front paws inwards when climbing down trees or other vertical surfaces.",
    "Cats have a third eyelid called a haw, which helps protect their eyes.",
    "Cats have scent glands on their cheeks and paws, which they use to mark their territory.",
    "Cats have a unique collarbone that is not connected to other bones, allowing them to fit through tight spaces.",
    "Cats have a specialized organ in their noses called the Jacobson's organ, which helps them process certain scents.",
    "Cats have a keen sense of hearing and can detect frequencies up to 64,000 Hz.",
    "Cats have a specialized structure in their inner ear that allows them to maintain their balance.",
    "Cats have a long, flexible spine that enables them to twist and bend their bodies in various ways.",
    "Cats have a keen sense of smell and can detect odors much more strongly than humans.",
    "Cats have a strong preference for cleanliness and spend a significant amount of time grooming themselves.",
    "Cats have a specialized vocalization called a chirrup, which is a mix between a meow and a purr.",
    "Cats have a strong prey drive and enjoy hunting and pouncing on toys or small objects.",
    "Cats have a natural instinct to scratch and mark their territory.",
    "Cats have a unique paw-pads pattern, similar to a human's fingerprints.",
    "Cats have been domesticated for over 4,000 years.",
    "Cats have an average of 12 whiskers on each side of their face.",
    "Cats have a highly developed sense of taste, and they have about 470 taste buds.",
    "Cats have a nictitating membrane, or a third eyelid, that helps protect their eyes from damage.",
    "Cats have a strong aversion to water, but some breeds, like the Maine Coon, enjoy playing with it.",
    "Cats have a specialized tooth called a carnassial tooth, which helps them shear meat from bones.",
    "Cats have a keen sense of timing and are known for their impeccable ability to judge distances.",
    "Cats have a natural instinct to knead or 'make biscuits' with their paws when they are content.",
    "Cats have a highly flexible spine that allows them to twist and turn in mid-air.",
    "Cats have a higher field of vision than humans, as they can see up to 200 degrees.",
    "Cats have a specialized grooming technique called allogrooming, where they groom other cats as a social bonding activity.",
    "Cats have a unique hunting behavior known as 'the pounce', where they crouch and spring forward to capture their prey.",
    "Cats have a highly developed sense of touch, with sensitive nerve endings in their paws and whiskers.",
    "Cats have a preference for hiding and seeking out small, enclosed spaces.",
    "Cats have a unique purring mechanism that involves the vibration of their vocal cords and diaphragm.",
    "Cats have a natural instinct to mark their territory by rubbing their scent glands against objects.",
    "Cats have a strong sense of curiosity and enjoy exploring their surroundings.",
    "Cats have a specialized collarbone called the clavicle, which is much smaller and more flexible than a human's.",
    "Cats have a highly developed sense of night vision and can see in almost total darkness.",
    "Cats have a natural instinct to use a litter box for elimination, making them easy to house-train.",
    "Cats have a unique grooming behavior called 'bunting,' where they rub their face against objects or people to mark them with their scent.",
    "Cats have a strong bond with their human caregivers and can form deep emotional connections.",
    "Cats have a highly developed sense of spatial awareness and can squeeze through narrow gaps with ease."
  ];
  
  let catBreeds = [
    'Abyssinian',
    'American Bobtail',
    'American Curl',
    'American Shorthair',
    'American Wirehair',
    'Balinese',
    'Bengal',
    'Birman',
    'Bombay',
    'British Shorthair',
    'Burmese',
    'Chartreux',
    'Cornish Rex',
    'Devon Rex',
    'Egyptian Mau',
    'Exotic Shorthair',
    'Havana Brown',
    'Himalayan',
    'Japanese Bobtail',
    'Maine Coon',
    'Manx',
    'Norwegian Forest',
    'Ocicat',
    'Persian',
    'Ragdoll',
    'Russian Blue',
    'Scottish Fold',
    'Siamese',
    'Siberian',
    'Sphynx'
  ];
  
  class CAT {
    getInfo() {
      return {
        id: 'ginxilovecats',
        name: 'CATS',
        color1: '#7868B5',
        color2: '#564B7F',
        color3: '#3C3456',
        blocks: [
          {
            opcode: 'randomcatfact',
            blockType: Scratch.BlockType.REPORTER,
            text: 'random cat fact from [FORMAT]',
            disableMonitor: true,
            arguments: {
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'FORMAT_MENU'
              }
            }
          },
          {
            opcode: 'catscool',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'are cats cool?',
            disableMonitor: true,
          },
          {
            opcode: 'catinfo',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get info of breed [BREED]',
            disableMonitor: true,
            arguments: {
              BREED: {
                type: Scratch.ArgumentType.STRING,
                menu: 'BREED_MENU'
              }
            }
          }
        ],
        menus: {
          FORMAT_MENU: {
            acceptReporters: true,
            items: ['source 1 (meowfacts)', 'source 2 (catfact.ninja)', 'source 3 (local. faster, but may be inaccurate!)']
          },
          BREED_MENU: {
            acceptReporters: true,
            items: catBreeds
          }
        }
      };
    }
  
    randomcatfact(args) {
      if (args.FORMAT == "source 1 (meowfacts)") {
        return fetch("https://meowfacts.herokuapp.com/")
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Network response was not OK.');
            }
          })
          .then((data) => {
            return String(data.data);
          })
          .catch((error) => {
            console.error(error);
            return 'Uh oh! Something went wrong.';
          });
        } else if (args.FORMAT == "source 2 (catfact.ninja)") {
        return fetch("https://catfact.ninja/fact")
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Network response was not OK.');
            }
          })
          .then((data) => {
            return String(data.fact);
          })
          .catch((error) => {
            console.error(error);
            return 'Uh oh! Something went wrong.';
          });
      } else if (args.FORMAT == 'source 3 (local. faster, but may be inaccurate!)') {
        return catFacts[Math.floor(Math.random() * catFacts.length)]
      }
    }
    catscool() {
      return true
    }
    catinfo(args) {
      if (!catBreeds.includes(args.BREED)) {
        // `args.BREED` is not any of the cat breeds in the `catBreeds` array
        return "I won't let you exploit this."
      }
    
      var breedsWithoutCat = [
        "American Bobtail",
        "American Curl",
        "American Shorthair",
        "American Curlhair",
        "American Wirehair",
        "Birman",
        "British Shorthair",
        "Chartreux",
        "Cornish Rex",
        "Devon Rex",
        "Egyptian Mau",
        "Exotic Shorthair",
        "Havana Brown",
        "Japanese Bobtail",
        "Maine Coon",
        "Norwegian Forest",
        "Ocicat",
        "Oriental",
        "Ragdoll",
        "Russian Blue",
        "Scottish Fold"
      ];
    
      var breed = args.BREED
      var includeCat = breedsWithoutCat.includes(breed);
    
      if (!includeCat) {
        breed += " cat";
      }
    
      return fetch("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&titles=" + encodeURIComponent(breed) + "&explaintext=1&exsectionformat=plain&format=json&origin=*")
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Network response was not OK.');
          }
        })
        .then((data) => {
          // Extract the relevant information from the data object
          const pageId = Object.keys(data.query.pages)[0];
          let extract = data.query.pages[pageId].extract;
          extract = extract.replace(/\s{2,}/g, ' ');
          return extract.split('.').slice(0, 2).join('.') + '. (https://en.wikipedia.org/wiki/' + breed.replace(/\s/g, '_') + ")";
        })
        .catch((error) => {
          console.error(error);
          return 'Uh oh! Something went wrong.';
        });
      
    }
  }
  Scratch.extensions.register(new CAT());
})(Scratch);