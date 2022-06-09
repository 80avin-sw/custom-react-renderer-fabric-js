import React, { useEffect, useState } from "react";
import { FabricCanvas } from "./renderers/canvas";
import "./App.css";
import { Musical } from "./renderers/musical";

function App() {
  return (
    <div className="App">
      <Musical>
        <timbre wave="piano" />
        <lyrics text="AGFG|AAA2|GGG2|AAA2|AGFG|AAAA|GGAG|F4|z4" />
        <delay duration={1500} />
        <lyrics text="AGFG|AAA2|GGG2|AAA2|AGFG|AAAA|GGAG|F4|z4" />
        <parallelSong>
          <seqSong>
            <delay duration={1000} />
            <timbre
              wave="sawtooth"
              gain={0.15}
              attack={0.008}
              decay={0.2}
              release={0.2}
              cutoff={0}
              cutfollow={20}
              resonance={3}
            />
            <lyrics text="AGFG|AAA2|GGG2|AAA2|AGFG|AAAA|GGAG|F4|z4" />
          </seqSong>
          <seqSong>
            <delay duration={500} />
            <timbre wave="piano"/>
            <lyrics text={`
X:2
T:8th Sonata for inst
%staves {1 2}
C:L. van Beethoven
M:C
L:1/16
Q:1/8=66
F:http://richardrobinson.tunebook.org.uk/tune/6525
K:Cm
V:1
!fp![E,4G,4C4]- [E,3/G,3/C3/]!3![G,/C/]!4![G,3/=B,3/D3/]!5![G,/C/E/] ([=A,4C4E4]!4![=B,2D2])z2|\n!fp!!3![=B,4D4F4]- [B,3/D3/F3/][B,/D/F/][B,3/D3/G3/][B,/D/A/] ([B,4D4A4]!3![C2E2G2])z2|
V:2
[C,,4E,,4G,,4C,4]- [C,,3/E,,3/G,,3/C,3/]!2!E,/!3!D,3/!4!C,/ (!2!^F,4G,2)z _A,,|\n_A,4-A,3/!2!A,/!1!G,3/=F,/ E,4-E,2z2|`} />
          </seqSong>
        </parallelSong>
      </Musical>
    </div>
  );
}

export default App;
