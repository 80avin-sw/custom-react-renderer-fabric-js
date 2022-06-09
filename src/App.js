import React, { useEffect, useState } from 'react'
import { FabricCanvas } from './renderers/canvas'
import './App.css'
import m from 'musical.js'
import { Musical } from './renderers/musical'

function App() {
  const [color, setColor] = useState('#25b1a7')
  const [show, setShow] = useState(true)
  useEffect(() => {
    const inst = new m.Instrument('piano')
    inst.play({tempo:200},
      "AGFG|AAA2|GGG2|AAA2|AGFG|AAAA|GGAG|F4|z4", () => {
        console.log('done')
      })
    return () => {
      inst.silence()
    }
  }, [show])
  return (
    <div className="App">
      <button onClick={() => setShow(!show)}>toogle</button>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />

      <FabricCanvas>
        <rect  angle={-10} left={40} top={40} height={20} width={100} fill="yellow" />
          {show &&  <rect left={80} top={80} height={20} width={100} fill={color} />}
          <circle onMouseOver={()=> setColor("green")} radius={30} left={130} top={50} fill="brown" />
      </FabricCanvas>
      <Musical >
        <timbre wave="piano"/>
        <lyrics text="AGFG|AAA2|GGG2|AAA2|AGFG|AAAA|GGAG|F4|z4" /> 
      </Musical>
    </div>
  )
}

export default App
