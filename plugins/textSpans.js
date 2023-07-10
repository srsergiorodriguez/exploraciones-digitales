let through = require('through2');
let cheerio = require('cheerio');

// This constructor function will be called once per format
// for every build. It received a plugin registry object, which
// has .add(), .before() and .after() functions that can be used
// to register plugin functions in the pipeline.

let Plugin = function(registry){
  registry.after('markdown:convert', 'textSpans:insert', this.textSpans);
};

Plugin.prototype = {

  textSpans: function(config, stream, extras, cb) {
    stream = stream.pipe(through.obj(function(file, enc, cb) {
      if(!file.$el) file.$el = cheerio.load(file.contents.toString());
        // Loop through all figures to replace with iframes
        file.$el('p').each(function(i, el) {
          let jel = file.$el(this);

          const italicRegex = new RegExp(/\*(?<class>[a-z,;:.áéíóúü-_@#¡!¿?0-9\)\()]+)\*/i);

          if (italicRegex.test(jel.html())) {
            const content = jel.html().match(italicRegex).groups.class;
            const newcontent = jel.html().replace(italicRegex, `<i>${content}</i>`);
            jel.html(newcontent);
          }
        });
      
      // pass file through the chain
      cb(null, file);
    }))

    cb(null, config, stream, extras);
  }

}

module.exports = Plugin;
