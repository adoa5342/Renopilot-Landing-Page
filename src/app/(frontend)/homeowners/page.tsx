import PageRenderer from '../PageRenderer'
import ProjectsLoader from '../components/ProjectsLoader'

export default function HomeownersPage() {
  return (
      <ProjectsLoader>
        <PageRenderer slug="homeowners" />
      </ProjectsLoader>
    )
}
