import React from "react";

interface AnimatedLabelPropType {
  content: string
};

function AnimatedLabel({ content }: AnimatedLabelPropType) {
  const characters: string[] = content.split("");

  return (
    <label>
      {characters.map((letter, idx) => (
        <span
          key={idx}
          className="animated-letter"
          style={{ transitionDelay: `${idx * 50}ms` }}
        >
          {letter}
        </span>
      ))}
    </label>
  )
}

export default AnimatedLabel;