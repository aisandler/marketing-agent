#!/usr/bin/env python3
"""
Migrate CPL Deal Posts to separate Residential Deals and Commercial Deals tables.

Mapping:
- Practice Area = "Residential" → Residential Deals table
- Practice Area = "Commercial Banking" or "Commercial Leasing" → Commercial Deals table
- Attorney = "Lisa Gabler" with Deal Type = "Leasing" → Commercial Deals (Commercial Leasing)

Run with: python3 migrate-deal-posts.py [--dry-run]
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv
import pathlib

# Load environment variables from project root (override any existing)
project_root = pathlib.Path(__file__).parent.parent
load_dotenv(project_root / '.env', override=True)

AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE_ID = os.getenv('AIRTABLE_BASE_ID')

# Table IDs
OLD_TABLE_ID = 'tblrlUEPbkmBbwWd1'  # CPL Deal Posts (original)
RESIDENTIAL_TABLE_ID = 'tblYzy2Cn1c1ZHae2'  # Residential Deals (new)
COMMERCIAL_TABLE_ID = 'tbloEDxJjraYgWTHY'  # Commercial Deals (new)

BASE_URL = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}"

HEADERS = {
    "Authorization": f"Bearer {AIRTABLE_API_KEY}",
    "Content-Type": "application/json"
}

# Property type mapping (old → new)
RESIDENTIAL_PROPERTY_MAP = {
    "Residential": "Single Family",  # Generic residential
    "Co-op": "Co-op",
    "Condo": "Condo",
    "Townhouse": "Townhouse",
    "Multi-family": "Multi-family",
}

COMMERCIAL_PROPERTY_MAP = {
    "Retail": "Retail",
    "Office": "Office",
    "Industrial": "Industrial",
    "Mixed-Use": "Mixed-Use",
    "Hotel": "Hotel",
    "Multifamily": "Multifamily",
    "Commercial": "Office",  # Map generic "Commercial" to Office
    "Medical": "Medical",
}


def get_all_records(table_id):
    """Fetch all records from a table."""
    records = []
    offset = None

    while True:
        params = {"pageSize": 100}
        if offset:
            params["offset"] = offset

        response = requests.get(f"{BASE_URL}/{table_id}", headers=HEADERS, params=params)
        data = response.json()

        if "error" in data:
            print(f"Error fetching records: {data['error']}")
            sys.exit(1)

        records.extend(data.get("records", []))
        offset = data.get("offset")

        if not offset:
            break

    return records


def determine_target_table(record):
    """Determine which table a record should go to."""
    fields = record.get("fields", {})
    practice_area = fields.get("Practice Area", "")
    attorney = fields.get("Attorney", "")
    deal_type = fields.get("Deal Type", "")

    if practice_area == "Residential":
        return "residential"
    elif practice_area in ("Commercial Banking", "Commercial Leasing"):
        return "commercial"
    elif attorney == "Lisa Gabler" and deal_type == "Leasing":
        return "commercial"  # Infer commercial leasing
    elif attorney == "Lisa Gabler":
        return "commercial"  # Lisa is commercial-focused
    else:
        # Default to commercial if unclear (most deals are banking)
        return "commercial"


def map_to_residential(fields):
    """Map fields from old schema to Residential Deals schema."""
    property_type = fields.get("Property Type", "")
    mapped_property = RESIDENTIAL_PROPERTY_MAP.get(property_type, "Single Family")

    return {
        "Deal Description": fields.get("Deal Description", ""),
        "Deal Type": fields.get("Deal Type"),
        "Deal Value": fields.get("Deal Value"),
        "Property Type": mapped_property,
        "Location": fields.get("Location", ""),
        "Attorney": fields.get("Attorney"),
        "Client Represented": fields.get("Client Represented"),
        "Post Status": map_post_status(fields.get("Post Status")),
        "Post Copy": fields.get("Post Copy", ""),
        "Notes": fields.get("Notes", ""),
    }


def map_to_commercial(fields):
    """Map fields from old schema to Commercial Deals schema."""
    property_type = fields.get("Property Type", "")
    mapped_property = COMMERCIAL_PROPERTY_MAP.get(property_type, "Mixed-Use")

    practice_area = fields.get("Practice Area", "")
    if not practice_area and fields.get("Deal Type") == "Leasing":
        practice_area = "Commercial Leasing"
    elif not practice_area:
        practice_area = "Commercial Banking"

    # Map deal value to tier
    deal_value = fields.get("Deal Value", 0) or 0
    if deal_value >= 5000000:
        deal_tier = "Enterprise ($5M+)"
    elif deal_value >= 1000000:
        deal_tier = "Standard ($1-5M)"
    else:
        deal_tier = "Grassroots (<$1M)"

    return {
        "Deal Description": fields.get("Deal Description", ""),
        "Deal Type": fields.get("Deal Type"),
        "Deal Value": fields.get("Deal Value"),
        "Property Type": mapped_property,
        "Location": fields.get("Location", ""),
        "Practice Area": practice_area,
        "Attorney": fields.get("Attorney"),
        "Client Represented": fields.get("Client Represented"),
        "Deal Tier": deal_tier,
        "Post Status": map_post_status(fields.get("Post Status")),
        "Post Copy": fields.get("Post Copy", ""),
        "Notes": fields.get("Notes", ""),
    }


def map_post_status(old_status):
    """Map old post status to new workflow status."""
    status_map = {
        "Raw Info": "Raw Info",
        "Draft": "Draft",
        "Ready for Review": "Draft",
        "Approved": "Ready for Calendar",
        "Posted": "Posted",
    }
    return status_map.get(old_status, "Draft")


def create_record(table_id, fields, dry_run=False):
    """Create a record in the target table."""
    # Remove None values
    clean_fields = {k: v for k, v in fields.items() if v is not None and v != ""}

    if dry_run:
        return {"id": "dry_run", "fields": clean_fields}

    response = requests.post(
        f"{BASE_URL}/{table_id}",
        headers=HEADERS,
        json={"fields": clean_fields}
    )

    result = response.json()
    if "error" in result:
        print(f"  Error creating record: {result['error']}")
        return None

    return result


def main():
    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("=== DRY RUN MODE - No changes will be made ===\n")

    print("Fetching records from CPL Deal Posts...")
    records = get_all_records(OLD_TABLE_ID)
    print(f"Found {len(records)} records\n")

    residential_count = 0
    commercial_count = 0
    errors = []

    for record in records:
        fields = record.get("fields", {})
        description = fields.get("Deal Description", "?")[:50]
        target = determine_target_table(record)

        if target == "residential":
            mapped = map_to_residential(fields)
            table_id = RESIDENTIAL_TABLE_ID
            table_name = "Residential Deals"
            residential_count += 1
        else:
            mapped = map_to_commercial(fields)
            table_id = COMMERCIAL_TABLE_ID
            table_name = "Commercial Deals"
            commercial_count += 1

        print(f"  → {table_name}: {description}...")

        if dry_run:
            print(f"    Would create with: {list(mapped.keys())}")
        else:
            result = create_record(table_id, mapped)
            if result:
                print(f"    Created: {result.get('id', '?')}")
            else:
                errors.append(description)

    print(f"\n{'=' * 50}")
    print(f"Migration complete:")
    print(f"  Residential Deals: {residential_count}")
    print(f"  Commercial Deals: {commercial_count}")
    if errors:
        print(f"  Errors: {len(errors)}")
        for e in errors:
            print(f"    - {e}")

    if dry_run:
        print("\n=== DRY RUN COMPLETE - Run without --dry-run to apply changes ===")


if __name__ == "__main__":
    main()
