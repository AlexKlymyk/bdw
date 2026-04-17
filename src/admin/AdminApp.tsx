import { Refine, Authenticated } from '@refinedev/core'
import { dataProvider, liveProvider } from '@refinedev/supabase'
import { ThemedLayout, ErrorComponent, RefineThemes, useNotificationProvider } from '@refinedev/antd'
import routerProvider from '@refinedev/react-router'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { App as AntApp, ConfigProvider } from 'antd'
import { PushpinOutlined, NodeIndexOutlined } from '@ant-design/icons'

import '@refinedev/antd/dist/reset.css'

import { supabaseClient } from '../lib/supabase'
import { authProvider } from '../lib/authProvider'
import LoginPage from './pages/login/LoginPage'
import StickerList from './pages/stickers/StickerList'
import StickerCreate from './pages/stickers/StickerCreate'
import StickerEdit from './pages/stickers/StickerEdit'
import ThreadList from './pages/threads/ThreadList'
import ThreadCreate from './pages/threads/ThreadCreate'
import ThreadEdit from './pages/threads/ThreadEdit'

export default function AdminApp() {
  return (
    <ConfigProvider theme={RefineThemes.Blue}>
      <AntApp>
        <Refine
          dataProvider={dataProvider(supabaseClient)}
          liveProvider={liveProvider(supabaseClient)}
          routerProvider={routerProvider}
          authProvider={authProvider}
          notificationProvider={useNotificationProvider}
          resources={[
            {
              name: 'stickers',
              list: '/admin/stickers',
              create: '/admin/stickers/create',
              edit: '/admin/stickers/edit/:id',
              meta: {
                label: 'Stickers',
                icon: <PushpinOutlined />,
              },
            },
            {
              name: 'threads',
              list: '/admin/threads',
              create: '/admin/threads/create',
              edit: '/admin/threads/edit/:id',
              meta: {
                label: 'Threads',
                icon: <NodeIndexOutlined />,
              },
            },
          ]}
          options={{ syncWithLocation: true }}
        >
          <Routes>
            <Route path="login" element={<LoginPage />} />

            <Route
              element={
                <Authenticated key="admin" fallback={<Navigate to="/admin/login" replace />}>
                  <ThemedLayout>
                    <Outlet />
                  </ThemedLayout>
                </Authenticated>
              }
            >
              <Route index element={<Navigate to="stickers" replace />} />

              <Route path="stickers">
                <Route index element={<StickerList />} />
                <Route path="create" element={<StickerCreate />} />
                <Route path="edit/:id" element={<StickerEdit />} />
              </Route>

              <Route path="threads">
                <Route index element={<ThreadList />} />
                <Route path="create" element={<ThreadCreate />} />
                <Route path="edit/:id" element={<ThreadEdit />} />
              </Route>

              <Route path="*" element={<ErrorComponent />} />
            </Route>
          </Routes>
        </Refine>
      </AntApp>
    </ConfigProvider>
  )
}
