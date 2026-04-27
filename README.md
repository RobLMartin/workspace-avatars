# workspace-avatars

Monorepo for [`workspace-avatars`](./packages/avatars) and its [docs site](./apps/docs).

## Structure

```
.
├── packages/
│   └── avatars/        # The publishable npm package
└── apps/
    └── docs/           # React Router 7 landing + docs (deployed to Vercel)
```

## Getting started

```bash
npm install
npm run dev           # runs the docs site, hot-reloading from the package
```

The docs site imports `workspace-avatars` as a workspace dep, so edits
to `packages/avatars/src` show up live in `apps/docs`.

## Building

```bash
npm run build:pkg     # build the npm package only
npm run build:docs    # build the docs site only
npm run build         # build everything
```

## Releasing the package

We use [changesets](https://github.com/changesets/changesets) for versioning.

```bash
# 1. Make changes in packages/avatars
# 2. Record the change
npm run changeset

# 3. Bump versions + write changelog
npm run version-packages

# 4. Build and publish to npm
npm run release
```

You'll need to be logged in to npm (`npm login`) and have publish rights to
the `workspace-avatars` package.

## Deploying the docs site

The `apps/docs` directory is a standard React Router 7 app. Connect the repo
to Vercel and set the root directory to `apps/docs` — the `@react-router/dev`
preset handles the rest.
