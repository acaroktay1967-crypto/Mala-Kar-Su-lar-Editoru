# Renderer Process Implementation

This directory contains the custom Renderer process code for the Electron-based TCK Mala Karşı İşlenen Suçlar Editörü application.

## Files Added

### 1. `renderer.js`
The main renderer process script that handles all UI interactions:

**Features:**
- **Tab Navigation System**: Seamless navigation between different sections (Dashboard, Bilişim Suçları, Dolandırıcılık, etc.)
- **Event Handlers**: Comprehensive event handling for:
  - Button clicks
  - Form submissions
  - Search and filter operations
  - Modal interactions
- **Search Functionality**: Real-time debounced search with highlighting
- **Filter System**: Multi-criteria filtering for court decisions (crime type, date range, precedent status)
- **Data Display**: Dynamic rendering of statistics, tables, and card-based layouts
- **Modal Management**: Full-featured modal system with keyboard shortcuts (Escape to close)
- **Form Validation**: Client-side validation with real-time feedback
- **Notification System**: Toast-style notifications for success/error/info messages
- **Statistics Calculation**: Animated statistics with smooth transitions
- **DOM Manipulation**: Efficient DOM updates using vanilla JavaScript
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + S`: Save form
  - `Ctrl/Cmd + F`: Focus search
  - `Alt + 1-6`: Switch tabs
  - `Escape`: Close modals

**Key Functions:**
```javascript
// Tab management
switchTab(tabId)
loadTabContent(tabId)

// Data operations
loadStatistics()
loadBilisimSuclari()
loadMahkemeKararlari()

// Search and filter
performSearch(query)
applyFilters()
filterAndDisplayKararlar()

// UI interactions
showNotification(message, type)
openModal(modalId)
closeModal(modalId)
validateForm(form)
```

### 2. `app.html`
Complete HTML structure that integrates the renderer script:

**Sections:**
- Dashboard with statistics cards
- Bilişim Suçları (Cyber Crimes) management
- Nitelikli Dolandırıcılık (Qualified Fraud) management
- Kredi Kartı Suçları (Credit Card Crimes) management
- Mahkeme Kararları (Court Decisions) with search and filter
- Reports section
- Backup section

### 3. `main-process.js`
Simplified main process with mock data for testing:

**IPC Handlers:**
- `bilişim:getAll`, `bilişim:save`, `bilişim:delete`
- `dolandırıcılık:getAll`, `dolandırıcılık:save`
- `kredi-kartı:getAll`, `kredi-kartı:save`
- `backup:create`, `backup:restore`
- `report:generate`

### 4. `app.css`
Comprehensive styling for the application:

**Features:**
- Modern, clean design with CSS variables
- Responsive layout for mobile and desktop
- Smooth animations and transitions
- Card-based layouts
- Professional color scheme
- Accessibility considerations

## Architecture

```
┌─────────────────────────────────────┐
│         Main Process                │
│      (main-process.js)              │
│  - IPC Handlers                     │
│  - Menu Management                  │
│  - Window Creation                  │
└──────────────┬──────────────────────┘
               │
               │ IPC Communication
               │
┌──────────────┴──────────────────────┐
│         Preload Script              │
│        (preload.js)                 │
│  - contextBridge API                │
│  - Security Layer                   │
└──────────────┬──────────────────────┘
               │
               │ Exposed API
               │
┌──────────────┴──────────────────────┐
│      Renderer Process               │
│       (renderer.js)                 │
│  - DOM Manipulation                 │
│  - Event Handling                   │
│  - UI State Management              │
│  - Client-side Logic                │
└─────────────────────────────────────┘
               │
               │
┌──────────────┴──────────────────────┐
│           UI Layer                  │
│         (app.html)                  │
│  - HTML Structure                   │
│  - User Interface                   │
└─────────────────────────────────────┘
```

## Usage

### Starting the Application
```bash
npm install
npm start
```

### Development Mode
The application starts with DevTools open for debugging.

## Key Features Demonstrated

### 1. Tab Navigation
Click on navigation buttons to switch between different sections. The active tab is highlighted and content animates smoothly.

### 2. Statistics Dashboard
The dashboard shows animated counters for:
- Bilişim Suçları count
- Dolandırıcılık count
- Kredi Kartı Suçları count
- Total records

### 3. Court Decisions (Mahkeme Kararları)
- **Search**: Type in the search box to filter decisions in real-time
- **Filters**: Apply multiple filters (crime type, precedent status, date range)
- **Card View**: Court decisions displayed in an attractive card layout
- **Details**: Click "Detayları Gör" to view full decision details in a modal

### 4. Form Validation
Forms include real-time validation with error messages for required fields, email format, and number validation.

### 5. Notifications
Success, error, and info notifications appear in the top-right corner with smooth animations.

### 6. Menu Integration
Use the application menu (Dosya, Görünüm, Raporlar) to trigger actions like backup, restore, and report generation.

## Security

The application follows Electron security best practices:
- `nodeIntegration: false`
- `contextIsolation: true`
- All API access through preload script with `contextBridge`
- XSS protection with HTML escaping
- No eval() or dangerous functions

## Utility Functions

The renderer includes helpful utilities:
- `escapeHtml()`: Prevents XSS attacks
- `formatDate()`: Turkish locale date formatting
- `formatCurrency()`: Turkish Lira currency formatting
- `debounce()`: Performance optimization for search

## Future Enhancements

Potential improvements:
- Real database integration (currently using mock data)
- Export to PDF/Excel functionality
- Print preview for court decisions
- Advanced search with regular expressions
- User preferences persistence
- Dark mode theme
- Multi-language support

## Browser Compatibility

Built with modern JavaScript (ES6+) and tested in Electron environment. Uses:
- Arrow functions
- Async/await
- Template literals
- Destructuring
- Spread operator
- Promise.all

## Performance

- Debounced search (300ms delay)
- Efficient DOM updates
- Minimal reflows/repaints
- Event delegation where appropriate
- Lazy loading for tabs
