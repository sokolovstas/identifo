import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Header, Main } from '../components';
import { Context as AppContext } from '../context/app-context';

function App() {
  const { state } = useContext(AppContext)
  if (state.isAuthenticated) return <Redirect to='/demo' />
  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}

export default App;
