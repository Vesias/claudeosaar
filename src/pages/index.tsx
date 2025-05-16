import Dashboard from '../ui/dashboard';
import { withAuth } from '../components/withAuth';

function Home() {
  return <Dashboard />;
}

export default withAuth(Home);