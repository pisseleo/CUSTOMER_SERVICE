
// import { type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { NotFoundPage } from '../pages/NotFoundPage';
import { RequestsListPage } from '../pages/customers/list';
import { NewRequestPage } from '../pages/customers/new';
import { RequestDetailPage } from '../pages/customers/view';

function AppRoutes() {
 

  return (
        <Routes>
         
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route
            path="/customers"
            element={
             
                <RequestsListPage />
             
            }
          />
          <Route
            path="/customers/new"
            element={
             
                <NewRequestPage />
             
            }
          />
          <Route
            path="/customers/:requestId"
            element={
             
                <RequestDetailPage />
             
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
  )
}

export default AppRoutes