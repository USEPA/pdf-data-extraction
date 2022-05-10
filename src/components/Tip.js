 // @flow

import React, { Component } from "react";
//import tags from "../tags.json";

import "../style/Tip.css"
//import "../lib/bootstrap/css/bootstrap.min.css"
//import "../lib/bootstrap/js/bootstrap.min.js"
//mport "jquery/dist/jquery.min.js"
//import jQuery from "jquery"
import "../lib/bootstrap/js/bootstrap.bundle.min.js"

const jQuery = require('jquery');
window.jQuery = jQuery;
import ('bootstrap-select/dist/css/bootstrap-select.min.css');
require('bootstrap-select');

//<div class="separator">Relationships</div>
//<div>
//<select id="sel" class="selectpicker" name="sel" onChange={event => this.setState({ relationship: event.target.value })} multiple data-live-search="true">
//    <option value='r1'>r1</option>
//    <option value='r2'>r2</option>
//</select>
//<br/>
//<input type='text' name='option' id='optionTextBox' />
//<button type='button' id='btnAdd'>Add Option</button>

type State = {
  compact: boolean,
  text: string,
  relationship: string
};

type Props = {
  onConfirm: (comment: { text: string, relationship: string }) => void,
  onOpen: () => void,
  onUpdate?: () => void
};

class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    relationship: ""
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;
    //alert(this.props.tags);
    jQuery('.selectpicker').selectpicker();
    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();

      let optionList = document.getElementById('tagSelect').options;
      optionList.add(
        new Option("Select Type: ", "")
      );

      this.props.tags.annotation_types.forEach(option =>
        optionList.add(
          new Option(option.name, option.id)
        )
      );


      //var btn = document.getElementById('btnAdd');
      //btn.onclick = function(){

      //    var tb = document.getElementById('optionTextBox'), val = tb.value;
      //    if(val.length){

      //        var sel = document.getElementById('sel').options;
      //        var opt = new Option(val, val);
      //        sel.add(opt);
      //        tb.value = '';
      //    }
    //  };

    }
  }

  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text, relationship } = this.state;

    return (

      <div className="Tip">
        {compact ? (
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          >
            Add Annotation
          </div>
        ) : (
          <form
            className="Tip__card"
            onSubmit={event => {
              event.preventDefault();
              onConfirm({ text, relationship });
            }}
          >
            <div>
              <div>
              <select
                id = "tagSelect"
                width="100%"
                placeholder=""
                autoFocus
                value={text}
                onChange={event => this.setState({ text: event.target.value})}
                ref={node => {
                  if (node) {
                    node.focus();
                  }
                }}
              />

              </div>



            </div>
            <hr/>

            <div>
              <input type="submit" value="Save" />
            </div>

          </form>
        )}

      </div>

    );

  }
}

export default Tip;
