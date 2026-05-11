from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLICATIONS_CSV = ROOT / "data" / "publications" / "publications.csv"
AWARDS_CSV = ROOT / "data" / "awards" / "awards.csv"
PROFILE_CSV = ROOT / "data" / "profile" / "profile.csv"
LINKS_CSV = ROOT / "data" / "profile" / "links.csv"
EDUCATION_CSV = ROOT / "data" / "profile" / "education.csv"
EXPERIENCE_PROJECTS_CSV = ROOT / "data" / "profile" / "experience_projects.csv"
ACADEMIC_SERVICE_CSV = ROOT / "data" / "profile" / "academic_service.csv"
OUTPUT_JS = ROOT / "assets" / "site-data.js"

PUBLICATION_REQUIRED_FIELDS = [
    "id",
    "status",
    "articleType",
    "journalShort",
    "journalFull",
    "date",
    "title",
    "authors",
    "keywords",
    "abstract",
    "citation",
    "notes",
]

AWARD_REQUIRED_FIELDS = ["icon", "title", "detail", "issuer", "notes"]
KEY_VALUE_FIELDS = ["key", "value"]
LINK_FIELDS = ["key", "label", "url", "placement"]
EDUCATION_FIELDS = ["Degree", "Field / Major", "Institution", "Location", "Start", "End", "Status", "Notes"]
EXPERIENCE_PROJECT_FIELDS = ["Category", "Title / Role", "Institution / Funder", "Period", "Role", "Description"]
ACADEMIC_SERVICE_FIELDS = ["Type", "Role / Activity", "Venue / Organization", "Year", "Notes"]


def read_csv(path: Path, required_fields: list[str]) -> list[dict[str, str]]:
    if not path.exists():
        raise FileNotFoundError(f"Missing data file: {path}")

    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames is None:
            raise ValueError(f"{path} has no header row")

        missing = [field for field in required_fields if field not in reader.fieldnames]
        if missing:
            raise ValueError(f"{path} is missing columns: {', '.join(missing)}")

        rows: list[dict[str, str]] = []
        for line_number, row in enumerate(reader, start=2):
            normalized = {field: (row.get(field) or "").strip() for field in required_fields}
            if not any(normalized.values()):
                continue
            if not normalized[required_fields[0]]:
                raise ValueError(f"{path}:{line_number} is missing '{required_fields[0]}'")
            rows.append(normalized)

    return rows


def read_publications() -> list[dict[str, str | int]]:
    publications = []
    seen_ids: set[int] = set()
    for row in read_csv(PUBLICATIONS_CSV, PUBLICATION_REQUIRED_FIELDS):
        try:
            pub_id = int(row["id"])
        except ValueError as exc:
            raise ValueError(f"{PUBLICATIONS_CSV}: publication id must be an integer: {row['id']}") from exc

        if pub_id in seen_ids:
            raise ValueError(f"{PUBLICATIONS_CSV}: duplicate publication id: {pub_id}")
        seen_ids.add(pub_id)

        publications.append({"id": pub_id, **{key: row[key] for key in PUBLICATION_REQUIRED_FIELDS if key != "id"}})

    return sorted(publications, key=publication_sort_key)


def publication_sort_key(publication: dict[str, str | int]) -> tuple[int, int]:
    status = str(publication.get("status", "")).strip().lower()
    date = str(publication.get("date", ""))
    if status == "under review":
        year = 9999
    else:
        match = re.search(r"\b(19|20)\d{2}\b", date)
        year = int(match.group(0)) if match else 0
    pub_id = int(publication["id"])
    return (-year, pub_id)


def read_key_value(path: Path, key_field: str = "key", value_field: str = "value") -> dict[str, str]:
    return {row[key_field]: row[value_field] for row in read_csv(path, [key_field, value_field]) if row[key_field]}


def read_links() -> list[dict[str, str]]:
    return read_csv(LINKS_CSV, LINK_FIELDS)


def read_education() -> list[dict[str, str]]:
    return [
        {
            "degree": row["Degree"],
            "field": row["Field / Major"],
            "institution": row["Institution"],
            "location": row["Location"],
            "start": row["Start"],
            "end": row["End"],
            "status": row["Status"],
            "notes": row["Notes"],
        }
        for row in read_csv(EDUCATION_CSV, EDUCATION_FIELDS)
    ]


def read_experience_projects() -> list[dict[str, str]]:
    return [
        {
            "category": row["Category"],
            "title": row["Title / Role"],
            "institution": row["Institution / Funder"],
            "period": row["Period"],
            "role": row["Role"],
            "description": row["Description"],
        }
        for row in read_csv(EXPERIENCE_PROJECTS_CSV, EXPERIENCE_PROJECT_FIELDS)
    ]


def read_academic_service() -> list[dict[str, str]]:
    return [
        {
            "type": row["Type"],
            "activity": row["Role / Activity"],
            "venue": row["Venue / Organization"],
            "year": row["Year"],
            "notes": row["Notes"],
        }
        for row in read_csv(ACADEMIC_SERVICE_CSV, ACADEMIC_SERVICE_FIELDS)
    ]


def build_site_data() -> dict[str, object]:
    return {
        "profile": read_key_value(PROFILE_CSV),
        "links": read_links(),
        "education": read_education(),
        "publications": read_publications(),
        "awards": read_csv(AWARDS_CSV, AWARD_REQUIRED_FIELDS),
        "experienceProjects": read_experience_projects(),
        "academicService": read_academic_service(),
    }


def write_site_data(output_path: Path) -> None:
    data = build_site_data()
    serialized = json.dumps(data, ensure_ascii=False, indent=4)
    header = (
        "// This file is generated by scripts/build_site_data.py.\n"
        "// Edit CSV files under data/ and run update-site-data.ps1 instead.\n"
    )
    output_path.write_text(f"{header}window.siteData = {serialized};\n", encoding="utf-8")
    try:
        display_path = output_path.relative_to(ROOT)
    except ValueError:
        display_path = output_path
    print(f"Generated {display_path}")
    print(f"Profile: {data['profile'].get('fullName', '')}")
    print(f"Publications: {len(data['publications'])}")
    print(f"Awards: {len(data['awards'])}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build assets/site-data.js from CSV source data.")
    parser.add_argument("--output", type=Path, default=OUTPUT_JS, help="Output JS file path.")
    args = parser.parse_args()
    write_site_data(args.output if args.output.is_absolute() else ROOT / args.output)


if __name__ == "__main__":
    main()
