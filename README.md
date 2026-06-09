# D365 Finance Configuration Extractor

A powerful Chrome/Edge browser extension for extracting and comparing Dynamics 365 Finance configuration data across multiple legal entities with multi-format export support.

## 🎯 Features

- **Multi-Legal Entity Support**: Extract configuration from 100+ legal entities simultaneously
- **Multiple Export Formats**: Excel (.xlsx), CSV (.csv), JSON (.json), and Text (.txt)
- **Selectable Output Content**: Choose Data only, Comparison only, or both before export
- **Configuration Comparison**: Automatically identify differences between legal entity configurations
- **Session-Based Authentication**: Works with your current D365F session (no additional credentials needed)
- **Performance Optimized**: Handles large-scale extractions efficiently using IndexedDB
- **Real-Time Progress Tracking**: Monitor extraction progress with detailed status updates

## 📦 What Gets Extracted

### Core Configuration Entities:

**General Ledger:**
- Ledgers
- Chart of Accounts (Main Accounts)
- Financial Dimension Hierarchies
- Dimension Attributes
- Ledger Parameters

**Accounts Receivable:**
- Customer Posting Profiles

**Accounts Payable:**
- Vendor Posting Profiles

**Inventory Management:**
- Inventory Posting Profiles

**Additional:**
- Legal Entity Information
- Sales Tax Groups & Codes
- Number Sequences
- Intercompany Setup

## 🚀 Installation

### For Development:

1. Clone this repository:
```bash
git clone <repo-url>
cd Dynamics365Finance
```

2. Open Chrome or Edge browser

3. Navigate to `chrome://extensions/` (or `edge://extensions/`)

4. Enable **Developer Mode** (toggle in top-right corner)

5. Click **Load unpacked** and select the project root directory

6. The extension icon will appear in your toolbar

### For Production:

The extension can be packaged and distributed through:
- Chrome Web Store
- Microsoft Edge Add-ons Store
- Internal enterprise deployment via Group Policy

## 💻 Usage

### Basic Workflow:

1. **Navigate to Dynamics 365 Finance** and ensure you're logged in

2. **Open the Extension** by clicking its icon in the toolbar

3. **Select Configuration**:
   - Choose legal entities (or use "Select All")
   - Choose D365F modules to extract
   - Select export format (Excel, CSV, JSON, Text)
   - Choose output content:
     - Include Data
     - Include Comparison

4. **Start Extraction**:
   - Click "Extract Configuration"
   - Monitor progress in real-time
   - Estimated time: 5-15 minutes for 100+ legal entities

5. **Export Results**:
   - Results appear as downloadable files
   - Click "Download" next to each file
   - Files saved to your Downloads folder

### Comparison Features:

The extension automatically generates a **Comparison Report** that includes:

- **Summary**: Overview of all legal entities compared
- **Missing Entities**: Which legal entities lack certain configurations
- **Detailed Differences**: Record-level differences across legal entities
- **Match Status**: Configuration parity between legal entities

### Excel Integration:

Open the generated `.xlsx` file in Excel to:
- Use **Excel Copilot** to analyze differences
- Create pivot tables for quick insights
- Filter and sort configuration data
- Share analysis with stakeholders

## 🏗️ Project Structure

```
Dynamics365Finance/
├── manifest.json              # Extension configuration
├── src/
│   ├── popup/
│   │   ├── toggle.html       # Lightweight popup toggle UI
│   │   └── toggle.js         # Popup toggle logic
│   ├── sidebar/
│   │   ├── sidebar.html      # Main extraction UI
│   │   ├── sidebar.css       # Sidebar styling
│   │   └── sidebar.js        # Extraction + export logic
│   ├── background/
│   │   └── background.js     # Service worker (extraction engine)
│   ├── content/
│   │   └── content.js        # Page context script
│   ├── utils/
│   │   ├── exporters.js      # Export format handlers
│   │   ├── comparator.js     # Comparison engine
│   │   └── (helper utils)
│   └── constants/
│       └── entities.js       # D365F entity definitions
│   └── lib/
│       └── xlsx.full.min.js  # Excel generation library
├── icons/                     # Extension icons
└── README.md
```

## 🔧 Architecture

### Component Overview:

Popup (toggle.html/js)
- Opens/closes the injected sidebar on the active D365F tab

Sidebar (sidebar.html/js)
- Primary extraction UI and workflow
- Legal entity/module selection
- Output selection (Include Data / Include Comparison)
- Direct multi-format export generation

Content Script (content.js)
- Runs in D365F page context
- Injects and toggles sidebar UI

Background Service Worker (background.js)
- Manages extraction sessions
- Coordinates multi-LE extraction
- Handles non-sidebar extraction/export flows
- Manages file downloads
- Uses IndexedDB for large datasets

**Utilities**
- **exporters.js**: Converts data to Excel, CSV, JSON, Text formats
- **comparator.js**: Analyzes differences across legal entities
- **constants/entities.js**: D365F entity metadata

### Data Flow:

```
User selects entities
         ↓
Popup sends message to Content Script
         ↓
Content Script fetches data from OData APIs
         ↓
Data sent to Background Service Worker
         ↓
Comparator analyzes differences
         ↓
Exporters generate files in selected formats
         ↓
Files available for download
```

## 📊 Comparison Report Structure

The generated comparison report includes:

### Summary Section:
```
Legal Entities: USPM, USMF, JPMF
Total Entities: 8
Total Records: 2,450
Missing Entities by LE:
  USPM: None
  USMF: TaxGroups
  JPMF: NumberSequences
```

### Entity Comparisons:
```
[MainAccounts]
  USPM ↔ USMF
    LE1 Records: 145
    LE2 Records: 142
    Difference: 3
    Status: DIFFERENCE ✗

  USPM ↔ JPMF
    LE1 Records: 145
    LE2 Records: 145
    Difference: 0
    Status: MATCH ✓
```

### Detailed Differences:
```
Records with Modifications: 5
Records Added (in some LEs): 8
Records Removed (from some LEs): 3
Unchanged Records: 134
```

## ⚙️ Configuration

### Adjusting Performance:

For very large deployments (200+ legal entities), modify `background.js`:

```javascript
// Increase batch size (default: 10-20 LEs per batch)
const BATCH_SIZE = 30;

// Increase concurrency (default: 5 parallel requests)
const MAX_PARALLEL_REQUESTS = 10;
```

### Custom Entity Selection:

To add additional entities, edit `src/constants/entities.js`:

```javascript
'CustomEntity': {
    name: 'CustomEntity',
    displayName: 'Custom Configuration',
    category: 'Custom',
    odataCollection: 'CustomEntities',
    description: 'Your custom entity description'
}
```

## 🔐 Security & Privacy

- **No Credentials Stored**: Uses your existing D365F session (cookie-based)
- **Local Storage Only**: All data stored locally in your browser
- **No External APIs**: All data remains within your organization
- **HTTPS Only**: Extension only works on secure HTTPS connections
- **No Data Transmission**: Data never leaves your device

## 🐛 Troubleshooting

### Extension not showing legal entities:
1. Ensure you're logged into D365F
2. Check browser console (F12) for errors
3. Verify host permissions in manifest.json
4. Try refreshing the page

### Extraction timeout (100+ LEs):
1. Close other browser tabs
2. Increase batch size in background.js
3. Try extracting fewer legal entities at once
4. Check network connectivity

### Excel file corrupted:
1. Ensure Excel is up-to-date
2. Try exporting as CSV instead
3. Check browser disk space

### Missing data in results:
1. Verify all selected entities exist in D365F
2. Check user permissions for those entities
3. Try single LE extraction first

## 📈 Performance Benchmarks

Typical extraction times (on standard hardware):

| Legal Entities | Entities | Estimated Time |
|---|---|---|
| 5 | 5 | 1-2 min |
| 25 | 5 | 3-5 min |
| 50 | 5 | 5-8 min |
| 100 | 5 | 10-15 min |
| 100 | 10 | 15-25 min |

## 🔄 Version History

v1.1.0 (2026-06-09)
- Sidebar-first workflow documented and aligned with current implementation
- Added selectable export output controls:
   - Include Data
   - Include Comparison
- Export generation now honors selected output options in XLSX/CSV/JSON/TXT
- Fixed legal-entity normalization/filtering regression that could return 0 records
- Added guard to prevent silent empty data exports

**v1.0.0** (2026-06-01)
- Initial release
- Core extraction functionality
- Multi-format export support
- Configuration comparison
- Multi-legal entity support

## 📝 License

This extension is provided as-is for internal use within your organization.

## 🤝 Contributing

To contribute improvements:
1. Create a feature branch
2. Implement your changes
3. Test with 5+ legal entities
4. Submit pull request with description

## 📞 Support

For issues or feature requests:
1. Check the Troubleshooting section
2. Review browser console logs (F12)
3. Contact your IT department
4. Submit an issue with:
   - Extension version
   - Browser & version
   - D365F environment URL (masked)
   - Error message (if any)

## 🚀 Future Enhancements

Planned features:
- [ ] Real-time sync capability
- [ ] Custom entity mapping
- [ ] Scheduled automatic extractions
- [ ] Slack/Teams integration for results
- [ ] Advanced filtering options
- [ ] Configuration rollback capability
- [ ] Audit trail export

---

**Happy Extracting! 🎉**
