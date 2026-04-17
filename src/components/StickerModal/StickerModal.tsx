import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import type { StickerData } from '../../lib/stickerIcon'
import './StickerModal.scss'
import modalPin from '../../assets/modal-pin.avif'
import modalPin2x from '../../assets/modal-pin-2x.avif'
import modalClose from '../../assets/modal-close.svg'
import modalCloseHover from '../../assets/modal-close-hover.svg'

type Props = {
  sticker: StickerData
  onClose: () => void
}

export default function StickerModal({ sticker, onClose }: Props) {
  const [isHover, setIsHover] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="sticker-modal-overlay" onClick={onClose}>
      <div className="sticker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sticker-modal__content">
          <button className="sticker-modal__close" onClick={onClose} aria-label="Close" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <img src={isHover ? modalCloseHover : modalClose} alt="modal close" />
          </button>

          <img src={modalPin} srcSet={`${modalPin2x} 2x`} alt="modal pin" className="sticker-modal__pin" />

          {sticker.type === 'photo' && sticker.photo_url_full && (
            <div className="sticker-modal__photo">
              <img src={sticker.photo_url_full} alt={sticker.title ?? ''} />
            </div>
          )}

          <div className="sticker-modal__body">
            {sticker.title && (
              <h2 className="sticker-modal__title">{sticker.title}</h2>
            )}
            {sticker.date_of_leaving && (
              <p className="sticker-modal__date">
                <span>Date of leaving:</span> {dayjs(sticker.date_of_leaving).format('DD / MM / YYYY')}
              </p>
            )}
            {sticker.text && (
              <p className="sticker-modal__text">{sticker.text}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
