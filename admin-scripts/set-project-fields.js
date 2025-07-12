// admin-scripts/set-project-fields.js

const { graphql } = require("@octokit/graphql");

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY; // e.g. "owner/repo"
const issueTitle = process.env.ISSUE_TITLE; // e.g. "Monthly Report for 2025-07"
let startDate = process.env.START_DATE;   // e.g. "2025-07" or "2025-07-01"
let endDate = process.env.END_DATE;         // e.g. "2025-07-30" or undefined
const estimate = process.env.ESTIMATE;      // e.g. "5"

if (!token || !repo || !issueTitle || !startDate || !estimate) {
  console.error("Missing required environment variables");
  process.exit(1);
}

// Normalize startDate to YYYY-MM-DD if only YYYY-MM is provided
if (/^\d{4}-\d{2}$/.test(startDate)) {
  startDate = `${startDate}-01`;
}

// Calculate last day of the month if endDate is not provided
if (!endDate) {
  const start = new Date(startDate);
  const year = start.getUTCFullYear();
  const month = start.getUTCMonth();
  // Set to first day of next month, then subtract one day
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  // Format as YYYY-MM-DD
  endDate = lastDay.toISOString().slice(0, 10);
}

const [owner, name] = repo.split("/");

// Project and field IDs from GitHub secrets
const projectId = process.env.PROJECT_ID;
const startDateFieldId = process.env.START_DATE_FIELD_ID;
const endDateFieldId = process.env.END_DATE_FIELD_ID;
const estimateFieldId = process.env.ESTIMATE_FIELD_ID;

if (!projectId || !startDateFieldId || !endDateFieldId || !estimateFieldId) {
  console.error("Missing required field IDs. Please set PROJECT_ID, START_DATE_FIELD_ID, END_DATE_FIELD_ID, and ESTIMATE_FIELD_ID secrets.");
  process.exit(1);
}

(async () => {
  // 1. Find the issue node ID
  const { repository } = await graphql(
    `
      query($owner: String!, $name: String!, $title: String!) {
        repository(owner: $owner, name: $name) {
          issues(first: 1, filterBy: { states: OPEN }, orderBy: { field: CREATED_AT, direction: DESC }, query: $title) {
            nodes {
              id
              title
              number
            }
          }
        }
      }
    `,
    { owner, name, title: issueTitle, headers: { authorization: `token ${token}` } }
  );

  const issue = repository.issues.nodes[0];
  if (!issue) {
    console.error("Issue not found");
    process.exit(1);
  }

  // 2. Set project fields (repeat for each field)
  const updateField = async (fieldId, value) => {
    await graphql(
      `
        mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) {
          updateProjectV2ItemFieldValue(
            input: {
              projectId: $projectId
              itemId: $itemId
              fieldId: $fieldId
              value: { text: $value }
            }
          ) {
            projectV2Item {
              id
            }
          }
        }
      `,
      {
        projectId,
        itemId: issue.id,
        fieldId,
        value,
        headers: { authorization: `token ${token}` }
      }
    );
  };

  await updateField(startDateFieldId, startDate);
  await updateField(endDateFieldId, endDate);
  await updateField(estimateFieldId, estimate);

  console.log("Project fields updated!");
})(); 