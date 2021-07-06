// @flow

import React, { Component } from "react";


import URLSearchParams from "url-search-params";

import PdfHighlighter from "./components/PdfHighlighter";
import Tip from "./components/Tip";
import Highlight from "./components/Highlight";
import Popup from "./components/Popup";
import AreaHighlight from "./components/AreaHighlight";
import PdfLoader from "./components/PdfLoader";

import defaultTags from "./tags.json";
import testHighlights from "./test-highlights.js";
import pdfjs from "pdfjs-dist";
import Spinner from "./Spinner.js";
import Sidebar from "./Sidebar.js";
import $ from "jquery"
//require("jQuery");

import type {
  T_Highlight,
  T_NewHighlight
} from "react-pdf-highlighter/src/types";

import "./style/App.css";
require("popper.js");
require("bootstrap");
require('@eastdesire/jscolor');
import "./lib/bootstrap/css/bootstrap.min.css"

type T_ManuscriptHighlight = T_Highlight;

type Props = {};

type State = {
  highlights: Array<T_ManuscriptHighlight>
};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({ comment }) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.text}
    </div>
  ) : null;

const DEFAULT_URL = "https://arxiv.org/pdf/1708.08021.pdf";

function gettext(pdfDocument){
  var pdf = pdfjs.getDocument(pdfUrl);
  return pdf.then(function(pdf) { // get all pages text
    var maxPages = pdf.pdfInfo.numPages;
    var countPromises = []; // collecting all page promises
    for (var j = 1; j <= maxPages; j++) {
      var page = pdf.getPage(j);

      var txt = "";
      countPromises.push(page.then(function(page) { // add page promise
        var textContent = page.getTextContent();
        return textContent.then(function(text){ // return content promise
          return text.items.map(function (s) { return s.str; }).join(''); // value page text
        });
      }));
    }
    // Wait for all pages and join text
    return Promise.all(countPromises).then(function (texts) {
      return texts.join('');
    });
  });
}

async function getT(pdfDocument) {
  var plaintext = "";

  for (var pn = 1; pn <= pdfDocument.numPages; pn++) {
    //console.log("hello" + plaintext);
    var page = await pdfDocument.getPage(pn);
      var unscaledViewport = page.getViewport({scale:1});
      const vp = page.getViewport({scale:1});
      var textContent = await page.getTextContent({ normalizeWhitespace: true });
          textContent.items.forEach(function (textItem) {
            plaintext += textItem.str + " ";
          })
  }
  return plaintext;
  //alert(pn + " : " +plaintext.length);
}


const searchParams = new URLSearchParams(document.location.search);
let d_url = searchParams.get("url") || DEFAULT_URL;

class App extends Component<Props, State> {
  state = {
    highlights: testHighlights[d_url] ? [...testHighlights[d_url]] : [],
    url : d_url,
    data: '',
    text: '',
    tags: defaultTags,
    relationships: []
  };

  state: State;

  resetHighlights = () => {
    this.setState({
      highlights: [],
      url: this.state.url,
      data: this.state.data,
      text: this.state.text,
      tags: this.state.tags,
      relationships: this.state.relationships
    });
  };

  removeHighlight = (highlight_id) => {
    this.setState({highlights: this.state.highlights.filter(function(highlight){
      return highlight_id !== highlight.id
      })});
  }
  editHighlight = (highlight_id) => {
    this.setState({highlights: this.state.highlights.filter(function(highlight){
      return highlight_id !== highlight.id
      })});
  }

  openPDF = (highlights, url, data) => {
    let schema = defaultTags;
    if(typeof highlights.schema != "undefined") schema = highlights.schema;
    this.setState({
      highlights: highlights.highlights,
      url: url,
      data: data,
      text: '',
      tags: schema,
      relationships: highlights.relationships
    });
    highlights.highlights.forEach(hlight => {
        data.forEach(tag => {
            if(tag.name == hlight.comment.text){
              hlight.position.rects.forEach(rect => {
                  rect.background = tag.color;
                })
            }
          })
      })
    defaultTags.forEach(tag => {
        let tagID = `.Highlight__` + tag.name;
        //document.getElementById(tagID).style.color=tag.color;
      //  $(tagID).css({"background": tag.color})
      //  $(tagID).css({"position": "absolute"});
      });
  };

  openSchema = (data) => {
    //alert(JSON.stringify(data));
    var tempHighlights = this.state.highlights;
    const currentTags = data;
    tempHighlights.forEach(hlight => {
        data.forEach(tag => {
            if(tag.name == hlight.comment.text){
              hlight.position.rects.forEach(rect => {
                  rect.background = tag.color;
                })
            }
          })
      })
    this.setState({
      highlights: tempHighlights,
      url: this.state.url,
      data: this.state.data,
      text: this.state.text,
      tags: data,
      relationships: this.state.relationships
    });

  };

  scrollViewerTo = (highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
    defaultTags.forEach(tag => {
        if(tag.id != 0)
        {
        let tagID = `.Highlight__` + tag.name;
        //document.getElementById(tagID).style.color=tag.color;
        $(tagID).css({"background": tag.color})
        $(tagID).css({"position": "absolute"});
      }
      });
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }


  async addHighlight(pdfDocument, highlight: T_NewHighlight) {
    const { highlights } = this.state;
    var closest = Number.MAX_VALUE;
    var offset = -1;
    var curr = 0;
    var matches = [];
    var plaintext = "";
    //const canv = document.getElementById('page1');
    for (var pn = 1; pn <= pdfDocument.numPages; pn++) {
      var page = await pdfDocument.getPage(pn);
        var unscaledViewport = page.getViewport({scale:1});
        //var scale = Math.min((canv.height / unscaledViewport.height), (canv.width / unscaledViewport.width));
        const vp = page.getViewport({scale:1.649169176049577});

        var textContent = await page.getTextContent({ normalizeWhitespace: true });

            for(var ti = 0; ti < textContent.items.length; ti++)
            {
                var textItem = textContent.items[ti];
                var textItemText = textItem.str;
                var highlightText = highlight.content.text;
                var highlightX = highlight.position.boundingRect.x1;
                var highlightY = highlight.position.boundingRect.y1;
                curr = plaintext.length;
                plaintext += textItem.str + " ";


                if(textItemText.includes(highlightText) && highlight.position.pageNumber == pn){
                  //neat
                  let x = textItem.transform[4];
                  let y = textItem.transform[5];
                  let w = textItem.width;
                  let h = textItem.height;

                  const [x1, y1, x2, y2] = vp.convertToViewportRectangle([x, y, w + x, h + y]);
                  var a = x1 - highlightX;
                  var b = y1 - highlightY;
                  var distance = Math.sqrt( a*a + b*b );
                  //curr += textItemText.indexOf(highlightText);
                  if(distance < closest){
                    closest = distance;
                    offset = curr + textItemText.indexOf(highlightText);
                  }
                } //if
                else if(textItemText.length < highlightText.length && highlight.position.pageNumber == pn)
                {
                  var iterator = ti + 1;
                  while(textItemText.length < highlightText.length && iterator < textContent.items.length)
                  {
                    textItemText += textContent.items[iterator].str;
                    iterator++;
                  } //while
                  if(textItemText.includes(highlightText)){
                    let x = textItem.transform[4];
                    let y = textItem.transform[5];
                    let w = textItem.width;
                    let h = textItem.height;

                    const [x1, y1, x2, y2] = vp.convertToViewportRectangle([x, y, w + x, h + y]);
                    var a = x1 - highlightX;
                    var b = y1 - highlightY;
                    var distance = Math.sqrt( a*a + b*b );
                    //curr += textItemText.indexOf(highlightText);
                    if(distance < closest){
                      closest = distance;
                      offset = curr + textItemText.indexOf(highlightText);
                    }
                  } //if
                } //else if



                //alert(JSON.stringify(highlight.position.rects) + " matching text" + x1 + " " + y1 + " " + x2 + " " + y2);


              //const scale = this.pdfViewer.currentScale;

              //const scale = 809.9999999999999 / 1200;

              //let x2 = (x * scale);
              //let y2 = ((y + h) * scale);
              //alert(textItem.str + " " + scale + " " + x1);
              //alert(textItem.str)

            } //for textitems
            this.state.tags.forEach(tag => {
                if(tag.id != 0){
                  console.log(tag.name + " " + tag.color);
                let tagID = `.Highlight__` + tag.name;
                console.log(tagID);
                //document.getElementById(tagID).style.color=tag.color;
                //$(tagID).css({"background": tag.color});
              }
              });

    } //for pages
    //alert("offset = " + offset);


    console.log("Saving highlight", highlight);
    //alert(JSON.stringify(highlight.comment.text));
    let end = offset + highlight.content.text.length;
    highlight.comment.begin = offset;
    highlight.comment.end = end;
    var bg_index = -1;
    const currentTags = this.state.tags;
    const defaultBGColor = "yellow";
    highlight.position.rects.forEach(rect => {
        rect.backgound = defaultBGColor;
      })
    currentTags.forEach((tag, index) => {
      if(tag.name == highlight.comment.text)
      {
        highlight.position.rects.forEach(rect => {
            rect.background = tag.color;
          })
      }
    });

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
      url: this.state.url,
      data: this.state.data,
      tags: this.state.tags,
      relationships: this.state.relationships
    });
    // alert(JSON.stringify(highlight));
  } //end addHighlight

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map(h => {
        return h.id === highlightId
          ? {
              ...h,
              position: { ...h.position, ...position },
              content: { ...h.content, ...content }
            }
          : h;
      }),
      url : this.state.url,
      data: this.state.data,
      tags: this.state.tags,
      relationships: this.state.relationships
    });
  }

  addRelationship = (type: string, head: string, nodes: []) => {
    var relation = {};
    relation.type = type;
    relation.head = head;
    relation.nodes = nodes;
    this.state.relationships.push(relation);

    this.setState({
      highlights: this.state.highlights,
      url : this.state.url,
      data: this.state.data,
      tags: this.state.tags,
      relationships: this.state.relationships
    });
  }

  updateText(text: string) {
    this.setState({
      highlights: this.state.highlights,
      url : this.state.url,
      data: this.state.data,
      text: text,
      tags: this.state.tags,
      relationships: this.state.relationships
    });
  }


  render() {
    const { highlights } = this.state;
    const { url } = this.state;
    const { data } = this.state;
    const { tags } = this.state;
    const { relationships } = this.state;
    const electron = window.require('electron');
    const ipcRenderer  = electron.ipcRenderer;
    const app = electron.app;
    const path = require('path');
    const fs = window.require('fs');

    return (
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={highlights}
          tags={tags}
          relationships={relationships}
          resetHighlights={this.resetHighlights}
          removeHighlight={this.removeHighlight}
          addRelationship={this.addRelationship}
          openSchema={this.openSchema}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            overflowY: "scroll",
            position: "relative"
          }}
        >
          <PdfLoader data={data} url={url} beforeLoad={<Spinner />}>
            {pdfDocument => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={event => event.altKey}
                onScrollChange={resetHash}

                scrollRef={scrollTo => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}

                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    tags={this.state.tags}
                    onOpen={transformSelection}
                    onConfirm={comment => {
                      this.addHighlight(pdfDocument, { content, position, comment });

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  ipcRenderer.on('file-opened', (event, file, content, highlights) => {
                    //filePath = file;
                    //originalContent = content;
                    this.openPDF(highlights, file, content);

                  });
                  ipcRenderer.on('schema-file-opened', (event, content) => {
                    //filePath = file;
                    //originalContent = content;
                    this.openSchema(content);

                  });
                  ipcRenderer.on('auto-annotate', (event) => {
                    //filePath = file;
                    //originalContent = content;
                    // waiting on gettext to finish completion, or error

                    //this.updateText(plaintext);
                    //alert(plaintext);
                    //alert(getPdfText(data));

                  });
                  ipcRenderer.on('save-file', (event, app_path) => {
                    //filePath = file;
                    //originalContent = content;
                    let url = this.state.url;
                    let highlights = this.state.highlights;
                    let relationships = this.state.relationships;
                    let schema = this.state.tags;

                    const pdfData = this.state.data;
                    pdfjs.getDocument({
                      data: pdfData,
                      eventBusDispatchToDOM: true
                    }).promise.then(pdfD => {


                        getT(pdfD).then(function(ptext){
                        let jsonT = {};
                        jsonT.text = ptext;
                        jsonT.relationships = relationships;
                        jsonT.schema = schema;
                        jsonT.highlights = highlights;
                        //alert("saving");
                        const filePath = path.join(app_path, path.basename(url)  + ".json");
                        fs.writeFile(filePath,
                                     JSON.stringify(jsonT), function (err) {
                            if (err) throw err;

                        });
                    //let url = this.state.url;
                    //getT(pdfDocument).then(function(plaintext){
                    //const tfilePath = path.join(app_path, path.basename(url)  + ".txt");
                    //fs.writeFileSync(tfilePath,
                                 //plaintext, function (err) {
                      //if (err) throw err;

                    });
                  })

                  //});

                  });
                  if (typeof highlight.comment === 'undefined'){
                  //the variable is undefined
                  console.log('undefined oh no');
                  } else {
                  //the variable is not undefined
                  console.log('defined lets do seomthing');

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                      tag={highlight.comment.text}

                    />
                  ) : (
                    <AreaHighlight
                      highlight={highlight}
                      onChange={boundingRect => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={popupContent =>
                        setTip(highlight, highlight => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );}
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );
  }
}

export default App;
