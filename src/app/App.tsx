import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { TicketProvider } from './contexts/TicketContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TicketProvider>
          <RouterProvider router={router} />
        </TicketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
