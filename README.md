# Pranavi's Farm 🌱

A cozy pixel-farm portfolio for **Pranavi Paudel**, Mechanical & Biomedical Engineer.
Live at **https://pranavi.com.np**. Walk around the farm, step into buildings, and find all 10 golden acorns.

| Place on the farm | Section | What happens |
|---|---|---|
| Farmhouse | About me | Bio, quick facts, "fireside chat" Q&As |
| Barn | Projects | Every project is a crate; DrainWatch is featured |
| Cart + pony | Experience | Drive a pony cart through the seasons, stopping at every job and lab |
| Telescope hill | Skills | The farm goes dark and skills become clickable constellations |
| Fair booth | Certifications | Prize ribbons, with links to view and verify each certificate |
| Greenhouse | Hobbies | Tap a pot and the plant blooms into a hobby |
| Noticeboard | Résumé | Download links, education, leadership, highlights |
| Mailbox | Contact | Write a note and a carrier pigeon flies it off (opens the email app) |
| Hidden everywhere | 10 golden acorns | Find them all to earn the Golden Acorn Pass (a coffee-chat invite) |

Busy recruiters can skip the game with the **Quick view** button (or link straight to `https://pranavi.com.np/#quick`).
All art is drawn in code, and all sounds and music are generated in the browser.

## Editing the content

Almost everything people read is in **`content.js`**: bio, experience, projects, skills (levels 1–5), certifications, hobbies, leadership and links. Edit the text between the quotes and keep the commas. Images and PDFs are referenced by file name and live next to `index.html`.

- **Booking link:** paste a Calendly (or similar) link into `bookingLink` and the Golden Acorn Pass will use it. Otherwise it opens an email.
- **Résumés:** replace `PranaviPaudel_Resume_mbe.pdf` / `PranaviPaudel_Resume_me.pdf` with new versions using the same file names.

## Hosting

GitHub Pages (branch `main`, root folder) with the custom domain `pranavi.com.np` (see `CNAME`). DNS is on Cloudflare: four `A` records for `@` (185.199.108.153 – 185.199.111.153) and a `CNAME` for `www` → `pranavipaudel.github.io`, all "DNS only".

## Files

All files sit in the top-level folder.

```
index.html               the farm (title screen, world, HUD)
drainwatch_final.html    full DrainWatch write-up
Pranavi.html             old profile link, forwards to the quick view
farm.css, fonts.css      styles + self-hosted fonts (Pixelify Sans, Nunito; SIL Open Font License)
content.js               ← all the text and links
sprites.js               pixel art, drawn in code
world.js                 the walkable farm, seasons, day/night
panels.js                building interiors, quick view, golden pass
road.js                  experience cart game
sky.js                   night-sky skills
pigeon.js                carrier-pigeon contact form
audio.js                 synthesized sound effects + music
util.js, title.js, main.js   helpers, title screen, HUD, menu, acorns, routing
```

**Handy links:** `#about`, `#projects`, `#projects/drainwatch`, `#experience`, `#experience/parker`, `#skills`, `#certs`, `#hobbies`, `#resume`, `#contact`, `#quick`.

**Controls:** click/tap to walk, or WASD/arrow keys · E/Space/Enter to go inside · 1–8 jump to sections · M toggles sound · Q quick view · J acorn journal.
