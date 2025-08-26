import NavBar from './components/NavBar/NavBar';
import './App.css';

function App() {
  return (
    <div className="App">
      <NavBar />
      <main className="main-content">
        <div className="content-wrapper">
          <h1>Bem-vindo ao Se Doce Fosse</h1>
          <p>Sistema de gestão administrativa</p>
          <div className="dashboard-preview">
            <h2>Dashboard</h2>
            <p>Selecione uma opção no menu lateral para começar.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
