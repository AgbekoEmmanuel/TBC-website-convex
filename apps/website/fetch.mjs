import https from 'https';

https.get('https://maps.app.goo.gl/RmjrT9GME6RqpXYu5', (res) => {
  console.log(res.headers.location);
});
