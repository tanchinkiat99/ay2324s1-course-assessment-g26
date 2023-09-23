import '@styles/globals.css';
import Nav from '@components/Nav';
import Provider from '@components/Provider';

export const metadata = {
  title: 'PeerPrep',
  description: 'Practice technical interviews with your peers',
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <main className="app">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
