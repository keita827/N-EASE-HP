# N-EASE Corporate Site

Static, responsive corporate site for N-EASE. Open `dist/index.html` for a local preview.

## Content maintenance

- Hero image: `dist/assets/yamagata-dawn.jpg`
- Official logo: `dist/assets/n-ease-logo-cropped.png`
- Representative portrait: replace the `.portrait-placeholder` block in `dist/index.html` with an image using the same class or add a dedicated image class.
- Case studies: duplicate the `article.case-flow` structure and update the content. Keep unverified metrics out of the page.
- Contact delivery: connect the `form[data-contact-form]` submit handler in `dist/main.js` to the selected backend before public launch.

## Pre-launch TODO

- Add confirmed address and contact details when available.
- Replace the portrait placeholder.
- Confirm and expand the privacy policy with the final operational contact.
- Connect the inquiry form backend and add spam protection.
- Update the canonical and OGP URLs if the site moves to a custom domain.
