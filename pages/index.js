import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Button, Grid, Header, Message, Segment } from 'semantic-ui-react';

export default function Home() {
  const [dynamicUrl, setDynamicUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const url = `${window.location.origin.replace('localhost', '127.0.0.1')}/api/getM3u?sid=tplay_A&id=123456789&sname=tataP&tkn=xeotpxyastrplg`;
    setDynamicUrl(url);
  }, []);

  function downloadM3uFile(filename) {
    setDownloading(true);
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`${window.location.origin}/api/getM3u?sid=tplay_A&id=123456789&sname=tataP&tkn=xeotpxyastrplg`, requestOptions)
      .then(response => response.text())
      .then(result => {
        const data = result;
        const blob = new Blob([data], { type: 'text/plain' });
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, filename);
        } else {
          const elem = window.document.createElement('a');
          elem.href = window.URL.createObjectURL(blob);
          elem.download = filename;
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
        }
        setDownloading(false);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        setDownloading(false);
      });
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
                <a href={dynamicUrl}>{dynamicUrl}</a>
              </p>
              <p>
                You can use the above m3u URL in OTT Navigator or Tivimate app to watch all channels.
              </p>
              <p>
                Set reload data to 10 Min in provider setting of Ott Navigator player & Enjoy!
              </p>
              <Message.Header>You cannot generate a permanent m3u file URL on localhost but you can download your m3u file:</Message.Header>
              <p>
                <Button primary onClick={() => downloadM3uFile('ts.m3u')} loading={downloading}>
                  Download m3u file
                </Button>
              </p>
              <p>The downloaded m3u file will be valid only for 10 Minutes.</p>
              {/* Donation Button */}
              <p>
                <Button color='yellow' onClick={() => window.open('upi://pay?pa=babidawka@okhdfdbank')}>
                  Donate via UPI
                </Button>
              </p>
            </Message>
            {err && (
              <Message negative>
                <Message.Header>Error</Message.Header>
                <p>{err}</p>
              </Message>
            )}
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
