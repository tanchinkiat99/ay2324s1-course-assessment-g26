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
        <Provider session={children.session}
            options={{
              clientMaxAge: 60 // Re-fetch session if cache is older than 60 seconds
            }}
        >
          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;
