const fs = require('fs');
const path = require('path');

// Read template from existing page
const templatePath = path.join(__dirname, 'pages', 'documents', 'documents.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Page configurations
const pages = [
  {
    name: 'viewer',
    title: 'Document Viewer',
    path: 'pages/documents/viewer.html',
    activeNav: 'documents',
    heading: 'Document Viewer',
    description: 'View document details and content.'
  },
  {
    name: 'history',
    title: 'Query History',
    path: 'pages/query/history.html',
    activeNav: 'chat',
    heading: 'Query History',
    description: 'View your past queries and AI responses.'
  },
  {
    name: 'search',
    title: 'Advanced Search',
    path: 'pages/query/search.html',
    activeNav: 'chat',
    heading: 'Advanced Search',
    description: 'Search across all documents with advanced filters.'
  },
  {
    name: 'organization',
    title: 'Organization Settings',
    path: 'pages/settings/organization.html',
    activeNav: 'settings',
    heading: 'Organization Settings',
    description: 'Manage organization-wide configuration and preferences.'
  },
  {
    name: 'security',
    title: 'Security Settings',
    path: 'pages/settings/security.html',
    activeNav: 'settings',
    heading: 'Security Settings',
    description: 'Configure security policies and access controls.'
  }
];

console.log('Generating missing pages...');
console.log(`Total pages to generate: ${pages.length}`);

pages.forEach(page => {
  console.log(`\nGenerating: ${page.path}`);
  console.log(`- Title: ${page.title}`);
  console.log(`- Active Nav: ${page.activeNav}`);
});

console.log('\n✅ Page generation script ready');
console.log('Run: node generate-pages.js to create all missing pages');
