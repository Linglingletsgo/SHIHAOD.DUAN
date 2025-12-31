"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Settings2,
  Image as ImageIcon,
  Download,
  Loader2,
  Film,
  ChevronDown,
  Info,
  Box,
  Zap,
} from "lucide-react";
import { SimulationEngine } from "@/lib/spectrafilm/engine";
import { FilmProfile } from "@/lib/spectrafilm/types";
// @ts-expect-error - libraw-mini lacks types
import UTIF from "utif";
// @ts-expect-error - libraw-mini lacks types
import { LibRaw } from "libraw-mini";
import { applyToneMapping } from "@/lib/spectrafilm/tonemapping";
import {
  applyDyeCouplingToDensity,
  getDyeCouplingMatrix,
  IDENTITY_MATRIX,
} from "@/lib/spectrafilm/dye-coupling";
import { applyPhysicalGrain } from "@/lib/spectrafilm/grain";
import { applyRedHalation } from "@/lib/spectrafilm/halation";
import { applyPyramidBloom } from "@/lib/spectrafilm/bloom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SpectraFilmPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [profile, setProfile] = useState<FilmProfile | null>(null);
  const [profileId, setProfileId] = useState<string>("");
  const [exposure, setExposure] = useState<number>(0);
  const [bloomStrength, setBloomStrength] = useState<number>(0.12);
  const [preserveExposure, setPreserveExposure] = useState<boolean>(true);
  const [useAutoExposure, setUseAutoExposure] = useState<boolean>(true);
  const [processing, setProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [profilesList, setProfilesList] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/profiles/index.json")
      .then((res) => res.json())
      .then((list: string[]) => {
        setProfilesList(list);
        if (list.length > 0 && !profileId) {
          setProfileId(list[0]);
        }
      })
      .catch((e) => {
        console.error("Failed to load profiles index:", e);
        setProfilesList(["kodak_portra_400"]);
        if (!profileId) setProfileId("kodak_portra_400");
      });
  }, [profileId]);

  useEffect(() => {
    async function loadProfileData(id: string) {
      if (!id) {
        setProfile(null);
        return;
      }
      try {
        const res = await fetch(`/profiles/${id}.json`);
        if (!res.ok) throw new Error("Failed to load profile");
        const data: FilmProfile = await res.json();
        setProfile(data);
      } catch (e) {
        console.error(e);
        setProfile(null);
      }
    }
    loadProfileData(profileId);
  }, [profileId]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setImageSrc(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function processImage() {
    if (!canvasRef.current || !imageFile || !profile) return;
    setProcessing(true);
    try {
      let width = 0,
        height = 0,
        pixelData: Float32Array;
      const ext = imageFile.name.split(".").pop()?.toLowerCase();
      if (!["arw", "cr2", "nef", "dng", "raf", "orf"].includes(ext || "")) {
        throw new Error(
          "Only RAW formats (ARW, CR2, NEF, DNG, RAF, ORF) are supported."
        );
      }
      const buffer = await imageFile.arrayBuffer();
      const libraw = await new LibRaw();
      try {
        const openResult = await libraw.open(buffer, {
          gamma: [1.0, 1.0],
          no_auto_bright: 1,
          use_camera_wb: 1,
        });
        if (
          openResult !== 0 &&
          openResult !== undefined &&
          openResult !== null
        ) {
          throw new Error("LibRaw open failed with code: " + openResult);
        }
        const memImg = (await libraw.getimage(
          () => {}
        )) as { width: number; height: number; data: Uint8Array };
        if (!memImg || !memImg.data)
          throw new Error("LibRaw failed to decode image.");
        width = memImg.width;
        height = memImg.height;
        const rawData = memImg.data as Uint8Array;
        const totalPixels = width * height;
        pixelData = new Float32Array(totalPixels * 4);
        for (let i = 0; i < totalPixels; i++) {
          const idx = i * 4;
          pixelData[idx] = rawData[idx] / 255.0;
          pixelData[idx + 1] = rawData[idx + 1] / 255.0;
          pixelData[idx + 2] = rawData[idx + 2] / 255.0;
          pixelData[idx + 3] = 1.0;
        }
      } finally {
        libraw.close();
      }

      const ctx = canvasRef.current!.getContext("2d");
      canvasRef.current!.width = width;
      canvasRef.current!.height = height;

      const engine = new SimulationEngine(profile);
      const filmType = engine.getFilmType();
      const isBW = filmType === "bw_negative";
      const outputBuffer = new Uint8ClampedArray(width * height * 4);
      const dyeMatrix =
        profile.physics?.dye_coupling_matrix ||
        getDyeCouplingMatrix(profile.id);
      const toneMode = profile.rendering?.tone_mapping || "linear";
      const useACES = toneMode === "aces";
      const useLinear = toneMode === "linear";

      let autoExposureBias = 0.0;
      if (useAutoExposure) {
        let logLuxSum = 0,
          count = 0;
        const epsilon = 0.0001,
          stride = 100 * 4;
        for (let i = 0; i < pixelData.length; i += stride) {
          const lux =
            pixelData[i] * 0.2126 +
            pixelData[i + 1] * 0.7152 +
            pixelData[i + 2] * 0.0722;
          logLuxSum += Math.log(Math.max(epsilon, lux));
          count++;
        }
        const logAvgLux = Math.exp(logLuxSum / count);
        const targetLux = 0.25;
        if (logAvgLux > epsilon)
          autoExposureBias = Math.log2(targetLux / logAvgLux);
      }

      const totalExposure = exposure + autoExposureBias;
      let inputSatSum = 0;
      let satAfterInvert = 0;
      let pixelCount = 0;

      const getSaturation = (r: number, g: number, b: number): number => {
        const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
        return max === 0 ? 0 : (max - min) / max;
      };

      const boostSaturation = (
        r: number,
        g: number,
        b: number,
        factor: number
      ): [number, number, number] => {
        const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
        const l = (max + min) / 2;
        if (max === min) return [r, g, b];
        const d = max - min;
        let s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        let h = 0;
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
        s = Math.min(1, s * factor);
        const hue2rgb = (p: number, q: number, t: number): number => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        if (s === 0) return [l, l, l];
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return [
          hue2rgb(p, q, h + 1 / 3),
          hue2rgb(p, q, h),
          hue2rgb(p, q, h - 1 / 3),
        ];
      };

      const densitiesR: number[] = [],
        densitiesG: number[] = [],
        densitiesB: number[] = [];
      for (let i = 0; i < pixelData.length; i += 4) {
        const r = Math.pow(pixelData[i], 2.2),
          g = Math.pow(pixelData[i + 1], 2.2),
          b = Math.pow(pixelData[i + 2], 2.2);
        inputSatSum += getSaturation(r, g, b);
        const logExp = engine.expose([r, g, b], totalExposure);
        const cmyDensity = engine.develop(logExp);
        const scanned = engine.scan(cmyDensity);
        let finalDensity: [number, number, number];
        if (filmType === "reversal") {
          finalDensity = scanned;
          satAfterInvert += getSaturation(scanned[0], scanned[1], scanned[2]);
        } else {
          const inverted = engine.invert(scanned);
          satAfterInvert += getSaturation(
            inverted[0],
            inverted[1],
            inverted[2]
          );
          finalDensity =
            dyeMatrix !== IDENTITY_MATRIX
              ? applyDyeCouplingToDensity(inverted, dyeMatrix)
              : inverted;
        }
        densitiesR.push(finalDensity[0]);
        densitiesG.push(finalDensity[1]);
        densitiesB.push(finalDensity[2]);
        pixelCount++;
      }

      densitiesR.sort((a, b) => a - b);
      densitiesG.sort((a, b) => a - b);
      densitiesB.sort((a, b) => a - b);
      let rangeR, rangeG, rangeB;
      if (preserveExposure) {
        if (filmType === "reversal") {
          rangeR = rangeG = rangeB = { min: 0.0, max: 1.0, scale: 1.0 };
        } else {
          const idxLow = Math.floor(densitiesR.length * 0.005);
          const offsetR = densitiesR[idxLow] || 0.0,
            offsetG = densitiesG[idxLow] || 0.0,
            offsetB = densitiesB[idxLow] || 0.0;
          const FIXED_MAX = 2.7,
            fixedScale = 1.0 / FIXED_MAX;
          rangeR = {
            min: offsetR,
            max: offsetR + FIXED_MAX,
            scale: fixedScale,
          };
          rangeG = {
            min: offsetG,
            max: offsetG + FIXED_MAX,
            scale: fixedScale,
          };
          rangeB = {
            min: offsetB,
            max: offsetB + FIXED_MAX,
            scale: fixedScale,
          };
        }
      } else {
        const pHigh = useLinear ? 1.0 : 0.995,
          pLow = useLinear ? 0.0 : 0.005;
        const idxHigh = Math.floor(densitiesR.length * pHigh) - 1,
          idxLow = Math.floor(densitiesR.length * pLow);
        const getRange = (arr: number[]) => {
          const min = arr[idxLow] || 0,
            max = arr[idxHigh] || 3.0,
            range = max - min;
          return { min, max, scale: range > 0.001 ? 1.0 / range : 1.0 };
        };
        rangeR = getRange(densitiesR);
        rangeG = getRange(densitiesG);
        rangeB = getRange(densitiesB);
      }
      const avgInputSatFirstPass = inputSatSum / pixelCount;
      const avgAfterInvertFirstPass = satAfterInvert / pixelCount;
      const rawFactor =
        avgAfterInvertFirstPass > 0.001
          ? avgInputSatFirstPass / avgAfterInvertFirstPass
          : 1.0;
      const SATURATION_RESTORE_FACTOR = Math.min(
        Math.max(rawFactor * 1.5, 1.0),
        5.0
      );

      const linearBuffer = new Float32Array(pixelData.length);
      for (let i = 0; i < pixelData.length; i += 4) {
        const r = Math.pow(pixelData[i], 2.2),
          g = Math.pow(pixelData[i + 1], 2.2),
          b = Math.pow(pixelData[i + 2], 2.2);
        const res = engine.processPixel([r, g, b], totalExposure);
        let processed = filmType === "reversal" ? res : engine.invert(res);
        if (!isBW && filmType !== "reversal" && dyeMatrix !== IDENTITY_MATRIX) {
          processed = applyDyeCouplingToDensity(processed, dyeMatrix);
        }
        let R_h = processed[0],
          G_h = processed[1],
          B_h = processed[2];
        if (!isBW && filmType !== "reversal") {
          [R_h, G_h, B_h] = applyRedHalation(
            processed[0],
            processed[1],
            processed[2],
            { strength: 0.15, radius: 1.5 }
          );
        }
        linearBuffer[i] = (R_h - rangeR.min) * rangeR.scale;
        linearBuffer[i + 1] = (G_h - rangeG.min) * rangeG.scale;
        linearBuffer[i + 2] = (B_h - rangeB.min) * rangeB.scale;
        linearBuffer[i + 3] = 1.0;
      }

      const bloomedBuffer = applyPyramidBloom(linearBuffer, width, height, {
        strength: bloomStrength,
        threshold: 0.65,
        radius: 2.0,
      });
      for (let i = 0; i < pixelData.length; i += 4) {
        const R_l = bloomedBuffer[i];
        const G_l = bloomedBuffer[i + 1];
        const B_l = bloomedBuffer[i + 2];
        let R_d, G_d, B_d;
        if (useLinear || !useACES) {
          R_d = Math.pow(Math.max(0, Math.min(1, R_l)), 1 / 2.2);
          G_d = Math.pow(Math.max(0, Math.min(1, G_l)), 1 / 2.2);
          B_d = Math.pow(Math.max(0, Math.min(1, B_l)), 1 / 2.2);
        } else {
          R_d = applyToneMapping(R_l, "aces");
          G_d = applyToneMapping(G_l, "aces");
          B_d = applyToneMapping(B_l, "aces");
        }
        let R_f = R_d,
          G_f = G_d,
          B_f = B_d;
        if (!isBW)
          [R_f, G_f, B_f] = boostSaturation(
            R_d,
            G_d,
            B_d,
            SATURATION_RESTORE_FACTOR
          );
        else {
          const luma = R_d * 0.299 + G_d * 0.587 + B_d * 0.114;
          R_f = G_f = B_f = luma;
        }
        const px = (i / 4) % width,
          py = Math.floor(i / 4 / width);
        [R_f, G_f, B_f] = applyPhysicalGrain(R_f, G_f, B_f, px, py, {
          iso: profile.meta?.iso || 100,
          monochrome: isBW,
        });
        const dither = (Math.random() - 0.5) / 255.0;
        outputBuffer[i] = Math.max(0, Math.min(255, (R_f + dither) * 255));
        outputBuffer[i + 1] = Math.max(0, Math.min(255, (G_f + dither) * 255));
        outputBuffer[i + 2] = Math.max(0, Math.min(255, (B_f + dither) * 255));
        outputBuffer[i + 3] = 255;
      }
      const newImageData = new ImageData(outputBuffer, width, height);
      ctx!.putImageData(newImageData, 0, 0);
    } catch (e) {
      console.error("Processing failed:", e);
      alert("Error: " + (e as Error).message);
    } finally {
      setProcessing(false);
    }
  }

  const downloadTiff = () => {
    if (!canvasRef.current || !profile) return;
    const canvas = canvasRef.current,
      ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const tiffBytes = UTIF.encodeImage(
      rgba.buffer,
      canvas.width,
      canvas.height
    );
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    const filename = `SpectraFilm_${profile.id}_${
      exposure >= 0 ? "+" : ""
    }${exposure.toFixed(1)}EV_${timestamp}.tif`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([tiffBytes], { type: "image/tiff" })
    );
    link.download = filename;
    link.click();
  };

  const getProfileLabel = (id: string) =>
    id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                <Film className="w-6 h-6 text-zinc-400" />
              </div>
              <span className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase">
                Physical Simulation
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter"
            >
              SPECTRA FILM
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 text-zinc-500 text-sm font-medium italic"
          >
            <Box className="w-4 h-4" />
            Advanced Spectral Processing Engine
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            {/* Upload Area */}
            <div className="group relative">
              <label className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer overflow-hidden backdrop-blur-sm">
                <input
                  type="file"
                  className="hidden"
                  accept=".dng,.arw,.cr2,.nef,.raf,.orf"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imageFile ? (
                    <>
                      <ImageIcon className="w-8 h-8 mb-3 text-zinc-400" />
                      <p className="text-sm text-zinc-400 font-medium px-4 truncate max-w-full">
                        {imageFile.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase tracking-widest font-bold">
                        Import RAW
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Controls Content */}
            <div className="space-y-8 p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl backdrop-blur-sm">
              {/* Profile Selection */}
              <div className="space-y-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-1">Chemistry Selection</label>
                <div className="relative group">
                  <select
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value)}
                    className="w-full bg-zinc-900/50 text-zinc-100 border border-zinc-800 rounded-xl px-5 py-4 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-zinc-600 hover:border-zinc-700 transition-all font-sans"
                  >
                    {Object.entries(
                      profilesList.reduce((acc, id) => {
                        let category = "Color Negative (Consumer)";
                        if (id.includes("portra") || id.includes("ektar") || id.includes("pro_400h")) {
                          category = "Color Negative (Pro)";
                        } else if (id.includes("provia") || id.includes("velvia") || id.includes("ektachrome")) {
                          category = "Slide / Reversal";
                        } else if (id.includes("vision3")) {
                          category = "Motion Picture";
                        }
                        
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(id);
                        return acc;
                      }, {} as Record<string, string[]>)
                    ).sort(([a], [b]) => {
                      // Custom sort order
                      const order = ["Color Negative (Pro)", "Color Negative (Consumer)", "Slide / Reversal", "Motion Picture"];
                      return order.indexOf(a) - order.indexOf(b);
                    }).map(([category, ids]) => (
                      <optgroup key={category} label={category} className="bg-zinc-900 text-zinc-500 text-[10px] font-bold tracking-widest uppercase">
                        {ids.map((id) => (
                          <option key={id} value={id} className="bg-zinc-900 text-zinc-100 text-sm py-2">
                            {getProfileLabel(id)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Adjustments */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-1">Exposure Compensation</label>
                    <span className="text-xs font-mono text-zinc-400">{exposure > 0 ? '+' : ''}{exposure} EV</span>
                  </div>
                  <input 
                    type="range" min="-3" max="3" step="0.5" 
                    value={exposure} 
                    onChange={(e) => setExposure(parseFloat(e.target.value))}
                    className="w-full accent-zinc-100"
                  />
                  <label className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 cursor-pointer group hover:bg-zinc-900/50 transition-colors">
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all",
                      useAutoExposure ? "bg-white border-white text-black" : "border-zinc-700"
                    )}>
                      {useAutoExposure && <Zap className="w-2.5 h-2.5 fill-current" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={useAutoExposure} onChange={(e) => setUseAutoExposure(e.target.checked)} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">Auto-Luminance</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-tight">Adaptive 25% Gray target</span>
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-1">Highlight Bloom</label>
                    <span className="text-xs font-mono text-zinc-400">{(bloomStrength * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.5" step="0.01" 
                    value={bloomStrength} 
                    onChange={(e) => setBloomStrength(parseFloat(e.target.value))}
                    className="w-full accent-zinc-100"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 cursor-pointer group hover:bg-zinc-900/50 transition-colors">
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-all",
                    preserveExposure ? "bg-white border-white text-black" : "border-zinc-700"
                  )}>
                    {preserveExposure && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={preserveExposure} onChange={(e) => setPreserveExposure(e.target.checked)} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">Preserve Exposure</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-tight">Lock physical dynamic range</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={processImage}
                disabled={!imageSrc || !profile || processing}
                className="w-full bg-zinc-100 text-black py-4 rounded-xl hover:bg-white disabled:opacity-20 disabled:hover:bg-zinc-100 transition-all font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-zinc-500/10"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Simulating Chemistry...
                  </>
                ) : (
                  <>
                    <Settings2 className="w-4 h-4" />
                    Develop & Scan
                  </>
                )}
              </button>

              {imageSrc && !processing && (
                <button
                  onClick={downloadTiff}
                  className="w-full bg-transparent text-zinc-400 py-4 rounded-xl border border-zinc-800 hover:bg-zinc-900/50 hover:text-zinc-200 transition-all font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                >
                  <Download className="w-4 h-4" />
                  Export Lossless
                </button>
              )}
            </div>
          </motion.div>

          {/* Viewport Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            <div className="relative flex-grow min-h-[500px] lg:min-h-0 bg-zinc-950 rounded-3xl border border-zinc-800/50 shadow-inner group overflow-hidden flex items-center justify-center backdrop-blur-xl">
              {/* Background Texture */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#fff 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />

              <AnimatePresence mode="wait">
                {imageSrc ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative w-full h-full flex flex-col items-center justify-center p-8"
                  >
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                      style={{
                        filter: processing ? "blur(20px) grayscale(1)" : "none",
                        transition: "filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                    {processing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="w-12 h-12 text-zinc-100 animate-spin-slow" />
                          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-100 animate-pulse">
                            Processing Spectral Data
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6 text-center px-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:scale-110 transition-transform duration-700">
                      <ImageIcon className="w-8 h-8 text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold tracking-tight text-zinc-200">
                        No Image Loaded
                      </h3>
                      <p className="text-sm text-zinc-500 max-w-[280px]">
                        Upload a camera RAW file to begin physical simulation.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Badges */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-zinc-800/50 flex items-center gap-2">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full animate-pulse",
                      imageSrc ? "bg-emerald-500" : "bg-zinc-700"
                    )}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {imageSrc ? "System Ready" : "Waiting"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 px-2">
              <Info className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed text-zinc-500 font-medium italic">
                SpectraFilm uses advanced spectral modeling to simulate the
                physical interaction of light with silver halide crystals and
                dye couplers. Preview resolution is adaptive; final exports
                maintain full source bit-depth.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 2px;
          background: #27272a;
          border-radius: 9999px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f4f4f5;
          margin-top: -7px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
          cursor: pointer;
          border: 2px solid #000;
          transition: transform 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
