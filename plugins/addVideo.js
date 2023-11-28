let through = require('through2');
let cheerio = require('cheerio');

// This constructor function will be called once per format
// for every build. It received a plugin registry object, which
// has .add(), .before() and .after() functions that can be used
// to register plugin functions in the pipeline.

let Plugin = function(registry){
  registry.after('markdown:convert', 'addVideo:insert', this.addVideo);
};

Plugin.prototype = {

  addVideo: function(config, stream, extras, cb) {
    
    stream = stream.pipe(through.obj(function(file, enc, cb) {
      if(!file.$el) file.$el = cheerio.load(file.contents.toString());
        // Loop through all figures to replace with iframes
        file.$el('movie').each(function(i, el) {
          let jel = file.$el(this);

          let content;
          let source = jel.attr('src');
          let caption = jel.attr('caption');
          let captionprint = jel.attr('captionprint');
          let newel;
          
          if(config.format == "html") {
            content = `<video src="${source}.mp4" poster="${source}.png" width="100%" controls controlsList="nodownload nofullscreen noremoteplayback">Tu buscador no soporta reprodución de video</video>`;
            newel = `<div class="video-wrapper"><figcaption>${caption}</figcaption>${content}</div>`;        
          } else {
            content =  `<img src="${source}.png" alt="${caption}" />`;
            newel = `<figure class="video-wrapper"><figcaption>${captionprint || caption}</figcaption>${content}</figure>`;
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
