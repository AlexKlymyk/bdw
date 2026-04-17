import L from 'leaflet'

import photoLg from '../assets/stickers/photo-lg.avif'
import photoLg2x from '../assets/stickers/photo-lg-2x.avif'
import photoMd from '../assets/stickers/photo-md.avif'
import photoMd2x from '../assets/stickers/photo-md-2x.avif'
import photoSm from '../assets/stickers/photo-sm.avif'
import photoSm2x from '../assets/stickers/photo-sm-2x.avif'
import photoXs from '../assets/stickers/photo-xs.avif'
import photoXs2x from '../assets/stickers/photo-xs-2x.avif'
import textLg from '../assets/stickers/text-lg.avif'
import textLg2x from '../assets/stickers/text-lg-2x.avif'
import pinLg from '../assets/pins/pin-lg.avif'
import pinLg2x from '../assets/pins/pin-lg-2x.avif'
import pinSm from '../assets/pins/pin-sm.avif'
import pinSm2x from '../assets/pins/pin-sm-2x.avif'

type FrameDef = {
  src: string; src2x: string
  w: number; h: number
  pin: 'lg' | 'sm'
  photoTop?: number; photoLeft?: number; photoW?: number; photoH?: number
}

const FRAMES: Record<string, Record<string, FrameDef>> = {
  photo: {
    large: { src: photoLg,  src2x: photoLg2x,  w: 111, h: 134, pin: 'lg', photoTop: 10, photoLeft: 10, photoW: 91, photoH: 93 },
    medium: { src: photoMd,  src2x: photoMd2x,  w: 89,  h: 106, pin: 'lg', photoTop: 8,  photoLeft: 9,  photoW: 71, photoH: 73 },
    small: { src: photoSm,  src2x: photoSm2x,  w: 78,  h: 93,  pin: 'sm', photoTop: 8,  photoLeft: 8,  photoW: 62, photoH: 62 },
    extra_small: { src: photoXs,  src2x: photoXs2x,  w: 61,  h: 73,  pin: 'sm', photoTop: 6,  photoLeft: 7,  photoW: 47, photoH: 49 },
  },
  text: {
    large: { src: textLg, src2x: textLg2x, w: 135, h: 138, pin: 'lg' },
  },
}

const PINS = {
  lg: { src: pinLg, src2x: pinLg2x, w: 24, h: 23, centerX: 17 },
  sm: { src: pinSm, src2x: pinSm2x, w: 14, h: 14, centerX: 10 },
}

export type StickerData = {
  id: string
  type: 'text' | 'photo'
  size: string
  lat: number
  lng: number
  title?: string | null
  text?: string | null
  photo_url?: string | null
  photo_url_full?: string | null
  date_of_leaving?: string | null
}

function stickerRotation(id: string): number {
  const hash = id.slice(0, 8).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (hash % 17) - 8 // -8° to +8°
}

export function createStickerIcon(sticker: StickerData, isMobile: boolean): L.DivIcon {
  const typeFrames = FRAMES[sticker.type] ?? FRAMES.text
  const frame: FrameDef = typeFrames[sticker.size] ?? typeFrames.large ?? Object.values(typeFrames)[0]
  const pin = PINS[frame.pin]
  const rotation = stickerRotation(sticker.id)
  const scale = isMobile ? 0.85 : 1
  const translate = isMobile ? 'translate(0%, 4%)' : 'translate(0, 0)'

  const frameImg = `<img src="${frame.src}" srcset="${frame.src2x} 2x" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;" />`

  let html: string

  if (sticker.type === 'photo') {
    const photoImg = sticker.photo_url
      ? `<img src="${sticker.photo_url}" style="position:absolute;top:${frame.photoTop}px;left:${frame.photoLeft}px;width:${frame.photoW}px;height:${frame.photoH}px;object-fit:cover;z-index:1;" />`
      : ''
    html = `<div class="sticker-marker" style="width:${frame.w}px;height:${frame.h}px;position:relative;cursor:pointer;transform:rotate(${rotation}deg) scale(${scale}) ${translate};transform-origin:center top;">${photoImg}${frameImg}</div>`
  } else {
    const textEl = sticker.text
      ? `<div style="padding:14px 14px 24px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;"><span style="display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;font-size:11px;font-family:'Architects Daughter',cursive;text-align:center;color:#4a3728;line-height:1.4;">${sticker.text}</span></div>`
      : ''
    html = `<div class="sticker-marker" style="width:${frame.w}px;height:${frame.h}px;position:relative;cursor:pointer;transform:rotate(${rotation}deg) scale(${scale}) ${translate};transform-origin:center top;">${frameImg}${textEl}</div>`
  }

  return L.divIcon({
    html,
    iconSize: [frame.w, frame.h],
    iconAnchor: [Math.round(frame.w / 2), Math.round(2 + pin.h / 2)],
    className: '',
  })
}

export function createPinIcon(sticker: StickerData): L.DivIcon {
  const typeFrames = FRAMES[sticker.type] ?? FRAMES.text
  const frame: FrameDef = typeFrames[sticker.size] ?? typeFrames.large ?? Object.values(typeFrames)[0]
  const pin = PINS[frame.pin]

  const html = `<img src="${pin.src}" srcset="${pin.src2x} 2x" style="width:${pin.w}px;height:${pin.h}px;pointer-events:none;" />`

  return L.divIcon({
    html,
    iconSize: [pin.w, pin.h],
    iconAnchor: [pin.centerX, pin.h / 2],
    className: '',
  })
}
