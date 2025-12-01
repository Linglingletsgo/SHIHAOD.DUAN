'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { Upload, Download, Play, FileVideo, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MediaToolPage() {
  const [activeTab, setActiveTab] = useState<'converter' | 'downloader'>('converter');
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load FFmpeg when component mounts or tab changes to downloader
  useEffect(() => {
    const loadFFmpeg = async () => {
      if (ffmpegRef.current) return; // FFmpeg already loaded

      const ffmpeg = new FFmpeg();
      ffmpeg.on('log', ({ message }) => {
        console.log(message);
      });

      try {
        await ffmpeg.load({
          coreURL: await toBlobURL(`https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm`, 'application/wasm'),
        });
        ffmpegRef.current = ffmpeg;
        setLoaded(true);
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
      }
    };

    // Only load FFmpeg if the downloader tab is active or if it's the initial load for converter
    // The VideoProcessor component will handle its own loading if it's the active tab initially
    if (activeTab === 'downloader' || activeTab === 'converter') { // Load for both, but VideoProcessor has its own logic
      loadFFmpeg();
    }
  }, [activeTab]);
  
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Media Tools
          </h1>
          <p className="text-gray-400">Professional media processing in your browser</p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="bg-neutral-900 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('converter')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'converter' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Format Converter
            </button>
            <button
              onClick={() => setActiveTab('downloader')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'downloader' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Media Downloader
            </button>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm">
          {activeTab === 'converter' ? <VideoProcessor /> : <M3U8Downloader ffmpeg={ffmpegRef.current!} loaded={loaded} />}
        </div>
      </div>
    </div>
  );
}

function VideoProcessor() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'video' | 'audio'>('video');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputExt, setOutputExt] = useState('mp4');
  
  // Modes
  type Mode = 'convert' | 'resize' | 'audio' | 'compress' | 'gif' | 'screenshot';
  const [mode, setMode] = useState<Mode>('convert');

  // Settings
  const [targetFormat, setTargetFormat] = useState('mp4');
  const [resizeHeight, setResizeHeight] = useState('720');
  const [audioFormat, setAudioFormat] = useState('mp3');
  const [compressionLevel, setCompressionLevel] = useState('28'); // CRF
  const [gifFps, setGifFps] = useState('10');
  const [gifWidth, setGifWidth] = useState('480');
  const [screenshotTime, setScreenshotTime] = useState('00:00:01');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.item(0);
    if (selectedFile) {
        setFile(selectedFile);
        const type = selectedFile.type.startsWith('audio/') ? 'audio' : 'video';
        setFileType(type);
        setMode('convert');
        setTargetFormat(type === 'audio' ? 'mp3' : 'mp4');
        setOutputUrl(null);
        setStatus('Idle');
    }
  };

  const load = async () => {
    setIsLoading(true);
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
    }
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) {
        messageRef.current.innerHTML = message;
      }
      console.log(message);
    });
    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });
    
    try {
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    } catch (error) {
        console.error('Failed to load FFmpeg:', error);
        setStatus('Failed to load FFmpeg core. Check console.');
    } finally {
        setIsLoading(false);
    }
  };

  const processVideo = async () => {
    if (!file || !ffmpegRef.current) return;
    
    const ffmpeg = ffmpegRef.current;
    setStatus('Processing...');
    setOutputUrl(null);
    setProgress(0);

    try {
        await ffmpeg.writeFile('input', await fetchFile(file));
        
        let args: string[] = [];
        let outExt = 'mp4';
        let mimeType = 'video/mp4';

        switch (mode) {
            case 'convert':
                outExt = targetFormat;
                args = ['-i', 'input', `output.${outExt}`];
                mimeType = fileType === 'audio' || ['mp3', 'wav', 'aac', 'ogg'].includes(outExt) ? `audio/${outExt}` : `video/${outExt}`;
                break;
            case 'resize':
                outExt = 'mp4';
                args = ['-i', 'input', '-vf', `scale=-2:${resizeHeight}`, `output.${outExt}`];
                break;
            case 'audio':
                outExt = audioFormat;
                args = ['-i', 'input', '-vn', `output.${outExt}`];
                mimeType = `audio/${outExt}`;
                break;
            case 'compress':
                outExt = 'mp4';
                args = ['-i', 'input', '-crf', compressionLevel, `output.${outExt}`];
                break;
            case 'gif':
                outExt = 'gif';
                args = ['-i', 'input', '-vf', `fps=${gifFps},scale=${gifWidth}:-1`, `output.${outExt}`];
                mimeType = 'image/gif';
                break;
            case 'screenshot':
                outExt = 'png';
                args = ['-ss', screenshotTime, '-i', 'input', '-vframes', '1', `output.${outExt}`];
                mimeType = 'image/png';
                break;
        }

        const ret = await ffmpeg.exec(args);
        
        if (ret !== 0) {
            throw new Error(`FFmpeg exited with code ${ret}. Check console for details.`);
        }

        const data = await ffmpeg.readFile(`output.${outExt}`);
        
        const url = URL.createObjectURL(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        new Blob([data as any], { type: mimeType })
        );
        setOutputUrl(url);
        setOutputExt(outExt);
        setStatus('Completed!');
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setStatus(`Processing failed: ${errorMessage}`);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const availableModes = fileType === 'audio' 
    ? [{ id: 'convert', label: 'Convert Format' }]
    : [
        { id: 'convert', label: 'Convert Format' },
        { id: 'resize', label: 'Resize' },
        { id: 'audio', label: 'Extract Audio' },
        { id: 'compress', label: 'Compress' },
        { id: 'gif', label: 'Make GIF' },
        { id: 'screenshot', label: 'Screenshot' },
      ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Local Media Processor</h2>
        <p className="text-sm text-gray-400">
            Powered by FFmpeg.wasm. Your files never leave your device.
        </p>
      </div>

      {!loaded && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            {isLoading ? (
                <>
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p>Loading FFmpeg core...</p>
                </>
            ) : (
                <button onClick={load} className="bg-blue-600 px-4 py-2 rounded">Retry Load FFmpeg</button>
            )}
        </div>
      )}

      {loaded && (
        <div className="space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 hover:border-neutral-500 transition-colors text-center cursor-pointer relative">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="video/*,audio/*"
                />
                <div className="flex flex-col items-center space-y-2 pointer-events-none">
                    {file ? (
                        <>
                            {fileType === 'audio' ? (
                                <div className="w-10 h-10 flex items-center justify-center bg-purple-900/50 rounded-full text-purple-400">
                                    <span className="font-bold">♪</span>
                                </div>
                            ) : (
                                <FileVideo className="w-10 h-10 text-blue-500" />
                            )}
                            <span className="font-medium text-white">{file.name}</span>
                            <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </>
                    ) : (
                        <>
                            <Upload className="w-10 h-10 text-gray-500" />
                            <span className="text-gray-400">Click or drag media file here</span>
                        </>
                    )}
                </div>
            </div>

            {file && (
                <div className="space-y-6">
                    {/* Mode Selection */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {availableModes.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id as Mode)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    mode === m.id 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
                                }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Settings Panel */}
                    <div className="bg-neutral-800/50 p-6 rounded-xl space-y-4">
                        {mode === 'convert' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400">Target Format</label>
                                <select 
                                    value={targetFormat}
                                    onChange={(e) => setTargetFormat(e.target.value)}
                                    className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 outline-none"
                                >
                                    {fileType === 'video' && (
                                        <>
                                            <option value="mp4">MP4</option>
                                            <option value="webm">WebM</option>
                                            <option value="mov">MOV</option>
                                            <option value="avi">AVI</option>
                                            <option value="mkv">MKV</option>
                                        </>
                                    )}
                                    <option value="mp3">MP3</option>
                                    <option value="wav">WAV</option>
                                    <option value="aac">AAC</option>
                                    <option value="ogg">OGG</option>
                                </select>
                            </div>
                        )}

                        {mode === 'resize' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400">Target Height (Width auto-scaled)</label>
                                <select 
                                    value={resizeHeight}
                                    onChange={(e) => setResizeHeight(e.target.value)}
                                    className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 outline-none"
                                >
                                    <option value="1080">1080p</option>
                                    <option value="720">720p</option>
                                    <option value="480">480p</option>
                                    <option value="360">360p</option>
                                </select>
                            </div>
                        )}

                        {mode === 'audio' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400">Audio Format</label>
                                <select 
                                    value={audioFormat}
                                    onChange={(e) => setAudioFormat(e.target.value)}
                                    className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 outline-none"
                                >
                                    <option value="mp3">MP3</option>
                                    <option value="wav">WAV</option>
                                    <option value="aac">AAC</option>
                                    <option value="ogg">OGG</option>
                                </select>
                            </div>
                        )}

                        {mode === 'compress' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400">Compression Level (CRF: {compressionLevel})</label>
                                <input 
                                    type="range" 
                                    min="18" 
                                    max="35" 
                                    value={compressionLevel}
                                    onChange={(e) => setCompressionLevel(e.target.value)}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>High Quality (18)</span>
                                    <span>Low Size (35)</span>
                                </div>
                            </div>
                        )}

                        {mode === 'gif' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-400">FPS</label>
                                    <input 
                                        type="number" 
                                        value={gifFps}
                                        onChange={(e) => setGifFps(e.target.value)}
                                        className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-400">Width (px)</label>
                                    <input 
                                        type="number" 
                                        value={gifWidth}
                                        onChange={(e) => setGifWidth(e.target.value)}
                                        className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'screenshot' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-400">Timestamp (HH:MM:SS)</label>
                                <input 
                                    type="text" 
                                    value={screenshotTime}
                                    onChange={(e) => setScreenshotTime(e.target.value)}
                                    placeholder="00:00:01"
                                    className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 outline-none"
                                />
                            </div>
                        )}

                        <button
                            onClick={processVideo}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            <Play className="w-4 h-4" /> Start Processing
                        </button>
                    </div>
                </div>
            )}

            {(status !== 'Idle' && status !== 'Completed!') && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>{status}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p ref={messageRef} className="text-xs text-gray-600 font-mono truncate"></p>
                </div>
            )}

            {outputUrl && (
                <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-green-200">Processing Complete</span>
                    </div>
                    <a
                        href={outputUrl}
                        download={`processed.${outputExt}`}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download
                    </a>
                </div>
            )}
        </div>
      )}
    </div>
  );
}

interface VideoResult {
  title?: string;
  url?: string;
  thumbnail?: string;
  duration?: number;
  ext?: string;
  error?: string;
}

 // M3U8 Downloader Component
const M3U8Downloader = ({ ffmpeg, loaded }: { ffmpeg: FFmpeg; loaded: boolean }) => {
  const [m3u8Url, setM3u8Url] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    if (!m3u8Url || !loaded) return;
    
    setDownloading(true);
    setError(null);
    setProgress(0);
    setSuccess(false);

    try {
      // Download M3U8 using ffmpeg
      await ffmpeg.exec([
        '-i', m3u8Url,
        '-c', 'copy',
        '-bsf:a', 'aac_adtstoasc',
        'output.mp4'
      ]);

      // Get the output file
      const data = await ffmpeg.readFile('output.mp4');
      const buffer = new Uint8Array(data as Uint8Array).buffer;
      const blob = new Blob([buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_${Date.now()}.mp4`;
      a.click();

      URL.revokeObjectURL(url);
      setSuccess(true);
      setProgress(100);
    } catch (err) {
      console.error('M3U8 download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download M3U8 stream');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">M3U8 Stream Downloader</h2>
        <p className="text-sm text-gray-400">
            Download and convert M3U8 live streams to MP4 format using FFmpeg in your browser
        </p>
      </div>

      {!loaded && (
        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4 text-yellow-400 text-sm">
          Please wait for FFmpeg to load before downloading
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            M3U8 URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={m3u8Url}
              onChange={(e) => setM3u8Url(e.target.value)}
              placeholder="https://example.com/stream/playlist.m3u8"
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors"
              disabled={downloading}
            />
            <button
              onClick={handleDownload}
              disabled={!m3u8Url || !loaded || downloading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </button>
          </div>
        </div>

        {downloading && (
          <div className="bg-neutral-800/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Processing stream...</span>
              <span className="text-gray-300">{progress}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-600/50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-400">Download Failed</p>
              <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-600/50 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-400">Download Complete!</p>
              <p className="text-sm text-green-300 mt-1">Your video has been downloaded successfully</p>
            </div>
          </div>
        )}

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 space-y-2">
          <h3 className="font-medium text-sm text-gray-300">How to find M3U8 URLs:</h3>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Open browser Developer Tools (F12)</li>
            <li>Go to Network tab and filter by "m3u8"</li>
            <li>Play the video on the website</li>
            <li>Copy the M3U8 URL from the network requests</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
