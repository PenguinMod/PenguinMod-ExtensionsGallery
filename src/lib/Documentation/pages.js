// duplicate the import line and change the variable name
// then use the path to the md file and then add ?raw
// ex:
//      "./test.md?raw"
//      "./particle-tools.md?raw"
import PageParticleTools from "./particle-tools.md?raw";

// Extra Control (unlisted)
import PageExtraControl from "./Extra-Control.md?raw";
// Free Servers
import PageFreeServers from "./FreeServers.md?raw";

// TurboWeather
import PageTurboWeather from "./TurboWeather.md?raw";

import PageMoreTypes from "./More-Types.md?raw";

// Boxed Physics
import BoxedPhysics from "./BoxedPhysics.md?raw";

export default {
    // the key is the path to the docs page
    // so you can do "sharkpool-particle-tools" for example
    // you cant use / like "sharkpool/particle-tools" yet
    "particle-tools": PageParticleTools,
    "Extra-Control": PageExtraControl,

    // FreeServers
    "FreeServers": PageFreeServers,

    //TurboWeather
    "TurboWeather": PageTurboWeather,

    "more-types": PageMoreTypes,

    // Boxed Physics
    "BoxedPhysics": BoxedPhysics,
};
