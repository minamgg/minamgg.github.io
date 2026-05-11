# Min Wu Personal Homepage

This repository contains the static personal academic homepage for Min Wu. It is designed for GitHub Pages and can be hosted directly from the repository root.

## Live Site

After GitHub Pages is enabled, the site should be available at:

```text
https://minamgg.github.io/
```

## Project Structure

```text
.
├── index.html                 # Main page layout and styles
├── assets/
│   ├── main.js                # Rendering, carousel controls, modals, and interactions
│   ├── site-data.js           # Generated website data; do not edit manually
│   └── avatar.png             # Profile image
├── data/
│   ├── profile/               # Profile, links, education, projects, service
│   ├── publications/          # Publication records
│   └── awards/                # Award records
├── scripts/
│   └── build_site_data.py     # CSV-to-JS data generator
├── update-site-data.ps1       # Convenience update script for Windows
├── LICENSE                    # MIT License
└── README.md
```

## Local Preview

Open `index.html` directly in a browser, or run a local static server from the repository root:

```powershell
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

## Maintenance Workflow

Most homepage content is maintained through CSV files under `data/`. After editing any CSV file, regenerate `assets/site-data.js`:

```powershell
.\update-site-data.ps1
```

Then refresh the browser.

## Common Content Edits

- Basic profile information: `data/profile/profile.csv`
- Contact and academic links: `data/profile/links.csv`
- Education records: `data/profile/education.csv`
- Academic appointments and funded projects: `data/profile/experience_projects.csv`
- Academic service: `data/profile/academic_service.csv`
- Publications, working papers, and theses: `data/publications/publications.csv`
- Awards and honors: `data/awards/awards.csv`

Do not edit `assets/site-data.js` directly because it is generated from the CSV files.

## How To Add New Content

Add new records by appending rows to the relevant CSV file. Keep the existing header row unchanged.

- New publication: add one row to `data/publications/publications.csv`. Use a new numeric `id`; fill `status`, journal fields, title, authors, keywords, abstract, citation, and notes where available.
- New funded project or appointment: add one row to `data/profile/experience_projects.csv`. Use `Category` values such as `Funded Project` or `Work Experience`.
- New academic service item: add one row to `data/profile/academic_service.csv`.
- New education record: add one row to `data/profile/education.csv`.
- New award or honor: add one row to `data/awards/awards.csv`.
- New contact or profile link: add one row to `data/profile/links.csv`. Use `placement` values such as `profile`, `footer`, or `footer,nav`.
- Profile text changes: edit the relevant key in `data/profile/profile.csv`.

After editing any CSV file, regenerate the website data:

```powershell
.\update-site-data.ps1
```

Then preview locally:

```powershell
python -m http.server 8000
```

Open `http://127.0.0.1:8000/` and refresh the page. Commit both the CSV changes and the regenerated `assets/site-data.js`.

## Visual and Interaction Edits

- Page layout, CSS, and modal markup live in `index.html`.
- Dynamic rendering and interactions live in `assets/main.js`.
- Publication cards and project cards are rendered from `assets/site-data.js` at page load.
- Funded project cards open a detail modal; long descriptions should stay in `data/profile/experience_projects.csv` rather than being placed directly on cards.

## Updating Images

Replace image files in `assets/` while keeping the same file names when possible. If the file name changes, update the corresponding CSV field or profile setting, then run:

```powershell
.\update-site-data.ps1
```

## GitHub Pages Setup

In the GitHub repository settings:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

Because this is a static site, no build command is required.

## License

This project is released under the MIT License. See `LICENSE` for details.
