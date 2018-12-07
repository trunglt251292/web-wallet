/**
 * Sync host config, help quick config when deploy to host
 * @type {number}
 */
const hostConfig = {
  // The host base for host the 'dist and assets' resource
  clientHttpsHost: 'http://localhost:8000',
  // Server provide api service
  apiHost: 'http://localhost:8001/api',
  upload: {
    // The server host use to upload files
    pushHost: 'http://localhost:8001',
    // Server to get the uploads resources
    getHost: 'http://localhost:8001'
  },
  // Host use to share the posts to FB, Twitter,...
  shareHost: 'http://localhost:8001',
  // This will be the host running server
  serverSocketHost: 'http://localhost:8001',
  peer: {
    // Http host without port use for peer-client
    peerHost: 'localhost',
    // 443 if server is https
    peerPort: 8001,
    peerPath: '/peer_server',
    turnServers: []
  },
  faceBookApi: '<YOUR-CONFIG-HERE>',
  googleApi: '<YOUR-CONFIG-HERE>',
  emailPayment: 'payment@tesse.vn',
  tess: {
    _id: 'PLACE-YOUR-BOT-ID',
    cuid: 'PLACE-YOUR-BOT-CUID'
  },
  language: {
    detectAPI: 'https://freegeoip.net/json/',
    globalHost: 'https://tesse.io',
    defaultLangId: 'en' // en || vi
  }
};

export default hostConfig;
