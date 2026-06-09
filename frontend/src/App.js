import React from 'react';
import Page2 from './components/page2';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Student Data Manager</h1>
        <p>Manage your student records with the backend API.</p>
      </header>
      <main>
        <Page2 />
      </main>
    </div>
  );
}

export default App;
