// admin-scripts/generate-monthly-report.js
const fs = require('fs');
const path = require('path');

const currentMonth = process.env.CURRENT_MONTH;
const lastMonth = process.env.LAST_MONTH;

if (!currentMonth) {
    console.error("CURRENT_MONTH env variable is required");
    process.exit(1);
}

// Load repository configuration
function loadRepoConfig() {
    try {
        const configPath = path.join(__dirname, 'repos-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Error loading repository config:', error.message);
        process.exit(1);
    }
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

// Generate repository activity links section
function generateRepoActivityLinks(repos, currentMonth, lastDayOfMonth) {
    let linksSection = '';

    repos.forEach(repo => {
        const org = repo.organization;
        const repoName = repo.repository;
        const displayName = repo.name;

        linksSection += `### ${displayName}
- **Repository**: [${org}/${repoName}](https://github.com/${org}/${repoName})
- **Commit History**: [View ${getMonthName(currentMonth)} commits](https://github.com/${org}/${repoName}/commits/main/?since=${currentMonth}-01&until=${currentMonth}-${lastDayOfMonth})
- **Pull Requests**: [View ${getMonthName(currentMonth)} PRs](https://github.com/${org}/${repoName}/pulls?q=is%3Apr+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth})

`;
    });

    return linksSection;
}

// Generate repository comparison table
function generateRepoComparisonTable(repos, currentMonth, lastDayOfMonth) {
    let tableRows = '';

    repos.forEach(repo => {
        const org = repo.organization;
        const repoName = repo.repository;
        const displayName = repo.name;

        tableRows += `| ${displayName} | [View](https://github.com/${org}/${repoName}/commits/main/?since=${currentMonth}-01&until=${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/${org}/${repoName}/pulls?q=is%3Apr+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/${org}/${repoName}/issues?q=is%3Aissue+created%3A${currentMonth}-01..${currentMonth}-${lastDayOfMonth}) | [View](https://github.com/${org}/${repoName}/stargazers) |
`;
    });

    return tableRows;
}

// Generate detailed analysis section
function generateDetailedAnalysis(repos) {
    let analysisSection = '';

    repos.forEach(repo => {
        const displayName = repo.name;
        const focus = repo.focus;
        const keyAreas = repo.keyAreas.join(', ');
        const estimate = repo.estimate;

        analysisSection += `### ${displayName}
- **Focus**: ${focus}
- **Key Areas**: ${keyAreas}
- **Estimated Budget**: $${estimate.toLocaleString()}
- **Recent Activity**: Check commit history for latest developments

`;
    });

    return analysisSection;
}

// Generate estimates summary
function generateEstimatesSummary(repos) {
    const totalEstimate = repos.reduce((sum, repo) => sum + (repo.estimate || 0), 0);
    const avgEstimate = repos.length > 0 ? Math.round(totalEstimate / repos.length) : 0;

    return `### Estimates Summary
- **Total Estimated Budget**: $${totalEstimate.toLocaleString()}
- **Average per Repository**: $${avgEstimate.toLocaleString()}
- **Repositories with Estimates**: ${repos.filter(repo => repo.estimate).length}/${repos.length}

`;
}

const config = loadRepoConfig();
const repos = config.repositories;
const monthName = getMonthName(currentMonth);
const previousMonth = lastMonth || getPreviousMonth(currentMonth);
const previousMonthName = getMonthName(previousMonth);
const lastDayOfMonth = getLastDayOfMonth(currentMonth);

console.log(`Monthly Report for ${monthName}

## 🎯 Executive Summary
This report provides a comprehensive overview of development activities across our key repositories for ${monthName}.

---

## 🔗 Repository Activity Links

${generateRepoActivityLinks(repos, currentMonth, lastDayOfMonth)}
---

## 📈 Quick Stats
- **Reporting Period**: ${currentMonth}-01 to ${currentMonth}-${lastDayOfMonth}
- **Previous Month**: ${previousMonthName}
- **Repositories Tracked**: ${repos.length}

---

## 🛠️ Development Metrics

### Repository Comparison
| Repository | Commits | PRs | Issues | Stars |
|------------|---------|-----|--------|-------|
${generateRepoComparisonTable(repos, currentMonth, lastDayOfMonth)}

---

## 🔍 Detailed Analysis

${generateEstimatesSummary(repos)}
${generateDetailedAnalysis(repos)}
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