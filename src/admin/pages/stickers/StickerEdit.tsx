import { Edit } from '@refinedev/antd'
import StickerForm from './StickerForm'

export default function StickerEdit() {
  return (
    <Edit footerButtons={() => null}>
      <StickerForm action="edit" />
    </Edit>
  )
}
