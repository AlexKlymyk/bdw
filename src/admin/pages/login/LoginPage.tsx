import { AuthPage } from '@refinedev/antd'

export default function LoginPage() {
  return (
    <AuthPage
      type="login"
      title="BDW Admin"
      forgotPasswordLink={false}
      registerLink={false}
    />
  )
}
