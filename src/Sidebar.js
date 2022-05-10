// @flow

import React, { useState } from "react";

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
import 'datatables.net'
import './lib/datatables/css/jquery.dataTables.min.css'
require('bootstrap-select');
require('@eastdesire/jscolor');

type Props = {
  highlights: Array<T_ManuscriptHighlight>,
  tags: Object,
  relationships: Array<String>,
  resetHighlights: () => void,
  removeHighlight: () => void,
  addRelationship: () => void,
  annoEdit: () => void
};

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

const updateHash = highlight => {
  document.location.hash = `highlight-${highlight.id}`;
};

function updateTable(t, text,type,userName,page, id){
  t.row.add( [
        text,
        type,
        userName,
        page,
        id
    ] ).draw( false );
}

// function updateTable2(t, text){
//   t.row.add( [
//         text
//     ] ).draw( false );
// }
// function handleDragStart(e) {
//   // this / e.target is the source node.
//
//   // Set the source row opacity
//   this.style.opacity = '0.4';
//
//   // Keep track globally of the source row and source table id
//   dragSrcRow = this;
//   srcTable = this.parentNode.parentNode.id
//
//   // Keep track globally of selected rows
//   selectedRows = jQuery('#' + srcTable).DataTable().rows( { selected: true } );
//
//   // Allow moves
//   e.dataTransfer.effectAllowed = 'move';
//
//   // Save the source row html as text
//   e.dataTransfer.setData('text/plain', e.target.outerHTML);
//
// }
//
// function handleDragOver(e) {
//   if (e.preventDefault) {
//     e.preventDefault(); // Necessary. Allows us to drop.
//   }
//
//   // Allow moves
//   e.dataTransfer.dropEffect = 'move';
//
//   return false;
// }

// function handleDragEnter(e) {
//   // this / e.target is the current hover target.
//
//   // Get current table id
//   var currentTable = this.parentNode.parentNode.id
//
//   // Don't show drop zone if in source table
//   if (currentTable !== srcTable) {
//     this.classList.add('over');
//   }
// }
//
// function handleDragLeave(e) {
//   // this / e.target is previous target element.
//
//   // Remove the drop zone when leaving element
//   this.classList.remove('over');
// }
//
// function handleDrop(e) {
//   // this / e.target is current target element.
//
//   if (e.stopPropagation) {
//     e.stopPropagation(); // stops the browser from redirecting.
//   }
//
//   // Get destination table id, row
//   var dstTable = jQuery(this.closest('table')).attr('id');
//
//   // No need to process if src and dst table are the same
//   if (srcTable !== dstTable) {
//
//     // If selected rows and dragged item is selected then move selected rows
//     if (selectedRows.count() > 0 && jQuery(dragSrcRow).hasClass('selected')) {
//       console.log('#' + dstTable);
//
//       // Add row to destination Datatable
//
//       console.log(selectedRows.data().length);
//       var multi_row = [];
//       for(var i = 0; i < selectedRows.data().length; i++){
//         row_data_json = {};
//         //get headers
//
//         console.log(selectedRows.data()[i]);
//         for (var j = 0; j < selectedRows.data()[i].length; j++){
// //           console.log($('#' + dstTable + ' thead tr th').eq(j).text());
// //           console.log(selectedRows.data()[i][j]);
//           row_data_json[$('#' + dstTable + ' thead tr th').eq(j).text()] = selectedRows.data()[i][j];
//           row_data_json.tableName = dstTable;
//         }
//         jQuery('#' + dstTable).DataTable().rows.add([row_data_json]).draw();
//         data2.push(row_data_json);
//
//       }
// //       $('#' + dstTable).DataTable().rows.add(selectedRows.data()).draw();
//
//
//       // Remove row from source Datatable
//       //$('#' + srcTable).DataTable().rows(selectedRows.indexes()).remove().draw();
//
//     } else {  // Otherwise move dragged row
//
//       // Get source transfer data
//       var srcData = e.dataTransfer.getData('text/plain');
//
//       // Add row to destination Datatable
//       row_data_json = {};
//       jQuery('#' + dstTable).DataTable().row.add(jQuery(srcData)).draw();
//
//       jQuery(srcData + ' tr').each(function() {
//         var header_index = 0;
//         jQuery(this).find("td").each(function() {
//           row_data_json[jQuery('#' + dstTable + ' thead tr th').eq(header_index).text()] = jQuery(this).text();
//           header_index += 1;
//         });
//       });
// //       $('#' + dstTable).DataTable().rows.add([row_data_json]).draw();
//       row_data_json.tableName = dstTable;
//       data2.push(row_data_json);
//
//
//
//       // Remove row from source Datatable
//       //$('#' + srcTable).DataTable().row(dragSrcRow).remove().draw();
//     }
//
//   }
//   return false;
// }
//
// function handleDragEnd(e) {
//   // this/e.target is the source node.
//
//   // Reset the opacity of the source row
//   this.style.opacity = '1.0';
//
//   // Clear 'over' class from both tables
//   // and reset opacity
//   [].forEach.call(rows, function (row) {
//     row.classList.remove('over');
//     row.style.opacity = '1.0';
//   });
//
//   [].forEach.call(rows2, function (row) {
//     row.classList.remove('over');
//     row.style.opacity = '1.0';
//   });
// }
//
// var dragSrcRow = null;  // Keep track of the source row
// var selectedRows = null;   // Keep track of selected rows in the source table
// var srcTable = '';  // Global tracking of table being dragged for 'over' class setting
// var rows = [];   // Global rows for #example
// var rows2 = [];  // Global rows for #example2
var t;

function Sidebar({ highlights, tags, relationships, resetHighlights, removeHighlight, addRelationship, openSchema, annoEdit, addRelationshipToAnno, addRelationshipType }: Props) {
  const groupedByDate = {};
    if ( jQuery.fn.dataTable.isDataTable( '#table_id' )){

    }else{
      t = jQuery('#table_id').DataTable({
          // data: data,
          paging: false,
          order: [[1, 'asc']],

          // columnDefs: [ {
          //   orderable: false,
          //   className: 'select-checkbox',
          //   targets:   0
          // } ],
          // select: {
          //   style:    'os',
          //   selector: 'td:first-child'
          // },
          //
          // // Add HTML5 draggable class to each row
          // createdRow: function ( row, data, dataIndex, cells ) {
          //   jQuery(row).attr('draggable', 'true');
          // },
          //
          // drawCallback: function () {
          //   // Add HTML5 draggable event listeners to each row
          //   rows = document.querySelectorAll('#table_id tbody tr');
          //     [].forEach.call(rows, function(row) {
          //       row.addEventListener('dragstart', handleDragStart, false);
          //       row.addEventListener('dragenter', handleDragEnter, false)
          //       row.addEventListener('dragover', handleDragOver, false);
          //       row.addEventListener('dragleave', handleDragLeave, false);
          //       row.addEventListener('drop', handleDrop, false);
          //       row.addEventListener('dragend', handleDragEnd, false);
          //     });
          // }
        });
        jQuery('#table_id tbody').on( 'click', 'tr', function () {
          if ( jQuery(this).hasClass('selected') ) {
              jQuery(this).removeClass('selected');
          }
          else {
              t.$('tr.selected').removeClass('selected');
              jQuery(this).addClass('selected');
          }
      } );

      jQuery('#button').click( function () {
        if(t.row('.selected').data()){
          removeHighlight(t.row('.selected').data()[4]);
          t.row('.selected').remove().draw( false );

        }
      } );
    }


    // var t2 = jQuery('#table_id2').DataTable();
    // var t3 = jQuery('#table_id3').DataTable();
highlights.forEach(message => {
  const key = message.comment.text;


  // push message to existing key or create new array containing this message
  if(groupedByDate[key]) {
    groupedByDate[key].push(message);
  } else {
    groupedByDate[key] = [message];
  }
});
var myMap = Object.values(groupedByDate);

jQuery('select[name=reltypesel]').change(function() {
    if (jQuery(this).val() == '')
    {
        var newType = "new";
        var newValue = jQuery('option', this).length;
        jQuery('<option>')
            .text(newType)
            .attr('value', newValue);
        jQuery(this).val(newValue);
    }
});



// Highlight Sorting Logic
myMap = myMap.sort((a, b) => (a[0].comment.text > b[0].comment.text) ? 1 : -1)
t.clear();
// t2.clear();

  return (

    <div id="split-0" className="sidebar" style={{ width: "35vw" }}>

{/*Annotation modal creation*/}
{myMap.map((highlight, index) => (
    <div>
    {highlight.map(message => (


      <div className="modal show" id={`editAnnoModal${message.id}`} tabIndex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalLabel">Edit Annotation</h5>
              <button type="button" className="close" aria-label="Close" onClick={() => jQuery(`#editAnnoModal${message.id}`).modal('hide')}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body container">
            <div className="row">
            {message.content.text ? (

              <blockquote style={{ padding: "1rem", float: "left" }}>
                {`${message.content.text}`}
              </blockquote>

            ) : null}
            </div>
            <div className="row">
            <select id={"annoEditSel" + message.id}>
              <option value="" selected="selected" hidden="hidden">{message.comment.text}</option>
              {tags.annotation_types.map((tag, tindex) => (

                    <option value={tag.name} key={tindex}>{tag.name}</option>


              ))}
            </select>
            </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => {addRelationshipToAnno(message.id); jQuery(`#editAnnoModal${message.id}`).modal('hide');}}>Add to relationship</button>
              <button type="button" className="btn btn-secondary" onClick={() => jQuery(`#editAnnoModal${message.id}`).modal('hide')}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => {annoEdit(message.id, jQuery("#annoEditSel" + message.id).val()); jQuery(`#editAnnoModal${message.id}`).modal('hide')}}>Save</button>
            </div>
          </div>
        </div>
      </div>
      ))}
      </div>
    ))}
{/*modal end*/}

      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" id="annotation-tab" data-toggle="tab" href="#annotation" role="tab" aria-controls="annotation" aria-selected="true">Annotations</a>
        </li>
        {/*}<li className="nav-item">
          <a className="nav-link" id="relationship-tab" data-toggle="tab" href="#rel" role="tab" aria-controls="relationship" aria-selected="false">Relationships</a>
        </li>*/}
      </ul>

      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="annotation" role="tabpanel" aria-labelledby="annotation-tab">



          <button type="button" className="btn btn-link" data-toggle="modal" data-target="#editSchemaModal">
            Edit Schema
          </button>


<div className="accordion" id="accordionExample">
<button id="button">Delete selected row</button>
{
  <table id="table_id" class="display">
    <thead>
        <tr>
            <th>Text</th>
            <th>Type</th>
            <th>User</th>
            <th>Page</th>
            <th>ID</th>
        </tr>
    </thead>

</table>
}
{/*{
  <table id="table_id3" class="display">
    <thead>
        <tr>
            <th>Type</th>
        </tr>
    </thead>

</table>
  }*/}




{myMap.map((highlight, index) => (
  <div>
  {/*<div className="accordion-item">*/}
    {/*<h2 className="accordion-header" id="headingOne">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + index} aria-expanded="true" aria-controls="collapseOne">
        {highlight[0].comment.text}
      </button>
    </h2>*/}


  {highlight.map(message => (
    <div id={"collapse" + index} className="accordion-collapse collapse show" aria-labelledby="headingOne"  key={index} onClick={() => {
                  updateHash(message);
                }}>



      <div class="accordion-body">
      {updateTable(t, message.content.text, message.comment.text,`${message.userName}`, message.position.pageNumber, message.id )}
      {/*<div style={{display: "inline-block"}}>
      <div style={{padding: "1rem", float: "left"}}>
                <a onClick={(e) => removeHighlight(message.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg></a>
                <a data-toggle="modal" data-target={`#editAnnoModal${message.id}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg></a>
              </div>
            {message.content.text ? (
              <blockquote style={{ padding: "1rem", float: "left" }}>
                {`${message.content.text}`}
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
            <div className="highlight__location" style={{display: "inline-block", float: "left"}}>
            Added By {`${message.userName}`}
           </div>
            <div className="highlight__location" style={{display: "inline-block"}}>
            Page {message.position.pageNumber}
           </div>

          {message.comment.relationship ? (
            <a className="button4">{message.comment.relationship}</a>
          ) : null}*/}
      </div>
    </div>
    ))}


  </div>
))}

</div>



          {/*highlights.length > 0 ? (
            <div style={{ padding: "1rem" }}>
              <button onClick={resetHighlights}>Reset Annotations</button>
            </div>
          ) : null*/}

        </div>

    <div className="tab-pane fade" id="rel" role="tabpanel" aria-labelledby="relationship-tab">
        <select name="reltypesel" id="reltypesel" onChange={() => {

            if(jQuery('#reltypesel').val() == null)
            {
              jQuery('#addrelModal').modal("show");
            }
          }}>
                  {tags.relationship_types.map((rtag, index) => (
                    <option value={rtag.name}>{rtag.name}</option>
                  ))}
          <option disabled>_________</option>
          <option value="">Add Type</option>
        </select>
        <button type="button" class="btn btn-link" onClick={() => addRelationship(jQuery('#reltypesel').val(), "", [])}>
          New Relationship
        </button>
        <ul className="sidebar__relationships">
        {/*{
          <table id="table_id2" class="display">
            <thead>
                <tr>
                    <th>Type</th>
                </tr>
            </thead>

        </table>
      }*/}

          {relationships.map((relation, index) => (

                <li key={index}>
                <strong>{relation.type}</strong>
                {relation.head ? (

                  <blockquote style={{ marginTop: "0.5rem" }}>
                    {`${highlights.filter(function(highlight){return relation.head == highlight.id})[0].content.text}`}
                  </blockquote>
                ) : null}
                {relation.nodes.map((rel, i) => (
                  <blockquote style={{ marginTop: "0.5rem" }} key={i}>
                    {`${highlights.filter(function(highlight){return rel == highlight.id})[0].content.text}`}
                    // {updateTable2(t2, `${highlights.filter(function(highlight){return rel == highlight.id})[0].content.text}` )}
                  </blockquote>
                  ))}
                </li>

          ))}

        </ul>


        <div class="modal fade" id="createrelModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
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


                        <option key={index} value={highlight.id}>A{index} - {highlight.content.text}</option>


                  ))}
                </select>

                <div class="separator"></div>
                <label>Select Nodes:</label>
                <br/>
                <select id="sel" name="sel" multiple>
                  {highlights.map((highlight, index) => (


                        <option key={index} value={highlight.id}>A{index} - {highlight.content.text}</option>


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



        <div class="modal fade" id="addrelModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="ModalLabel">Add Relationship</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => jQuery('#addrelModal').modal('hide')}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <label>Enter New Type Name:</label>
                <input id="relTypeInput"></input>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={() => jQuery('#addrelModal').modal('hide')}>Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => {
                  addRelationshipType(jQuery('#relTypeInput').val());
                  jQuery('#addrelModal').modal('hide');
                }
                  }>Add</button>
              </div>
            </div>
          </div>
        </div>
                </div>





        <div class="modal show" id="editSchemaModal" tabindex="1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
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
                  <tbody>
                  {tags.annotation_types.map((tag, index) => (

                        <tr key={index} id={tag.name + "modaltr" + index}>
                        <th><p name="tagname" contentEditable = "true">{tag.name}</p></th>
                        <th><input name="tagcolor" data-jscolor="{}" defaultValue={tag.color}></input></th>
                        <th><button onClick={function(){if(confirm("Remove " + tag.name + "?")){
                            tags.annotation_types.splice(index, 1);
                            openSchema(tags);
                            jscolor.install();

                          }}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg></button></th>
                        </tr>

                  ))}
                </tbody>
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
                let tempt = tags;
                t.id = "<new>";
                t.name = "<new>";
                t.color = "#FBFF17";
                tempt.push(t);
                openSchema(tempt);
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
                    var tempTags = {};
                    inputs = document.getElementsByTagName('input');

                    for (index = 0; index < tagNameInputs.length; ++index) {
                        temp = {};
                        temp.id = tagNameInputs[index].textContent;
                        temp.name = tagNameInputs[index].textContent;
                        temp.color = tagColorInputs[index].value;
                        tempTags.annotation_types[index] = temp;
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
