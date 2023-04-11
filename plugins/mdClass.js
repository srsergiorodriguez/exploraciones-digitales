let through = require('through2');
let cheerio = require('cheerio');

// This constructor function will be called once per format
// for every build. It received a plugin registry object, which
// has .add(), .before() and .after() functions that can be used
// to register plugin functions in the pipeline.

let Plugin = function(registry){
  registry.after('markdown:convert', 'mdClass:insert', this.addClass);
};

Plugin.prototype = {

  addClass: function(config, stream, extras, cb) {
    stream = stream.pipe(through.obj(function(file, enc, cb) {
      // file.$el = file.$el || cheerio.load(file.contents.toString());
      if(!file.$el) file.$el = cheerio.load(file.contents.toString());
        // Loop through all figures to replace with iframes
        file.$el('p').each(function(i, el) {
          let jel = file.$el(this);

          const regex = new RegExp(/{:[ ]?[a-z-]+}/i);

          if (regex.test(jel.html())) {
            const newclass = jel.html().match(/{:[ ]?(?<class>[a-z-]+)}/i).groups.class;
            const newcontent = jel.html().replace(regex, "");
            
            jel.html(`<p class=${newclass}>${newcontent}</p>`);
          }

          // jel.after(jel.html)
          // jel.empty();
          // jel.remove();
        });

      

      // file
      //   .$el('p')
      //   .before('sadfsfdfsd');

      // pass file through the chain
      cb(null, file);
    }))

    cb(null, config, stream, extras);
  }

}

module.exports = Plugin;
