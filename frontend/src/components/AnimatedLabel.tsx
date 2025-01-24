import React from "react";

interface Text {
  content: string
};

function AnimatedLabel(text: Text) {
  const characters: string[] = text.content.split("");

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