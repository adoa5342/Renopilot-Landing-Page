import PageRenderer from '../PageRenderer'
import ProjectsLoader from '../components/ProjectsLoader'

export default function RegisterPage() {
  return (
      <ProjectsLoader>
        <PageRenderer slug="register-form" />
      </ProjectsLoader>
    )
}
