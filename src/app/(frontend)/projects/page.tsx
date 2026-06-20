import PageRenderer from '../PageRenderer'
import ProjectsLoader from '../components/ProjectsLoader'

// This is a server component by default
export default function ProjectsPage() {
  return (
    <ProjectsLoader>
      <PageRenderer slug="projects" />
    </ProjectsLoader>
  )
}
