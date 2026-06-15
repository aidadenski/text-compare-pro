import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Branded iOS home-screen icon, generated so there is no missing PNG to 404 on.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1c1917',
          color: '#f6f3ec',
          fontSize: 104,
          fontWeight: 700,
          letterSpacing: -4,
          fontFamily: 'serif',
        }}
      >
        Tc
      </div>
    ),
    { ...size },
  );
}
