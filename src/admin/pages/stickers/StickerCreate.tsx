import { Create } from '@refinedev/antd'
import StickerForm from './StickerForm'

export default function StickerCreate() {
  return (
    <Create footerButtons={() => null}>
      <StickerForm action="create" />
    </Create>
  )
}
