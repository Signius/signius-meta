# Repository Monitoring Configuration

This directory contains scripts for generating monthly reports and managing repository configurations.

## Files

- `generate-monthly-report.js` - Generates monthly reports based on configured repositories
- `repos-config.json` - Configuration file containing repository information
- `manage-repos.js` - Helper script to manage repository configurations
- `set-project-fields.js` - Sets project board fields for reports

## Configuration

The `repos-config.json` file contains the list of repositories to monitor. Each repository entry includes:

```json
{
  "name": "Display Name",
  "organization": "github-org",
  "repository": "repo-name",
  "focus": "Brief description of the project focus",
  "keyAreas": ["Area 1", "Area 2", "Area 3"]
}
```

## Managing Repositories

Use the `manage-repos.js` script to easily add, remove, or list repositories:

### List all repositories
```bash
node manage-repos.js list
```

### Add a new repository
```bash
node manage-repos.js add "Project Name" organization repo-name "Project focus" "Key area 1, Key area 2, Key area 3"
```

Example:
```bash
node manage-repos.js add "My Web App" myorg mywebapp "Web development" "Frontend, Backend, API"
```

### Remove a repository
```bash
node manage-repos.js remove organization repo-name
```

Example:
```bash
node manage-repos.js remove myorg mywebapp
```

### Show help
```bash
node manage-repos.js help
```

## Report Generation

The monthly report is automatically generated based on the repositories in the config file. The report includes:

- Repository activity links
- Development metrics table
- Detailed analysis for each repository
- Quick stats summary

## GitHub Actions Integration

The workflow in `.github/workflows/monthly-report.yml` automatically:

1. Runs on the first of every month
2. Generates the report using the current repository configuration
3. Creates a GitHub issue with the report
4. Updates project board fields
5. Closes the previous month's report

## Manual Report Generation

To generate a report manually:

```bash
CURRENT_MONTH=2024-01 node generate-monthly-report.js
```

This will output the markdown report to stdout, which can be redirected to a file:

```bash
CURRENT_MONTH=2024-01 node generate-monthly-report.js > report.md
``` 