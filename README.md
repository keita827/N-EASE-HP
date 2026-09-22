# N-EASE Corporate Site

Static, responsive corporate site for N-EASE. Open `dist/index.html` for a local preview.

## Content maintenance

- Hero image: `dist/assets/yamagata-dawn.jpg`
- Official logo: `dist/assets/n-ease-logo-transparent.png` (official supplied artwork with only its black canvas removed)
- Representative portrait: replace or extend the `.message-identity` aside in `dist/index.html` with a portrait figure; no empty photo placeholder is shown before an approved image is available.
- Case studies: duplicate the `article.case-editorial` structure and update the content. The `.case-system-visual` area can later be replaced by an approved system screenshot. Keep unverified metrics out of the page.
- Contact delivery: connect the `form[data-contact-form]` submit handler in `dist/main.js` to the selected backend before public launch.

## Pre-launch TODO

- Add confirmed address and contact details when available.
- Add an approved representative portrait when available.
- Add an approved case-study system screenshot when its publication scope is confirmed.
- Confirm and expand the privacy policy with the final operational contact.
- Connect the inquiry form backend and add spam protection.
- Update the canonical and OGP URLs if the site moves to a custom domain.
