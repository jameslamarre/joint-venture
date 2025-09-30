# Tiny Scripted - Spring 2025

[Next.js](https://nextjs.org) and [Sanity Studio](https://www.sanity.io/studio)
monorepo. Intended for deployment to [Vercel](https://vercel.com).

## Local development

Rename the `.env.example` file to `.env` and store the environment variables
that Next and Sanity will use to pull data from the Sanity API. You can get or
create the Sanity tokens, ids, and secrets from
[manage.sanity.io](https://manage.sanity.io).

Once those env variables are ready, you can run the following commands to get
Next's development server up and running:

```bash
# install dependencies
pnpm install:all

# run requisite generate and clean steps
# before running all apps simultaneously
pnpm run dev

# run next.js only
pnpm run dev:next

# run sanity studio only
pnpm run dev:sanity
```

The Next.js app will be running at `http://localhost:3000` and the Sanity Studio
CMS at `http://localhost:3333`.

### Installing and updating Sanity Studio dependencies

Updating Sanity Studio dependencies and installing new ones requires running the
respective Sanity CLI commands from the `studio` subdirectory:

```bash
# first cd into the studio subdirectory from the root project folder
cd studio

# use @sanity/cli command to upgrade dependencies
npx sanity upgrade ...

# or to install new dependencies
npx sanity install ...
```

## Deploying

There are two databases for the Sanity account, "dev" and "production." If there
are changes to the database on dev, and those are tied to codebase changes on
the frontend, the dev database will need to be imported to production when
pushing the code. _Note there will be some downtime or site weirdness because of
this_ The steps to do so:

- Open pull request for code changes
- Make sure the dev database has all content updates and is exactly what should
  be reflected on the live site
- Export production database FIRST as a backup _DON'T SKIP THIS, THIS IS THE
  BACKUP IN CASE THINGS GO WRONG_ `npx sanity dataset export production`
- Export the dev database, from /studio: `npx sanity dataset export dev`
- Import the dev database into production, from /studio:
  `npx sanity dataset import --replace production [FILENAME OF EXPORTED DATABASE]`
  - This effectively replaces the production database with dev
- Push the codebase live through pull request
