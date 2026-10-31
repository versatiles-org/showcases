[![CI status](https://img.shields.io/github/actions/workflow/status/versatiles-org/showcases/ci.yml)](https://github.com/versatiles-org/showcases/actions/workflows/ci.yml)

# VersaTiles Showcases

A gallery of [119 projects using VersaTiles](https://versatiles.org/showcases/) that we are aware of, ranging from journalism and transit trackers to commercial platforms and research tools.

Using VersaTiles in a public project? See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add it.

## Development

Requires Node.js 22 or later.

```bash
npm install
npm run dev     # dev server at http://localhost:5173/showcases/
npm run check   # format, lint, types and a full build into dist/
```

- `showcases.yaml` holds the entries and `screenshots/` their images, resized to 800×450 WebP during the build.
- `index.html` is generated from the versatiles.org page template by `npm run build:html`, which CI runs before each deployment.
- `npm run build` prerenders the gallery into the page, so it can be read without JavaScript.

The gallery previously lived in [versatiles-documentation](https://github.com/versatiles-org/versatiles-documentation), so issue and pull request numbers in older commit messages refer to that repository.
