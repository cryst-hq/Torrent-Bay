/* ============================================
   TORRENT BAY - MAIN APPLICATION LOGIC
   100% Client-Side. Zero Dependencies.
   100% Local Storage (IndexedDB).
   ============================================ */

// Global state
let allTorrents = [];
let filteredTorrents = [];
let searchDebounceTimer = null;
const AUTO_REFRESH_INTERVAL = 5000; // 5 seconds (check for updates)

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Check online status
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Set up event listeners
    setupEventListeners();

    // Load torrents from local database
    await loadTorrents();

    // Auto-refresh to check for new data
    setInterval(async () => {
        await loadTorrents(true); // Silent refresh
    }, AUTO_REFRESH_INTERVAL);
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                filterAndDisplay();
            }, 300);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndDisplay);
    }

    if (sortBy) {
        sortBy.addEventListener('change', filterAndDisplay);
    }
}

// ============================================
// DATA LOADING (Local IndexedDB)
// ============================================
async function loadTorrents(silent = false) {
    const container = document.getElementById('torrents-container');
    
    if (!silent) {
        container.innerHTML = '<div class="loading">Loading magnets...</div>';
    }

    try {
        // Fetch from local IndexedDB
        allTorrents = await db.getAllTorrents();
        
        updateLastUpdatedTime();
        updateTotalCount(allTorrents.length);
        filterAndDisplay();

    } catch (error) {
        console.error('Error loading torrents:', error);
        container.innerHTML = '<div class="no-results">Failed to load torrents from local database.</div>';
    }
}

// ============================================
// FILTERING & SORTING
// ============================================
function filterAndDisplay() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');

    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    const sortMethod = sortBy ? sortBy.value : 'newest';

    // Filter
    filteredTorrents = allTorrents.filter(torrent => {
        // Search filter (name + tags)
        const matchesSearch = !searchTerm || 
            torrent.name.toLowerCase().includes(searchTerm) ||
            (torrent.tags && torrent.tags.toLowerCase().includes(searchTerm));

        // Category filter
        const matchesCategory = !selectedCategory || torrent.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Sort
    filteredTorrents.sort((a, b) => {
        switch (sortMethod) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'size':
                // Basic size sorting (not perfect but works for common formats)
                const sizeA = parseSizeToBytes(a.size || '0');
                const sizeB = parseSizeToBytes(b.size || '0');
                return sizeB - sizeA;
            case 'newest':
            default:
                return new Date(b.created_at) - new Date(a.created_at);
        }
    });

    displayTorrents(filteredTorrents);
    updateResultsCount(filteredTorrents.length);
}

function parseSizeToBytes(sizeStr) {
    if (!sizeStr) return 0;
    const match = sizeStr.match(/(\d+\.?\d*)\s*(GB|MB|KB|TB)?/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = (match[2] || 'MB').toUpperCase();
    
    const multipliers = {
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024
    };
    
    return value * (multipliers[unit] || 1);
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================
function displayTorrents(torrents) {
    const container = document.getElementById('torrents-container');

    if (torrents.length === 0) {
        container.innerHTML = '<div class="no-results">No magnets found. Try a different search or category.</div>';
        return;
    }

    container.innerHTML = torrents.map(torrent => createTorrentCard(torrent)).join('');
}

function createTorrentCard(torrent) {
    const tags = torrent.tags ? (Array.isArray(torrent.tags) ? torrent.tags : torrent.tags.split(',').map(t => t.trim())) : [];
    const date = new Date(torrent.created_at).toLocaleDateString();
    const uploader = torrent.uploader || 'Anonymous';
    const size = torrent.size || 'Unknown';

    return `
        <div class="torrent-card">
            <div class="torrent-header">
                <div class="torrent-name">${escapeHtml(torrent.name)}</div>
                <div class="category-badge">${torrent.category}</div>
            </div>
            
            <div class="torrent-meta">
                <span>Date: ${date}</span>
                <span>Uploader: ${escapeHtml(uploader)}</span>
                <span>Size: ${escapeHtml(size)}</span>
            </div>

            ${tags.length > 0 ? `
                <div class="tags-container">
                    ${tags.map(tag => `<span class="tag-pill" onclick="searchByTag('${escapeHtml(tag)}')">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}

            <div class="torrent-actions">
                <a href="${escapeHtml(torrent.magnet)}" class="btn-magnet">
                    Open in Client
                </a>
                <button class="btn-copy" onclick="copyMagnet('${escapeHtml(torrent.magnet)}')">
                    Copy Magnet
                </button>
            </div>
        </div>
    `;
}

// ============================================
// USER ACTIONS
// ============================================
function copyMagnet(magnetLink) {
    const unescaped = new DOMParser().parseFromString(magnetLink, 'text/html').documentElement.textContent;
    
    navigator.clipboard.writeText(unescaped).then(() => {
        showSuccess('Magnet link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = unescaped;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showSuccess('Magnet link copied to clipboard!');
    });
}

function searchByTag(tag) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = tag;
        filterAndDisplay();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ============================================
// UI UPDATES
// ============================================
function updateOnlineStatus() {
    const statusIndicator = document.getElementById('online-status');
    if (statusIndicator) {
        // Always show as "Local" since we're using local storage
        statusIndicator.textContent = 'Local';
        statusIndicator.title = 'All data stored locally on this device';
        statusIndicator.classList.add('online');
        statusIndicator.classList.remove('offline');
    }
}

function updateTotalCount(count) {
    const countEl = document.getElementById('total-count');
    if (countEl) {
        countEl.textContent = count.toLocaleString();
    }
}

function updateResultsCount(count) {
    const countEl = document.getElementById('results-count');
    if (countEl) {
        countEl.textContent = count.toLocaleString();
    }
}

function updateLastUpdatedTime() {
    const lastUpdatedEl = document.getElementById('last-updated');
    if (lastUpdatedEl) {
        const now = new Date();
        lastUpdatedEl.textContent = `Updated ${now.toLocaleTimeString()}`;
    }
}

function showWarning(message) {
    const banner = document.getElementById('warning-banner');
    const messageEl = document.getElementById('warning-message');
    if (banner && messageEl) {
        messageEl.textContent = message;
        banner.style.display = 'flex';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            closeWarning();
        }, 10000);
    }
}

function showSuccess(message) {
    const banner = document.getElementById('success-banner');
    const messageEl = document.getElementById('success-message');
    
    // Create banner if it doesn't exist (for index.html)
    if (!banner) {
        const newBanner = document.createElement('div');
        newBanner.id = 'success-banner';
        newBanner.className = 'success-banner';
        newBanner.innerHTML = `
            <span id="success-message">${message}</span>
            <button onclick="closeSuccess()">✕</button>
        `;
        document.querySelector('.container').insertBefore(newBanner, document.querySelector('.controls'));
        
        setTimeout(() => {
            closeSuccess();
        }, 5000);
        return;
    }
    
    if (messageEl) {
        messageEl.textContent = message;
        banner.style.display = 'flex';
        
        setTimeout(() => {
            closeSuccess();
        }, 5000);
    }
}

function closeWarning() {
    const banner = document.getElementById('warning-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

function closeSuccess() {
    const banner = document.getElementById('success-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// ============================================
// UTILITIES
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally accessible
window.copyMagnet = copyMagnet;
window.searchByTag = searchByTag;
window.closeWarning = closeWarning;
window.closeSuccess = closeSuccess;
