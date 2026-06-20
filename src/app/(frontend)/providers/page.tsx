import PageRenderer from '../PageRenderer'
import ProjectsLoader from '../components/ProjectsLoader'


export default function ProvidersPage() {
  return (
        <ProjectsLoader>
          <PageRenderer slug="providers" />
        </ProjectsLoader>
      )
}
