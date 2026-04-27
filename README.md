# workspace-avatars

Monorepo for [`workspace-avatars`](./packages/avatars) and its [docs site](./apps/docs).

## Layout

```
.
├── packages/
│   └── avatars/        # The publishable npm package
└── apps/
    └── docs/           # React Router 7 landing + docs (deployed to Vercel)
```

## Getting started

```bash
pnpm install
pnpm dev              # runs the docs site, hot-reloading from the package
```

The docs site imports `workspace-avatars` as a workspace dep, so edits
to `packages/avatars/src` show up live in `apps/docs`.

## Building

```bash
pnpm build:pkg        # build the npm package only
pnpm build:docs       # build the docs site only
pnpm build            # build everything
```

## Releasing the package

We use [changesets](https://github.com/changesets/changesets) for versioning.

```bash
# 1. Make changes in packages/avatars
# 2. Record the change
pnpm changeset

# 3. Bump versions + write changelog
pnpm version-packages

# 4. Build and publish to npm
pnpm release
```

You'll need to be logged in to npm (`npm login`) and have publish rights to
the `@workspace` scope.

## Deploying the docs site

The `apps/docs` directory is a standard React Router 7 app. Connect the repo
to Vercel and set the root directory to `apps/docs` — the `@react-router/dev`
preset handles the rest.
