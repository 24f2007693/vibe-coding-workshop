````markdown
# Simple Image Gallery (Like / Dislike + CSV Export)

What this is
- A small client-side web app that displays an image gallery.
- Users can Like or Dislike each image.
- Votes are stored locally in the browser (localStorage).
- You can download a CSV summary that maps image name -> image link -> status (like/dislike/empty).

How to run
1. Save the files (index.html, styles.css, app.js) into a folder.
2. Open `index.html` in any modern browser (no server required).
3. Click the thumbs to Like or Dislike, then use "Download CSV Summary" to export results.

Customizing images
- Edit the `IMAGES` array in `app.js`. Each entry should be:
  - { name: 'My Image', link: 'https://example.com/my-image.jpg' }

CSV format
- Columns: image_name, image_link, status
- `status` is `like`, `dislike`, or empty if no vote.

Notes & next steps
- Votes are only stored in the local browser. If you want centralized storage and user accounts, add a backend (API + DB).
- For multiple users or persistent analytics, integrate with a server (example: Node/Express + SQLite/Postgres).
- You can change placeholder images (picsum.photos) to your hosted images or an images/ folder.

License
- Free to use and adapt.
````