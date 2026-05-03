const { writeFileSync, mkdirSync } = require('fs');

const backendUrl =
  process.env.BACKEND_URL ||
  'https://peach-nutrition-angular-server.onrender.com';

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';

const content = `// Auto-generated at build time — do not edit manually.
export const environment = {
  production: true,
  apiUrl: '/api',
  backendUrl: '${backendUrl}',
  stripePublishableKey: '${stripePublishableKey}',
};
`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync('./src/environments/environment.ts', content);
console.log(`environment.ts generated (backendUrl=${backendUrl})`);
