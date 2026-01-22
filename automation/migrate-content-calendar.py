#!/usr/bin/env python3
"""
CPL Content Calendar Migration Script

This script migrates existing records to the new schema:
1. Populates "Posting Account" from "Who to Post" (maps person -> account)
2. Populates "Platform" from "Channels" (takes first value)
3. Sets "Post Type" to "Original" by default
4. Sets "Queue Position" to 1 by default

Run with: python3 migrate-content-calendar.py [--dry-run]
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables from project root (override any existing)
import pathlib
project_root = pathlib.Path(__file__).parent.parent
load_dotenv(project_root / '.env', override=True)

AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE_ID = os.getenv('AIRTABLE_BASE_ID')
TABLE_ID = 'tblasltP6iiMKW7Mg'  # CPL Content Calendar

BASE_URL = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{TABLE_ID}"

HEADERS = {
    "Authorization": f"Bearer {AIRTABLE_API_KEY}",
    "Content-Type": "application/json"
}

# Mapping from "Who to Post" values to "Posting Account" values
WHO_TO_ACCOUNT_MAP = {
    "Andrew": "Andrew LinkedIn",
    "Alan": "Alan LinkedIn",
    "Michael Carlos": "Michael Carlos LinkedIn",
    "Alex": "Alan LinkedIn",  # Alex maps to Alan's approval workflow for now
    "Lisa Gabler": "Lisa LinkedIn",
    "CPL": "CPL LinkedIn",
}

# Platform mapping (handles case variations)
PLATFORM_MAP = {
    "LinkedIn": "LinkedIn",
    "Instagram": "Instagram",
    "Facebook": "Facebook",
    "TikTok": "TikTok",
    "X": "X",
}


def get_all_records():
    """Fetch all records from the Content Calendar table."""
    records = []
    offset = None

    while True:
        params = {"pageSize": 100}
        if offset:
            params["offset"] = offset

        response = requests.get(BASE_URL, headers=HEADERS, params=params)
        data = response.json()

        if "error" in data:
            print(f"Error fetching records: {data['error']}")
            sys.exit(1)

        records.extend(data.get("records", []))
        offset = data.get("offset")

        if not offset:
            break

    return records


def determine_posting_account(who_to_post):
    """Map 'Who to Post' value(s) to 'Posting Account'."""
    if not who_to_post:
        return "CPL LinkedIn"  # Default

    # who_to_post is a list (multiselect)
    if isinstance(who_to_post, list) and len(who_to_post) > 0:
        first_person = who_to_post[0]
        return WHO_TO_ACCOUNT_MAP.get(first_person, "CPL LinkedIn")

    return "CPL LinkedIn"


def determine_platform(channels):
    """Map 'Channels' value(s) to 'Platform'."""
    if not channels:
        return "LinkedIn"  # Default

    # channels is a list (multiselect)
    if isinstance(channels, list) and len(channels) > 0:
        first_channel = channels[0]
        return PLATFORM_MAP.get(first_channel, "LinkedIn")

    return "LinkedIn"


def migrate_record(record, dry_run=False):
    """Migrate a single record to the new schema."""
    record_id = record["id"]
    fields = record.get("fields", {})

    # Get existing values
    who_to_post = fields.get("Who to Post", [])
    channels = fields.get("Channels", [])

    # Check if already migrated (has new fields populated)
    if fields.get("Posting Account") and fields.get("Platform"):
        return None  # Already migrated

    # Determine new values
    posting_account = determine_posting_account(who_to_post)
    platform = determine_platform(channels)

    # Build update payload
    update_fields = {}

    if not fields.get("Posting Account"):
        update_fields["Posting Account"] = posting_account

    if not fields.get("Platform"):
        update_fields["Platform"] = platform

    if not fields.get("Post Type"):
        update_fields["Post Type"] = "Original"

    if not fields.get("Queue Position"):
        update_fields["Queue Position"] = 1

    if not update_fields:
        return None  # Nothing to update

    if dry_run:
        print(f"  Would update record {record_id}:")
        print(f"    Who to Post: {who_to_post} -> Posting Account: {posting_account}")
        print(f"    Channels: {channels} -> Platform: {platform}")
        return {"dry_run": True, "fields": update_fields}

    # Perform the update
    response = requests.patch(
        f"{BASE_URL}/{record_id}",
        headers=HEADERS,
        json={"fields": update_fields}
    )

    result = response.json()
    if "error" in result:
        print(f"  Error updating {record_id}: {result['error']}")
        return None

    return result


def create_repost_records(records, dry_run=False):
    """Create repost records for posts where Who to Post has CPL and another person."""
    reposts_to_create = []

    for record in records:
        fields = record.get("fields", {})
        who_to_post = fields.get("Who to Post", [])

        # Check if this record has both a partner and CPL
        if isinstance(who_to_post, list) and len(who_to_post) > 1:
            has_cpl = "CPL" in who_to_post
            partners = [p for p in who_to_post if p != "CPL"]

            if has_cpl and partners:
                # This record needs a repost created
                date = fields.get("Date")
                if date:
                    # Calculate repost date (2 days later)
                    from datetime import datetime, timedelta
                    original_date = datetime.strptime(date, "%Y-%m-%d")
                    repost_date = original_date + timedelta(days=2)

                    repost = {
                        "Date": repost_date.strftime("%Y-%m-%d"),
                        "Post Topic": fields.get("Post Topic", ""),
                        "Posting Account": "CPL LinkedIn",
                        "Platform": "LinkedIn",
                        "Post Type": "Repost",
                        "Copy": "NATIVE SHARE",
                        "Post Status": "Drafting",
                        "Content Pillar": fields.get("Content Pillar"),
                        "Focus": fields.get("Focus"),
                        "Source Post": [record["id"]],  # Link to original
                        "Queue Position": 1,
                        "Notes": f"Auto-created repost of partner content"
                    }
                    reposts_to_create.append(repost)

    if dry_run:
        print(f"\nWould create {len(reposts_to_create)} repost records")
        for repost in reposts_to_create[:5]:  # Show first 5
            print(f"  - {repost['Date']}: Repost of '{repost['Post Topic'][:50]}...'")
        return reposts_to_create

    # Create repost records in batches of 10
    created = 0
    for i in range(0, len(reposts_to_create), 10):
        batch = reposts_to_create[i:i+10]
        response = requests.post(
            BASE_URL,
            headers=HEADERS,
            json={"records": [{"fields": r} for r in batch]}
        )
        result = response.json()
        if "records" in result:
            created += len(result["records"])

    print(f"Created {created} repost records")
    return created


def main():
    dry_run = "--dry-run" in sys.argv
    skip_reposts = "--skip-reposts" in sys.argv

    if dry_run:
        print("=== DRY RUN MODE - No changes will be made ===\n")

    print("Fetching all records from CPL Content Calendar...")
    records = get_all_records()
    print(f"Found {len(records)} records\n")

    print("Migrating records to new schema...")
    migrated = 0
    skipped = 0

    for record in records:
        result = migrate_record(record, dry_run)
        if result:
            migrated += 1
        else:
            skipped += 1

    print(f"\nMigration complete:")
    print(f"  Migrated: {migrated}")
    print(f"  Skipped (already done or empty): {skipped}")

    if not skip_reposts:
        print("\nChecking for repost records to create...")
        create_repost_records(records, dry_run)

    if dry_run:
        print("\n=== DRY RUN COMPLETE - Run without --dry-run to apply changes ===")


if __name__ == "__main__":
    main()
