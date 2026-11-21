# Muhammad Mahad & Mrs. Mahad — Wedding Invitation

A responsive wedding invitation website with a warm ivory, champagne and antique gold theme.

## Folder structure

- `index.html` — page content and sections
- `style.css` — all layout, colors, responsive rules and animations
- `script.js` — invitation reveal, countdown, cursor glow, flowers, plane path, gallery, lanterns and optional music controls
- `assets/photo1.jpg` — supplied maroon wedding illustration
- `assets/photo2.jpg` — supplied ivory wedding illustration
- `assets/photo3.jpg` — supplied couple illustration
- `assets/phullaan-naal-sajjeya-jehda.mp4` — supplied wedding song video/audio

## Run locally

1. Keep the folder structure unchanged.
2. Open `index.html` in a modern browser.
3. For best results, serve the folder with any simple local static server.

## Edit the website

- Names, event text and dates are in `index.html`.
- Colors and fonts are defined near the top of `style.css` in `:root`.
- Replace the images in `assets/` while keeping the same filenames, or update the image paths in `index.html`.
- The countdown target is in `script.js` as `2026-12-27T20:00:00+05:30`.
- The floating music player uses the supplied local MP4 soundtrack in `assets/phullaan-naal-sajjeya-jehda.mp4`. It attempts audible autoplay on page load and retries on the visitor's first interaction; browsers may block sound autoplay until interaction.
- The calendar button downloads an .ics file with all three supplied celebrations. No venue or address is added because none was provided.
- The cursor glow is enabled on desktop pointers; touch screens receive a soft tap ripple instead.
- Reduced-motion preferences disable decorative motion.

## Details used

- Groom: Muhammad Mahad
- Bride: Mrs. Mahad
- Mehndi: 26 Dec 2026 · Saturday · 8:00 PM
- Barat: 27 Dec 2026 · Sunday · 8:00 PM
- Walima: 28 Dec 2026 · Monday · 7:30 PM
- Countdown: Barat, 27 December 2026 at 8:00 PM, using the brief's fixed +05:30 offset

Venue, address, map link, RSVP number, family names, and music track were not supplied, so they are not fabricated. The provided three couple illustrations are used as gallery and portrait artwork. The first reference image informs the palette and atmosphere only.


## Theme update
- The hero now uses the supplied mosque-arch reference image with a warm ivory and antique-gold treatment.
- The site-wide palette and decorative details are tuned to the reference image.
- The music player has a decorative record, animated sound bars, and a more prominent gold play control.
- The reference image is stored at `assets/mosque-arch.jpg`.


## Blooming wedding edition
- Brighter ivory, blush, rose-gold and champagne palette with soft luminous gradients.
- Increased lightweight floating blossom and petal effects, plus floral accents around headings and cards.
- Updated the floating music player with a rose-gold disc, soft glow and warmer visualizer accents.
- Existing sections, countdown, event calendar, gallery, cursor glow, lantern interaction and mobile layout are retained.


## Grand Bloom Edition
The latest visual pass adds a brighter pearl, blush, ruby and champagne palette, layered floral accents, CSS-drawn falling blossoms and rose petals, richer event cards, and an upgraded music player. All previous sections, supplied illustrations, countdown, calendar download, gallery lightbox, lantern interaction, and responsive layout are retained.


## Wedding song
- Track: **Phullaan Naal Sajjeya Jehda**
- Credits from the supplied filename: **Sunehra · Lost Stories Music · Jai Dhir**
- Source: MP4 supplied by the user; stored locally in `assets/` so the website does not depend on YouTube or a network connection for the song.
- Autoplay is attempted. Chrome, Safari and mobile browsers may block audible autoplay until a user gesture; the player then starts on the first interaction or when Play is tapped.
