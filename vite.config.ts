import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { networkInterfaces } from 'os';

function getLocalIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

export default defineConfig({
    plugins: [react()],
    server: {
        host: true, // Équivalent à --host
        port: 5173,
        open: `http://${getLocalIP()}:5173`,
    },
});