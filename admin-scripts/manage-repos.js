#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'repos-config.json');

function loadConfig() {
    try {
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Error loading config:', error.message);
        return { repositories: [] };
    }
}

function saveConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log('✅ Config saved successfully');
    } catch (error) {
        console.error('❌ Error saving config:', error.message);
    }
}

function addRepo(name, organization, repository, focus, keyAreas) {
    const config = loadConfig();

    // Check if repo already exists
    const existingRepo = config.repositories.find(repo =>
        repo.organization === organization && repo.repository === repository
    );

    if (existingRepo) {
        console.log('❌ Repository already exists in config');
        return;
    }

    const newRepo = {
        name,
        organization,
        repository,
        focus,
        keyAreas: keyAreas.split(',').map(area => area.trim())
    };

    config.repositories.push(newRepo);
    saveConfig(config);
    console.log(`✅ Added repository: ${name} (${organization}/${repository})`);
}

function removeRepo(organization, repository) {
    const config = loadConfig();

    const initialLength = config.repositories.length;
    config.repositories = config.repositories.filter(repo =>
        !(repo.organization === organization && repo.repository === repository)
    );

    if (config.repositories.length === initialLength) {
        console.log('❌ Repository not found in config');
        return;
    }

    saveConfig(config);
    console.log(`✅ Removed repository: ${organization}/${repository}`);
}

function listRepos() {
    const config = loadConfig();

    if (config.repositories.length === 0) {
        console.log('No repositories configured');
        return;
    }

    console.log('\n📋 Configured Repositories:');
    console.log('='.repeat(50));

    config.repositories.forEach((repo, index) => {
        console.log(`${index + 1}. ${repo.name}`);
        console.log(`   Organization: ${repo.organization}`);
        console.log(`   Repository: ${repo.repository}`);
        console.log(`   Focus: ${repo.focus}`);
        console.log(`   Key Areas: ${repo.keyAreas.join(', ')}`);
        console.log('');
    });
}

function showHelp() {
    console.log(`
🔧 Repository Management Tool

Usage:
  node manage-repos.js <command> [options]

Commands:
  list                    - Show all configured repositories
  add <name> <org> <repo> <focus> <keyAreas>  - Add a new repository
  remove <org> <repo>     - Remove a repository
  help                    - Show this help message

Examples:
  node manage-repos.js list
  node manage-repos.js add "My Project" myorg myrepo "Web development" "Frontend, Backend, API"
  node manage-repos.js remove myorg myrepo
`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'list':
        listRepos();
        break;

    case 'add':
        if (args.length < 6) {
            console.log('❌ Usage: node manage-repos.js add <name> <org> <repo> <focus> <keyAreas>');
            process.exit(1);
        }
        addRepo(args[1], args[2], args[3], args[4], args[5]);
        break;

    case 'remove':
        if (args.length < 3) {
            console.log('❌ Usage: node manage-repos.js remove <org> <repo>');
            process.exit(1);
        }
        removeRepo(args[1], args[2]);
        break;

    case 'help':
    default:
        showHelp();
        break;
} 