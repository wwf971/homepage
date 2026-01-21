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

// Try to load private config, fall back to defaults if it doesn't exist
let configPrivate = {};
try {
  configPrivate = await import('./config.0.js');
  console.log('[CONFIG] Loaded config.0.js (private configuration)');
} catch {
  console.log('[CONFIG] No config.0.js found, using default config.js values');
}

// Export with fallback to defaults
export const SERVER_URL = configPrivate.SERVER_URL || 'https://example.com:8000';
export const CV_PROJECTS_DISPLAY = configPrivate.CV_PROJECTS_DISPLAY || [
  'project-name-1',
  'project-name-2',
  'project-name-3',
];
export const EMAIL = configPrivate.EMAIL || 'example@email.com';
export const GITHUB_URL = configPrivate.GITHUB_URL || 'https://github.com/username';
export const GITHUB_URL_THIS_PAGE = configPrivate.GITHUB_URL_THIS_PAGE || 'https://github.com/username/homepage';

// Convenience getter functions
export const getServerUrl = () => SERVER_URL;
export const getCVProjectsDisplay = () => CV_PROJECTS_DISPLAY;

console.log('📡 Server URL:', SERVER_URL);
