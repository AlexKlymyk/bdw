import { List, useTable, EditButton, DeleteButton } from '@refinedev/antd'
import { Table, Space } from 'antd'

export default function ThreadList() {
  const { tableProps } = useTable({ syncWithLocation: true })

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" width={80} render={(v: string) => v.slice(0, 8) + '...'} />
        <Table.Column
          dataIndex="from_sticker_id"
          title="From sticker"
          render={(v: string) => v?.slice(0, 8) + '...'}
        />
        <Table.Column
          dataIndex="to_sticker_id"
          title="To sticker"
          render={(v: string) => v?.slice(0, 8) + '...'}
        />
        <Table.Column dataIndex="created_at" title="Created at" />
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
