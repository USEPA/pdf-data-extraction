// @flow

import React from "react";

import type { T_Highlight } from "react-pdf-highlighter/src/types";
type T_ManuscriptHighlight = T_Highlight;

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  resetHighlights: () => void,
  removeHighlight: () => void
};



const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({ highlights, resetHighlights, removeHighlight }: Props) {
  return (
    <div className="sidebar" style={{ width: "25vw" }}>


      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              <div><strong>{highlight.comment.emoji}</strong></div>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
            <div style={{ padding: "1rem" }}>
              <button onClick={(e) => removeHighlight(highlight.id)}>Delete Annotation</button>
            </div>
          </li>
        ))}
      </ul>
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={resetHighlights}>Reset Annotations</button>
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;
