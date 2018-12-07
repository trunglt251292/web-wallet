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
};

export default hostConfig;
