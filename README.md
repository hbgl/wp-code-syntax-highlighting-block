# Code syntax highlighting for Wordpess

A Wordpress plugin that provides a Gutenberg block for displaying computer code with syntax-highlighting. Uses [highlight.js](https://highlightjs.org/) under the hood.

- ✅ Supports 192 languages
- ✅ 256 included themes
- ✅ Server rendered static HTML
- ✅ Zero JS runtime dependencies
- ✅ Dynamic light/dark mode based on [preferred color scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Browser support

The plugin uses [declarative shadow DOM](https://web.dev/articles/declarative-shadow-dom) for isolation. This feature is avaiable as of Baseline 2024 across [all modern browsers](https://caniuse.com/declarative-shadow-dom). Declarative shadow DOM can be [polyfilled](https://web.dev/articles/declarative-shadow-dom#polyfill) but this is beyond the scope of this plugin.

## Development

Running the plugin during development requires a working Wordpress application. The project directory must be placed in the standard Wordpress plugin directory `wp-content/plugins`.

A docker-compose script is provided to create the development environment:

```
mkdir code-syntax-highlighting-block-docker # root dir for Wordpress docker files
cd code-syntax-highlighting-block-docker

mkdir -p html/wp-content/plugins/code-syntax-highlighting-block
cd html/wp-content/plugins/code-syntax-highlighting-block

git clone https://github.com/hbgl/wp-code-syntax-highlighting-block.git .

docker-compose up

# Wordpress is now available at http://localhost:8426/
```

To build the project in watch-mode run `npm run start`. You should now be able to include the block "Code with Syntax Highlighting" after activating the plugin.

## FAQs

### Why no line numbers?

[Because highlight.js does not have them.](https://highlightjs.readthedocs.io/en/latest/line-numbers.html)

## TODOs

PRs and issues welcome.

- [ ] User-defined defaults for language and theme
- [ ] Better editor for writing the code (maybe [Monaco Editor](https://github.com/microsoft/monaco-editor)?)
- [ ] Custom themes
- [ ] Custom language definitions

## License

[MIT](https://opensource.org/license/MIT)
