# Electron Application Architecture

## Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    ELECTRON APPLICATION                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      MAIN PROCESS                            │
│  (electron-main.js - Node.js Environment)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  • Creates BrowserWindow                                      │
│  • Manages application lifecycle                             │
│  • Handles IPC requests                                       │
│  • Database operations                                        │
│  • File system access                                         │
│  • Menu management                                            │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │          Database Module                    │             │
│  │          (database.js)                      │             │
│  │                                             │             │
│  │  • SQLite3 integration                      │             │
│  │  • Table creation & management              │             │
│  │  • CRUD operations                          │             │
│  │  • Backup & restore                         │             │
│  │  • Report generation                        │             │
│  └────────────────────────────────────────────┘             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↕ IPC
┌─────────────────────────────────────────────────────────────┐
│                    PRELOAD SCRIPT                            │
│  (preload.js - Bridge between Main & Renderer)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  • Context Isolation enabled                                  │
│  • Exposes secure API via contextBridge                       │
│  • Maps IPC calls to window.api object                        │
│                                                               │
│  Exposed APIs:                                                │
│    - window.api.bilişim                                       │
│    - window.api.dolandırıcılık                               │
│    - window.api.krediKartı                                   │
│    - window.api.backup                                        │
│    - window.api.report                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                   RENDERER PROCESS                           │
│  (Browser Environment - Chromium)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │         index_ht.html                       │             │
│  │  • Main UI structure                        │             │
│  │  • Dashboard                                │             │
│  │  • Data tables                              │             │
│  │  • Forms & modals                           │             │
│  └────────────────────────────────────────────┘             │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │         Stylesheets                         │             │
│  │  • styles-main.css                          │             │
│  │  • styles.css                               │             │
│  │  • mahkeme-kararları.css                    │             │
│  └────────────────────────────────────────────┘             │
│                                                               │
│  ┌────────────────────────────────────────────┐             │
│  │         mains.js                            │             │
│  │  • Tab navigation                           │             │
│  │  • Event handlers                           │             │
│  │  • API calls via window.api                 │             │
│  │  • UI updates                               │             │
│  └────────────────────────────────────────────┘             │
│                                                               │
└─────────────────────────────────────────────────────────────┘


## Data Flow

### Example: Fetching All Cases

1. User clicks "Bilişim Suçları" tab in UI
2. Renderer Process (mains.js):
   ```javascript
   const data = await window.api.bilişim.getAll();
   ```
3. Preload Script (preload.js) receives call:
   ```javascript
   bilişim: {
     getAll: () => ipcRenderer.invoke('bilişim:getAll')
   }
   ```
4. Main Process (electron-main.js) handles IPC:
   ```javascript
   ipcMain.handle('bilişim:getAll', async () => {
     return await db.getAllBilişimSuclari();
   });
   ```
5. Database Module (database.js) executes query:
   ```javascript
   async getAllBilişimSuclari() {
     // SQLite query
     return rows;
   }
   ```
6. Data flows back through IPC to renderer
7. UI updates with retrieved data


## Security Features

### Context Isolation
- Renderer cannot directly access Node.js APIs
- Prevents prototype pollution attacks
- Isolates main and renderer contexts

### Preload Script
- Whitelisted APIs only
- No direct Node.js access from renderer
- Secure IPC communication bridge

### No Node Integration
- nodeIntegration: false
- Chromium environment isolated
- Reduces attack surface


## Database Schema

### Tables:
1. **bilişim_suclari** - Cybercrime cases
2. **nitelikli_dolandırıcılık** - Fraud cases
3. **kredi_kartı_suclari** - Credit card fraud
4. **mahkeme_kararlari** - Court decisions (if implemented)

### Storage Location:
- Windows: %APPDATA%/TCKSuclarEditoru/
- macOS: ~/Library/Application Support/TCKSuclarEditoru/
- Linux: ~/.local/share/TCKSuclarEditoru/


## Build Process

```
npm run build
    ↓
electron-builder
    ↓
Creates platform-specific installers:
    • Windows: NSIS installer (.exe)
    • macOS: DMG (.dmg)
    • Linux: AppImage / deb / rpm
```

## File Organization

```
Project Root
├── electron-main.js       # Main process entry
├── preload.js            # Secure IPC bridge
├── database.js           # SQLite handler
├── index_ht.html         # Main UI
├── mains.js              # Renderer script
├── styles-main.css       # Primary styles
├── styles.css            # Additional styles
├── mahkeme-kararları.css # Court styles
├── package.json          # Dependencies & config
├── .gitignore           # Git ignore rules
├── test-electron.js     # Config tests
└── test-ipc.js          # IPC tests
```

## Development Workflow

1. **Development Mode**:
   ```bash
   npm run dev
   ```
   - Opens with DevTools
   - Hot reload possible with electron-reload

2. **Production Mode**:
   ```bash
   npm start
   ```
   - No DevTools
   - Optimized performance

3. **Build Distribution**:
   ```bash
   npm run build
   ```
   - Creates installers
   - Output in `dist/` directory
