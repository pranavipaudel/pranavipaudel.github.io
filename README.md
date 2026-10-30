# Pranavi's Farm 🌱

A cozy pixel-farm portfolio for **Pranavi Paudel**, Mechanical & Biomedical Engineer.
Walk around the farm, step into buildings, and find all 10 golden acorns.

| Place on the farm | Section | What happens |
|---|---|---|
| Farmhouse | About me | Bio, quick facts, "fireside chat" Q&As |
| Barn | Projects | Every project is a crate; DrainWatch is featured |
| The road + cart | Experience | Drive a pony cart through the seasons, stopping at every job and lab |
| Telescope hill | Skills | The farm goes dark and skills become clickable constellations |
| Fair booth | Certifications | Prize ribbons, with links to view and verify each certificate |
| Greenhouse | Hobbies | Tap a pot and the plant blooms into a hobby |
| Noticeboard | Résumé | Download links, education, leadership, highlights |
| Mailbox | Contact | Write a note and a carrier pigeon flies it off (opens the email app) |
| Hidden everywhere | 10 golden acorns | Find them all to earn the Golden Acorn Pass (a coffee-chat invite) |

Busy recruiters can skip the game with the **Quick view** button (or link straight to `index.html#quick`).
All art is drawn in code, and all sounds and music are generated in the browser. There are no game assets to host.

---

## Put it online with GitHub Pages (free, no domain needed)

1. Create a new repository on GitHub. Name it **`<your-username>.github.io`** if you want the site at the root, or anything else (e.g. `portfolio`).
2. Click **Add file → Upload files**, then drag in **everything in this folder** (including the `css`, `js` and `fonts` folders). Commit.
3. Go to **Settings → Pages**. Under "Build and deployment", pick **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/` (or `https://<your-username>.github.io/portfolio/`).

### When you buy a new domain

1. In the repo, add a file named `CNAME` (no extension) containing just your domain, e.g. `pranavipaudel.com`.
2. At your domain registrar, add DNS records:
   - `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - a `CNAME` record for `www` pointing to `<your-username>.github.io`
3. Back in **Settings → Pages**, enter the domain and tick **Enforce HTTPS** once it's available.
4. Update the portfolio link on your résumés, and the QR code on the DrainWatch poster if the domain changes (it currently points to `pranavipaudel.xyz/drainwatch_final.html`).

> ⚠️ Don't upload the old `CNAME` file (with `pranavipaudel.xyz`) while that domain is expired. GitHub would try to send visitors to the dead domain.

---

## Editing the content

Almost everything people read is in **`js/content.js`**: bio, experience, projects, skills (with levels 1–5), certifications, hobbies, leadership and links. Edit the text between the quotes and keep the commas. Images are referenced by file name, so put new images in the root folder.

Things worth a look:

- **Hobbies (greenhouse):** pulled from things you mentioned (LEGO and board games with your Parker manager, 3D printing, tinkering, tutoring, Nepal, your candy tray). Change them to whatever you like. Plant types: `tulip, daisy, sun, fern, lily, rhodo, clover`.
- **Skill levels:** levels for SolidWorks, CFD, wet-lab skills, etc. come from your old site. Levels for skills that weren't on it (Kaizen/5S, PLC/HMI, DFM, qRT-PCR, Instron) are my estimates. Adjust them.
- **Booking link:** paste a Calendly (or similar) link into `bookingLink` and the Golden Acorn Pass will use it. Otherwise it opens an email.
- **Résumés:** `PranaviPaudel_Resume_mbe.pdf` and `PranaviPaudel_Resume_me.pdf` are publicly downloadable, including your phone number. Swap them for versions without it if you prefer.
- **Social preview image:** once you have a domain, change `og:image` in `index.html` to the full URL (e.g. `https://yourdomain.com/pranu.JPEG`) so link previews show your photo.

## Keep these private (don't upload them)

A GitHub Pages repo is public, so anything in it can be downloaded by anyone. Leave these out:

- the Neuralink cover letter, `New co-op qns`, `Experiences.docx`, and `List of all the stuffs done`
- `DrainWatch_Final_Report.pdf` (the site keeps the "request access by email" flow, because the report names your teammates and includes a nurse's personal medical history)

## Files

```
index.html               the farm (title screen, world, HUD)
drainwatch_final.html    full DrainWatch write-up, restyled to match (same URL as before)
Pranavi.html             old profile link, now forwards to the quick view
css/farm.css, fonts.css  styles + self-hosted fonts (Pixelify Sans, Nunito; SIL Open Font License)
js/content.js            ← all the text and links
js/sprites.js            pixel art, drawn in code
js/world.js              the walkable farm, seasons, day/night
js/panels.js             building interiors, quick view, golden pass
js/road.js               experience cart game
js/sky.js                night-sky skills
js/pigeon.js             carrier-pigeon contact form
js/audio.js              synthesized sound effects + music
js/title.js, main.js     title screen, HUD, menu, acorns, routing
```

**Handy links:** `#about`, `#projects`, `#projects/drainwatch`, `#experience`, `#experience/parker`, `#skills`, `#certs`, `#hobbies`, `#resume`, `#contact`, `#quick`.

**Controls:** click/tap to walk, or WASD/arrow keys · E/Space/Enter to go inside · 1–8 jump to sections · M toggles sound · Q quick view · J acorn journal.
