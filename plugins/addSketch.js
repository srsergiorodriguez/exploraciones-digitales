let through = require('through2');
let cheerio = require('cheerio');

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
          let newel = "";

          const printmsg = ". Esta es una captura de pantalla del interactivo que se encuentra en la versión web de esta disertación";
          
          if(config.format == "html") {
            let height = jel.attr('height');
            content = `<iframe src=${source} width="100%" height="${height}"frameborder="0" allowfullscreen></iframe>`;
            newel = `<div class="sketch-wrapper"><figcaption>${caption}</figcaption>${content}</div>`;        
          } else {
            let listdata = jel.attr('list-data');
            if (listdata) {
              newel = `<figcaption>${captionprint || caption}</figcaption>` + getTable(listdata);
            } else {
              content = `<img src=${source + "/img.png"} alt="" />`;
              newel = `<figure class="illustration sketch-wrapper"><figcaption>${captionprint || caption}${caption ? printmsg : ""}</figcaption>${content}</figure>`;
            }
          }

          jel.replaceWith(newel);
        });

      // pass file through the chain
      cb(null, file);
    }))

    cb(null, config, stream, extras);
  }

}

function getTable(listdata) {
  let newel = "";
  // const [header, content] = listdata.split(/\|(-\|)+\n/);

  const spl = listdata.split("\n");
  const header = spl[0];
  const content = spl.slice(2).join("\n");


  let hs = header.split("|")
  hs = hs.slice(1, hs.length - 1);
  for (let h of hs) {
    newel += `<th>${h}</th>`
  }
  newel = `<tr>${newel}</tr>`

  // console.log(content);

  for (let rowcontent of content.split("\n")) {
    if (rowcontent === "") continue

    let row = ""
    let cs = rowcontent.split("|")
    cs = cs.slice(1, cs.length - 1);
    for (let c of cs) {
      row += `<td>${c}</td>`
    }
    newel += `<tr>${row}</tr>`
  }

  newel = `<table>${newel}</table>`

  return newel;
}

module.exports = Plugin;
