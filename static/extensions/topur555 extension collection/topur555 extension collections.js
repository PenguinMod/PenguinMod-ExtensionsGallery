(function (Scratch) {
    'use strict';

    const icon = 'data:image/svg+xml;base64,' + btoa(`
       
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#842BFA"/>
      <stop offset="1" stop-color="#24128F"/>
    </linearGradient>
    <linearGradient id="cyan" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#63FFFF"/>
      <stop offset="1" stop-color="#25A9FF"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="27" fill="url(#bg)"/>
  <g fill="none" stroke="#B77AFF" stroke-width="3" opacity=".8">
    <circle cx="64" cy="59" r="39"/>
    <ellipse cx="64" cy="59" rx="17" ry="39"/>
    <path d="M26 59H102M34 39H94M34 79H94"/>
  </g>
  <ellipse cx="64" cy="62" rx="53" ry="14"
    fill="none" stroke="url(#cyan)" stroke-width="5"
    transform="rotate(-25 64 62)"/>
  <path d="M28 27H100V43H75L68 78H49L57 43H28Z"
    fill="#24128F"/>
  <path d="M32 25H96V38H72L65 73H48L55 38H32Z"
    fill="#FFFFFF"/>
  <text x="64" y="101" text-anchor="middle"
    font-family="Arial,sans-serif" font-size="29"
    font-weight="900" font-style="italic"
    fill="#201078" stroke="#201078" stroke-width="5"
    paint-order="stroke">555</text>
  <text x="64" y="101" text-anchor="middle"
    font-family="Arial,sans-serif" font-size="29"
    font-weight="900" font-style="italic"
    fill="url(#cyan)">555</text>
  <path d="M103 17L106 24L113 27L106 30L103 37L100 30L93 27L100 24Z"
    fill="#63FFFF"/>
</svg>
    `);

    class Topur555 {
        getInfo() {
            return {
                id: 'topur555',
                name: 'Topur_555 extension collection',
                menuIconURI: icon,
                blockIconURI: icon,
                color1: '#6C5CE7',
                color2: '#5645C0',
                color3: '#403399',
                blocks: [
                    {
                        opcode: 'openWebsite',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'open Topur_555 website'
                    }
                ]
            };
        }

        openWebsite() {
            window.open(
                'https://topur555.edgeone.dev/',
                '_blank'
            );
        }
    }

    Scratch.extensions.register(new Topur555());

    // Thử mở trang khi extension được tải.
    window.open('https://topur555.edgeone.dev/', '_blank');

})(Scratch);