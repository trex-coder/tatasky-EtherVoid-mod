import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Button, Grid, Header, Message, Segment } from 'semantic-ui-react';
import Axios from 'axios';

export default function Home() {
  const [dynamicUrl, setDynamicUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [shorteningError, setShorteningError] = useState('');

  useEffect(() => {
    const url = `${window.location.origin.replace('localhost', '127.0.0.1')}/api/getM3u?sid=tplay_A&id=123456789&sname=tataP&tkn=xeotpxyastrplg`;
    setDynamicUrl(url);
  }, []);

  async function shortenUrl(originalUrl) {
    try {
      const response = await Axios.get(`https://ulvis.net/api.php?url=${encodeURIComponent(originalUrl)}&type=json&private=1`);
      setShortenedUrl(response.data.short);
    } catch (error) {
      console.error('Error shortening URL:', error);
      setShorteningError('Error shortening URL. Please try again.');
    }
  }

  function downloadM3uFile(filename) {
    setDownloading(true);
    // Add your download logic here
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(dynamicUrl);
      console.log('URL copied to clipboard');
      // Shorten the copied URL
      await shortenUrl(dynamicUrl);
      // Optionally show a success message or perform other actions
    } catch (err) {
      console.error('Error copying URL to clipboard:', err);
      // Optionally show an error message
    }
  }

  return (
    <div>
      <Head>
        <title>Generate Tata Play IPTV playlist</title>
        <meta
          name="description"
          content="Easiest way to generate a Tata Play IPTV (m3u) playlist for the channels you have subscribed to."
        />
      </Head>
      <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 600 }}>
          <Segment loading={downloading}>
            <Header as="h1" textAlign="center">
              Generate Tata Play m3u
            </Header>
            <Message>
              <Message.Header>Dynamic URL to get m3u:</Message.Header>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(dynamicUrl)}&size=small`} alt="QR Code" />
              <p>
                <Button primary onClick={copyToClipboard}>
                  Copy URL
                </Button>
              </p>
              {shortenedUrl && (
                <Message positive>
                  <Message.Header>Shortened URL:</Message.Header>
                  <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
                </Message>
              )}
              <p>
                You can use the above m3u URL in OTT Navigator app to watch all channels.
              </p>
              <Message.Header>You cannot generate a permanent m3u file URL on localhost but you can download your m3u file:</Message.Header>
              <p>
                <Button primary onClick={() => downloadM3uFile('ts.m3u')} loading={downloading}>
                  Download m3u file
                </Button>
              </p>
              <p>The downloaded m3u file will be valid only for an unlimited time.</p>
              {/* Donation Button */}
              <p>
                <Button color='yellow' onClick={() => window.open('upi://pay?pa=babidawka@okhdfdbank')}>
                  Donate via UPI
                </Button>
              </p>
            </Message>
            <p style={{ marginTop: '1rem' }}>
              <a href="https://github.com/lalitjoshi06/tataplay_url" target="_blank" rel="noreferrer">
                View source code on Github
              </a>
            </p>
          </Segment>
        </Grid.Column>
      </Grid>
    </div>
  );
}
