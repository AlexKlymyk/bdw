import { useForm, SaveButton } from '@refinedev/antd'
import { Form, Input, InputNumber, Select, Upload, Button, Card, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { UploadOutlined } from '@ant-design/icons'
import { supabaseClient } from '../../../lib/supabase'
import type { UploadFile } from 'antd'

type StickerFormProps = {
  action: 'create' | 'edit'
}

const PHOTO_SIZES = [
  { value: 'large',       label: 'Large (103 × 126px)' },
  { value: 'medium',      label: 'Medium (80 × 98px)' },
  { value: 'small',       label: 'Small (69 × 85px)' },
  { value: 'extra_small', label: 'Extra small (53 × 64px)' },
]

const TEXT_SIZES = [
  { value: 'large', label: 'Large (135 × 138px)' },
]

// Target 1× dimensions from Figma — uploaded at 2× for retina sharpness
const SIZE_DIMENSIONS: Record<string, { w: number; h: number }> = {
  large:       { w: 103, h: 126 },
  medium:      { w: 80,  h: 98  },
  small:       { w: 70,  h: 85  },
  extra_small: { w: 53,  h: 64  },
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function cropAndResize(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
): HTMLCanvasElement {
  const srcRatio = img.naturalWidth / img.naturalHeight
  const dstRatio = targetW / targetH

  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
  if (srcRatio > dstRatio) {
    sw = img.naturalHeight * dstRatio
    sx = (img.naturalWidth - sw) / 2
  } else {
    sh = img.naturalWidth / dstRatio
    sy = (img.naturalHeight - sh) / 2
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  canvas.getContext('2d')!.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH)
  return canvas
}

function canvasToWebP(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/webp',
      quality,
    ),
  )
}

async function uploadBlob(blob: Blob, path: string): Promise<string> {
  const { error } = await supabaseClient.storage
    .from('sticker-photos')
    .upload(path, blob, { upsert: true, contentType: 'image/webp' })
  if (error) throw error
  const { data } = supabaseClient.storage.from('sticker-photos').getPublicUrl(path)
  return data.publicUrl
}

export default function StickerForm({ action }: StickerFormProps) {
  const { formProps, saveButtonProps, formLoading } = useForm({
    action,
    redirect: 'list',
  })

  const stickerType = Form.useWatch('type', formProps.form)
  const stickerSize = Form.useWatch('size', formProps.form)

  async function handleUpload(file: File): Promise<{ thumb: string; full: string }> {
    const img = await loadImage(file)
    const timestamp = Date.now()

    const dims = SIZE_DIMENSIONS[stickerSize] ?? SIZE_DIMENSIONS.large

    // Thumbnail: 2× sticker size (for retina marker on map)
    const thumbCanvas = cropAndResize(img, dims.w * 2, dims.h * 2)
    const thumbBlob = await canvasToWebP(thumbCanvas, 0.85)
    const thumb = await uploadBlob(thumbBlob, `stickers/${timestamp}_thumb.webp`)

    // Full: 904×904px (2× of 452px modal size)
    const fullCanvas = cropAndResize(img, 904, 904)
    const fullBlob = await canvasToWebP(fullCanvas, 0.9)
    const full = await uploadBlob(fullBlob, `stickers/${timestamp}_full.webp`)

    URL.revokeObjectURL(img.src)
    return { thumb, full }
  }

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={async (rawValues) => {
        const values = rawValues as Record<string, unknown>
        const photoRaw = values.photo_url

        if (typeof photoRaw === 'string') {
          // User didn't interact with Upload — raw URL from DB, keep as-is
        } else {
          const fileList: UploadFile[] = (photoRaw as { fileList?: UploadFile[] })?.fileList ?? []
          if (fileList.length > 0 && fileList[0].originFileObj) {
            const { thumb, full } = await handleUpload(fileList[0].originFileObj as File)
            values.photo_url = thumb
            values.photo_url_full = full
          } else if (fileList.length > 0 && typeof fileList[0].url === 'string') {
            values.photo_url = fileList[0].url
          } else {
            // Empty fileList — user deleted the photo
            values.photo_url = null
            values.photo_url_full = null
          }
        }
        formProps.onFinish?.(values)
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form.Item label="Sticker type" name="type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'text', label: 'Text' },
              { value: 'photo', label: 'Photo' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Size" name="size" rules={[{ required: true }]}>
          <Select
            options={stickerType === 'text' ? TEXT_SIZES : PHOTO_SIZES}
            placeholder="Select size"
          />
        </Form.Item>

        <Form.Item label="Title" name="title">
          <Input maxLength={100} />
        </Form.Item>

        {stickerType === 'text' && (
          <Form.Item label="Text" name="text" rules={[{ required: true }]}>
            <Input.TextArea rows={4} maxLength={300} showCount />
          </Form.Item>
        )}

        {stickerType === 'photo' && (
          <>
            <Form.Item
              label="Photo"
              name="photo_url"
              getValueProps={(value) => ({
                fileList:
                  typeof value === 'string' && value
                    ? [{ uid: '-1', name: 'photo', status: 'done', url: value }]
                    : (value?.fileList ?? []),
              })}
            >
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload photo</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Caption (optional)" name="text">
              <Input maxLength={200} />
            </Form.Item>
          </>
        )}
      </Card>

      <Card title="Map coordinates" style={{ marginBottom: 16 }}>
        <Form.Item label="Latitude (lat)" name="lat" rules={[{ required: true }]}>
          <InputNumber
            style={{ width: '100%' }}
            step={0.0001}
            precision={6}
            placeholder="54.5000"
          />
        </Form.Item>
        <Form.Item label="Longitude (lng)" name="lng" rules={[{ required: true }]}>
          <InputNumber
            style={{ width: '100%' }}
            step={0.0001}
            precision={6}
            placeholder="-3.0000"
          />
        </Form.Item>
      </Card>

      <Card title="Details" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Date of leaving"
          name="date_of_leaving"
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
          getValueFromEvent={(date) => date ? date.format('YYYY-MM-DD') : null}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Card>

      <SaveButton {...saveButtonProps} loading={formLoading} />
    </Form>
  )
}
