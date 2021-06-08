// @flow

import React from "react";

//import "jquery";
import type { T_Highlight } from "react-pdf-highlighter/src/types";
type T_ManuscriptHighlight = T_Highlight;
//import "./lib/bootstrap/js/bootstrap.min.js"
//import "./lib/bootstrap/css/bootstrap.min.css"

const jQuery = require('jquery');
window.jQuery = jQuery;
require("popper.js");
require("bootstrap");
import "./lib/bootstrap/css/bootstrap.min.css"
import ('bootstrap-select/dist/css/bootstrap-select.min.css');
import "./style/custom.css"
require('bootstrap-select');

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  relationships: Array<String>,
  resetHighlights: () => void,
  removeHighlight: () => void,
  addRelationship: () => void
};



const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({ highlights, relationships, resetHighlights, removeHighlight, addRelationship }: Props) {
  return (
    <div className="sidebar" style={{ width: "35vw" }}>

      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" id="annotation-tab" data-toggle="tab" href="#annotation" role="tab" aria-controls="annotation" aria-selected="true">Annotations</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="relationship-tab" data-toggle="tab" href="#rel" role="tab" aria-controls="relationship" aria-selected="false">Relationships</a>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="annotation" role="tabpanel" aria-labelledby="annotation-tab">


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
                <div style={{ padding: "1rem" }}>
                  <button style={{margin:"10px"}} onClick={(e) => removeHighlight(highlight.id)}><i class="gg-trash"></i></button>
                  <button onClick={(e) => editHighlight(highlight.id)}><i class="gg-pen"></i></button>
                </div>
                  <strong>{highlight.comment.text}</strong>

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

                {highlight.comment.relationship ? (
                  <a className="button4">{highlight.comment.relationship}</a>
                ) : null}


              </li>
            ))}
          </ul>
          {highlights.length > 0 ? (
            <div style={{ padding: "1rem" }}>
              <button onClick={resetHighlights}>Reset Annotations</button>
            </div>
          ) : null}

        </div>
        <div className="tab-pane fade" id="rel" role="tabpanel" aria-labelledby="relationship-tab">
        <button type="button" class="btn btn-link" data-toggle="modal" data-target="#addrelModal">
          Add Relationship
        </button>
        <ul className="sidebar__relationships">

          {relationships.map((relation, index) => (

                <li>
                <strong>{relation.type}</strong>
                {relation.head ? (

                  <blockquote style={{ marginTop: "0.5rem" }}>
                    {`${highlights.filter(function(highlight){return relation.head == highlight.id})[0].content.text}`}
                  </blockquote>
                ) : null}
                {relation.nodes.map((rel, i) => (
                  <blockquote style={{ marginTop: "0.5rem" }}>
                    {`${highlights.filter(function(highlight){return rel == highlight.id})[0].content.text}`}
                  </blockquote>
                  ))}
                </li>

          ))}
        </ul>


        <div class="modal fade" id="addrelModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="ModalLabel">Add Relationship</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <label>Select Type:</label>

                <select name="typesel" id="typesel">
                  <option value="type1">type1</option>
                  <option value="type2">type2</option>
                  <option value="type3">type3</option>
                  <option value="type4">type4</option>
                </select>
                <div class="separator"></div>
                <label>Select Head Node:</label>
                <br/>
                <select id="headsel">
                  {highlights.map((highlight, index) => (


                        <option value={highlight.id}>{highlight.id}  {highlight.content.text}</option>


                  ))}
                </select>

                <div class="separator"></div>
                <label>Select Nodes:</label>
                <br/>
                <select id="sel" name="sel" multiple>
                  {highlights.map((highlight, index) => (


                        <option value={highlight.id}>{highlight.id}  {highlight.content.text}</option>


                  ))}
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => addRelationship(jQuery('#typesel').val(), jQuery('#headsel').val(), jQuery('#sel').val())}>Add</button>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>

    </div>
  );
}

export default Sidebar;
