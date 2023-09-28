let through = require('through2');
let cheerio = require('cheerio');

const fs = require('fs'); 
const path = require("path");

// This constructor function will be called once per format
// for every build. It received a plugin registry object, which
// has .add(), .before() and .after() functions that can be used
// to register plugin functions in the pipeline.

let Plugin = function(registry){
  registry.after('markdown:convert', 'addSketch:insert', this.addSketch);
};

Plugin.prototype = {

  addSketch: function(config, stream, extras, cb) {
    
    stream = stream.pipe(through.obj(function(file, enc, cb) {
      if(!file.$el) file.$el = cheerio.load(file.contents.toString());
        // Loop through all figures to replace with iframes
        file.$el('sketch').each(function(i, el) {
          let jel = file.$el(this);

          let content;
          let source = jel.attr('src');
          let caption = jel.attr('caption');
          let captionprint = jel.attr('captionprint');
          let newel;

          // const tempIframe = document.createElement("iframe");
          const iframeHeight = getElementHeight(source, ".box");
          
          if(config.format == "html") {
            let height = jel.attr('height');
            content = `<iframe src=${source} width="100%" height="${height}"frameborder="0" allowfullscreen></iframe><p>${iframeHeight}</p>`;
            newel = `<div class="sketch-wrapper"><figcaption>${caption}</figcaption>${content}</div>`;        
          } else {
            content =  `<img src=${source + "/img.png"} alt="" />`;
            newel = `<div class="sketch-wrapper"><figcaption>${captionprint || caption}</figcaption>${content}</div>`;
          }

          jel.replaceWith(newel);
        });

      // pass file through the chain
      cb(null, file);
    }))

    cb(null, config, stream, extras);
  }

}


function getElementHeight(url, selector) {
  const filePath = path.resolve(__dirname, `${url.replace("./assets", "../images")}/index.html`);
  const data = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(data);
  const $general = $("#general");

  // return $general.style
  return Object.entries($general.css())
}

module.exports = Plugin;
