// IAM System entry point
// Full implementation added in subsequent sprints
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'iam-api' }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log('IAM API running on port', process.env.PORT || 3000);
});
