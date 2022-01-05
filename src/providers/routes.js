import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from '../redux/user/selectors'
import paths from 'shared/paths'
import pages from 'shared/authorizedPages'
import Spinner from 'ui/Spinner/Spinner'

import Dashboard from 'components/Dashboard'
import Adherents from 'components/Adherents'
import Messagerie from 'components/Messagerie'
import Elections from 'components/Elections'
import Ripostes from 'components/Ripostes'
import Groups from 'components/Groups'
import News from 'components/News'
import Phoning from 'components/Phoning'
import DTD from 'components/DTD'
import NoMatch from 'components/NoMatch'

const AppRoutes = () => {
  const location = useLocation()
  const authorizedPages = useSelector(getAuthorizedPages)

  useEffect(() => window.scrollTo(0, 0), [location])

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="*" element={<NoMatch />} />
        <Route path={paths.dashboard} element={authorizedPages.includes(pages.dashboard) && <Dashboard />} />
        <Route path={paths.adherents} element={authorizedPages.includes(pages.adherents) && <Adherents />} />
        <Route path={`${paths.messagerie}/*`} element={authorizedPages.includes(pages.messagerie) && <Messagerie />} />
        <Route path={paths.elections} element={authorizedPages.includes(pages.elections) && <Elections />} />
        <Route path={paths.ripostes} element={authorizedPages.includes(pages.ripostes) && <Ripostes />} />
        <Route path={`${paths.groups}/*`} element={authorizedPages.includes(pages.groups) && <Groups />} />
        <Route path={paths.news} element={authorizedPages.includes(pages.news) && <News />} />
        <Route path={`${paths.phoning}/*`} element={authorizedPages.includes(pages.phoning) && <Phoning />} />
        <Route path={`${paths.DTD}/*`} element={authorizedPages.includes(pages.DTD) && <DTD />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
