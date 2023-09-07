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
          let newel;
          
          if(config.format == "html") {
            let height = jel.attr('height');
            content = `<iframe src=${source} width="100%" height="${height}"frameborder="0" allowfullscreen></iframe>`;
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

module.exports = Plugin;
