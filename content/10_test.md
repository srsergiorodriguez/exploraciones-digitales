---
title: Conclusionesdsffds
subtitle: ¿De qué trata este proyecto?
---

<header class="chapter-headers">
  <h1>{{ page.title }}</h1>
  <h2>{{ page.subtitle }}</h2>
</header>

This is a chapter written in markdown.

## Internal links

You can link to other files simply by making an internal [link](./introduccion.html). The build process will automatically search for this ID in all files, and append the filename if needed for the particular format.

## Images

You can insert images simply by adding an image tag with the name of the image. This will look for an image located in `images/bruce.jpg`, but you can easily change this location if you want.

![Picture of Bruce Springsteen](2bits.png)

<figure class="screenshot" sketch-height="130px" data-p5-sketch="https://srsergiorodriguez.github.io/exploraciones-sketches/C1/1interrupt/">
  <figcaption>El interruptor contiene un bit de información (dos diferencias)</figcaption>
    <img alt="intro ex02" src="bits.png" />
</figure>

## Code examples

Code examples can be written using the markdown syntax, and they
will automatically be converted to HTMLBook programlistings. Here's an
example of using the `console.log` function.

```js
console.log("hello");
```

## Footnotes

You ==can== also write **footnotes** using <mark>Marked text</mark> the Markdown syntax^[They are great], or the HTMLBook syntax<span data-type="footnote">They are great too</span>.
