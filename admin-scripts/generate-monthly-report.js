// admin-scripts/generate-monthly-report.js

const currentMonth = process.env.CURRENT_MONTH;
const lastMonth = process.env.LAST_MONTH;

if (!currentMonth) {
    console.error("CURRENT_MONTH env variable is required");
    process.exit(1);
}

console.log(`### Monthly Report for ${currentMonth}

- https://github.com/treasuryguild/treasury-apis/commits/main/?since=${currentMonth}-01&until=${currentMonth}-30
- https://github.com/sidan-lab/DRep/commits/main/?since=${currentMonth}-01&until=${currentMonth}-30
- https://github.com/MeshJS/governance/commits/main/?since=${currentMonth}-01&until=${currentMonth}-30
`); 