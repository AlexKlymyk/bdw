import { Edit } from '@refinedev/antd'
import ThreadForm from './ThreadForm'

export default function ThreadEdit() {
  return (
    <Edit footerButtons={() => null}>
      <ThreadForm action="edit" />
    </Edit>
  )
}
