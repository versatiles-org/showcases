# Contributing

## Add your project

If you use VersaTiles in a public project, we'd love to feature it.

1. Open [`showcases.yaml`](showcases.yaml) and append a new entry:

   ```yaml
   - title: 'Your Project'
     url: 'https://example.org'
     source: 'Your Org'
     country: 'Germany'
     description: 'One sentence about what the project shows'
     image: your-project-slug.png # also accepts .jpg, .jpeg, .webp
     tags:
       - commercial # who made it: journalism, independent, commercial, research, events
       - interactive-map
       # - any other tags already used by other entries
   ```

   Every tag has to be used by at least one other entry — the build rejects one-offs, which
   are almost always typos.

2. Drop a screenshot at `screenshots/your-project-slug.png` (PNG, 16:9, < 1 MB, it's auto-resized to 800×450 during build).

3. Increase the project count in [`README.md`](README.md) by one. The build checks that it matches.

4. Open a pull request.

That's it — no code changes needed.

## Report a problem

Open an [issue](https://github.com/versatiles-org/showcases/issues) for a wrong or outdated entry, or a bug in the gallery. For VersaTiles itself, pick the right repository under [github.com/versatiles-org](https://github.com/versatiles-org).
