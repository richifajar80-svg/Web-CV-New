import { ImageResponse } from 'next/og';

export const alt = 'cvbagus.id - Buat CV ATS Friendly & Profesional Online';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px 80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '900',
              color: '#ffffff',
            }}
          >
            CB
          </div>
          <span style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            cvbagus.id
          </span>
          <span
            style={{
              marginLeft: '12px',
              fontSize: '18px',
              fontWeight: '700',
              backgroundColor: '#fef3c7',
              color: '#78350f',
              padding: '4px 16px',
              borderRadius: '999px',
            }}
          >
            Standar ATS HRD
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '950px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: '900',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
            }}
          >
            Buat CV ATS-Friendly & Lolos Seleksi Kerja dalam 5 Menit
          </div>
          <div style={{ fontSize: '24px', color: '#a7f3d0', fontWeight: '400' }}>
            10+ Templat Profesional • Live Skor ATS Otomatis • Cetak & Unduh PDF Instan
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '24px',
            fontSize: '20px',
            color: '#d1fae5',
          }}
        >
          <span>https://cvbagus.id</span>
          <span style={{ fontWeight: '700', color: '#ffffff' }}>
            Sekali Bayar Rp 25.000 / 1 Tahun Penuh
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
