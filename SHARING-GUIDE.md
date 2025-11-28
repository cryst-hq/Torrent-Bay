# How to Share Your Torrent Database

## The Database File

Your entire torrent collection is stored in **localStorage** inside your browser. To share it, you simply export it as a JSON file.

## Quick Export/Import

### Export (Create Shareable File)

1. Open `index.html` in your browser
2. Click the **"Export DB"** button (top right area)
3. A file named `torrentbay-backup-YYYY-MM-DD.json` downloads
4. This file contains ALL your torrents

### Import (Load Someone's Collection)

1. Open `index.html` in your browser
2. Click the **"Import DB"** button
3. Select a `.json` backup file
4. All torrents are added to your collection
5. Page reloads automatically

## Sharing Methods

### Email
- Export your database
- Attach the `.json` file to an email
- Recipient downloads it and imports

### USB Stick
- Copy the entire `Torrent-Bay` folder to USB
- Also copy your exported `.json` file
- Give USB to friend
- They open `index.html` and import the JSON

### Cloud Storage
- Export database to Dropbox/Google Drive folder
- Share the link
- Others download and import

### GitHub Repository
- Fork this repo
- Export your database
- Commit `my-collection.json` to your fork
- Others clone and import
- Update regularly to share new finds

### Messaging Apps
- Export database (usually < 1MB for 100-200 torrents)
- Send via WhatsApp, Telegram, Discord, etc.
- Recipient saves and imports

## Database File Format

The exported JSON looks like this:

```json
{
  "torrents": [
    {
      "id": 1,
      "name": "Ubuntu 24.04 LTS",
      "magnet": "magnet:?xt=urn:btih:...",
      "category": "Apps",
      "tags": "linux, ubuntu, iso",
      "size": "4.2 GB",
      "uploader": "Ubuntu Team",
      "dead": false,
      "created_at": "2024-11-28T10:00:00.000Z"
    }
  ],
  "nextId": 2,
  "lastModified": "2024-11-28T12:00:00.000Z"
}
```

## Merging Collections

When you import a database:
- It **adds** to your existing collection (doesn't replace)
- Duplicate entries may occur if you import the same file twice
- No automatic deduplication (keep your exports organized)

## Storage Limits

- **Browser localStorage**: ~5-10MB (varies by browser)
- **Typical capacity**: 1,000-5,000 torrents
- **File size**: ~1-5KB per torrent entry
- **100 torrents** ≈ 100-500KB JSON file

## Best Practices

### For Curators (Building Collections)

1. **Regular Backups**: Export weekly to avoid data loss
2. **Versioned Files**: Name exports like `torrents-2024-11-28.json`
3. **Public Sharing**: Upload to GitHub/GitLab for community access
4. **Quality Control**: Mark dead torrents before sharing

### For Users (Importing Collections)

1. **Verify Source**: Only import from trusted sources
2. **Check File Size**: Suspiciously large files may have issues
3. **Backup First**: Export your current collection before importing
4. **Test Small**: Start with small collections to test

## Collaborative Workflows

### Scenario 1: Team Project
- Designate one person as "database maintainer"
- Everyone exports their additions
- Maintainer imports all and re-exports master copy
- Team imports the latest master

### Scenario 2: Community Repository
- Create GitHub repo
- Members submit JSON files via Pull Requests
- Maintainer merges and updates `master-database.json`
- Community imports from repo

### Scenario 3: Forum/Discord Community
- Pin a message with the latest export link
- Update monthly with new additions
- Users import to get the full collection
- Contributors share their own exports

## Troubleshooting

**"Import failed - Invalid JSON"**
- File may be corrupted
- Open in text editor to verify it's valid JSON
- Re-export from the source

**"Storage quota exceeded"**
- Your localStorage is full
- Export your database
- Clear browser data
- Re-import your backup

**"Duplicate entries after import"**
- Same file imported twice
- Manually remove duplicates or
- Clear database and re-import once

**"Lost my database"**
- Cleared browser data without backing up
- Check if you have any exported files
- No automatic recovery possible

## Privacy Note

- JSON files are **plain text** - anyone can read them
- They contain magnet links, names, and metadata
- No personal information is stored
- Share responsibly

## Legal Reminder

Only share collections of legal torrents:
- Public domain content
- Creative Commons licensed media
- Official Linux ISOs
- Open source software

Do not share databases containing copyrighted material.

---

**Need help?** Check the main README.md or open an issue on GitHub.
