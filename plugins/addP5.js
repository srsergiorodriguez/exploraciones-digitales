let through = require('through2');
let cheerio = require('cheerio');

// This constructor function will be called once per format
// for every build. It received a plugin registry object, which
// has .add(), .before() and .after() functions that can be used
// to register plugin functions in the pipeline.

let Plugin = function(registry){
  registry.after('markdown:convert', 'addP5:insert', this.addFrames);
};

Plugin.prototype = {

  addFrames: function(config, stream, extras, cb) {
    if(config.format == "html") {

    stream = stream.pipe(through.obj(function(file, enc, cb) {
        if(!file.$el) file.$el = cheerio.load(file.contents.toString());
          // Loop through all figures to replace with iframes
          file.$el('figure[data-p5-sketch^="http"]').each(function(i, el) {
            let jel = file.$el(this);
            
            let source = jel.attr('data-p5-sketch');
            let sketchHeight = jel.attr('sketch-height');
            let newel = `<div class="p5-wrapper"><iframe src=${source} width="650px" height="${sketchHeight}"frameborder="0" allowfullscreen></iframe></div>`;
            jel.before(newel);

            // check for a caption; if found, add to new element
            let caption = jel.find('figcaption');
            if (caption.length > 0 && /\S+/.test(caption.text())) {
              let prevframe = jel.prev().find('iframe').last();
              let captionel = `<p>${caption.html()}</p>`
              prevframe.before(captionel);
            }

            jel.empty();
            jel.remove();
          });

        // pass file through the chain
        cb(null, file);
      }))

    }

    cb(null, config, stream, extras);
  }

}

module.exports = Plugin;
