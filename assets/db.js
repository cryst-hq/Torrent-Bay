/* ============================================
   LOCAL DATABASE - localStorage JSON File
   100% Client-Side. Portable. Shareable.
   Data stored in: torrents-data.json (conceptually)
   ============================================ */

const STORAGE_KEY = 'torrentbay_database';

class LocalDatabase {
    constructor() {
        this.data = [];
        this.nextId = 1;
        this.ready = false;
    }

    // Initialize localStorage database
    async init() {
        try {
            // Load existing data from localStorage
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.data = parsed.torrents || [];
                this.nextId = parsed.nextId || 1;
            } else {
                // Initialize empty database
                this.data = [];
                this.nextId = 1;
                this.save();
            }
            this.ready = true;
            console.log(`Local database initialized: ${this.data.length} torrents loaded`);
        } catch (error) {
            console.error('Failed to initialize database:', error);
            this.data = [];
            this.nextId = 1;
            this.ready = true;
        }
    }

    // Save to localStorage
    save() {
        try {
            const dataToSave = {
                torrents: this.data,
                nextId: this.nextId,
                lastModified: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Failed to save database:', error);
            throw new Error('Storage quota exceeded. Try exporting and clearing old data.');
        }
    }

    // Add a new torrent
    async addTorrent(torrentData) {
        if (!this.ready) await this.init();

        const torrent = {
            id: this.nextId++,
            ...torrentData,
            created_at: new Date().toISOString(),
            dead: false
        };

        this.data.push(torrent);
        this.save();
        return torrent;
    }

    // Get all torrents
    async getAllTorrents() {
        if (!this.ready) await this.init();

        // Sort by created_at descending (newest first)
        return [...this.data].sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
    }

    // Update a torrent (e.g., mark as dead)
    async updateTorrent(id, updates) {
        if (!this.ready) await this.init();

        const index = this.data.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error('Torrent not found');
        }

        this.data[index] = { ...this.data[index], ...updates };
        this.save();
        return this.data[index];
    }

    // Get torrent count
    async getCount() {
        if (!this.ready) await this.init();
        return this.data.length;
    }

    // Export all data (for backup/sharing)
    async exportData() {
        if (!this.ready) await this.init();
        const exportData = {
            torrents: this.data,
            nextId: this.nextId,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(exportData, null, 2);
    }

    // Download database as JSON file
    downloadBackup() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            alert('No data to export');
            return;
        }

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `torrentbay-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import data (for restore/sharing)
    async importData(jsonData) {
        if (!this.ready) await this.init();

        try {
            const parsed = JSON.parse(jsonData);
            
            // Handle both old format (array) and new format (object)
            if (Array.isArray(parsed)) {
                // Old format: just array of torrents
                this.data = [...this.data, ...parsed];
                this.nextId = Math.max(...this.data.map(t => t.id), 0) + 1;
            } else {
                // New format: complete database export
                this.data = parsed.torrents || [];
                this.nextId = parsed.nextId || 1;
            }
            
            this.save();
            return this.data.length;
        } catch (error) {
            throw new Error('Invalid JSON format: ' + error.message);
        }
    }

    // Import from file upload
    async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const count = await this.importData(e.target.result);
                    resolve(count);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
}

// Create global database instance
const db = new LocalDatabase();

// Initialize on load
db.init().catch(err => {
    console.error('Failed to initialize database:', err);
});

// Add utility functions for easy data management
window.exportDatabase = () => db.downloadBackup();
window.importDatabase = (file) => db.importFromFile(file);
