// @flow

import React, { Component } from "react";
import tags from "../tags.json";
import "../style/Tip.css";

type State = {
  compact: boolean,
  text: string,
  emoji: string
};

type Props = {
  onConfirm: (comment: { text: string, emoji: string }) => void,
  onOpen: () => void,
  onUpdate?: () => void
};

class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    emoji: ""
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();

      let optionList = document.getElementById('tagSelect').options;


      tags.forEach(option =>
        optionList.add(
          new Option(option.name, option.id)
        )
      );


      var btn = document.getElementById('btnAdd');
      btn.onclick = function(){

          var tb = document.getElementById('optionTextBox'), val = tb.value;
          if(val.length){
              alert(val);
              var sel = document.getElementById('sel');
              var opt = document.createElement('option');
              opt.value = val;
              opt.innerHTML = val;
              sel.appendChild(opt);
              tb.value = '';
          }
      };
    }
  }

  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text, emoji } = this.state;

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
              onConfirm({ text, emoji });
            }}
          >
            <div>
              <div>
              <select
                id = "tagSelect"
                width="100%"
                placeholder="Your comment"
                autoFocus
                value={text}
                onChange={event => this.setState({ text: event.target.value })}
                ref={node => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
              </div>
              <div>
              <select id="sel" name="sel" onChange={event => this.setState({ emoji: event.target.value })}>
                  <option value='r1'>r1</option>
                  <option value='r2'>r2</option>
              </select>
              <input type='text' name='option' id='optionTextBox' />
              <button id='btnAdd'>Add Option</button>

            </div>
            </div>
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
