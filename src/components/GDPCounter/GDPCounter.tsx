import { useState } from 'react'
import './GDPCounter.scss'
import screw from '../../assets/screw.svg'

function splitIntoGroupsOfThree(value: number): string[] {
  const n = Math.floor(Math.abs(Number.isFinite(value) ? value : 0))
  let s = n.toString()
  if (s.length > 9) {
    s = '999999999'
  } else {
    s = s.padStart(9, '0')
  }
  const groups: string[] = []
  for (let i = 0; i < s.length; i += 3) {
    groups.push(s.slice(i, i + 3))
  }
  return groups
}

function DigitTile({ char }: { char: string }) {
  return (
    <div className="gdp-counter__digit-tile">
      <span className="gdp-counter__digit-char">{char}</span>
    </div>
  )
}

function GDPCounter() {
  const [value] = useState(274562359)

  const groups = splitIntoGroupsOfThree(value)

  return (
    <div className="gdp-counter">
      <div className="gdp-counter__label">
        LIVE GDP <span className="loss">LOSS</span>
      </div>
      <img src={screw} alt="screw" className="gdp-counter__screw gdp-counter__screw--left" />
      <img src={screw} alt="screw" className="gdp-counter__screw gdp-counter__screw--right" />

      <div className="gdp-counter__digits-wrap">
        <div className="gdp-counter__digit-group">
          <DigitTile char="£" />
        </div>

        {groups.map((chunk, gi) => (
          <div key={`g-${gi}`} className="gdp-counter__digit-group-wrap">
            {gi > 0 ? <div className="gdp-counter__dot" aria-hidden /> : null}
            <div className="gdp-counter__digit-group">
              {chunk.split('').map((c, i) => (
                <DigitTile key={`g${gi}-${i}`} char={c} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GDPCounter
