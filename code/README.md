# TOC
- [Kodedokumentasjon](#code-documentation)
- [FreeMarker](#freemarker)
- [Libs and tools](#libs-and-tools)
  * [Xptool (verktøy)](#xptool--tool-)
- [SCSS annd ES6](#scss-and-es6)
  * [Use](#use)
  * [Wepack](#Webpack)


# Code documentation

For information about setup and building, see [system documentation](../README.md)

# FreeMarker
We can use [FreeMarker](https://freemarker.apache.org/) to render HTML backend.
This gives us "Powerful template language: Conditional blocks, iterations, assignments, string and arithmetic operations and formatting, macros and functions, including other templates, escaping by default (optional), and many more".

By using macros there are big potential to reuse code across multiple files.

# Libs and tools
We include a couple of extra libraries with functionality. These are separate blocks with functionality that are used across projects.

## Xptool (tool)
In Bouvet we have xptool, which is a tool for daily development needs in Enonic XP. (https://github.com/bouvet-apps/xp-tool)
To use it in your terminal, install it with `npm install -g @bouvet-apps/xp-tool`, and run `xptool` in a terminal to get a list of options to what to use it for.

In this project command `xptool phrase validate` is used from the package.json in the `lint` script, to make sure your i18n files are valid.

Check https://github.com/bouvet-apps/xp-tool for more information about what it can help you with, and how.


# SCSS and ES6
SCSS is used to create CSS for the project.
The SCSS files are located in `/code/src/frontend/styles/`.
We write all scripts in ES6. These are transpiled to JS with Webpack.

## Use
Each part has its own SCSS file, included in pageContributions where needed. This lets us load only the CSS which are needed. It gives us some extra HTTP requests, but as we use HTTP/2 this should be no problem.

SCSS for parts should be added to `/components/parts`. If the name of the SCSS file matches the part name, it will be added to pageContributions through `libs.util.getPartCssContribution(component)`.

## Webpack
To be able to usefiles in the frontend folder, it needs to go through webpack.

Script files are added manually in the entry list in `/code/src/frontend/webpack.common.config.js`:
```
module.exports = {
  entry: {
    ...
    main: "./scripts/main.es6",
    ...
  }
```
This gives a bundeled file `main.js` in the asset-folder ready to be used in the pageContributions part.
