# Department print headers

Upload each department's official print header as a PNG in this folder. Use the
filename matching the department slug below; the application uses a generic
college/department heading until a matching image is present.

For this project, paste the PNG files directly into
`frontend/public/department-headers/` (alongside this README). PDF export
automatically selects the image using the signed-in user's department. No code
change is needed when adding a header for one of the listed departments.

- `computer-engineering.png`
- `information-technology.png`
- `artificial-intelligence-data-science.png`
- `artificial-intelligence-machine-learning.png`
- `computer-science-engineering-iot.png`
- `electronics-computer-science.png`
- `electronics-telecommunication.png`

Keep the image wide (roughly 1200 × 180 px) with a transparent or white
background. These files are served by Vite/Vercel from `/department-headers/`.
