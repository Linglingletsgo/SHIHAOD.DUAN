from http.server import BaseHTTPRequestHandler
import json
import yt_dlp
from urllib.parse import parse_qs, urlparse

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            url = data.get('url')
            
            if not url:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'URL is required'}).encode('utf-8'))
                return

            ydl_opts = {
                'format': 'best',
                'quiet': True,
                'no_warnings': True,
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                # For some sites extract_info returns a list
                if 'entries' in info:
                    video = info['entries'][0]
                else:
                    video = info

                result = {
                    'title': video.get('title'),
                    'url': video.get('url'),
                    'thumbnail': video.get('thumbnail'),
                    'duration': video.get('duration'),
                    'ext': video.get('ext'),
                    'webpage_url': video.get('webpage_url')
                }

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
