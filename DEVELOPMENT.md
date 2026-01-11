# Development Guide

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/acaroktay1967-crypto/Mala-Kar-Su-lar-Editoru.git
cd Mala-Kar-Su-lar-Editoru
npm install
```

### 2. Run Tests

```bash
# Test Electron configuration
node test-electron.js

# Test IPC handlers
node test-ipc.js
```

### 3. Start Development

```bash
# Development mode (with DevTools)
npm run dev

# Production mode
npm start
```

## Project Structure

### Main Process (electron-main.js)
- Handles application lifecycle
- Creates browser windows
- Manages IPC communication
- Interacts with file system
- Database operations

**Key responsibilities:**
- Window management
- Menu creation
- IPC handler setup
- Database initialization

### Preload Script (preload.js)
- Bridges main and renderer processes
- Exposes secure APIs
- Uses contextBridge for isolation

**Security considerations:**
- Only expose necessary APIs
- Never expose entire Node.js environment
- Validate all inputs from renderer

### Renderer Process (mains.js)
- Handles UI interactions
- Tab navigation
- Form handling
- API calls through window.api

### Database (database.js)
- SQLite3 integration
- CRUD operations
- Backup/restore functionality
- Report generation

## Adding New Features

### 1. Add a New Table

In `database.js`, update `createTables()`:

```javascript
const newTable = `
  CREATE TABLE IF NOT EXISTS new_table (
    id TEXT PRIMARY KEY,
    field1 TEXT,
    field2 INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;
this.db.run(newTable);
```

### 2. Add Database Methods

```javascript
async getAllFromNewTable() {
  return new Promise((resolve, reject) => {
    this.db.all("SELECT * FROM new_table", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async saveToNewTable(data) {
  // Implementation
}
```

### 3. Add IPC Handlers

In `electron-main.js`:

```javascript
ipcMain.handle('newTable:getAll', async () => {
  return await db.getAllFromNewTable();
});

ipcMain.handle('newTable:save', async (event, data) => {
  return await db.saveToNewTable(data);
});
```

### 4. Expose API in Preload

In `preload.js`:

```javascript
contextBridge.exposeInMainWorld('api', {
  // ... existing APIs
  newTable: {
    getAll: () => ipcRenderer.invoke('newTable:getAll'),
    save: (data) => ipcRenderer.invoke('newTable:save', data)
  }
});
```

### 5. Use in Renderer

In `mains.js` or your UI script:

```javascript
async function loadNewTableData() {
  const data = await window.api.newTable.getAll();
  // Update UI with data
}

async function saveNewTableData(formData) {
  const result = await window.api.newTable.save(formData);
  if (result.success) {
    showNotification('Saved successfully!');
  }
}
```

## Database Location

The database is automatically created in:

- **Windows**: `%APPDATA%/TCKSuclarEditoru/suclar.db`
- **macOS**: `~/Library/Application Support/TCKSuclarEditoru/suclar.db`
- **Linux**: `~/.local/share/TCKSuclarEditoru/suclar.db`

For development, you can find and inspect the database at these locations.

## Debugging

### Enable Developer Tools

```bash
npm run dev
```

Or press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS) in the application.

### Console Logging

**Main Process:**
```javascript
console.log('Main process log');
// View in terminal where you ran npm start
```

**Renderer Process:**
```javascript
console.log('Renderer process log');
// View in DevTools console
```

### IPC Debugging

Add logging to track IPC calls:

```javascript
// In electron-main.js
ipcMain.handle('some:action', async (event, data) => {
  console.log('IPC received:', 'some:action', data);
  const result = await someOperation(data);
  console.log('IPC response:', result);
  return result;
});
```

## Building for Distribution

### Build for Current Platform

```bash
npm run build
```

### Build for Specific Platform

Edit `package.json` build configuration:

```json
"build": {
  "win": {
    "target": "nsis"
  },
  "mac": {
    "target": "dmg"
  },
  "linux": {
    "target": ["AppImage", "deb"]
  }
}
```

## Testing

### Manual Testing Checklist

- [ ] Application launches without errors
- [ ] Database initializes correctly
- [ ] All tabs are accessible
- [ ] Forms can be submitted
- [ ] Data persists after restart
- [ ] Backup/restore works
- [ ] Menu items function correctly
- [ ] Reports generate successfully

### Automated Testing

Currently using validation scripts:
- `test-electron.js` - Configuration validation
- `test-ipc.js` - IPC handler validation

## Common Issues

### Issue: Application won't start

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: Database errors

**Solution:**
1. Check database file location
2. Ensure write permissions
3. Delete database file and restart (will recreate)

### Issue: IPC not working

**Solution:**
1. Check handler is defined in electron-main.js
2. Verify preload.js exposes the API
3. Ensure renderer uses correct API path
4. Check for typos in channel names

## Code Style

- Use clear, descriptive variable names
- Comment complex logic
- Follow existing patterns
- Use async/await for asynchronous operations
- Handle errors appropriately

## Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test thoroughly
4. Commit: `git commit -m "Description"`
5. Push: `git push origin feature/my-feature`
6. Create pull request

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Node.js Documentation](https://nodejs.org/docs/)

## Support

For issues or questions:
- Check existing issues on GitHub
- Review documentation
- Create new issue with detailed description
