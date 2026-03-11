import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;