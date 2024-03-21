// name: Text To Speech: Redone
// credit: PuzzlingGGG
// description: Generate better TTS! Made using TTS Tool API!

class TextToSpeechRedone {
  constructor() {
    this.audioUrl = null;
    this.voices = [{"text":"Amazon Australian English (Nicole)","value":"{\"voiceName\": \"Amazon Australian English (Nicole)\", \"lang\": \"en-AU\"}"},{"text":"Amazon Australian English (Russell)","value":"{\"voiceName\": \"Amazon Australian English (Russell)\", \"lang\": \"en-AU\"}"},{"text":"Amazon Brazilian Portuguese (Ricardo)","value":"{\"voiceName\": \"Amazon Brazilian Portuguese (Ricardo)\", \"lang\": \"pt-BR\"}"},{"text":"Amazon Brazilian Portuguese (Vitoria)","value":"{\"voiceName\": \"Amazon Brazilian Portuguese (Vitoria)\", \"lang\": \"pt-BR\"}"},{"text":"Amazon British English (Amy)","value":"{\"voiceName\": \"Amazon British English (Amy)\", \"lang\": \"en-GB\"}"},{"text":"Amazon British English (Brian)","value":"{\"voiceName\": \"Amazon British English (Brian)\", \"lang\": \"en-GB\"}"},{"text":"Amazon British English (Emma)","value":"{\"voiceName\": \"Amazon British English (Emma)\", \"lang\": \"en-GB\"}"},{"text":"Amazon Canadian French (Chantal)","value":"{\"voiceName\": \"Amazon Canadian French (Chantal)\", \"lang\": \"fr-CA\"}"},{"text":"Amazon Castilian Spanish (Conchita)","value":"{\"voiceName\": \"Amazon Castilian Spanish (Conchita)\", \"lang\": \"es-ES\"}"},{"text":"Amazon Castilian Spanish (Enrique)","value":"{\"voiceName\": \"Amazon Castilian Spanish (Enrique)\", \"lang\": \"es-ES\"}"},{"text":"Amazon Danish (Mads)","value":"{\"voiceName\": \"Amazon Danish (Mads)\", \"lang\": \"da-DK\"}"},{"text":"Amazon Danish (Naja)","value":"{\"voiceName\": \"Amazon Danish (Naja)\", \"lang\": \"da-DK\"}"},{"text":"Amazon Dutch (Lotte)","value":"{\"voiceName\": \"Amazon Dutch (Lotte)\", \"lang\": \"nl-NL\"}"},{"text":"Amazon Dutch (Ruben)","value":"{\"voiceName\": \"Amazon Dutch (Ruben)\", \"lang\": \"nl-NL\"}"},{"text":"Amazon French (Celine)","value":"{\"voiceName\": \"Amazon French (Celine)\", \"lang\": \"fr-FR\"}"},{"text":"Amazon French (Mathieu)","value":"{\"voiceName\": \"Amazon French (Mathieu)\", \"lang\": \"fr-FR\"}"},{"text":"Amazon German (Hans)","value":"{\"voiceName\": \"Amazon German (Hans)\", \"lang\": \"de-DE\"}"},{"text":"Amazon German (Marlene)","value":"{\"voiceName\": \"Amazon German (Marlene)\", \"lang\": \"de-DE\"}"},{"text":"Amazon Icelandic (Dora)","value":"{\"voiceName\": \"Amazon Icelandic (Dora)\", \"lang\": \"is-IS\"}"},{"text":"Amazon Icelandic (Karl)","value":"{\"voiceName\": \"Amazon Icelandic (Karl)\", \"lang\": \"is-IS\"}"},{"text":"Amazon Indian English (Raveena)","value":"{\"voiceName\": \"Amazon Indian English (Raveena)\", \"lang\": \"en-IN\"}"},{"text":"Amazon Italian (Carla)","value":"{\"voiceName\": \"Amazon Italian (Carla)\", \"lang\": \"it-IT\"}"},{"text":"Amazon Italian (Giorgio)","value":"{\"voiceName\": \"Amazon Italian (Giorgio)\", \"lang\": \"it-IT\"}"},{"text":"Amazon Norwegian (Liv)","value":"{\"voiceName\": \"Amazon Norwegian (Liv)\", \"lang\": \"nb-NO\"}"},{"text":"Amazon Polish (Ewa)","value":"{\"voiceName\": \"Amazon Polish (Ewa)\", \"lang\": \"pl-PL\"}"},{"text":"Amazon Polish (Jacek)","value":"{\"voiceName\": \"Amazon Polish (Jacek)\", \"lang\": \"pl-PL\"}"},{"text":"Amazon Polish (Jan)","value":"{\"voiceName\": \"Amazon Polish (Jan)\", \"lang\": \"pl-PL\"}"},{"text":"Amazon Polish (Maja)","value":"{\"voiceName\": \"Amazon Polish (Maja)\", \"lang\": \"pl-PL\"}"},{"text":"Amazon Portuguese (Cristiano)","value":"{\"voiceName\": \"Amazon Portuguese (Cristiano)\", \"lang\": \"pt-PT\"}"},{"text":"Amazon Portuguese (Ines)","value":"{\"voiceName\": \"Amazon Portuguese (Ines)\", \"lang\": \"pt-PT\"}"},{"text":"Amazon Romanian (Carmen)","value":"{\"voiceName\": \"Amazon Romanian (Carmen)\", \"lang\": \"ro-RO\"}"},{"text":"Amazon Russian (Maxim)","value":"{\"voiceName\": \"Amazon Russian (Maxim)\", \"lang\": \"ru-RU\"}"},{"text":"Amazon Russian (Tatyana)","value":"{\"voiceName\": \"Amazon Russian (Tatyana)\", \"lang\": \"ru-RU\"}"},{"text":"Amazon Swedish (Astrid)","value":"{\"voiceName\": \"Amazon Swedish (Astrid)\", \"lang\": \"sv-SE\"}"},{"text":"Amazon Turkish (Filiz)","value":"{\"voiceName\": \"Amazon Turkish (Filiz)\", \"lang\": \"tr-TR\"}"},{"text":"Amazon US English (Ivy)","value":"{\"voiceName\": \"Amazon US English (Ivy)\", \"lang\": \"en-US\"}"},{"text":"Amazon US English (Joey)","value":"{\"voiceName\": \"Amazon US English (Joey)\", \"lang\": \"en-US\"}"},{"text":"Amazon US English (Justin)","value":"{\"voiceName\": \"Amazon US English (Justin)\", \"lang\": \"en-US\"}"},{"text":"Amazon US English (Kendra)","value":"{\"voiceName\": \"Amazon US English (Kendra)\", \"lang\": \"en-US\"}"},{"text":"Amazon US English (Kimberly)","value":"{\"voiceName\": \"Amazon US English (Kimberly)\", \"lang\": \"en-US\"}"},{"text":"Amazon US English (Salli)","value":"{\"voiceName\": \"Amazon US English (Salli)\", \"lang\": \"en-US\"}"},{"text":"Amazon US Spanish (Miguel)","value":"{\"voiceName\": \"Amazon US Spanish (Miguel)\", \"lang\": \"es-US\"}"},{"text":"Amazon US Spanish (Penelope)","value":"{\"voiceName\": \"Amazon US Spanish (Penelope)\", \"lang\": \"es-US\"}"},{"text":"Amazon Welsh (Gwyneth)","value":"{\"voiceName\": \"Amazon Welsh (Gwyneth)\", \"lang\": \"cy-GB\"}"},{"text":"Amazon Welsh (Geraint)","value":"{\"voiceName\": \"Amazon Welsh (Geraint)\", \"lang\": \"cy-GB\"}"},{"text":"Microsoft Australian English (Catherine)","value":"{\"voiceName\": \"Microsoft Australian English (Catherine)\", \"lang\": \"en-AU\"}"},{"text":"Microsoft Australian English (James)","value":"{\"voiceName\": \"Microsoft Australian English (James)\", \"lang\": \"en-AU\"}"},{"text":"Microsoft Austrian German (Michael)","value":"{\"voiceName\": \"Microsoft Austrian German (Michael)\", \"lang\": \"de-AT\"}"},{"text":"Microsoft Belgian Dutch (Bart)","value":"{\"voiceName\": \"Microsoft Belgian Dutch (Bart)\", \"lang\": \"nl-BE\"}"},{"text":"Microsoft Brazilian Portuguese (Daniel)","value":"{\"voiceName\": \"Microsoft Brazilian Portuguese (Daniel)\", \"lang\": \"pt-BR\"}"},{"text":"Microsoft Brazilian Portuguese (Maria)","value":"{\"voiceName\": \"Microsoft Brazilian Portuguese (Maria)\", \"lang\": \"pt-BR\"}"},{"text":"Microsoft British English (George)","value":"{\"voiceName\": \"Microsoft British English (George)\", \"lang\": \"en-GB\"}"},{"text":"Microsoft British English (Hazel)","value":"{\"voiceName\": \"Microsoft British English (Hazel)\", \"lang\": \"en-GB\"}"},{"text":"Microsoft British English (Susan)","value":"{\"voiceName\": \"Microsoft British English (Susan)\", \"lang\": \"en-GB\"}"},{"text":"Microsoft Bulgarian (Ivan)","value":"{\"voiceName\": \"Microsoft Bulgarian (Ivan)\", \"lang\": \"bg-BG\"}"},{"text":"Microsoft Canadian English (Linda)","value":"{\"voiceName\": \"Microsoft Canadian English (Linda)\", \"lang\": \"en-CA\"}"},{"text":"Microsoft Canadian English (Richard)","value":"{\"voiceName\": \"Microsoft Canadian English (Richard)\", \"lang\": \"en-CA\"}"},{"text":"Microsoft Canadian French (Caroline)","value":"{\"voiceName\": \"Microsoft Canadian French (Caroline)\", \"lang\": \"fr-CA\"}"},{"text":"Microsoft Canadian French (Claude)","value":"{\"voiceName\": \"Microsoft Canadian French (Claude)\", \"lang\": \"fr-CA\"}"},{"text":"Microsoft Canadian French (Nathalie)","value":"{\"voiceName\": \"Microsoft Canadian French (Nathalie)\", \"lang\": \"fr-CA\"}"},{"text":"Microsoft Catalan (Herena)","value":"{\"voiceName\": \"Microsoft Catalan (Herena)\", \"lang\": \"ca-ES\"}"},{"text":"Microsoft Chinese (Huihui)","value":"{\"voiceName\": \"Microsoft Chinese (Huihui)\", \"lang\": \"zh-CN\"}"},{"text":"Microsoft Chinese (Kangkang)","value":"{\"voiceName\": \"Microsoft Chinese (Kangkang)\", \"lang\": \"zh-CN\"}"},{"text":"Microsoft Chinese (Yaoyao)","value":"{\"voiceName\": \"Microsoft Chinese (Yaoyao)\", \"lang\": \"zh-CN\"}"},{"text":"Microsoft ChineseHK (Danny)","value":"{\"voiceName\": \"Microsoft ChineseHK (Danny)\", \"lang\": \"zh-HK\"}"},{"text":"Microsoft ChineseHK (Tracy)","value":"{\"voiceName\": \"Microsoft ChineseHK (Tracy)\", \"lang\": \"zh-HK\"}"},{"text":"Microsoft Croatian (Matej)","value":"{\"voiceName\": \"Microsoft Croatian (Matej)\", \"lang\": \"hr-HR\"}"},{"text":"Microsoft Czech (Jakub)","value":"{\"voiceName\": \"Microsoft Czech (Jakub)\", \"lang\": \"cs-CZ\"}"},{"text":"Microsoft Danish (Helle)","value":"{\"voiceName\": \"Microsoft Danish (Helle)\", \"lang\": \"da-DK\"}"},{"text":"Microsoft Dutch (Frank)","value":"{\"voiceName\": \"Microsoft Dutch (Frank)\", \"lang\": \"nl-NL\"}"},{"text":"Microsoft Egyptian Arabic (Hoda)","value":"{\"voiceName\": \"Microsoft Egyptian Arabic (Hoda)\", \"lang\": \"ar-EG\"}"},{"text":"Microsoft Finnish (Heidi)","value":"{\"voiceName\": \"Microsoft Finnish (Heidi)\", \"lang\": \"fi-FI\"}"},{"text":"Microsoft French (Hortense)","value":"{\"voiceName\": \"Microsoft French (Hortense)\", \"lang\": \"fr-FR\"}"},{"text":"Microsoft French (Julie)","value":"{\"voiceName\": \"Microsoft French (Julie)\", \"lang\": \"fr-FR\"}"},{"text":"Microsoft French (Paul)","value":"{\"voiceName\": \"Microsoft French (Paul)\", \"lang\": \"fr-FR\"}"},{"text":"Microsoft German (Hedda)","value":"{\"voiceName\": \"Microsoft German (Hedda)\", \"lang\": \"de-DE\"}"},{"text":"Microsoft German (Katja)","value":"{\"voiceName\": \"Microsoft German (Katja)\", \"lang\": \"de-DE\"}"},{"text":"Microsoft German (Stefan)","value":"{\"voiceName\": \"Microsoft German (Stefan)\", \"lang\": \"de-DE\"}"},{"text":"Microsoft Greek (Stefanos)","value":"{\"voiceName\": \"Microsoft Greek (Stefanos)\", \"lang\": \"el-GR\"}"},{"text":"Microsoft Hebrew (Asaf)","value":"{\"voiceName\": \"Microsoft Hebrew (Asaf)\", \"lang\": \"he-IL\"}"},{"text":"Microsoft Hindi (Hemant)","value":"{\"voiceName\": \"Microsoft Hindi (Hemant)\", \"lang\": \"hi-IN\"}"},{"text":"Microsoft Hindi (Kalpana)","value":"{\"voiceName\": \"Microsoft Hindi (Kalpana)\", \"lang\": \"hi-IN\"}"},{"text":"Microsoft Hungarian (Szabolcs)","value":"{\"voiceName\": \"Microsoft Hungarian (Szabolcs)\", \"lang\": \"hu-HU\"}"},{"text":"Microsoft Indian English (Heera)","value":"{\"voiceName\": \"Microsoft Indian English (Heera)\", \"lang\": \"en-IN\"}"},{"text":"Microsoft Indian English (Ravi)","value":"{\"voiceName\": \"Microsoft Indian English (Ravi)\", \"lang\": \"en-IN\"}"},{"text":"Microsoft Indonesian (Andika)","value":"{\"voiceName\": \"Microsoft Indonesian (Andika)\", \"lang\": \"id-ID\"}"},{"text":"Microsoft Irish English (Sean)","value":"{\"voiceName\": \"Microsoft Irish English (Sean)\", \"lang\": \"en-IE\"}"},{"text":"Microsoft Italian (Cosimo)","value":"{\"voiceName\": \"Microsoft Italian (Cosimo)\", \"lang\": \"it-IT\"}"},{"text":"Microsoft Italian (Elsa)","value":"{\"voiceName\": \"Microsoft Italian (Elsa)\", \"lang\": \"it-IT\"}"},{"text":"Microsoft Japanese (Ayumi)","value":"{\"voiceName\": \"Microsoft Japanese (Ayumi)\", \"lang\": \"ja-JP\"}"},{"text":"Microsoft Japanese (Haruka)","value":"{\"voiceName\": \"Microsoft Japanese (Haruka)\", \"lang\": \"ja-JP\"}"},{"text":"Microsoft Japanese (Ichiro)","value":"{\"voiceName\": \"Microsoft Japanese (Ichiro)\", \"lang\": \"ja-JP\"}"},{"text":"Microsoft Japanese (Sayaka)","value":"{\"voiceName\": \"Microsoft Japanese (Sayaka)\", \"lang\": \"ja-JP\"}"},{"text":"Microsoft Korean (Heami)","value":"{\"voiceName\": \"Microsoft Korean (Heami)\", \"lang\": \"ko-KR\"}"},{"text":"Microsoft Malay (Rizwan)","value":"{\"voiceName\": \"Microsoft Malay (Rizwan)\", \"lang\": \"ms-MY\"}"},{"text":"Microsoft Mexican Spanish (Raul)","value":"{\"voiceName\": \"Microsoft Mexican Spanish (Raul)\", \"lang\": \"es-MX\"}"},{"text":"Microsoft Mexican Spanish (Sabina)","value":"{\"voiceName\": \"Microsoft Mexican Spanish (Sabina)\", \"lang\": \"es-MX\"}"},{"text":"Microsoft Norwegian (Jon)","value":"{\"voiceName\": \"Microsoft Norwegian (Jon)\", \"lang\": \"nb-NO\"}"},{"text":"Microsoft Polish (Adam)","value":"{\"voiceName\": \"Microsoft Polish (Adam)\", \"lang\": \"pl-PL\"}"},{"text":"Microsoft Polish (Paulina)","value":"{\"voiceName\": \"Microsoft Polish (Paulina)\", \"lang\": \"pl-PL\"}"},{"text":"Microsoft Portuguese (Helia)","value":"{\"voiceName\": \"Microsoft Portuguese (Helia)\", \"lang\": \"pt-PT\"}"},{"text":"Microsoft Romanian (Andrei)","value":"{\"voiceName\": \"Microsoft Romanian (Andrei)\", \"lang\": \"ro-RO\"}"},{"text":"Microsoft Russian (Irina)","value":"{\"voiceName\": \"Microsoft Russian (Irina)\", \"lang\": \"ru-RU\"}"},{"text":"Microsoft Russian (Pavel)","value":"{\"voiceName\": \"Microsoft Russian (Pavel)\", \"lang\": \"ru-RU\"}"},{"text":"Microsoft Saudi Arabic (Naayf)","value":"{\"voiceName\": \"Microsoft Saudi Arabic (Naayf)\", \"lang\": \"ar-SA\"}"},{"text":"Microsoft Slovak (Filip)","value":"{\"voiceName\": \"Microsoft Slovak (Filip)\", \"lang\": \"sk-SK\"}"},{"text":"Microsoft Slovenian (Lado)","value":"{\"voiceName\": \"Microsoft Slovenian (Lado)\", \"lang\": \"sl-SI\"}"},{"text":"Microsoft Spanish (Helena)","value":"{\"voiceName\": \"Microsoft Spanish (Helena)\", \"lang\": \"es-ES\"}"},{"text":"Microsoft Spanish (Laura)","value":"{\"voiceName\": \"Microsoft Spanish (Laura)\", \"lang\": \"es-ES\"}"},{"text":"Microsoft Spanish (Pablo)","value":"{\"voiceName\": \"Microsoft Spanish (Pablo)\", \"lang\": \"es-ES\"}"},{"text":"Microsoft Swedish (Bengt)","value":"{\"voiceName\": \"Microsoft Swedish (Bengt)\", \"lang\": \"sv-SE\"}"},{"text":"Microsoft Swiss French (Guillaume)","value":"{\"voiceName\": \"Microsoft Swiss French (Guillaume)\", \"lang\": \"fr-CH\"}"},{"text":"Microsoft Swiss German (Karsten)","value":"{\"voiceName\": \"Microsoft Swiss German (Karsten)\", \"lang\": \"de-CH\"}"},{"text":"Microsoft Tamil (Valluvar)","value":"{\"voiceName\": \"Microsoft Tamil (Valluvar)\", \"lang\": \"ta-IN\"}"},{"text":"Microsoft Thai (Pattara)","value":"{\"voiceName\": \"Microsoft Thai (Pattara)\", \"lang\": \"th-TH\"}"},{"text":"Microsoft Turkish (Tolga)","value":"{\"voiceName\": \"Microsoft Turkish (Tolga)\", \"lang\": \"tr-TR\"}"},{"text":"Microsoft US English (David)","value":"{\"voiceName\": \"Microsoft US English (David)\", \"lang\": \"en-US\"}"},{"text":"Microsoft US English (Mark)","value":"{\"voiceName\": \"Microsoft US English (Mark)\", \"lang\": \"en-US\"}"},{"text":"Microsoft US English (Zira)","value":"{\"voiceName\": \"Microsoft US English (Zira)\", \"lang\": \"en-US\"}"},{"text":"Microsoft Vietnamese (An)","value":"{\"voiceName\": \"Microsoft Vietnamese (An)\", \"lang\": \"vi-VI\"}"}]; //yes i know manually inputting shit like this is bad buuut i dont care becasue trying to request fucked everything :troll_hands: (trust me this used to be a lot bigger)
  }

  getInfo() {
    return {
      id: 'textToSpeechRedone',
      name: 'Text To Speech: Redone',
      blocks: [
        {
          blockType: Scratch.BlockType.LABEL,
          text: 'this whole thing is powered by TTS Tool, big thanks to them for making this whole thing possible!!! :good:',
        },
        {
          opcode: 'generateTTS',
          blockType: Scratch.BlockType.COMMAND,
          text: 'generate TTS with text [TEXT] voice [VOICE] volume [VOLUME] rate [RATE] pitch [PITCH]',
          arguments: {
            TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: "Joe"},
            VOICE: {type: Scratch.ArgumentType.STRING, menu: "voicesMenu", defaultValue: "Amazon US English (Joey)"},
            VOLUME: {type: Scratch.ArgumentType.STRING, menu: "volumeMenu", defaultValue: "x-loud"},
            RATE: {type: Scratch.ArgumentType.STRING, menu: "rateMenu", defaultValue: "x-slow"},
            PITCH: {type: Scratch.ArgumentType.STRING, menu: "pitchMenu", defaultValue: "medium"}
          }
        },
        {
          opcode: 'playGeneratedTTS',
          blockType: Scratch.BlockType.COMMAND,
          text: 'play generated TTS'
        },
        {
          opcode: 'isApiUp',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is API up?',
        },
        {
          opcode: 'getGeneratedTTSDataURI',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get generated TTS as data URI',
        },
      ],
      menus: {
        voicesMenu: this.voices,
        volumeMenu: ['x-soft', 'soft', 'medium', 'loud', 'x-loud'],
        rateMenu: ['x-slow', 'slow', 'medium', 'fast', 'x-fast'],
        pitchMenu: ['x-low', 'low', 'medium', 'high', 'x-high']
      }
    };
  }

  //fetchVoices() {
    //Scratch.fetch('https://support.readaloud.app/read-aloud/list-voices/premium')
    //.then(response => response.json())
    //.then(voices => {
      //this.voices = voices.map(voice => ({
        //text: voice.voiceName,
        //value: JSON.stringify({voiceName: voice.voiceName, lang: voice.lang})
      //}));
    //})
    //.catch(error => console.error('error fetching voices:', error));
  //}

  _getVoicesMenu() {
    return this.voices;
  }

  generateTTS(args) {
    let selectedVoice;
    try {
      const selectedVoice = JSON.parse(args.VOICE);
    } catch (e) { // shitty fix for default value of voice, DO NOT CHANGE THAT SHIT :skull:
      selectedVoice = {voiceName: args.VOICE, lang: "en-US"};
    }
    const data = [{
      voiceId: selectedVoice.voiceName,
      ssml: `<speak version="1.0" xml:lang="${selectedVoice.lang}"><prosody volume='${args.VOLUME}' rate='${args.RATE}' pitch='${args.PITCH}'>${args.TEXT}</prosody></speak>`
    }];

    Scratch.fetch('https://support.readaloud.app/ttstool/createParts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      const code = data[0];
      this.audioUrl = `https://support.readaloud.app/ttstool/getParts?q=${code}`;
    })
    .catch(error => console.error('error generating TTS:', error));
  }

  playGeneratedTTS() {
    if (!this.audioUrl) {
      console.log('aww man theres no tts :(');
      return;
    }
    const audio = new Audio(this.audioUrl);
    audio.play().catch(error => console.error('error playing TTS:', error));
  }

  isApiUp() {
    Scratch.fetch('https://support.readaloud.app/read-aloud/list-voices/premium')
      .then(response => {
        if(response) {
          return true;
        }
        throw new Error('Fetch not successful');
      })
      .catch(error => false);
  }

  getGeneratedTTSDataURI() {
    if (!this.audioUrl) {
      console.log("aww man theres no tts :(");
      return "";
    }

    return fetch(this.audioUrl)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }))
      .catch(error => {
        console.error('mmmmm something failed with data uri, take a look: ', error);
        return "";
      });
  }

}

Scratch.extensions.register(new TextToSpeechRedone());
