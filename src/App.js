// @flow

import React, { Component } from "react";


import URLSearchParams from "url-search-params";

import PdfHighlighter from "./components/PdfHighlighter";
import Tip from "./components/Tip";
import Highlight from "./components/Highlight";
import Popup from "./components/Popup";
import AreaHighlight from "./components/AreaHighlight";
import PdfLoader from "./components/PdfLoader";

import testHighlights from "./test-highlights.js";
import pdfjs from "pdfjs-dist";
import Spinner from "./Spinner.js";
import Sidebar from "./Sidebar.js";

import type {
  T_Highlight,
  T_NewHighlight
} from "react-pdf-highlighter/src/types";

import "./style/App.css";

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

function gettext(pdfUrl){
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

/*
async function getPdfText(data) {
    let doc = await pdfjs.getDocument({data}).promise;
    let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {
        return (await (await doc.getPage(i+1)).getTextContent()).items.map(token => token.str).join('');
    });
    return (await Promise.all(pageTexts)).join('');
}
*/

function getPdfText(data) {
    let doc = pdfjs.getDocument({data});

      doc.getPage(1).getTextContent({ normalizeWhitespace: true }).then(function (textContent) {
        textContent.items.forEach(function (textItem) { alert(textItem) });
        })
}

/*
async function getPdfText(data) {
    let doc = await pdfjs.getDocument({data}).promise;
    let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {
        return (await (await doc.getPage(i+1)).getTextContent()).items.map(token => token.str).join('');
    });
    return (await Promise.all(pageTexts)).join('');
}
*/

const searchParams = new URLSearchParams(document.location.search);
let d_url = searchParams.get("url") || DEFAULT_URL;

class App extends Component<Props, State> {
  state = {
    highlights: testHighlights[d_url] ? [...testHighlights[d_url]] : [],
    url : d_url,
    data: ''
  };

  state: State;

  resetHighlights = () => {
    this.setState({
      highlights: [],
      url: this.state.url,
      data: this.state.data
    });
  };

  removeHighlight = (highlight_id) => {
    this.setState({highlights: this.state.highlights.filter(function(highlight){
      return highlight_id !== highlight.id
      })});
  }

  openPDF = (highlights, url, data) => {
    this.setState({
      highlights: highlights,
      url: url,
      data: data
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
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find(highlight => highlight.id === id);
  }

  addHighlight(highlight: T_NewHighlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
      url: this.state.url,
      data: this.state.data
    });
  }

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
      data: this.state.data
    });
  }


  render() {
    const { highlights } = this.state;
    const { url } = this.state;
    const { data } = this.state;
    const electron = window.require('electron');
    const ipcRenderer  = electron.ipcRenderer;
    const app = electron.app;
    const path = require('path');
    const fs = window.require('fs');

    return (
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={highlights}
          resetHighlights={this.resetHighlights}
          removeHighlight={this.removeHighlight}
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
                    onOpen={transformSelection}
                    onConfirm={comment => {
                      this.addHighlight({ content, position, comment });

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
                  ipcRenderer.on('auto-annotate', () => {
                    //filePath = file;
                    //originalContent = content;
                    // waiting on gettext to finish completion, or error

                    for (var i = 1; i <= pdfDocument.numPages; i++) {
                      pdfDocument.getPage(i).then(function (page) {
                        page.getTextContent({ normalizeWhitespace: true }).then(function (textContent) {
                            textContent.items.forEach(function (textItem) {

                              alert(textItem.str + " " + textItem.transform.toString());
                            })
                        })
                      })
                    }
                    //getPdfText(data);

                  });
                  ipcRenderer.on('save-file', (event, app_path) => {
                    //filePath = file;
                    //originalContent = content;
                    const filePath = path.join(app_path, path.basename(this.state.url)  + ".json");
                    fs.writeFileSync(filePath,
                                 JSON.stringify(this.state.highlights), function (err) {
                        if (err) throw err;

                    });

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
