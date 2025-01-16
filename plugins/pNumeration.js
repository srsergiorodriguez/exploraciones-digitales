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
    if(config.format == "html") {

      stream = stream.pipe(through.obj(function(file, enc, cb) {  
        if(!file.$el) file.$el = cheerio.load(file.contents.toString());

          const number = file.$el('h1[number]').attr('number');

          const numberRef = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

          let count = 1;
          file.$el('section[data-type="chapter"]').find("p").each(function(i, el) {
            let jel = file.$el(this);
  
            const content = jel.html();

            if (jel.prop('innerText').length > 75) {
              jel.html(`<p><span class="paragraph-number tooltip" onclick=setBookmark(${number},${count}) id="bookmark-${number}-${count}">§${count}${numberRef[+number-1]}<span style="font-size: 0.9em" class="tooltiptext">Guardar marcapáginas</span></span> ${content}</p>`);
              // jel.html(`<p><span style="cursor:pointer;" onclick=setBookmark(${number},${count}) id="bookmark-${number}-${count}"><strong>§${count}${numberRef[+number-1]}</strong></span> ${content}</p>`);
              count++;
            }
            
          });
        cb(null, file);
      }))
    }
    

    cb(null, config, stream, extras);
  }

}

module.exports = Plugin;
