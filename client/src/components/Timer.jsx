import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({timeLeft, totalTime}) => {
    const percentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
    const urgent = timeLeft <= 10;
    const ring = urgent ? "#F87171" : "#E8A94C";
  return (
    <div className='w-20 h-20'>
            <CircularProgressbar
            value={percentage}
            text={`${timeLeft}s`}
            styles={buildStyles({
                textSize: "26px",
                pathColor: ring,
                textColor : urgent ? "#F87171" : "#1C1F24",
                textFontFamily: "JetBrains Mono, monospace",
                trailColor : "rgba(139,146,160,0.25)",
                pathTransitionDuration: 0.4,
                strokeLinecap: "round",
            })}
            />
    </div>
  )
}

export default Timer
