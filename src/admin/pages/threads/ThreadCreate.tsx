import { Create } from '@refinedev/antd'
import ThreadForm from './ThreadForm'

export default function ThreadCreate() {
  return (
    <Create footerButtons={() => null}>
      <ThreadForm action="create" />
    </Create>
  )
}
