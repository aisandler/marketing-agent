#!/usr/bin/env python3
"""
Cleanup Airtable Database and Relink All Records

Steps:
1. Delete duplicate from Basic Info
2. Clear all detail tables (Services, Workforce, Marketing, etc.)
3. Keep Basic Info records (10 competitors)
4. Re-run linked loader to create properly linked detail records
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE_ID = os.getenv('AIRTABLE_BASE_ID')
BASE_URL = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}"

HEADERS = {
    "Authorization": f"Bearer {AIRTABLE_API_KEY}",
    "Content-Type": "application/json"
}

# Table IDs - configure in .env or environment
# Set AIRTABLE_TABLE_<NAME> environment variables for each table
TABLES = {
    "basic_info": os.getenv('AIRTABLE_TABLE_BASIC_INFO', 'YOUR_TABLE_ID'),
    "services": os.getenv('AIRTABLE_TABLE_SERVICES', 'YOUR_TABLE_ID'),
    "workforce": os.getenv('AIRTABLE_TABLE_WORKFORCE', 'YOUR_TABLE_ID'),
    "marketing": os.getenv('AIRTABLE_TABLE_MARKETING', 'YOUR_TABLE_ID'),
    "positioning": os.getenv('AIRTABLE_TABLE_POSITIONING', 'YOUR_TABLE_ID'),
    "swot": os.getenv('AIRTABLE_TABLE_SWOT', 'YOUR_TABLE_ID'),
    "ai_search": os.getenv('AIRTABLE_TABLE_AI_SEARCH', 'YOUR_TABLE_ID'),
    "messaging": os.getenv('AIRTABLE_TABLE_MESSAGING', 'YOUR_TABLE_ID'),
}

# Duplicate record to delete (test record) - set via environment or argument
BBG_DUPLICATE_ID = os.getenv('AIRTABLE_DUPLICATE_RECORD_ID', '')


def delete_record(table_id: str, record_id: str):
    """Delete a single record."""
    url = f"{BASE_URL}/{table_id}/{record_id}"
    response = requests.delete(url, headers=HEADERS)

    if response.status_code == 200:
        print(f"✅ Deleted record {record_id} from table {table_id}")
        return True
    else:
        print(f"❌ Error deleting record: {response.status_code}")
        print(f"   Response: {response.text}")
        return False


def get_all_records(table_id: str):
    """Get all records from a table."""
    url = f"{BASE_URL}/{table_id}"
    all_records = []

    params = {}
    while True:
        response = requests.get(url, headers=HEADERS, params=params)

        if response.status_code != 200:
            print(f"❌ Error fetching records: {response.status_code}")
            return []

        data = response.json()
        all_records.extend(data.get('records', []))

        # Check for pagination
        offset = data.get('offset')
        if not offset:
            break
        params['offset'] = offset

    return all_records


def delete_all_records_from_table(table_name: str, table_id: str):
    """Delete all records from a table."""
    print(f"\n📊 Processing table: {table_name}")

    records = get_all_records(table_id)
    print(f"   Found {len(records)} records")

    if len(records) == 0:
        print(f"   ✅ Table already empty")
        return

    # Airtable allows deleting up to 10 records at once
    for i in range(0, len(records), 10):
        batch = records[i:i+10]
        record_ids = [r['id'] for r in batch]

        # Delete batch
        params = "&".join([f"records[]={rid}" for rid in record_ids])
        url = f"{BASE_URL}/{table_id}?{params}"

        response = requests.delete(url, headers=HEADERS)

        if response.status_code == 200:
            print(f"   ✅ Deleted batch of {len(record_ids)} records")
        else:
            print(f"   ❌ Error deleting batch: {response.status_code}")
            print(f"      {response.text}")

    print(f"   ✅ Cleared {len(records)} records from {table_name}")


def main():
    print("🚀 Airtable Cleanup and Relink Script")
    print("=" * 60)

    # Step 1: Delete duplicate from Basic Info
    print("\n📋 Step 1: Delete duplicate from Basic Info")
    delete_record(TABLES["basic_info"], BBG_DUPLICATE_ID)

    # Verify Basic Info count
    basic_records = get_all_records(TABLES["basic_info"])
    print(f"   Basic Info now has {len(basic_records)} competitors")

    # Step 2: Clear all detail tables
    print("\n📋 Step 2: Clear all detail tables")
    detail_tables = ["services", "workforce", "marketing", "positioning", "swot", "ai_search", "messaging"]

    for table_name in detail_tables:
        delete_all_records_from_table(table_name, TABLES[table_name])

    print("\n" + "=" * 60)
    print("✅ CLEANUP COMPLETE")
    print("=" * 60)
    print("\nNext step: Run the linked loader script to recreate detail records with proper linking")
    print("Command: python3 automation/load-all-competitors-linked.py")


if __name__ == "__main__":
    main()
