
// import { type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { NotFoundPage } from '../pages/NotFoundPage';
import { RequestsListPage } from '../pages/customers/list';
import { NewRequestPage } from '../pages/customers/new';
import { RequestDetailPage } from '../pages/customers/view';

function AppRoutes() {
 

  return (
        <Routes>
         
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route
            path="/list"
            element={
             
                <RequestsListPage />
             
            }
          />
          <Route
            path="/new"
            element={
             
                <NewRequestPage />
             
            }
          />
          <Route
            path="customers/:requestId"
            element={
             
                <RequestDetailPage />
             
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
  )
}

export default AppRoutes