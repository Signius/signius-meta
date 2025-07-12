// admin-scripts/generate-monthly-report.js

const currentMonth = process.env.CURRENT_MONTH;
const lastMonth = process.env.LAST_MONTH;

if (!currentMonth) {
    console.error("CURRENT_MONTH env variable is required");
    process.exit(1);
}

// Helper function to get month name
function getMonthName(monthStr) {
    const date = new Date(`${monthStr}-01`);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Helper function to get previous month
function getPreviousMonth(monthStr) {
    const date = new Date(`${monthStr}-01`);
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
}

// Helper function to get the last day of the month
function getLastDayOfMonth(monthStr) {
    const date = new Date(`${monthStr}-01`);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.getDate();
}

const monthName = getMonthName(currentMonth);
const previousMonth = lastMonth || getPreviousMonth(currentMonth);
const previousMonthName = getMonthName(previousMonth);
const lastDayOfMonth = getLastDayOfMonth(currentMonth);

console.log(`Monthly Report for ${monthName}

## 🎯 Executive Summary
This report provides a comprehensive overview of development activities across our key repositories for ${monthName}.

---

## 🔗 Repository Activity Links

### Treasury Guild
- **Repository**: [treasuryguild/treasury-apis](https://github.com/treasuryguild/treasury-apis)
- **Commit History**: [View ${monthName} commits](https://github.com/treasuryguild/treasury-apis/commits/main/?since=${currentMonth}-01&until=${currentMonth}-${lastDayOfMonth})
- **Pull Requests**: [View ${monthName} PRs](https://github.com/treasuryguild/treasury-apis/pulls?q=is%3Apr+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth})

### Sidan Labs
- **Repository**: [sidan-lab/DRep](https://github.com/sidan-lab/DRep)
- **Commit History**: [View ${monthName} commits](https://github.com/sidan-lab/DRep/commits/main/?since=${currentMonth}-01&until=${currentMonth}-${lastDayOfMonth})
- **Pull Requests**: [View ${monthName} PRs](https://github.com/sidan-lab/DRep/pulls?q=is%3Apr+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth})

### MeshJS
- **Repository**: [MeshJS/governance](https://github.com/MeshJS/governance)
- **Commit History**: [View ${monthName} commits](https://github.com/MeshJS/governance/commits/main/?since=${currentMonth}-01&until=${currentMonth}-${lastDayOfMonth})
- **Pull Requests**: [View ${monthName} PRs](https://github.com/MeshJS/governance/pulls?q=is%3Apr+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth})

---

## 📈 Quick Stats
- **Reporting Period**: ${currentMonth}-01 to ${currentMonth}-${lastDayOfMonth}
- **Previous Month**: ${previousMonthName}
- **Repositories Tracked**: 3

---

## 🛠️ Development Metrics

### Repository Comparison
| Repository | Commits | PRs | Issues | Stars |
|------------|---------|-----|--------|-------|
| Treasury Guild | [View](https://github.com/treasuryguild/treasury-apis/commits/main/?since=${currentMonth}-01&until=${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/treasuryguild/treasury-apis/pulls?q=is%3Apr+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/treasuryguild/treasury-apis/issues?q=is%3Aissue+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/treasuryguild/treasury-apis/stargazers) |
| Sidan Labs | [View](https://github.com/sidan-lab/DRep/commits/main/?since=${currentMonth}-01&until=${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/sidan-lab/DRep/pulls?q=is%3Apr+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/sidan-lab/DRep/issues?q=is%3Aissue+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/sidan-lab/DRep/stargazers) |
| MeshJS | [View](https://github.com/MeshJS/governance/commits/main/?since=${currentMonth}-01&until=${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/MeshJS/governance/pulls?q=is%3Apr+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/MeshJS/governance/issues?q=is%3Aissue+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/MeshJS/governance/stargazers) |

---

## 🔍 Detailed Analysis

### Treasury Guild
- **Focus**: Treasury management and financial APIs
- **Key Areas**: Payment processing, financial calculations, treasury operations
- **Recent Activity**: Check commit history for latest developments

### Sidan Labs
- **Focus**: Decentralized reputation
- **Key Areas**: Data fetching, data processing, dashboards, and more
- **Recent Activity**: Check commit history for latest developments

### MeshJS
- **Focus**: Decentralized reputation
- **Key Areas**: Data fetching, data processing, dashboards, and more
- **Recent Activity**: Check commit history for latest developments

---

## 🎯 Next Steps
1. Review commit activity across all repositories
2. Analyze pull request trends and code review processes
3. Monitor issue resolution and bug fixes
4. Track community engagement and contributions

---

*Report generated on ${new Date().toISOString().split('T')[0]}*
*For detailed analytics, visit the individual repository links above.*
`); 