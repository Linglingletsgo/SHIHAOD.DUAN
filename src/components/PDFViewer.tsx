'use client';

import { motion } from 'framer-motion';

interface ProcessFile {
  title: string;
  url: string;
}

interface PDFViewerProps {
  title: string;
  description?: string;
  pdfUrl?: string;
  videoUrl?: string;
  processFiles?: ProcessFile[];
}

const PDFViewer = ({
  pdfUrl,
  title,
  description,
  videoUrl,
  processFiles = []
}: PDFViewerProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 font-mono">{title}</h1>
        </motion.div>

        {/* 简介 */}
        {description && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl font-mono">
              {description}
            </p>
          </motion.div>
        )}

        {/* PDF查看器 - 使用object */}
        {pdfUrl && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex justify-center">
              <object
                data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&pagemode=none&bgcolor=000000`}
                type="application/pdf"
                className="w-full h-[800px]"
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: '#000000',
                  margin: 0,
                  padding: 0
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                <p className="text-zinc-400 text-center py-8">
                  您的浏览器不支持PDF显示，请
                  <a href={pdfUrl} className="text-blue-400 hover:text-blue-300 ml-1">
                    点击这里下载PDF
                  </a>
                </p>
              </object>
            </div>
          </motion.div>
        )}

        {/* PROCESS 部分 - 视频和过程文件 */}
        {(videoUrl || processFiles.length > 0) && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >

            {/* 视频 */}
            {videoUrl && (
              <div className="mb-8">
                <div className="relative w-full max-w-4xl mx-auto">
                  <video
                    controls
                    controlsList="nodownload nofullscreen noremoteplayback"
                    className="w-full rounded-lg shadow-lg"
                    poster="/images/video-poster.jpg"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    您的浏览器不支持视频播放。
                  </video>
                </div>
              </div>
            )}

            {/* 过程文件 - 直接嵌入 */}
            {processFiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processFiles.map((file, index) => (
                  <div key={index} className="bg-zinc-800 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-lg">{file.title}</h3>
                    <div className="bg-zinc-900 rounded p-4 min-h-[300px] flex items-center justify-center">
                      <iframe
                        src={file.url}
                        className="w-full h-full min-h-[300px] rounded"
                        title={file.title}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;