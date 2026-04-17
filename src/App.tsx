import { useMediaQuery } from 'usehooks-ts'
import { useState } from 'react'
import './App.scss'
import MapBoard from './components/MapBoard/MapBoard'
import GDPCounter from './components/GDPCounter/GDPCounter'
import stickersBg from './assets/stickers-bg.avif'
import stickersBg2x from './assets/stickers-bg-2x.avif'
import stickersBgMobile from './assets/stickers-bg-mobile.avif'
import stickersBgMobile2x from './assets/stickers-bg-mobile-2x.avif'
import StickerModal from './components/StickerModal/StickerModal'
import type { StickerData } from './lib/stickerIcon'

function App() {
  const [activeSticker, setActiveSticker] = useState<StickerData | null>(null)
  const isMobile = useMediaQuery('(max-width: 600px)')

  const stickersBgImage = isMobile ? stickersBgMobile : stickersBg
  const stickersBgImage2x = isMobile ? stickersBgMobile2x : stickersBg2x

  return (
    <div className="app">
      <div className="app__stickers-bg">
        <img src={stickersBgImage} srcSet={`${stickersBgImage2x} 2x`} alt="stickers bg" />
      </div>
      <div className="app__content">
        <GDPCounter />
        <MapBoard setActiveSticker={setActiveSticker} />
        {activeSticker && (
          <StickerModal
            sticker={activeSticker}
            onClose={() => setActiveSticker(null)}
          />
        )}
      </div>
    </div>
  )
}

export default App
