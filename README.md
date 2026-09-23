# N-EASE Corporate Site

Static, responsive corporate site for N-EASE. Open `dist/index.html` for a local preview.

## Content maintenance

- Hero image: `dist/assets/yamagata-dawn.jpg`
- About image: `dist/assets/about-natural-light.jpg`
- Official logo: `dist/assets/n-ease-logo-transparent.png` (official supplied artwork with only its black canvas removed)
- Brand intro: CSS keyframes in `dist/styles.css` with minimal lifecycle handling in `dist/main.js`. It plays once per browser session using the `neaseIntroPlayed` session-storage key and is skipped for reduced-motion users.
- Case studies: duplicate the `article.case-card` structure and update its text. Keep the homepage cases text-led and leave unverified metrics, client names, and system screenshots out.
- Contact delivery: connect the `form[data-contact-form]` submit handler in `dist/main.js` to the selected backend before public launch.

## Pre-launch TODO

- Add confirmed address and contact details when available.
- Confirm and expand the privacy policy with the final operational contact.
- Connect the inquiry form backend and add spam protection.
- Update the canonical and OGP URLs if the site moves to a custom domain.
