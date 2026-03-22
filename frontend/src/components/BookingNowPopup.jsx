import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const DEFAULT_PHONE_DISPLAY = '+91 97551 24554';
const DEFAULT_PHONE_TEL = '+919755124554';
const DEFAULT_WHATSAPP_DIGITS = '919755124554';

export default function BookingNowPopup({
  isOpen,
  onClose,
  message = 'If you want to book your seats',
  whatsappMessage,
  phoneDisplay = DEFAULT_PHONE_DISPLAY,
  phoneTel = DEFAULT_PHONE_TEL,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);

    // Prevent background scrolling while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappPrefill = whatsappMessage || 'Hello, I want to book seats.';
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP_DIGITS}?text=${encodeURIComponent(whatsappPrefill)}`;

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-24 bg-gradient-to-r from-[#0D7377] to-[#0D5C63]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/15 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/25 transition-all"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>
          <div className="absolute left-6 bottom-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ letterSpacing: '0.08em' }}>
              Booking
            </p>
            <p className="text-2xl font-bold">YMB GoExpress</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-5">{message}</p>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#0D7377] font-semibold uppercase tracking-wider mb-1">Call on this</p>
              <a
                href={`tel:${phoneTel}`}
                className="text-[#0D5C63] font-bold text-lg hover:underline"
              >
                {phoneDisplay}
              </a>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0D7377] text-white hover:opacity-90 transition-all"
              aria-label="Chat on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-2xl" />
            </a>
          </div>

          <div className="mt-5 flex gap-3">
            <a
              href={`tel:${phoneTel}`}
              className="flex-1 bg-white border border-[#0D7377]/30 text-[#0D5C63] px-4 py-2.5 rounded-xl font-semibold hover:bg-[#0D7377]/10 transition-all text-center"
            >
              Call Now
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-gradient-to-r from-[#0D7377] to-[#0D5C63] text-white px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all text-center"
            >
              WhatsApp
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            You can call or WhatsApp us to confirm your seats.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

