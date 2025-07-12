// admin-scripts/get-project-info.js

const { graphql } = require("@octokit/graphql");

const token = process.env.GITHUB_TOKEN;

if (!token) {
    console.error("GITHUB_TOKEN environment variable is required");
    console.error("Set it with: set GITHUB_TOKEN=your_token_here");
    process.exit(1);
}

(async () => {
    try {
        console.log("Fetching project information for Signius organization...\n");

        // Get project ID
        const { organization } = await graphql(
            `query {
        organization(login: "Signius") {
          projectV2(number: 1) {
            id
            title
          }
        }
      }`,
            { headers: { authorization: `token ${token}` } }
        );

        console.log("Project ID:", organization.projectV2.id);
        console.log("Project Title:", organization.projectV2.title);

        // Get fields
        const { node } = await graphql(
            `query {
        node(id: "${organization.projectV2.id}") {
          ... on ProjectV2 {
            fields(first: 30) {
              nodes {
                ... on ProjectV2Field {
                  id
                  name
                  dataType
                }
                ... on ProjectV2IterationField {
                  id
                  name
                  dataType
                }
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  dataType
                }
              }
            }
          }
        }
      }`,
            { headers: { authorization: `token ${token}` } }
        );

        console.log("\nFields:");
        node.fields.nodes.forEach(field => {
            console.log(`- ${field.name}: ${field.id}`);
        });

        console.log("\nCopy these values to your set-project-fields.js script:");
        console.log(`projectId = "${organization.projectV2.id}";`);

        // Find specific fields
        const startDateField = node.fields.nodes.find(f => f.name === "Start date");
        const endDateField = node.fields.nodes.find(f => f.name === "End date");
        const estimateField = node.fields.nodes.find(f => f.name === "Estimate");

        if (startDateField) console.log(`startDateFieldId = "${startDateField.id}";`);
        if (endDateField) console.log(`endDateFieldId = "${endDateField.id}";`);
        if (estimateField) console.log(`estimateFieldId = "${estimateField.id}";`);

    } catch (error) {
        console.error("Error:", error.message);
        console.error("\nMake sure you have the correct permissions and the project exists.");
    }
})(); 