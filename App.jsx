import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import CV from '@/cv/CV.jsx'
import Test from '@/test/Test.jsx'
import TestMarkdown from '@/test/TestMarkdown.jsx'
import AssetInfo from '@/asset/AssetInfo.jsx'
import ProjectRouter from '@/project/ProjectRouter.jsx'
import { useAssetStore } from '@/asset/Asset.js'
import { useProjectsMetadataStore } from '@/project/ProjectsMetadataStore.js'
import { ASSET_PATHS } from './config.js'

// centralized asset fetching hook
function useGlobalAssetFetch() {
  const assetPaths = [
    ASSET_PATHS.HOME_INTRO,
    ASSET_PATHS.HOME_PROJECTS,
    ASSET_PATHS.HOME_SKILLS,
    ASSET_PATHS.HOME_EDUCATION,
    ASSET_PATHS.HOME_WORK,
    ASSET_PATHS.HOME_ACTIVITY,
  ];

  const { receiveProjectsAsset } = useProjectsMetadataStore();

  React.useEffect(() => {
    const store = useAssetStore.getState();
    
    // Fetch all assets that need refreshing
    assetPaths.forEach(assetPath => {
      const currentAsset = store.assets[assetPath];
      if (!currentAsset || store.shouldRefetch(assetPath)) {
        store.fetchAsset(assetPath);
      }
    });
  }, []);

  // Subscribe to projects asset changes and process metadata
  const projectsAssetPath = ASSET_PATHS.HOME_PROJECTS;
  const projectsAsset = useAssetStore((state) => state.assets[projectsAssetPath] || null);
  const { setError: setProjectsError } = useProjectsMetadataStore();
  
  React.useEffect(() => {
    if (projectsAsset?.status === 'error') {
      // Handle asset fetch or parsing errors
      console.log('❌ Projects asset error in App.jsx:', projectsAsset.error);
      setProjectsError(projectsAsset.error || 'Failed to load projects');
    } else if (projectsAsset?.content?.type === 'json' && projectsAsset.content.data) {
      // Handle successful load
      console.log('🔄 Processing projects metadata in App.jsx');
      receiveProjectsAsset(projectsAsset);
    }
  }, [projectsAsset, receiveProjectsAsset, setProjectsError]);
}

function App() {
  console.log('App component rendering');
  // initialize global asset fetching
  useGlobalAssetFetch();
  
  return (
    <Router>
      <div>
        <Routes>
          {/* Root route */}
          <Route path="/" element={<Home />} />
          
          {/* CV routes - both with and without trailing slash */}
            <Route path="/cv" element={<CV />} />
            <Route path="/cv/" element={<CV />} />

          {/* Home routes - both with and without trailing slash */}
          <Route path="/home" element={<Home />} />
          <Route path="/home/" element={<Home />} />


          {/* Test routes */}
          <Route path="/test" element={<Test />} />
          <Route path="/test/" element={<Test />} />

          <Route path="/test-markdown" element={<TestMarkdown />} />
          <Route path="/test-markdown/" element={<TestMarkdown />} />
          
          {/* Asset routes - captures any URL starting with /asset/ */}
          <Route path="/asset/*" element={<AssetInfo />} />

          {/* Show routes - same component as asset routes */}
          <Route path="/show/*" element={<AssetInfo />} />

          {/* Project routes */}
          <Route path="/project/*" element={<ProjectRouter />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <a href="/home/" style={{ color: '#007acc' }}>Go back to Home</a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App