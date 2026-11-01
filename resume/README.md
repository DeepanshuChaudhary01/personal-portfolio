# Resume

Whatever PDF sits directly in this folder is the resume the site publishes:

- **/resume.pdf** serves it (visitors always download it as `Deepanshu-Chaudhary-Resume.pdf`).
- **/resume** shows it on the page.
- The ticket on the home page reads its page count, paper size and date from the file.

To update it, replace the PDF here, then redeploy. In `npm run dev`, a browser refresh is enough.

Keep one PDF here. If there are several, the site uses the newest, judged by the date stored inside
the PDF when it was exported (then by file time).

## Keeping private details out

This file is public. Employer names, internal figures and your phone number must stay out of it.

- **`private/`** is git-ignored and never published. Keep the full version of your resume there.
- **`private/blocklist.txt`** lists terms that must never be published. Before every build,
  `scripts/check-resume.mjs` reads the PDFs here and stops the build if one contains a listed term or
  a phone number. Run it any time with `npm run check:resume`.
- **On Vercel**, the `private/` folder doesn't exist, so add the same terms as an environment variable
  named `RESUME_BLOCKLIST`, with the terms separated by `|` (not commas: a term like `30,000` contains one).
  Without it, only phone numbers are checked there.
