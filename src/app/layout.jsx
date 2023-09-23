import '@styles/globals.css';

export const metadata = {
  title: 'PeerPrep',
  description: 'Practice technical interviews with your peers',
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
