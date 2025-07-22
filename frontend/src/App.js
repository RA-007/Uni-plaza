import logo from './logo.svg';
import './App.css';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <div className="App">
  <AdminDashboard />
  <StudentDashboard />
    </div>
  );
}

export default App;
