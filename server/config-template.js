const config = {
  port: process.env.PORT || 8000,
  clientHttpsHost: 'http://localhost:8000/',
  explorerLink: 'http://dev.explorer.knownetwork.io/',
  netHash: '295e7db37e230249e022d7cf9c603ef49a56a51de8c843923f52b6ae8e7f2e37',
  limitList: 24,
  official: [
    { host: '35.197.237.19', port: 4003, ssl: false },
    { host: '35.229.26.186', port: 4003, ssl: false }

  ],
  public: [],
  testnet: [
    // new $peer({ host: '127.0.0.1', port: 4000, ssl: false }),
  ]
};

export default config;
