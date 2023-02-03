import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard/ui/Dashboard';
import AuthContext from '../../pages/main/auth/AuthContext';
import MainPage from '../../pages/main/MainPage';
import Settings from '../../pages/Settings/ui/Settings';
import Transactions from '../../pages/Transactions/ui/Transactions';
import View from '../../processes/View';
import { privateRoutes, publicRoutes } from './routes';

function AppRouter() {
  const { isAuth } = useContext(AuthContext);
  return isAuth ? (
    <Routes>
      {publicRoutes.map((routPath) => (
        <Route path={routPath} key={routPath} element={<Navigate to='/dashboard' />} />
      ))}
      <Route
        path='/dashboard'
        element={
          <main className='page'>
            <View />
            <Dashboard />
          </main>
        }
      />
      <Route
        path='/transactions'
        element={
          <main className='page'>
            <View />
            <Transactions />
          </main>
        }
      />
      <Route
        path='/settings'
        element={
          <main className='page'>
            <View />
            <Settings />
          </main>
        }
      />
      <Route path='*' element={<h1>NOT FOUND</h1>} />
    </Routes>
  ) : (
    <Routes>
      {privateRoutes.map((routPath) => (
        <Route path={routPath} key={routPath} element={<Navigate to='/' />} />
      ))}
      <Route path='/' element={<MainPage />}>
        <Route path='login' element={<h1>login</h1>} />
        <Route path='sign' element={<h1>registration</h1>} />
      </Route>
      <Route path='*' element={<h1>NOT FOUND</h1>} />
    </Routes>
  );
}

export default AppRouter;