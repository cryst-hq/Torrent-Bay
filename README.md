# TORRENT BAY - Decentralized Magnet Index

A **100% serverless, portable, zero-dependency** torrent magnet link index. Built with pure HTML/CSS/JavaScript + localStorage. No backend, no third-party services required.

## Features

- **Zero-Server Architecture**: Runs entirely in the browser
- **100% Local Storage**: All data stored in browser localStorage (easily exportable as JSON)
- **No Third-Party Dependencies**: No Supabase, Firebase, or any external service
- **Extremely Shareable**: One-click export/import via JSON files
- **Fully Portable**: Copy to USB stick, run from file system, or host anywhere
- **Offline-First**: Works completely offline once loaded
- **Real-time Search**: Instant filtering by name, tags, and category
- **One-Click Magnet**: Open in torrent client instantly
- **Tag System**: Clickable tags for easy filtering
- **Report Dead**: Community moderation built-in
- **Mobile Responsive**: Works perfectly on all devices
- **Export/Import**: Backup and share your entire database as JSON with one click

## Quick Start (1 Step)

### Just Open It

```bash
# Double-click index.html - it works instantly!
open index.html
```

That's it. No setup, no configuration, no API keys, no database setup. Everything is stored locally in your browser's localStorage.

### Try the Sample Database

Want to test it with some data?

1. Open `index.html`
2. Click "Import DB" button
3. Select `sample-database.json` (included in the project)
4. You'll instantly have 5 sample torrents (legal Creative Commons content)

The sample database includes:
- Ubuntu Linux ISO
- Big Buck Bunny (Creative Commons movie)
- Sintel (Creative Commons short film)
- Debian Linux ISO
- Public Domain Books Collection

## How It Works

### Local Storage Architecture

- **localStorage**: All data stored in browser's localStorage as JSON
- **One-Click Export**: Download your entire database as a `.json` file
- **One-Click Import**: Upload a `.json` file to restore/merge databases
- **Persistent**: Data survives browser restarts
- **Shareable**: Simply share the exported JSON file with others
- **Portable**: Export, copy to USB, import on any computer

### Database Location

The database is stored in your browser's localStorage at the key:
```
torrentbay_database
```

You can view it in DevTools → Application → Local Storage.

### Sharing Your Database

**To Share**:
1. Click "Export DB" button in the interface
2. A `.json` file downloads automatically
3. Share this file via email, USB, cloud storage, etc.

**To Import**:
1. Click "Import DB" button
2. Select the `.json` file
3. All torrents are instantly imported

### File Structure

```
/
├── index.html              # Main search/browse page
├── add.html                # Add magnet form
├── assets/
│   ├── style.css           # Minimalist black/white theme
│   ├── script.js           # All application logic
│   └── db.js               # localStorage wrapper
├── sample-database.json    # Sample data (legal torrents)
└── README.md               # This file
```

## Usage

### Adding Torrents
1. Click "Add Magnet"
2. Fill in the form (only name, magnet, and category are required)
3. Submit - it's instantly added to your local database

### Searching
- Type in the search box (searches name + tags)
- Filter by category dropdown
- Sort by newest, name, or size

### Exporting Database (Share with Others)

**Method 1: Use the UI Button** (Easiest)
1. Click "Export DB" button in the top controls
2. File downloads as `torrentbay-backup-YYYY-MM-DD.json`
3. Share this file via:
   - Email attachment
   - USB stick
   - Cloud storage (Dropbox, Google Drive)
   - GitHub repository
   - Messaging apps

**Method 2: Browser Console**
```javascript
exportDatabase(); // Downloads JSON file immediately
```

### Importing Database

**Method 1: Use the UI Button** (Easiest)
1. Click "Import DB" button
2. Select your `.json` backup file
3. Data is merged with existing entries
4. Page reloads automatically

**Method 2: Browser Console**
```javascript
// Will prompt for file selection
importDatabase(fileObject);
```

## Deployment Options

**Local File System**
```bash
open index.html  # Works immediately, no server needed
```

**GitHub Pages**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
# Enable Pages in repo settings
```

**IPFS (Decentralized)**
```bash
ipfs add -r .
# Access via: ipfs://<hash> or https://ipfs.io/ipfs/<hash>
```

**Any Static Host**
- Netlify, Vercel, Cloudflare Pages
- Upload files, no build process needed
- Works on any web server (Apache, Nginx, etc.)

## Technical Details

- **Storage**: Browser localStorage (JSON format)
- **Storage Key**: `torrentbay_database`
- **Capacity**: ~5-10MB (depending on browser, ~1000-5000 torrents)
- **Persistence**: Data survives browser restarts
- **Format**: Human-readable JSON
- **Cross-Origin**: Works from file:// URLs
- **Zero Network**: No internet required after first page load
- **Privacy**: All data stays on your device unless you export
- **Sync**: Manual via export/import (no automatic cloud sync)

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 10+)
- Opera: Full support
- Brave: Full support

**Minimum Requirements**:
- localStorage support (all browsers since 2010)
- JavaScript enabled
- ~5-10MB storage quota

## Sharing & Collaboration

Since everything is stored in localStorage, here's how to collaborate:

### Scenario 1: Share Your Collection with a Friend
1. Click "Export DB" → download JSON file
2. Send file via email/messaging
3. Friend clicks "Import DB" → selects your file
4. They now have your entire collection!

### Scenario 2: USB Stick Distribution
1. Export database as JSON
2. Copy both the app folder AND the JSON file to USB
3. Give USB to anyone
4. They open `index.html`, click "Import DB", select the JSON
5. Instant local torrent index!

### Scenario 3: Public Repository
1. Create GitHub repo with the app
2. Export database regularly
3. Commit `database-backup.json` to repo
4. Users clone repo and import the JSON
5. Decentralized, version-controlled magnet index!

### Scenario 4: Cloud Sync (Manual)
1. Export database to cloud folder (Dropbox/Drive)
2. Set up the app in multiple locations
3. Import the latest JSON when you want to sync
4. Update the cloud JSON when you add new magnets

## Legal Disclaimer

This software is provided for educational purposes only. Only use it to index legal, public domain, or Creative Commons content. Magnet links are metadata pointers - no files are hosted by this application.

---

**Built for freedom, privacy, and decentralization.**
