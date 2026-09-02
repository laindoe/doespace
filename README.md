# DoeSpace

The personal blog and artistry space of Lain Doe, built as a traditional
MySpace-style profile.

- **Live site:** https://laindoe.github.io/doespace/
- **Stack:** Jekyll + plain HTML/CSS, GitHub Pages, GitHub Actions, Pages CMS
- **Phase:** 1 — structure and publishing only. Backgrounds, borders, GIFs,
  the blingy, the working music player, and comments come later.

---

## How the project is organized

```
.
├── _config.yml                 Site settings (url, baseurl, permalinks)
├── .pages.yml                  Pages CMS configuration
├── Gemfile / Gemfile.lock      Ruby dependencies
├── index.html                  The profile page (two-column MySpace layout)
├── blog/index.html             Blog archive at /blog/
├── _layouts/
│   ├── default.html            Page shell: header, nav, footer
│   └── post.html               Single blog story
├── _includes/                  One file per profile module
│   ├── profile.html            Left column 1
│   ├── contact.html            Left column 2
│   ├── media-player.html       Left column 3
│   ├── interests.html          Left column 4
│   ├── details.html            Left column 5
│   ├── schools.html            Left column 6
│   ├── funemployed.html        Right column 1
│   ├── latest-posts.html       Right column 2
│   ├── about-me.html           Right column 3
│   ├── friends.html            Right column 4
│   └── comments.html           Right column 5
├── _data/
│   ├── profile.yml             Name, quote, age, location, status, About Me
│   └── modules.yml             Filler text for interests/details/schools,
│                               contact links, player, friend cards
├── _posts/                     Blog stories, one Markdown file each
├── assets/css/style.css        The entire stylesheet
├── assets/images/blog/         Images uploaded with blog stories
├── assets/images/placeholders/ Grey placeholder SVGs (swap these out later)
└── .github/workflows/deploy.yml  Build and deploy to GitHub Pages
```

### Layout rules

- **Desktop:** two columns — a narrow 300px left column and a wider right
  column, inside an 800px maximum page width.
- **Mobile (700px and below):** one column. The left column stacks first, so
  the order is Profile → Contact → Media Player → Interests → Details →
  Schools → Funemployed → Latest Blog Entries → About Me → Friends →
  Friends Comments.

To reorder or remove a module, edit the `{% include %}` lines in `index.html`.

---

## How to run Jekyll locally

Requires Ruby 3.x.

```bash
bundle install
bundle exec jekyll serve
```

Then open **http://localhost:4000/doespace/** — note the `/doespace/` path,
which mirrors the live project-page URL.

To reproduce exactly what CI builds:

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

The output lands in `_site/` (not committed).

---

## How to connect the repository to Pages CMS

Do this once:

1. Go to <https://app.pagescms.org> and click **Sign in with GitHub**.
2. Authorize the Pages CMS GitHub App.
3. When asked which repositories it may access, grant access to
   **laindoe/doespace** (either "All repositories" or "Only select
   repositories" with `doespace` ticked).
4. Back in Pages CMS, open the **doespace** repository and choose the **main**
   branch.
5. Pages CMS reads `.pages.yml` from the branch and shows two editing areas:
   **Blog Stories** and **Profile Details**.

Every save in Pages CMS is a commit to `main`, which triggers the deploy
workflow, so edits go live on their own.

---

## How to publish a story with Pages CMS

1. Open the **doespace** repository in Pages CMS, then the **Blog Stories**
   collection.
2. Click **Add an entry** and fill in the fields:

   | Field | What it does |
   |---|---|
   | Story Title | The headline, and the slug in the URL |
   | Publication Date | Sets the post date and the filename prefix |
   | Published | Turn **off** to keep the story off the live site |
   | Feature on Profile | Pins the story to the top of the profile blog module |
   | Thumbnail | Image shown beside the story in the blog lists |
   | Short Description | The excerpt shown on the profile and archive |
   | Categories | Optional tags |
   | Story Body | The story itself |

3. Click **Save**. Pages CMS commits a Markdown file to `_posts/` named
   `YYYY-MM-DD-story-title.md`, GitHub Actions rebuilds the site, and the
   story appears on the profile and at `/blog/` within a minute or two.

The profile module shows **four** stories: any marked *Feature on Profile*
first, then the newest remaining ones. Change the count with
`latest_posts_count` in `_config.yml`.

Stories with **Published** turned off are excluded from the build entirely —
no page is generated and they appear nowhere on the live site.

### Editing profile details

Open the **Profile Details** entry in Pages CMS to edit the display name,
quote, age, location, online status, Homeostasis link, and About Me text.
Those values are stored in `_data/profile.yml`.

The filler text for Lain's Interests, Details, and Schools, plus the contact
links, media-player track, and friend cards, lives in `_data/modules.yml` and
is edited directly in the repository.

---

## Where blog images are stored

`assets/images/blog/`

Anything uploaded through Pages CMS while editing a story is committed there,
and referenced in the post front matter as
`/assets/images/blog/your-file.jpg`.

The grey placeholder graphics in `assets/images/placeholders/` are plain SVG
files. Replace them (or point the front matter and `_data/*.yml` elsewhere)
when the real artwork is ready.

> All links and images use Jekyll's `relative_url` filter so they resolve
> correctly beneath the `/doespace` base path. When adding new links, write
> them as `{{ '/some/path' | relative_url }}` rather than hardcoding `/`.

---

## How to enable GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
   (Do *not* choose "Deploy from a branch" — this repo deploys via a workflow.)
   This switch has to be flipped by hand once — the workflow token is not
   allowed to turn Pages on by itself, and until it is set the **Setup Pages**
   step fails with *"Get Pages site failed"*.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the
   site with Jekyll and publishes it. To publish without a new commit — for
   example right after step 2 — open the **Actions** tab, pick
   **Build and deploy DoeSpace to GitHub Pages**, and click **Run workflow**.
4. The site appears at <https://laindoe.github.io/doespace/>.

If the repository is ever renamed or moved to a user page, update `url` and
`baseurl` in `_config.yml` to match.
