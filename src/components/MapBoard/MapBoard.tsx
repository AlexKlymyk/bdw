import { useState, useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './MapBoard.scss'
import flag from '../../assets/flag.avif'
import flag2x from '../../assets/flag-2x.avif'
import { supabaseClient } from '../../lib/supabase'
import { createStickerIcon, createPinIcon, type StickerData } from '../../lib/stickerIcon'

function ThreadPane() {
  const map = useMap()
  useEffect(() => {
    if (!map.getPane('threadPane')) {
      const pane = map.createPane('threadPane')
      pane.style.zIndex = '625'
      pane.style.pointerEvents = 'none'
    }
    if (!map.getPane('pinPane')) {
      const pane = map.createPane('pinPane')
      pane.style.zIndex = '650'
    }
  }, [map])
  return null
}

type ThreadData = {
  id: string
  from_sticker_id: string
  to_sticker_id: string
}

function MapBoard({ setActiveSticker }: { setActiveSticker: (sticker: StickerData) => void }) {
  const [stickers, setStickers] = useState<StickerData[]>([])
  const [threads, setThreads] = useState<ThreadData[]>([])
  const isMobile = useMediaQuery('(max-width: 600px)')
  const zoom = isMobile ? 6 : 7

  useEffect(() => {
    Promise.all([
      supabaseClient
        .from('stickers')
        .select('id, type, size, lat, lng, title, text, photo_url, photo_url_full, date_of_leaving'),
      supabaseClient
        .from('threads')
        .select('id, from_sticker_id, to_sticker_id'),
    ]).then(([{ data: stickerData }, { data: threadData }]) => {
      if (stickerData) setStickers(stickerData as StickerData[])
      if (threadData) setThreads(threadData as ThreadData[])
    })
  }, [])

  const stickerById = Object.fromEntries(stickers.map((s) => [s.id, s]))

  return (
    <div className="map-board">
      <div className="map-board__container">
        <img src={flag} srcSet={`${flag2x} 2x`} alt="flag" className="map-board__flag" />
        <div className="map-board__frame" />
        <div className="map-board__map">
          <MapContainer
            center={[53.5, -3]}
            zoom={zoom}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ThreadPane />

            {threads.map((thread) => {
              const from = stickerById[thread.from_sticker_id]
              const to = stickerById[thread.to_sticker_id]
              if (!from || !to) return null
              return (
                <Polyline
                  key={thread.id}
                  positions={[[from.lat, from.lng], [to.lat, to.lng]]}
                  pane="threadPane"
                  pathOptions={{ color: '#cc0000', weight: 2, opacity: 0.85 }}
                />
              )
            })}

            {stickers.map((sticker) => (
              <Marker
                key={sticker.id}
                position={[sticker.lat, sticker.lng]}
                icon={createStickerIcon(sticker, isMobile)}
                eventHandlers={{ click: () => setActiveSticker(sticker) }}
              />
            ))}

            {stickers.map((sticker) => (
              <Marker
                key={`pin-${sticker.id}`}
                position={[sticker.lat, sticker.lng]}
                icon={createPinIcon(sticker)}
                pane="pinPane"
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default MapBoard
