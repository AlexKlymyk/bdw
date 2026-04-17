import { useForm, SaveButton, useSelect } from '@refinedev/antd'
import { Form, Select } from 'antd'

type StickerItem = { id: string; type: string; text?: string; title?: string }

export default function ThreadForm({ action }: { action: 'create' | 'edit' }) {
  const { formProps, saveButtonProps, formLoading } = useForm({ action, redirect: 'list' })

  const fromStickerId = Form.useWatch('from_sticker_id', formProps.form)
  const toStickerId = Form.useWatch('to_sticker_id', formProps.form)

  const { selectProps: fromSelectProps } = useSelect<StickerItem>({
    resource: 'stickers',
    optionLabel: (item) =>
      `[${item.type}] ${item.title ?? item.text?.slice(0, 30) ?? item.id.slice(0, 8)}`,
    optionValue: 'id',
  })

  const { selectProps: toSelectProps } = useSelect<StickerItem>({
    resource: 'stickers',
    optionLabel: (item) =>
      `[${item.type}] ${item.title ?? item.text?.slice(0, 30) ?? item.id.slice(0, 8)}`,
    optionValue: 'id',
  })

  const fromOptions = (fromSelectProps.options ?? []).filter(
    (opt) => opt.value !== toStickerId,
  )
  const toOptions = (toSelectProps.options ?? []).filter(
    (opt) => opt.value !== fromStickerId,
  )

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="From sticker"
        name="from_sticker_id"
        rules={[{ required: true, message: 'Select a sticker' }]}
      >
        <Select {...fromSelectProps} options={fromOptions} placeholder="Select a sticker" showSearch />
      </Form.Item>

      <Form.Item
        label="To sticker"
        name="to_sticker_id"
        rules={[{ required: true, message: 'Select a sticker' }]}
      >
        <Select {...toSelectProps} options={toOptions} placeholder="Select a sticker" showSearch />
      </Form.Item>

      <SaveButton {...saveButtonProps} loading={formLoading} />
    </Form>
  )
}
