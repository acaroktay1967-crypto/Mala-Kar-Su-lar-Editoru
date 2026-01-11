# Mala Karşı İşlenen Suçlar Editörü

TCK (Türk Ceza Kanunu) Mala Karşı İşlenen Suçlar Editörü - Electron Desktop Application

## Features

- **Bilişim Suçları Yönetimi**: Track and manage cybercrime cases
- **Nitelikli Dolandırıcılık**: Handle sophisticated fraud cases
- **Kredi Kartı Suçları**: Manage credit card fraud cases
- **Mahkeme Kararları**: Store and search court decisions
- **Database Management**: SQLite database with backup/restore functionality
- **Reporting**: Generate comprehensive reports

## Installation

1. Clone the repository:
```bash
git clone https://github.com/acaroktay1967-crypto/Mala-Kar-Su-lar-Editoru.git
cd Mala-Kar-Su-lar-Editoru
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Run in Development Mode
```bash
npm run dev
```
This will open the application with Developer Tools enabled.

### Run in Production Mode
```bash
npm start
```

### Build Distributable Packages
```bash
npm run build
```
The built application will be available in the `dist` directory.

## Application Structure

```
├── electron-main.js      # Main process (Electron entry point)
├── preload.js           # Preload script (IPC bridge)
├── database.js          # SQLite database handler
├── index_ht.html        # Main application UI
├── mains.js             # Renderer process script
├── styles-main.css      # Main stylesheet
├── styles.css           # Additional styles
└── mahkeme-kararları.css # Court decisions styles
```

## Technologies

- **Electron**: Desktop application framework
- **SQLite3**: Local database
- **ExcelJS**: Excel report generation
- **PDFKit**: PDF document generation
- **UUID**: Unique ID generation

## Development

The application uses:
- **Context Isolation**: Enhanced security
- **IPC Communication**: Secure main-renderer communication
- **Preload Script**: Safe API exposure to renderer

## Database

The application automatically creates and manages a SQLite database in:
- Windows: `%APPDATA%/TCKSuclarEditoru/suclar.db`
- macOS: `~/Library/Application Support/TCKSuclarEditoru/suclar.db`
- Linux: `~/.local/share/TCKSuclarEditoru/suclar.db`

Backups are stored in the `backups` subdirectory.

## License

MIT License - See LICENSE file for details
