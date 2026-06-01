# Quick Start Guide

Get the D365 Finance Configuration Extractor up and running in minutes.

## 🚀 Installation (Development Mode)

### Step 1: Load Extension in Chrome/Edge

1. **Open your browser extensions page**:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

2. **Enable Developer Mode**:
   - Look for toggle in top-right corner
   - Click to enable

3. **Load the extension**:
   - Click "Load unpacked" button
   - Navigate to your `Dynamics365Finance` folder
   - Select it (the folder with `manifest.json`)
   - Click "Select Folder"

4. **Verify installation**:
   - Extension icon appears in toolbar
   - Click icon to open popup
   - You should see the extraction form

### Step 2: Navigate to D365F

1. Go to your Dynamics 365 Finance instance (e.g., `https://d365instance.dynamics.com`)
2. Log in with your credentials
3. You're ready to extract!

## 📊 Basic Usage

### Extract Configuration

1. **Click the extension icon** in your toolbar

2. **Select Legal Entities**:
   - Click "Select All" to choose all LEs
   - Or manually check specific ones
   - At least one must be selected

3. **Select Entities to Extract**:
   - Check the entities you want:
     - **Ledgers** (recommended) - Chart of accounts setup
     - **Main Accounts** - GL account definitions
     - **Dimension Hierarchies** - Dimension structure
     - **Posting Profiles** - AR/AP/Inventory posting rules

4. **Choose Export Formats**:
   - ✅ **Excel** - For analysis and Excel AI integration
   - ✅ **CSV** - For legacy systems
   - ✅ **JSON** - For API/programmatic use
   - ✅ **Text** - For documentation

5. **Optional: Include Comparison**:
   - Check "Include Comparison Report"
   - This auto-generates a summary of differences

6. **Click "Extract Configuration"**:
   - Watch the progress bar
   - Typical time: 2-15 minutes depending on data volume

7. **Download Results**:
   - When complete, download links appear
   - Files save to your Downloads folder

## 📈 Example: Comparing 3 Legal Entities

**Scenario**: You need to compare GL setup between USPM, USMF, and JPMF

### Steps:

1. Open extension on D365F logged in as any user
2. Select all 3 LEs (check USPM, USMF, JPMF)
3. Select: Ledgers, MainAccounts, DimensionHierarchies
4. Check "Include Comparison Report"
5. Select Excel format
6. Click "Extract Configuration"

### Results (in Excel):

- **Sheet 1: Metadata** - Overview of extraction
- **Sheet 2: Ledgers** - All GL setup data
- **Sheet 3: MainAccounts** - All GL accounts
- **Sheet 4: DimensionHierarchies** - Dimension structure
- **Sheet 5: Comparison** - Differences between LEs:
  ```
  USPM vs USMF: 3 accounts missing in USMF
  USPM vs JPMF: Configurations match ✓
  USMF vs JPMF: 5 accounts different
  ```

## 🔍 Analyzing Results in Excel

### Using Excel's AI (Copilot):

1. Open the generated `.xlsx` file
2. Click **Copilot** (Microsoft 365 subscribers)
3. Ask questions like:
   - "Which accounts are only in USPM?"
   - "What posting profiles differ between USMF and JPMF?"
   - "Summarize the main configuration differences"

### Manual Analysis:

1. Use **Data → Filter** to filter by Legal Entity
2. Create **Pivot Tables** to summarize differences
3. Use **Conditional Formatting** to highlight mismatches
4. Copy to PowerPoint for stakeholder presentations

## ⚡ Tips & Tricks

### Performance Tips:

- **Large volume?** Extract 10-20 LEs at a time
- **First time slow?** Normal for 100+ LEs, give it time
- **Timeouts?** Close other browser tabs

### Best Practices:

1. **Schedule for off-hours** - Less network congestion
2. **Start with 1-2 entities** - Test before full extraction
3. **Keep Excel open** - Don't open multiple downloads simultaneously
4. **Export to network drive** - For team sharing

### Troubleshooting:

| Issue | Solution |
|-------|----------|
| No legal entities showing | Refresh page, ensure you're on D365F |
| Extraction stalls | Check network, close other tabs, cancel & retry |
| Excel file won't open | Try CSV format instead |
| Missing data in results | Verify user has read permissions for entities |

## 📝 Example: Posting Profile Comparison

Extract posting profiles to identify AR/AP setup differences:

```
Extraction Settings:
├─ Legal Entities: All (5 LEs)
├─ Entities:
│  ├─ Customer Posting Profiles
│  └─ Vendor Posting Profiles
└─ Format: Excel + JSON

Results:
├─ Excel file with all posting rules
├─ Comparison sheet showing:
│  ├─ USPM: 45 customer profiles
│  ├─ USMF: 43 customer profiles (2 missing)
│  └─ Difference flagged in red
└─ JSON file for programmatic processing
```

## 🎯 Next Steps

1. ✅ Install extension
2. ✅ Try a test extraction with 2-3 LEs
3. ✅ Review results in Excel
4. ✅ Share with finance/accounting team
5. ✅ Use insights for configuration standardization

## 📞 Need Help?

- **Check logs**: Press F12, look at Console tab
- **Read DEVELOPMENT.md** for advanced setup
- **Review README.md** for feature details
- **Check extension permissions** in `chrome://extensions/`

---

**Ready to extract?** Click the extension icon and get started! 🚀
