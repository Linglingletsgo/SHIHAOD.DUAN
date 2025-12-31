/**
 * ACES ADX (Academy Density Exchange) Implementation
 * 
 * Based on ACES specification:
 * - urn:ampas:aces:transformId:v2.0:CSC.Academy.ADX10_to_ACES.a2.v1
 * 
 * Physical Workflow:
 * 1. Density (from film scan) → Channel Independent Density (CID)
 * 2. CID → Relative Log Exposure (via calibrated LUT)
 * 3. Log Exposure → Linear Exposure
 * 4. Linear Exposure → ACES (AP0 color space)
 * 
 * This is the INDUSTRY STANDARD for film scanning.
 */

type Vector3 = [number, number, number];






/**
 * Convert negative film CMY density to display sRGB
 * Physical approach: Density → Transmittance → Scene Light → sRGB
 * 
 * This bypasses ACES ADX because we're working with theoretical chemical density,
 * not scanner-measured density values.
 */
export function negativeDensityToACES(densityCMY: Vector3): Vector3 {
  const [C, M, Y] = densityCMY;
  
  // Step 1: Density → Transmittance (Beer-Lambert Law)
  // T = 10^(-D)
  const T_cyan = Math.pow(10, -C);
  const T_magenta = Math.pow(10, -M);
  const T_yellow = Math.pow(10, -Y);
  
  // Step 2: CMY Transmittance → RGB Scene Light
  // Negative film: 
  // - Low cyan transmittance (high density) = Dark red in scene = Low R
  // - High cyan transmittance (low density) = Bright red in scene = High R
  //
  // Physical relationship:
  // R_scene ∝ T_cyan (cyan absorbs red)
  // G_scene ∝ T_magenta (magenta absorbs green)
  // B_scene ∝ T_yellow (yellow absorbs blue)
  
  const R_scene = T_cyan;
  const G_scene = T_magenta;
  const B_scene = T_yellow;
  
  // Debug logging
  if (Math.random() < 0.001) {
    console.log('[PHYSICAL DEBUG] CMY Density:', densityCMY.map(v => v.toFixed(3)));
    console.log('[PHYSICAL DEBUG] CMY Transmittance:', [T_cyan, T_magenta, T_yellow].map(v => v.toFixed(3)));
    console.log('[PHYSICAL DEBUG] RGB Scene:', [R_scene, G_scene, B_scene].map(v => v.toFixed(3)));
  }
  
  // Step 3: Return scene-referred linear RGB (similar to ACES concept)
  return [R_scene, G_scene, B_scene];
}

/**
 * Scene-referred linear RGB to sRGB display
 * Standard color management workflow
 */
export function acesToSRGB(sceneRGB: Vector3): Vector3 {
  let [R, G, B] = sceneRGB;
  
  // Simple tone mapping (compress dynamic range)
  R = R / (1 + R);
  G = G / (1 + G);
  B = B / (1 + B);
  
  // Debug
  if (Math.random() < 0.001) {
    console.log('[PHYSICAL DEBUG] After tone mapping:', [R, G, B].map(v => v.toFixed(6)));
  }
  
  // sRGB OETF (gamma encoding)
  const applyGamma = (v: number) => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308
      ? 12.92 * v
      : 1.055 * Math.pow(v, 1/2.4) - 0.055;
  };
  
  const sRGB: Vector3 = [
    applyGamma(R),
    applyGamma(G),
    applyGamma(B)
  ];
  
  if (Math.random() < 0.001) {
    console.log('[PHYSICAL DEBUG] Final sRGB:', sRGB.map(v => v.toFixed(6)));
    console.log('---');
  }
  
  return sRGB;
}

/**
 * One-shot conversion: Negative CMY Density → Display
 */
export function negativeDensityToDisplay(densityCMY: Vector3): Vector3 {
  const sceneRGB = negativeDensityToACES(densityCMY);
  const srgb = acesToSRGB(sceneRGB);
  return srgb;
}

/**
 * DEPRECATED: Old function for backward compatibility
 */
export function densityToDisplay(density: Vector3): Vector3 {
  return negativeDensityToDisplay(density);
}
