import React, { useRef } from 'react'
import ControlPanel from '@/cv/ControlPanel.jsx'
import A4Container from '@/cv/A4Container.jsx'
import CVEducation from '@/cv/CVEducation.jsx'
import CVWork from '@/cv/CVWork.jsx'
import CVProjectCard from '@/cv/CVProjectCard.jsx'
import SkillTree from '@/home/SkillTree.jsx'
import { useAssetStore } from '@/asset/Asset.js'
import { ASSET_PATHS, getCVProjectsDisplay, EMAIL, GITHUB_URL, SERVER_URL } from '../../config.js'
import '@/markdown-yaml/Node.css'
import './CV.css'

const CV = () => {
  const exportRef = useRef(null)
  const skillsAsset = useAssetStore((state) => state.assets[ASSET_PATHS.HOME_SKILLS] || null);
  const projectsAsset = useAssetStore((state) => state.assets[ASSET_PATHS.HOME_PROJECTS] || null);

  const projectsDisplay = getCVProjectsDisplay();
  const homepageUrl = `${SERVER_URL.replace(/\/$/, '')}/home/`;

  // Get filtered and ordered projects for display
  const getProjectsForCV = () => {
    if (!projectsAsset?.content?.data) return []
    
    const allProjects = projectsAsset.content.data
    const projectsMap = {}
    
    // Create a map of project names to project data
    allProjects.forEach(projectItem => {
      const [key, project] = Object.entries(projectItem)[0]
      console.log(`Project ${key}:`, project)
      console.log(`Project ${key} place:`, project.place)
      projectsMap[key] = { ...project, key }
    })
    
    // Return projects in the specified order
    return projectsDisplay
      .map(name => projectsMap[name])
      .filter(project => project) // Remove any undefined projects
  }

  const cvProjects = getProjectsForCV()

  return (
    <div className="cv-page">
      <ControlPanel exportRef={exportRef} />
      <A4Container ref={exportRef}>
        <div className="cv-content">
          <div className="cv-header">
            <div className="cv-name">Weifan Wang</div>
            <div className="cv-contact">
              <span>email: {EMAIL}</span>
              <span>github: {GITHUB_URL}</span>
            </div>
            <div className="cv-contact">
              <span>homepage: {homepageUrl}</span>
            </div>
          </div>
          {/* Education Section */}
          <CVEducation />
          <CVWork />

          {/* Research Projects Section */}
          <div className="cv-projects-section">
            <div className="cv-section-title">Project Experiences</div>
            {cvProjects.length > 0 ? (
              <div className="cv-projects-container">
                {cvProjects.map((project, index) => (
                  <CVProjectCard key={project.key || index} project={project} />
                ))}
              </div>
            ) : (
              <div className="cv-projects-loading">
                Loading research projects...
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="cv-skills-section">
            <div className="cv-section-title">Skill Set</div>
            <SkillTree skillsAsset={skillsAsset} title={null} />
          </div>
        </div>
      </A4Container>
    </div>
  )
}

export default CV
