import { List, useTable, EditButton, DeleteButton, ImageField } from '@refinedev/antd'
import { Table, Tag, Space } from 'antd'

export default function StickerList() {
  const { tableProps } = useTable({ syncWithLocation: true })

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" width={80} render={(v: string) => v.slice(0, 8) + '...'} />
        <Table.Column
          dataIndex="type"
          title="Type"
          render={(v: string) => (
            <Tag color={v === 'text' ? 'blue' : 'green'}>
              {v === 'text' ? 'Text' : 'Photo'}
            </Tag>
          )}
        />
        <Table.Column dataIndex="size" title="Size" />
        <Table.Column dataIndex="title" title="Title" ellipsis />
        <Table.Column dataIndex="text" title="Text" ellipsis />
        <Table.Column
          dataIndex="photo_url"
          title="Photo"
          render={(url: string) =>
            url ? <ImageField value={url} width={60} height={60} style={{ objectFit: 'cover' }} /> : '—'
          }
        />
        <Table.Column dataIndex="lat" title="Lat" render={(v: number) => v?.toFixed(4)} />
        <Table.Column dataIndex="lng" title="Lng" render={(v: number) => v?.toFixed(4)} />
        <Table.Column dataIndex="date_of_leaving" title="Date of Leaving" />
        <Table.Column
          title="Actions"
          render={(_, record: { id: string }) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  )
}
