'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileVideo, MessageSquare } from 'lucide-react';

export default function ToolsPage() {
  const tools = [
    {
      id: 'mediatool',
      name: 'Media Tool',
      icon: FileVideo,
      href: '/mediatool',
      gradient: 'from-white to-white',
      available: true,
    },
    {
      id: 'rhymer',
      name: 'Rhymer',
      icon: MessageSquare,
      href: '/rhymer',
      gradient: 'from-white to-white',
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={tool.href}>
                <div className="group relative bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-600 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-neutral-800 p-3 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <tool.icon className="w-full h-full text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white">
                      {tool.name}
                    </h2>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
