# Code syntax highlighting for Wordpess

A Wordpress plugin that provides a Gutenberg block for displaying computer source code with syntax-highlighting. Uses [highlight.js](https://highlightjs.org/) under the hood.

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

```bash
mkdir code-syntax-highlighting-block-docker # root dir for Wordpress docker files
cd code-syntax-highlighting-block-docker

mkdir -p html/wp-content/plugins/code-syntax-highlighting-block
cd html/wp-content/plugins/code-syntax-highlighting-block

git clone https://github.com/hbgl/wp-code-syntax-highlighting-block.git .

docker-compose up
```

Installing dependencies:

```bash
npm ci
```

Build project and start watcher:

```bash
npm run start
```

The Wordpress application is available at [http://localhost:8426/](http://localhost:8426/).

You should now be able to use the block "Code with Syntax Highlighting" in the Gutenberg editor after activating the plugin.

## Building plugin ZIP for production

```bash
npm run plugin-zip
```

## Debugging PHP

The included Wordpress dockerfile comes with xdebug installed and activated. It runs in debug mode and can be started with the [default trigger](https://xdebug.org/docs/all_settings#trigger_value).

Example launch.json for Visual Studio Code:

```json
{
    "configurations": [
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "request": "launch",
            "port": 9003,
            "pathMappings": {
                "/var/www/html": "${workspaceFolder}/../../.."
            }
        }
    ]
}
```

## Connect to MySQL database

The docker MySQL database instance is exposed on the host port 8427.

```bash
mysql -h 127.0.0.1 -P 8427 -u root -proot
```

## FAQs

### Why no line numbers?

[Because highlight.js does not have them.](https://highlightjs.readthedocs.io/en/latest/line-numbers.html)

## TODOs

PRs and issues welcome.

- [ ] Live preview of theme in editor. Would currently require a bridge between Codemirror and Highlight.js.
- [ ] Custom themes.
- [ ] Custom language definitions.

## License

[MIT](https://opensource.org/license/MIT)
