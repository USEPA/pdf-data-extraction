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
require('@eastdesire/jscolor');

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  tags: Array<String>,
  relationships: Array<String>,
  resetHighlights: () => void,
  removeHighlight: () => void,
  addRelationship: () => void
};



const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

function Sidebar({ highlights, tags, relationships, resetHighlights, removeHighlight, addRelationship, openSchema }: Props) {
  const groupedByDate = {};
highlights.forEach(message => {
  const key = message.comment.text;

  // push message to existing key or create new array containing this message
  if(groupedByDate[key]) {
    groupedByDate[key].push(message);
  } else {
    groupedByDate[key] = [message];
  }
});
var myMap = Object.values(groupedByDate)

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



          <button type="button" className="btn btn-link" data-toggle="modal" data-target="#editSchemaModal">
            Edit Schema
          </button>

<div className="accordion" id="accordionExample">

{myMap.map((highlight, index) => (
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingOne">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + index} aria-expanded="true" aria-controls="collapseOne">
        {highlight[0].comment.text}
      </button>
    </h2>

  {highlight.map(message => (
    <div id={"collapse" + index} className="accordion-collapse collapse show" aria-labelledby="headingOne"  onClick={() => {
                  updateHash(message);
                }}
>
      <div class="accordion-body">
      <div>
      <div style={{padding: "1rem"}}>
                <button onClick={(e) => confirm("Are you sure?") ? removeHighlight(message.id) : 'false'}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg></button>
                <button onClick={(e) => editHighlight(message.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg></button>
              </div>
            {message.content.text ? (
              <blockquote style={{ marginTop: "0.5rem" }}>
                {`${message.content.text.slice(0, 90).trim()}…`}
              </blockquote>
            ) : null}
            {message.content.image ? (
              <div
                className="highlight__image"
                style={{ marginTop: "0.5rem" }}
              >
                <img src={message.content.image} alt={"Screenshot"} />
              </div>
            ) : null}
            </div>
            <div className="highlight__location">
            Page {message.position.pageNumber}
          </div>

          {message.comment.relationship ? (
            <a className="button4">{message.comment.relationship}</a>
          ) : null}
      </div>
    </div>
    ))}


  </div>
))}

</div>



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


                        <option value={highlight.id}>A{index} - {highlight.content.text}</option>


                  ))}
                </select>

                <div class="separator"></div>
                <label>Select Nodes:</label>
                <br/>
                <select id="sel" name="sel" multiple>
                  {highlights.map((highlight, index) => (


                        <option value={highlight.id}>A{index} - {highlight.content.text}</option>


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

        <div class="modal fade" id="editSchemaModal" tabindex="1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="ModalLabel">Edit Schema</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <table id="tagsTable">

                  {tags.map((tag, index) => (

                        <tr id={tag.name + "modaltr" + index}>
                        <th><p name="tagname" contenteditable = "true">{tag.name}</p></th>
                        <th><input name="tagcolor" data-jscolor="{}" value={tag.color}></input></th>
                        <th><button onClick={function(){if(confirm("Remove " + tag.name + "?")){ document.getElementById(tag.name + "modaltr" + index).remove();}}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg></button></th>
                        </tr>

                  ))}
                  {jscolor.install()}
                </table>
              </div>
              <button type="button" class="btn btn-link" onClick={function(){
                var inputs, index;
                    var tagNameInputs = document.getElementsByName('tagname');
                    var tagColorInputs = document.getElementsByName('tagcolor');
                    var temp = {};
                    var tempTags = [];
                    inputs = document.getElementsByTagName('input');

                    for (index = 0; index < tagNameInputs.length; ++index) {
                        temp = {};
                        temp.id = tagNameInputs[index].textContent;
                        temp.name = tagNameInputs[index].textConent;
                        temp.color = tagColorInputs[index].value;
                        tempTags[index] = temp;
                    }

                let t = {};
                t.id = "";
                t.name = "<new>";
                t.color = "#FBFF17";
                tags.push(t);
                openSchema(tags);
                jscolor.install();

              }}>
                Add Entity Type
              </button>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={function(){var inputs, index;
                    var tagNameInputs = document.getElementsByName('tagname');
                    var tagColorInputs = document.getElementsByName('tagcolor');
                    var temp = {};
                    var tempTags = [];
                    inputs = document.getElementsByTagName('input');

                    for (index = 0; index < tagNameInputs.length; ++index) {
                        temp = {};
                        temp.id = tagNameInputs[index].textContent;
                        temp.name = tagNameInputs[index].textContent;
                        temp.color = tagColorInputs[index].value;
                        tempTags[index] = temp;
                    }
                    tags = tempTags;
                    openSchema(tempTags);
                    jscolor.install();

                  } }>Save</button>
              </div>
            </div>
          </div>
        </div>


      </div>

    </div>
  );
}

export default Sidebar;
