import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './Components/Menu';
import World from './Components/World';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { WorldProvider } from './Components/WorldContext';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div className="alert alert-danger">
      <h2>Произошла ошибка:</h2>
      <p>{error.message}</p>
      <button 
        className="btn btn-primary mt-2"
        onClick={() => window.location.href = '/'}
      >
        Вернуться в меню
      </button>
    </div>
  );
}

function WorldWrapper() {
  const { worldId } = useParams();
  return (
    <WorldProvider worldId={worldId}>
      <World />
    </WorldProvider>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route 
        path="/world/:id" 
        element={
          <WorldProvider>
            <World />
          </WorldProvider>
        } 
      />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;