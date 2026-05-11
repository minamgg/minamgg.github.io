# Site Data

Maintain homepage content in these CSV files:

- `profile/profile.csv`
- `profile/links.csv`
- `profile/education.csv`
- `profile/experience_projects.csv`
- `profile/academic_service.csv`
- `publications/publications.csv`
- `awards/awards.csv`

After editing a CSV file, run this from the repository root:

```powershell
.\update-site-data.ps1
```

The command regenerates `assets/site-data.js`, which is the file loaded by `index.html`.

Do not edit `assets/site-data.js` directly unless you are deliberately bypassing the table workflow.

## Adding Rows

Append new content to the relevant CSV file and keep the header row unchanged:

- Publications: `publications/publications.csv`
- Funded projects and appointments: `profile/experience_projects.csv`
- Academic service: `profile/academic_service.csv`
- Education: `profile/education.csv`
- Awards: `awards/awards.csv`
- Contact/profile links: `profile/links.csv`
- Profile text: `profile/profile.csv`

After editing, run `.\update-site-data.ps1` from the repository root and commit both the CSV edits and regenerated `assets/site-data.js`.
