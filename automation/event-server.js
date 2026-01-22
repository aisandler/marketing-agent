#!/usr/bin/env node
/**
 * Factory Floor Event Server
 *
 * Simple HTTP server that serves real-time events from Claude Code hooks.
 * Events are read from /tmp/agent-events.jsonl and served via HTTP for
 * the Factory Floor Visualizer.
 *
 * Usage:
 *   node event-server.js [port]
 *
 * Default port: 3003
 *
 * Endpoints:
 *   GET /events?offset=N - Returns new events since byte offset N
 *   GET /health - Health check
 *   GET /clear - Clear the event file
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] ? parseInt(process.argv[2]) : 3003;
const EVENT_FILE = '/tmp/agent-events.jsonl';

// Ensure event file exists
if (!fs.existsSync(EVENT_FILE)) {
    fs.writeFileSync(EVENT_FILE, '');
}

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    // Health check
    if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
        return;
    }

    // Clear event file
    if (pathname === '/clear') {
        try {
            fs.writeFileSync(EVENT_FILE, '');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'cleared' }));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // Get events
    if (pathname === '/events') {
        const offset = parseInt(url.searchParams.get('offset') || '0');

        try {
            const stat = fs.statSync(EVENT_FILE);
            const fileSize = stat.size;

            if (offset >= fileSize) {
                // No new data
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ events: [], offset: fileSize }));
                return;
            }

            // Read from offset to end
            const fd = fs.openSync(EVENT_FILE, 'r');
            const buffer = Buffer.alloc(fileSize - offset);
            fs.readSync(fd, buffer, 0, buffer.length, offset);
            fs.closeSync(fd);

            const content = buffer.toString('utf8');
            const lines = content.split('\n').filter(line => line.trim());

            const events = [];
            for (const line of lines) {
                try {
                    events.push(JSON.parse(line));
                } catch (e) {
                    // Skip invalid JSON
                }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ events, offset: fileSize }));
        } catch (e) {
            if (e.code === 'ENOENT') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ events: [], offset: 0 }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        }
        return;
    }

    // Static file serving for the visualizer
    if (pathname === '/' || pathname === '/index.html') {
        const htmlPath = path.join(__dirname, 'factory-floor-visualizer.html');
        try {
            const content = fs.readFileSync(htmlPath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (e) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Visualizer not found');
        }
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║           Factory Floor Event Server                      ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Server running at: http://localhost:${PORT}                 ║
║  Event file: ${EVENT_FILE}                       ║
║                                                           ║
║  Endpoints:                                               ║
║    GET /              - Serve visualizer                  ║
║    GET /events?offset=N - Get new events since offset     ║
║    GET /health        - Health check                      ║
║    GET /clear         - Clear event file                  ║
║                                                           ║
║  To enable real-time events, add hooks to your            ║
║  .claude/settings.local.json (see README)                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
});

// Handle shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down event server...');
    server.close();
    process.exit(0);
});
