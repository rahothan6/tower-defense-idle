/**
 * roSprites.js
 * Pixel Art Canvas Rendering Engine for Ragnarok Online Themed Elements:
 * - High Wizard Hero (Staff aiming, Idle & Casting stance)
 * - Poring Family (Poring, Drops, Poporing, Marin)
 * - Mini-Bosses (Angeling, Deviling, Ghostring)
 * - MVP Bosses (Golden Thief Bug, Baphomet)
 * - Familiars / Drones (Arcane Orb, Lightning Oculus, Healing Fairy)
 * - Poison Puddle (Venom Dust / Toxic Slime)
 */

// ==========================================
// 1. HIGH WIZARD HERO (แทนป้อมตรงกลาง)
// ==========================================
export function drawHighWizard(ctx, cx, cy, scale, isCasting, aimAngle = 0) {
  ctx.save();
  ctx.translate(cx, cy);

  const pSize = scale;
  const t = Date.now();
  const castBob = isCasting ? -1.5 * pSize : Math.sin(t * 0.005) * 1.5;

  // 1. Soft Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 16.5 * pSize, 10 * pSize, 3.5 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Leather Boots
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-5 * pSize, 14.5 * pSize, 3.8 * pSize, 2.5 * pSize);
  ctx.fillRect(1.5 * pSize, 14.5 * pSize, 3.8 * pSize, 2.5 * pSize);

  // 3. Wizard Cape (Dark Navy/Purple)
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(-9 * pSize, 0 + castBob);
  ctx.lineTo(-11 * pSize, 16 * pSize);
  ctx.lineTo(9 * pSize, 16 * pSize);
  ctx.lineTo(7 * pSize, 0 + castBob);
  ctx.fill();

  // 4. Wizard Robe (Blue with Gold Hem)
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.moveTo(-6 * pSize, 2 * pSize + castBob);
  ctx.lineTo(-7 * pSize, 15 * pSize);
  ctx.lineTo(6 * pSize, 15 * pSize);
  ctx.lineTo(5 * pSize, 2 * pSize + castBob);
  ctx.fill();

  // Gold Trim
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-7 * pSize, 14 * pSize, 13 * pSize, 1.5 * pSize);

  // 5. Head & Anime Face
  ctx.fillStyle = '#fed7aa'; // Skin
  ctx.beginPath();
  ctx.ellipse(0, -3 * pSize + castBob, 5.5 * pSize, 5 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (Face direction based on aimAngle)
  const faceDir = Math.cos(aimAngle) >= 0 ? 1 : -1;
  const eyeOffset = faceDir > 0 ? 0 : -1 * pSize;

  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect((-3 + eyeOffset) * pSize, -3 * pSize + castBob, 1.6 * pSize, 2.4 * pSize);
  ctx.fillRect((1.5 + eyeOffset) * pSize, -3 * pSize + castBob, 1.6 * pSize, 2.4 * pSize);

  // Eye reflection highlight
  ctx.fillStyle = '#ffffff';
  ctx.fillRect((-2.5 + eyeOffset) * pSize, -2.6 * pSize + castBob, 0.8 * pSize, 1.0 * pSize);
  ctx.fillRect((2.0 + eyeOffset) * pSize, -2.6 * pSize + castBob, 0.8 * pSize, 1.0 * pSize);

  // Hair (Blonde)
  ctx.fillStyle = '#fde047';
  ctx.fillRect(-5 * pSize, -7 * pSize + castBob, 10 * pSize, 2.5 * pSize);
  ctx.fillRect(-6 * pSize, -5 * pSize + castBob, 2 * pSize, 5 * pSize);
  ctx.fillRect(4 * pSize, -5 * pSize + castBob, 2 * pSize, 5 * pSize);

  // 6. Iconic Pointy Wizard Hat
  ctx.fillStyle = '#1d4ed8';
  ctx.beginPath();
  ctx.ellipse(0, -7 * pSize + castBob, 12 * pSize, 3.5 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e40af';
  ctx.beginPath();
  ctx.moveTo(-6 * pSize, -7 * pSize + castBob);
  ctx.quadraticCurveTo(0, -22 * pSize + castBob, 5 * pSize, -24 * pSize + castBob);
  ctx.lineTo(6 * pSize, -7 * pSize + castBob);
  ctx.fill();

  // Hat Gold Band
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-6.5 * pSize, -8.5 * pSize + castBob, 13 * pSize, 1.8 * pSize);

  // 7. Wizard Magic Staff (Aiming towards aimAngle)
  ctx.save();
  // Staff hand position
  const handX = (faceDir > 0 ? 8 : -8) * pSize;
  const handY = (4 * pSize) + castBob;
  ctx.translate(handX, handY);

  // Relative staff angle: idle leans slightly, casting aims towards aimAngle
  let staffRot = 0;
  if (isCasting) {
    staffRot = aimAngle - (faceDir > 0 ? 0 : Math.PI);
  } else {
    staffRot = Math.sin(t * 0.005) * 0.08 + (faceDir > 0 ? 0.2 : -0.2);
  }
  ctx.rotate(staffRot);

  // Staff Shaft
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-1.2 * pSize, -18 * pSize, 2.4 * pSize, 30 * pSize);

  // Staff Head (Gold Ring)
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.6 * pSize;
  ctx.beginPath();
  ctx.arc(0, -18 * pSize, 4.8 * pSize, 0, Math.PI * 2);
  ctx.stroke();

  // Glowing Mana Crystal
  ctx.fillStyle = isCasting ? '#ffffff' : '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = isCasting ? 18 : 8;
  ctx.beginPath();
  ctx.arc(0, -18 * pSize, isCasting ? 3.8 * pSize : 2.6 * pSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Staff Muzzle Flash Spark (When Casting)
  if (isCasting) {
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 14;
    for (let sp = 0; sp < 4; sp++) {
      const sAng = (Math.PI / 2) * sp + t * 0.02;
      ctx.fillRect(Math.cos(sAng) * 7 * pSize - pSize, -18 * pSize + Math.sin(sAng) * 7 * pSize - pSize, 2.2 * pSize, 2.2 * pSize);
    }
    ctx.shadowBlur = 0;
  }

  ctx.restore();
  ctx.restore();
}

// ==========================================
// 2. PORING FAMILY & MINI-BOSSES
// ==========================================
export function drawPoring(ctx, cx, cy, scale, bounceOffset, palette, hasWings = false, hasHorns = false, hasHalo = false, isHit = false, isFrozen = false, isPoisoned = false, isGhost = false) {
  ctx.save();
  ctx.translate(cx, cy + bounceOffset);

  if (isGhost) {
    ctx.globalAlpha = 0.72 + Math.sin(Date.now() * 0.006) * 0.18;
  }

  let mainColor = isFrozen ? '#7dd3fc' : (isHit ? '#ffffff' : (isPoisoned ? '#86efac' : palette.body));
  let shadeColor = isFrozen ? '#0284c7' : (isHit ? '#e2e8f0' : (isPoisoned ? '#22c55e' : palette.shade));
  let outlineColor = isFrozen ? '#0369a1' : (isHit ? '#cbd5e1' : (isPoisoned ? '#15803d' : palette.outline));

  const pSize = scale;
  const sx = 1 + bounceOffset * 0.04;
  const sy = 1 - bounceOffset * 0.06;
  ctx.scale(sx, sy);

  // Wings (Angeling / Deviling)
  if (hasWings) {
    const wingFlap = Math.sin(Date.now() * 0.012) * 4;
    ctx.fillStyle = palette.wingColor || '#ffffff';
    // Left Wing
    ctx.fillRect(-14 * pSize, (-4 + wingFlap) * pSize, 5 * pSize, 3 * pSize);
    ctx.fillRect(-12 * pSize, (-1 + wingFlap) * pSize, 4 * pSize, 3 * pSize);
    // Right Wing
    ctx.fillRect(9 * pSize, (-4 - wingFlap) * pSize, 5 * pSize, 3 * pSize);
    ctx.fillRect(8 * pSize, (-1 - wingFlap) * pSize, 4 * pSize, 3 * pSize);
  }

  // Horns (Deviling)
  if (hasHorns) {
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-7 * pSize, -11 * pSize, 3 * pSize, 3 * pSize);
    ctx.fillRect(-6 * pSize, -13 * pSize, 2 * pSize, 3 * pSize);
    ctx.fillRect(4 * pSize, -11 * pSize, 3 * pSize, 3 * pSize);
    ctx.fillRect(4 * pSize, -13 * pSize, 2 * pSize, 3 * pSize);
  }

  // Halo (Angeling)
  if (hasHalo) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.8 * pSize;
    ctx.beginPath();
    ctx.ellipse(0, -13 * pSize, 6 * pSize, 2 * pSize, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Soft Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 11 * pSize, 10 * pSize, 3.5 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Slime Body (Outline)
  ctx.fillStyle = outlineColor;
  ctx.beginPath();
  ctx.ellipse(0, 1 * pSize, 11.5 * pSize, 10 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Slime Body (Main)
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.ellipse(0, 0.5 * pSize, 10.5 * pSize, 9 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bottom Shade
  ctx.fillStyle = shadeColor;
  ctx.beginPath();
  ctx.ellipse(0, 4.5 * pSize, 8.5 * pSize, 4 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-5 * pSize, -2 * pSize, 2.5 * pSize, 4.5 * pSize);
  ctx.fillRect(2.5 * pSize, -2 * pSize, 2.5 * pSize, 4.5 * pSize);

  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-4.5 * pSize, -1.5 * pSize, 1.2 * pSize, 1.8 * pSize);
  ctx.fillRect(3 * pSize, -1.5 * pSize, 1.2 * pSize, 1.8 * pSize);

  // Smile
  ctx.fillStyle = '#831843';
  ctx.fillRect(-1 * pSize, 3.5 * pSize, 2 * pSize, 1.2 * pSize);

  ctx.restore();
}

// ==========================================
// 3. MVP BOSS 1: GOLDEN THIEF BUG (GTB)
// ==========================================
export function drawGTB(ctx, cx, cy, scale, isHit = false, isFrozen = false, isPoisoned = false) {
  ctx.save();
  ctx.translate(cx, cy);

  const pSize = scale;
  const t = Date.now();

  let mainColor = isFrozen ? '#7dd3fc' : (isHit ? '#ffffff' : (isPoisoned ? '#86efac' : '#eab308'));
  let armorColor = isFrozen ? '#38bdf8' : (isHit ? '#f1f5f9' : (isPoisoned ? '#4ade80' : '#facc15'));
  let darkColor = isFrozen ? '#0369a1' : (isHit ? '#cbd5e1' : (isPoisoned ? '#15803d' : '#854d0e'));

  // Golden Boss Aura
  ctx.save();
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
  ctx.lineWidth = 2 * pSize;
  ctx.beginPath();
  ctx.arc(0, 0, 22 * pSize + Math.sin(t * 0.008) * 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 14 * pSize, 16 * pSize, 5 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Insect Legs (6 twitching legs)
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 2 * pSize;
  const legTwitch = Math.sin(t * 0.015) * 3;
  for (let s of [-1, 1]) {
    // Front leg
    ctx.beginPath();
    ctx.moveTo(s * 10 * pSize, -2 * pSize);
    ctx.lineTo(s * 18 * pSize, -6 * pSize + legTwitch);
    ctx.stroke();

    // Middle leg
    ctx.beginPath();
    ctx.moveTo(s * 12 * pSize, 4 * pSize);
    ctx.lineTo(s * 20 * pSize, 6 * pSize - legTwitch);
    ctx.stroke();

    // Back leg
    ctx.beginPath();
    ctx.moveTo(s * 10 * pSize, 10 * pSize);
    ctx.lineTo(s * 18 * pSize, 16 * pSize + legTwitch);
    ctx.stroke();
  }

  // Beetle Shell (Large Oval)
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.ellipse(0, 3 * pSize, 14 * pSize, 11 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shell Seam
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 1.5 * pSize;
  ctx.beginPath();
  ctx.moveTo(0, -6 * pSize);
  ctx.lineTo(0, 14 * pSize);
  ctx.stroke();

  // Golden Armor Plates (Gleaming GTB Shell)
  ctx.fillStyle = armorColor;
  ctx.beginPath();
  ctx.ellipse(-5 * pSize, 2 * pSize, 5 * pSize, 7 * pSize, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(5 * pSize, 2 * pSize, 5 * pSize, 7 * pSize, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.ellipse(0, -9 * pSize, 7 * pSize, 5 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Red Glowing Eyes
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 6;
  ctx.fillRect(-4 * pSize, -11 * pSize, 2.5 * pSize, 2.5 * pSize);
  ctx.fillRect(1.5 * pSize, -11 * pSize, 2.5 * pSize, 2.5 * pSize);
  ctx.shadowBlur = 0;

  // Antennae
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 1.5 * pSize;
  ctx.beginPath();
  ctx.moveTo(-3 * pSize, -13 * pSize);
  ctx.lineTo(-8 * pSize, -20 * pSize);
  ctx.moveTo(3 * pSize, -13 * pSize);
  ctx.lineTo(8 * pSize, -20 * pSize);
  ctx.stroke();

  ctx.restore();
}

// ==========================================
// 4. MVP BOSS 2: BAPHOMET
// ==========================================
export function drawBaphomet(ctx, cx, cy, scale, isHit = false, isFrozen = false, isPoisoned = false) {
  ctx.save();
  ctx.translate(cx, cy);

  const pSize = scale;
  const t = Date.now();

  let bodyColor = isFrozen ? '#7dd3fc' : (isHit ? '#ffffff' : (isPoisoned ? '#4ade80' : '#1e1b4b'));
  let furColor = isFrozen ? '#38bdf8' : (isHit ? '#f1f5f9' : (isPoisoned ? '#22c55e' : '#0f172a'));
  let hornColor = isFrozen ? '#bae6fd' : (isHit ? '#e2e8f0' : (isPoisoned ? '#15803d' : '#64748b'));

  // Red Demonic Boss Aura
  ctx.save();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.lineWidth = 2.5 * pSize;
  ctx.beginPath();
  ctx.arc(0, 0, 26 * pSize + Math.sin(t * 0.007) * 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 20 * pSize, 14 * pSize, 4.5 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Furry Demon Body
  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.ellipse(0, 6 * pSize, 10 * pSize, 14 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 6 * pSize, 8 * pSize, 11 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Demon Head (Goat Skull)
  ctx.fillStyle = furColor;
  ctx.beginPath();
  ctx.ellipse(0, -7 * pSize, 8 * pSize, 7 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Goat Snout
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(0, -4 * pSize, 4 * pSize, 5 * pSize, 0, 0, Math.PI * 2);
  ctx.fill();

  // Curled Goat Horns (Iconic Baphomet Horns)
  ctx.strokeStyle = hornColor;
  ctx.lineWidth = 4 * pSize;
  ctx.beginPath();
  // Left Horn
  ctx.moveTo(-5 * pSize, -11 * pSize);
  ctx.quadraticCurveTo(-18 * pSize, -20 * pSize, -16 * pSize, -8 * pSize);
  ctx.stroke();

  // Right Horn
  ctx.beginPath();
  ctx.moveTo(5 * pSize, -11 * pSize);
  ctx.quadraticCurveTo(18 * pSize, -20 * pSize, 16 * pSize, -8 * pSize);
  ctx.stroke();

  // Glowing Red Eyes
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 10;
  ctx.fillRect(-4 * pSize, -8 * pSize, 2.5 * pSize, 2.5 * pSize);
  ctx.fillRect(1.5 * pSize, -8 * pSize, 2.5 * pSize, 2.5 * pSize);
  ctx.shadowBlur = 0;

  // Giant Executioner's Scythe
  ctx.save();
  ctx.translate(12 * pSize, 0);
  ctx.rotate(0.2 + Math.sin(t * 0.006) * 0.05);

  // Scythe Shaft
  ctx.fillStyle = '#475569';
  ctx.fillRect(-1.5 * pSize, -26 * pSize, 3 * pSize, 48 * pSize);

  // Scythe Blade (Curved Silver Blade)
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(-1.5 * pSize, -26 * pSize);
  ctx.quadraticCurveTo(-22 * pSize, -24 * pSize, -26 * pSize, -6 * pSize);
  ctx.quadraticCurveTo(-14 * pSize, -16 * pSize, -1.5 * pSize, -18 * pSize);
  ctx.fill();

  ctx.restore();

  ctx.restore();
}

// ==========================================
// 5. POISON PUDDLE (Venom Dust / Toxic Slime)
// ==========================================
export function drawPoisonPuddleArt(ctx, p, t) {
  ctx.save();

  // Wobbly Slime Base
  const wobble = Math.sin(t * 0.004 + p.x) * 2;
  const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.2, p.x, p.y, p.radius);
  grad.addColorStop(0, 'rgba(34, 197, 94, 0.7)');
  grad.addColorStop(0.6, 'rgba(21, 128, 61, 0.5)');
  grad.addColorStop(0.9, 'rgba(88, 28, 135, 0.4)');
  grad.addColorStop(1, 'rgba(34, 197, 94, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius + wobble, 0, Math.PI * 2);
  ctx.fill();

  // Outer Acid Border
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = -t * 0.02;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Toxic Bubbles
  if (!p.bubbles) {
    p.bubbles = [
      { ox: -12, oy: -6, size: 4, speed: 0.006, phase: 0 },
      { ox: 10, oy: 8, size: 5, speed: 0.005, phase: 2 },
      { ox: 4, oy: -14, size: 3.5, speed: 0.008, phase: 4 },
      { ox: -8, oy: 12, size: 4.5, speed: 0.007, phase: 1 },
      { ox: 14, oy: -8, size: 3, speed: 0.009, phase: 3 }
    ];
  }

  p.bubbles.forEach(b => {
    const cycle = (t * b.speed + b.phase) % (Math.PI * 2);
    const bSize = Math.max(0, Math.sin(cycle) * b.size);
    if (bSize > 0.5) {
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.arc(p.x + b.ox, p.y + b.oy, bSize, 0, Math.PI * 2);
      ctx.fill();

      // Bubble highlight
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x + b.ox - bSize * 0.4, p.y + b.oy - bSize * 0.4, 1.2, 1.2);
    }
  });

  ctx.restore();
}

// ==========================================
// 6. FAMILIARS (DRONES IN RO THEME)
// ==========================================
// 6.1 Combat Drone -> Arcane Orb (ลูกแก้วมนตราหมุนรอบตัว)
export function drawCombatFamiliar(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  const t = Date.now();

  // Soft Outer Glow
  ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, 14 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Rotating Gold Rune Square
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.2 * scale;
  ctx.save();
  ctx.rotate(t * 0.004);
  ctx.strokeRect(-8 * scale, -8 * scale, 16 * scale, 16 * scale);
  ctx.restore();

  // Rotating Purple Rune Circle
  ctx.strokeStyle = '#c084fc';
  ctx.save();
  ctx.rotate(-t * 0.005);
  ctx.beginPath();
  ctx.arc(0, 0, 9 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Mana Core
  const grad = ctx.createRadialGradient(-2 * scale, -2 * scale, 1 * scale, 0, 0, 7 * scale);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.4, '#f472b6');
  grad.addColorStop(1, '#9333ea');

  ctx.fillStyle = grad;
  ctx.shadowColor = '#ec4899';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 6 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 6.2 Laser Drone -> Lightning Oculus (ภูตสายฟ้าคริสตัล)
export function drawLaserOculus(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  const t = Date.now();
  const hover = Math.sin(t * 0.008) * 2;

  // Golden Filigree Holder
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.arc(0, hover, 11 * scale, 0.4, Math.PI - 0.4);
  ctx.stroke();

  // Gold Wings
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-12 * scale, hover - 2 * scale, 4 * scale, 2 * scale);
  ctx.fillRect(8 * scale, hover - 2 * scale, 4 * scale, 2 * scale);

  // Diamond Lightning Crystal
  ctx.save();
  ctx.translate(0, hover);
  ctx.rotate(Math.PI / 4 + Math.sin(t * 0.01) * 0.1);

  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#67e8f9';
  ctx.shadowBlur = 12;
  ctx.fillRect(-5 * scale, -5 * scale, 10 * scale, 10 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-2 * scale, -2 * scale, 4 * scale, 4 * scale);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Sparkles
  if (Math.random() < 0.2) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect((Math.random() - 0.5) * 16 * scale, hover + (Math.random() - 0.5) * 16 * scale, 1.5, 1.5);
  }

  ctx.restore();
}

// 6.3 Repair Drone -> Healing Fairy (ภูตแฟรี่ฮีลมีปีก)
export function drawHealingFairy(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  const t = Date.now();
  const hover = Math.sin(t * 0.01) * 2.5;
  const wingFlap = Math.sin(t * 0.03) * 6;

  // Translucent Fluttering Wings
  ctx.fillStyle = 'rgba(187, 247, 208, 0.7)';
  ctx.beginPath();
  // Left Wing
  ctx.ellipse(-7 * scale, hover - 3 * scale + wingFlap * 0.2, 7 * scale, (4 + wingFlap * 0.3) * scale, -0.4, 0, Math.PI * 2);
  // Right Wing
  ctx.ellipse(7 * scale, hover - 3 * scale - wingFlap * 0.2, 7 * scale, (4 - wingFlap * 0.3) * scale, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Fairy Body (Emerald Dress)
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.ellipse(0, hover + 3 * scale, 3 * scale, 5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fairy Head
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, hover - 2.5 * scale, 3.2 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Blonde Hair
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-3 * scale, hover - 5.5 * scale, 6 * scale, 2.5 * scale);

  // Stardust Glow
  ctx.fillStyle = '#86efac';
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 8;
  ctx.fillRect(-1, hover - 8 * scale, 2, 2);
  ctx.shadowBlur = 0;

  ctx.restore();
}
