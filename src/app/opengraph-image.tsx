import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Software Engineer Growth Community';
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
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 70,
              fontWeight: 'bold',
              color: '#667eea',
              marginRight: 30,
            }}
          >
            C
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 10 }}>
              Software Engineer
            </div>
            <div style={{ fontSize: 72, fontWeight: 'bold' }}>
              Growth Community
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 36,
            opacity: 0.9,
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Platform untuk belajar, berbagi, dan tumbuh bersama
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
