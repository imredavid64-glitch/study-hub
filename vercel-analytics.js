// Vercel Web Analytics - Initialization
// This script initializes Vercel Web Analytics for the application
import { inject } from './lib/vercel-analytics.mjs';

// Initialize analytics with auto mode (production tracking on Vercel, development logging locally)
inject({ mode: 'auto' });
