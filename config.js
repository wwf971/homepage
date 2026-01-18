// Asset paths configuration
export const ASSET_PATHS = {
  HOME_INTRO: 'file_access_point/project/home/0-intro.txt',
  HOME_PROJECTS: 'file_access_point/project/home/projects.yaml',
  HOME_SKILLS: 'file_access_point/project/home/1-skill.yaml',
  HOME_EDUCATION: 'file_access_point/project/home/2-edu.yaml',
  HOME_ACTIVITY: 'file_access_point/project/home/3-activity.yaml',
};

// Helper function to generate individual project asset path
export const getProjectPath = (projectName) => {
  return `file_access_point/project/${projectName}/${projectName}.yaml`;
};

// Import private config - webpack will handle this at build time
// If config.0.js doesn't exist, these will be undefined
import * as configPrivate from './config.0.js';

// Export with fallback to defaults
export const SERVER_URL = configPrivate.SERVER_URL || 'https://example.com:8000';
export const CV_PROJECTS_DISPLAY = configPrivate.CV_PROJECTS_DISPLAY || [
  'project-name-1',
  'project-name-2',
  'project-name-3',
];

// Convenience getter functions
export const getServerUrl = () => SERVER_URL;
export const getCVProjectsDisplay = () => CV_PROJECTS_DISPLAY;

// Log which config was loaded
if (configPrivate.SERVER_URL) {
  console.log('✅ Loaded config.0.js (private configuration)');
  console.log('📡 Server URL:', SERVER_URL);
} else {
  console.log('ℹ️ No config.0.js found, using default config.js values');
  console.log('📡 Server URL:', SERVER_URL);
}
