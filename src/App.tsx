import { useMediaQuery } from 'usehooks-ts'
import './App.scss'
import MapBoard from './components/MapBoard/MapBoard'
import GDPCounter from './components/GDPCounter/GDPCounter'
import stickersBg from './assets/stickers-bg.avif'
import stickersBg2x from './assets/stickers-bg-2x.avif'
import stickersBgMobile from './assets/stickers-bg-mobile.avif'
import stickersBgMobile2x from './assets/stickers-bg-mobile-2x.avif'

function App() {
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
        <MapBoard />
      </div>
    </div>
  )
}

export default App
