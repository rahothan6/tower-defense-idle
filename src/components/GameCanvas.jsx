import React, { useRef, useEffect } from 'react';
import { getDistance, getAngle } from '../utils/gameMath';
import {
  drawHighWizard,
  drawPoring,
  drawGTB,
  drawBaphomet,
  drawCombatFamiliar,
  drawLaserOculus,
  drawHealingFairy,
  drawPoisonPuddleArt
} from '../utils/roSprites';

// วาดสายฟ้าเชื่อมตอนชิ่งกระสุน
function drawLightning(ctx, x1, y1, x2, y2, segments = 5, offset = 12) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const dx = (x2 - x1) / segments;
  const dy = (y2 - y1) / segments;

  for (let i = 1; i < segments; i++) {
    const curX = x1 + dx * i + (Math.random() - 0.5) * offset;
    const curY = y1 + dy * i + (Math.random() - 0.5) * offset;
    ctx.lineTo(curX, curY);
  }
  ctx.lineTo(x2, y2);
}

// คำนวณระยะห่างระหว่างจุดกับเส้นตรง (สำหรับลำแสง Railgun)
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

export default function GameCanvas({ 
  towerStats, 
  wave, 
  skills, 
  isPaused,
  onGameOver, 
  onEnemyKilled, 
  onTowerDamaged,
  onTriggerCardPick
}) {
  const canvasRef = useRef(null);

  const gameEntitiesRef = useRef({
    enemies: [],
    bullets: [],
    damageTexts: [],
    poisonPuddles: [],
    toxicFumes: [],
    lightningBeams: [],
    meteors: [],
    meteorTimer: 0,
    frostNovaTimer: 0,
    frostNovaWave: null,
    towerCurrentHp: 100,
    droneAngle: 0,
    shieldAngle: 0,
    shieldActiveTimer: 0,
    shieldCooldownTimer: 0,
    isShieldActive: true,
    lastShotTime: 0,
    lastTargetAngle: 0,
    poisonSpawnTimer: 0,
    spawnTimer: 1000,
    lastTriggeredWave: 0,
    railgunTimer: 0,
    railgunBeams: [],
    sniperTimer: 0,
    sniperTracers: [],
    gatlingTimer: 0,
    gatlingDurationTimer: 0,
    isGatlingActive: false,
    regenTimer: 0,
    shockwaveCooldownTimer: 0,
    shockwaveWave: null,
    laserDroneAngle: 0,
    laserDroneTimer: 0,
    laserDroneBeams: [],
    repairDroneAngle: 0,
    repairDroneTimer: 0,
    repairBeams: []
  });

  const towerStatsRef = useRef(towerStats);
  const waveRef = useRef(wave);
  const skillsRef = useRef(skills);
  const isPausedRef = useRef(isPaused);

  const callbacksRef = useRef({
    onGameOver,
    onEnemyKilled,
    onTowerDamaged,
    onTriggerCardPick
  });

  useEffect(() => {
    callbacksRef.current = {
      onGameOver,
      onEnemyKilled,
      onTowerDamaged,
      onTriggerCardPick
    };
  });

  useEffect(() => {
    towerStatsRef.current = towerStats;
    waveRef.current = wave;
    skillsRef.current = skills;
    isPausedRef.current = isPaused;
    // ซิงค์เลือดป้อมหากมีการฟื้นฟูเลือด (Vampiric Core) หรืออัปเกรด Max HP จากภายนอก
    if (towerStats.hp > gameEntitiesRef.current.towerCurrentHp) {
      gameEntitiesRef.current.towerCurrentHp = towerStats.hp;
    }
  }, [towerStats, wave, skills, isPaused]);

  // รีเซ็ตสนามเมื่อเริ่มเกมใหม่ที่ Wave 1
  useEffect(() => {
    if (wave === 1) {
      gameEntitiesRef.current.towerCurrentHp = towerStats.maxHp;
      gameEntitiesRef.current.enemies = [];
      gameEntitiesRef.current.bullets = [];
      gameEntitiesRef.current.damageTexts = [];
      gameEntitiesRef.current.poisonPuddles = [];
      gameEntitiesRef.current.lightningBeams = [];
      gameEntitiesRef.current.meteors = [];
      gameEntitiesRef.current.frostNovaWave = null;
      gameEntitiesRef.current.meteorTimer = 0;
      gameEntitiesRef.current.frostNovaTimer = 0;
      gameEntitiesRef.current.lastShotTime = 0;
      gameEntitiesRef.current.spawnTimer = 1000;
      gameEntitiesRef.current.poisonSpawnTimer = 0;
      gameEntitiesRef.current.lastTriggeredWave = 0;
      gameEntitiesRef.current.isShieldActive = true;
      gameEntitiesRef.current.shieldActiveTimer = 0;
      gameEntitiesRef.current.shieldCooldownTimer = 0;
      gameEntitiesRef.current.railgunTimer = 0;
      gameEntitiesRef.current.railgunBeams = [];
      gameEntitiesRef.current.sniperTimer = 0;
      gameEntitiesRef.current.sniperTracers = [];
      gameEntitiesRef.current.gatlingTimer = 0;
      gameEntitiesRef.current.gatlingDurationTimer = 0;
      gameEntitiesRef.current.isGatlingActive = false;
      gameEntitiesRef.current.regenTimer = 0;
      gameEntitiesRef.current.shockwaveCooldownTimer = 0;
      gameEntitiesRef.current.shockwaveWave = null;
      gameEntitiesRef.current.laserDroneAngle = 0;
      gameEntitiesRef.current.laserDroneTimer = 0;
      gameEntitiesRef.current.laserDroneBeams = [];
      gameEntitiesRef.current.repairDroneAngle = 0;
      gameEntitiesRef.current.repairDroneTimer = 0;
      gameEntitiesRef.current.repairBeams = [];
    }
  }, [wave, towerStats.maxHp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const entities = gameEntitiesRef.current;
    let animationFrameId;

    const loop = (timestamp) => {
      const { onGameOver, onEnemyKilled, onTowerDamaged, onTriggerCardPick } = callbacksRef.current;

      // 1. หยุดลูปหากอยู่ในหน้าต่างเลือกการ์ด
      if (isPausedRef.current) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      // 2. หากเลือดหมด หยุดลูป
      if (entities.towerCurrentHp <= 0) return;

      const currentStats = towerStatsRef.current;
      const currentWave = waveRef.current;
      const currentSkills = skillsRef.current || {};
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // ตัวคูณจาก Passive Cards
      const durationMult = 1 + (currentSkills.time_extension || 0) * 0.3;
      const cooldownMult = Math.max(0.4, 1 - (currentSkills.cooldown_reduct || 0) * 0.15);
      const areaMult = 1 + (currentSkills.area_expansion || 0) * 0.25;
      const spellAmpLvl = currentSkills.spell_amp || 0;
      const spellDamageMult = 1 + (spellAmpLvl * 0.35);
      const extraCasts = currentSkills.duplicate_cast || 0; // โบนัสเพิ่มจำนวนสกิล

      // ตัวคูณจาก Shooting Passive Cards
      const deadlyOpticLvl = currentSkills.deadly_optic || 0;
      const critChance = 0.15 + (deadlyOpticLvl * 0.10); // Base 15% + 10% ต่อเลเวล
      const baseCritDamage = 1.5;
      const critDamageBonus = deadlyOpticLvl > 0 ? Math.min(0.50, 0.20 + (deadlyOpticLvl - 1) * 0.10) : 0;
      const critDamageMult = baseCritDamage + critDamageBonus;

      const kineticLvl = currentSkills.kinetic_accel || 0;
      // บัฟดาเมจ Kinetic Accel เริ่ม 10% + 10% ต่อเลเวล โบนัสเพิ่มได้มากสุดไม่เกิน 50% ของพลังโจมตี
      const kineticBonusPercent = Math.min(0.50, kineticLvl * 0.10);
      const kineticMult = 1 + kineticBonusPercent;

      const heavyCaliberLvl = currentSkills.heavy_caliber || 0;
      const knockbackForce = heavyCaliberLvl > 0 ? (6 + heavyCaliberLvl * 2.5) : 0;

      const overclockLvl = currentSkills.overclock_barrel || 0;
      const attackSpeedMult = 1 + (overclockLvl * 0.10); // เริ่มต้น +10% และ +10% ต่อเลเวล
      const bulletSpeed = 500 * (1 + overclockLvl * 0.15);
      const bounceCount = currentSkills.bouncing || 0;

      // ระบบ GATLING OVERDRIVE
      const gatlingLvl = currentSkills.gatling || 0;
      let gatlingSpeedBoost = 1.0;
      if (gatlingLvl > 0) {
        if (entities.isGatlingActive) {
          entities.gatlingDurationTimer += 16;
          gatlingSpeedBoost = 2.0 + (gatlingLvl * 0.50);

          if (entities.gatlingDurationTimer > (3000 + gatlingLvl * 400) * durationMult) {
            entities.isGatlingActive = false;
            entities.gatlingDurationTimer = 0;
          }
        } else {
          entities.gatlingTimer += 16;
          const gatlingInterval = Math.max(3500, (8000 - gatlingLvl * 600) * cooldownMult);
          if (entities.gatlingTimer > gatlingInterval) {
            entities.isGatlingActive = true;
            entities.gatlingTimer = 0;
            entities.gatlingDurationTimer = 0;
          }
        }
      }

      // ตัวคูณจาก Tank & Drone Passive Cards
      const regenLvl = currentSkills.regen_core || 0;
      const thornsLvl = currentSkills.thorns || 0;
      const thornsMult = thornsLvl > 0 ? (2.5 + thornsLvl * 1.0) : 0;
      const titanLvl = currentSkills.titan_plating || 0;
      const damageReduction = titanLvl > 0 ? Math.min(0.55, 0.20 + (titanLvl - 1) * 0.07) : 0;

      const hiveOverdriveLvl = currentSkills.hive_overdrive || 0;
      const droneSpeedMult = 1 + (hiveOverdriveLvl * 0.80);
      const droneDmgMult = 1 + (hiveOverdriveLvl * 0.40);

      const hasDuplicator = (currentSkills.drone_duplicator || 0) > 0;
      const duplicatorLvl = currentSkills.drone_duplicator || 0;

      // 0.1 ระบบฟื้นฟูเลือดอัตโนมัติ (Nano Regen Core)
      if (regenLvl > 0 && entities.towerCurrentHp < currentStats.maxHp) {
        entities.regenTimer += 16;
        if (entities.regenTimer >= 1000) {
          entities.regenTimer = 0;
          const healAmount = regenLvl * 3;
          entities.towerCurrentHp = Math.min(currentStats.maxHp, entities.towerCurrentHp + healAmount);
          onTowerDamaged(entities.towerCurrentHp);

          entities.damageTexts.push({
            x: centerX + (Math.random() * 20 - 10),
            y: centerY - 25,
            text: `+${healAmount} HP`,
            isCrit: false,
            alpha: 1.0,
            vy: -1.0,
            color: '#10b981'
          });
        }
      }

      // 0.2 ระบบคลื่นผลักฉุกเฉิน (Emergency Shockwave)
      const shockwaveLvl = currentSkills.shockwave || 0;
      if (shockwaveLvl > 0) {
        if (entities.shockwaveCooldownTimer > 0) {
          entities.shockwaveCooldownTimer -= 16;
        } else if (entities.towerCurrentHp < currentStats.maxHp * 0.35) {
          entities.shockwaveCooldownTimer = Math.max(12000, 20000 * cooldownMult);
          entities.shockwaveWave = {
            radius: 20,
            maxRadius: Math.max(canvas.width, canvas.height) * 0.9 * areaMult
          };

          const shockDamage = currentStats.damage * (1.5 + shockwaveLvl * 0.8);
          for (let j = entities.enemies.length - 1; j >= 0; j--) {
            const e = entities.enemies[j];
            // ผลักเฉพาะมอนสเตอร์ทั่วไป (บอสและมินิบอสไม่โดนผลัก)
            if (!e.isBoss && !e.isMiniBoss) {
              const pushAngle = getAngle(centerX, centerY, e.x, e.y);
              const pushDist = 160;
              e.x += Math.cos(pushAngle) * pushDist;
              e.y += Math.sin(pushAngle) * pushDist;
            }
            e.hp -= shockDamage;
            e.hitFlashTimer = 5;

            entities.damageTexts.push({
              x: e.x,
              y: e.y - 14,
              text: `💥${Math.round(shockDamage)}`,
              isCrit: true,
              alpha: 1.0,
              vy: -1.5,
              color: '#f59e0b'
            });

            if (e.hp <= 0) {
              entities.enemies.splice(j, 1);
              onEnemyKilled(e.rewardCoins || 10);
            }
          }
        }
      }

      // วาดคลื่นกระแทกฉุกเฉิน VFX
      if (entities.shockwaveWave) {
        entities.shockwaveWave.radius += 20;
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, entities.shockwaveWave.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (entities.shockwaveWave.radius >= entities.shockwaveWave.maxRadius) {
          entities.shockwaveWave = null;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ตรวจสอบเงื่อนไขเลือกการ์ดทุกเวฟหาร 5 ลงตัว
      const isCardWave = (currentWave % 5 === 3) || (currentWave % 5 === 0);

      if (isCardWave && entities.lastTriggeredWave !== currentWave) {
        entities.lastTriggeredWave = currentWave;
        onTriggerCardPick();
      }

      // 1. วาดวงขอบเขตระยะยิง
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentStats.range, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ฟังก์ชันระเบิดซากมอนสเตอร์เมื่อตายจากเวท (Arcane Relic)
      const triggerSpellKillExplosion = (deadX, deadY) => {
        if (spellAmpLvl <= 0) return;
        const blastRadius = (35 + spellAmpLvl * 8) * areaMult;
        const blastDmg = currentStats.damage * (0.6 + spellAmpLvl * 0.2);

        ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.beginPath();
        ctx.arc(deadX, deadY, blastRadius, 0, Math.PI * 2);
        ctx.fill();

        for (let k = entities.enemies.length - 1; k >= 0; k--) {
          const target = entities.enemies[k];
          if (getDistance(deadX, deadY, target.x, target.y) < blastRadius + target.radius) {
            target.hp -= blastDmg;
            target.hitFlashTimer = 3;
            if (target.hp <= 0) {
              entities.enemies.splice(k, 1);
              onEnemyKilled(target.rewardCoins || 10);
            }
          }
        }
      };

      // 2. ระบบเสกมอนสเตอร์
      entities.spawnTimer += 16;
      const spawnInterval = Math.max(220, 1200 - currentWave * 35);
      
      if (entities.spawnTimer > spawnInterval) {
        entities.spawnTimer = 0;
        const angle = Math.random() * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const halfW = canvas.width / 2;
        const halfH = canvas.height / 2;
        // คำนวณระยะขอบจอในทิศทางของมุมนั้นๆ ให้เกิดเลยขอบจอออกไปเพียง 25px
        const distToEdgeX = Math.abs(cos) > 0.0001 ? Math.abs(halfW / cos) : Infinity;
        const distToEdgeY = Math.abs(sin) > 0.0001 ? Math.abs(halfH / sin) : Infinity;
        const borderDist = Math.min(distToEdgeX, distToEdgeY);
        const spawnDist = borderDist + 25;

        const isMiniBoss = (currentWave % 5 === 3) && Math.random() < 0.35;
        const isBoss = (currentWave % 5 === 0) && Math.random() < (currentWave >= 20 ? 0.45 : 0.25);

        let baseHp = 18;
        if (currentWave <= 3) {
          baseHp = 18 + currentWave * 4;
        } else if (currentWave <= 5) {
          baseHp = 35 + currentWave * 8;
        } else if (currentWave <= 12) {
          baseHp = 80 + (currentWave - 5) * 25;
        } else {
          const linearBase = 80 + (7 * 25);
          baseHp = linearBase * Math.pow(1.12, currentWave - 12);
        }

        let finalHp = baseHp;
        let radius = 12;
        let speed = Math.min(65, 30 + currentWave * 1.0);
        let rewardCoins = 10 + currentWave * 2;
        let damageToTower = Math.min(45, 12 + currentWave);

        let monsterType = 'poring';
        if (isBoss) {
          finalHp = baseHp * 5;
          radius = 24;
          speed = 20;
          rewardCoins = 60 + currentWave * 4;
          damageToTower = Math.min(80, 35 + currentWave * 1.5);
          monsterType = currentWave >= 25 ? 'baphomet' : 'gtb';
        } else if (isMiniBoss) {
          finalHp = baseHp * 2.5;
          radius = 18;
          speed = 25;
          rewardCoins = 35 + currentWave * 3;
          damageToTower = Math.min(60, 25 + currentWave * 1.2);
          const miniTypes = ['angeling', 'deviling', 'ghostring'];
          monsterType = miniTypes[Math.floor(Math.random() * miniTypes.length)];
        } else {
          if (currentWave <= 3) {
            monsterType = Math.random() < 0.6 ? 'poring' : 'drops';
          } else if (currentWave <= 7) {
            const r = Math.random();
            monsterType = r < 0.4 ? 'poporing' : (r < 0.75 ? 'marin' : 'poring');
          } else {
            const allTypes = ['poring', 'drops', 'poporing', 'marin'];
            monsterType = allTypes[Math.floor(Math.random() * allTypes.length)];
          }
        }

        entities.enemies.push({
          x: centerX + cos * spawnDist,
          y: centerY + sin * spawnDist,
          hp: finalHp,
          maxHp: finalHp,
          speed,
          radius,
          isBoss,
          isMiniBoss,
          monsterType,
          rewardCoins,
          damageToTower,
          frozenTimer: 0,
          hitFlashTimer: 0,
          poisonedTimer: 0
        });
      }

      // 3. ระบบบ่อพิษ (Poison Puddle + รองรับ Multicast Mirror)
      const poisonLvl = currentSkills.poison_puddle || 0;
      if (poisonLvl > 0) {
        entities.poisonSpawnTimer += 16;
        if (entities.poisonSpawnTimer > 3500 * cooldownMult) {
          entities.poisonSpawnTimer = 0;
          
          // จำนวนบ่อ = เลเวลของบ่อพิษเอง + โบนัสจากการ์ดกระจก (Multicast Mirror)
          const totalPuddles = poisonLvl + extraCasts;
          
          for (let pCount = 0; pCount < totalPuddles; pCount++) {
            const puddleAngle = Math.random() * Math.PI * 2;
            // สุ่มเกิดทั่ววงระยะโจมตี (Attack Range) กระจายพื้นที่ทั่วทั้งวง
            const minRadius = 35;
            const maxRadius = Math.max(minRadius + 60, currentStats.range - 20);
            const puddleDist = minRadius + Math.sqrt(Math.random()) * (maxRadius - minRadius);
            const targetX = Math.max(30, Math.min(canvas.width - 30, centerX + Math.cos(puddleAngle) * puddleDist));
            const targetY = Math.max(30, Math.min(canvas.height - 30, centerY + Math.sin(puddleAngle) * puddleDist));

            entities.poisonPuddles.push({
              x: targetX,
              y: targetY,
              radius: (28 + poisonLvl * 4) * areaMult,
              duration: 4000 * durationMult,
              damagePerTick: currentStats.damage * (0.35 + poisonLvl * 0.15) * spellDamageMult,
              bubbles: [
                { ox: -12, oy: -6, size: 4, speed: 0.006, phase: 0 },
                { ox: 10, oy: 8, size: 5, speed: 0.005, phase: 2 },
                { ox: 4, oy: -14, size: 3.5, speed: 0.008, phase: 4 },
                { ox: -8, oy: 12, size: 4.5, speed: 0.007, phase: 1 },
                { ox: 14, oy: -8, size: 3, speed: 0.009, phase: 3 }
              ]
            });
          }
        }
      }

      for (let i = entities.poisonPuddles.length - 1; i >= 0; i--) {
        const p = entities.poisonPuddles[i];
        p.duration -= 16;

        drawPoisonPuddleArt(ctx, p, timestamp);

        if (Math.random() < 0.2) {
          entities.toxicFumes.push({
            x: p.x + (Math.random() - 0.5) * (p.radius * 1.1),
            y: p.y + (Math.random() - 0.5) * (p.radius * 0.8),
            vy: -0.7 - Math.random() * 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            life: 25,
            maxLife: 25,
            size: 2.5 + Math.random() * 1.5
          });
        }

        for (let k = entities.enemies.length - 1; k >= 0; k--) {
          const e = entities.enemies[k];
          if (getDistance(p.x, p.y, e.x, e.y) < p.radius + e.radius) {
            e.hp -= p.damagePerTick * 0.016;
            e.poisonedTimer = 35;
            if (Math.random() < 0.08) e.hitFlashTimer = 2;
            if (e.hp <= 0) {
              entities.enemies.splice(k, 1);
              onEnemyKilled(e.rewardCoins || 10);
              triggerSpellKillExplosion(e.x, e.y);
            }
          }
        }

        if (p.duration <= 0) entities.poisonPuddles.splice(i, 1);
      }

      // วาดละอองไอพิษ
      for (let fIdx = entities.toxicFumes.length - 1; fIdx >= 0; fIdx--) {
        const f = entities.toxicFumes[fIdx];
        f.x += f.vx;
        f.y += f.vy;
        f.life--;

        ctx.save();
        ctx.globalAlpha = Math.max(0, f.life / f.maxLife);
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (f.life <= 0) entities.toxicFumes.splice(fIdx, 1);
      }

      // 4. ระบบเกราะหมุน (Orbiting Shield)
      const shieldLvl = currentSkills.orbit_shield || 0;
      if (shieldLvl > 0) {
        if (entities.isShieldActive) {
          entities.shieldActiveTimer += 16;
          entities.shieldAngle += 0.05;

          const totalShields = 1 + extraCasts;
          const shieldDist = (55 + shieldLvl * 5) * areaMult;

          for (let sIdx = 0; sIdx < totalShields; sIdx++) {
            const sAngle = entities.shieldAngle + (Math.PI * 2 / totalShields) * sIdx;
            const shieldX = centerX + Math.cos(sAngle) * shieldDist;
            const shieldY = centerY + Math.sin(sAngle) * shieldDist;

            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.arc(shieldX, shieldY, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#67e8f9';
            ctx.lineWidth = 2;
            ctx.stroke();

            for (let j = entities.enemies.length - 1; j >= 0; j--) {
              const e = entities.enemies[j];
              if (getDistance(shieldX, shieldY, e.x, e.y) < e.radius + 12) {
                e.hp -= currentStats.damage * 0.8 * spellDamageMult;
                e.hitFlashTimer = 3;
                if (!e.isBoss && !e.isMiniBoss) {
                  const pushAngle = getAngle(centerX, centerY, e.x, e.y);
                  e.x += Math.cos(pushAngle) * 30;
                  e.y += Math.sin(pushAngle) * 30;
                }

                if (e.hp <= 0) {
                  entities.enemies.splice(j, 1);
                  onEnemyKilled(e.rewardCoins || 10);
                  triggerSpellKillExplosion(e.x, e.y);
                }
              }
            }
          }

          if (entities.shieldActiveTimer > 5000 * durationMult) {
            entities.isShieldActive = false;
            entities.shieldActiveTimer = 0;
          }
        } else {
          entities.shieldCooldownTimer += 16;
          if (entities.shieldCooldownTimer > 6000 * cooldownMult) {
            entities.isShieldActive = true;
            entities.shieldCooldownTimer = 0;
          }
        }
      }

      // 5. ระบบ FROST NOVA (แช่แข็ง)
      const frostLvl = currentSkills.frost_nova || 0;
      if (frostLvl > 0) {
        entities.frostNovaTimer += 16;
        const frostInterval = Math.max(3000, (6500 - frostLvl * 400) * cooldownMult);
        if (entities.frostNovaTimer > frostInterval) {
          entities.frostNovaTimer = 0;
          entities.frostNovaWave = {
            radius: 10,
            maxRadius: (160 + frostLvl * 20) * areaMult,
            freezeDuration: (1.5 + frostLvl * 0.4) * durationMult
          };
        }
      }

      if (entities.frostNovaWave) {
        const fn = entities.frostNovaWave;
        fn.radius += 8;

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, fn.radius, 0, Math.PI * 2);
        ctx.stroke();

        // คำนวณดาเมจคลื่นน้ำแข็ง
        const frostDamage = currentStats.damage * (0.8 + frostLvl * 0.4) * spellDamageMult;

        for (let j = entities.enemies.length - 1; j >= 0; j--) {
          const e = entities.enemies[j];
          const d = getDistance(centerX, centerY, e.x, e.y);

          // ตรวจสอบมอนสเตอร์ที่อยู่ในแนวคลื่น และยังไม่เคยโดนคลื่นลูกนี้ทำดาเมจ
          if (Math.abs(d - fn.radius) < 18 && !e.hitByCurrentWave) {
            e.hitByCurrentWave = true;

            // บอสหลุดไวขึ้น 70% (เหลือเวลา 30%), มินิบอสหลุดไวขึ้น 50% (เหลือเวลา 50%)
            let resistFactor = 1.0;
            if (e.isBoss) {
              resistFactor = 0.30;
            } else if (e.isMiniBoss) {
              resistFactor = 0.50;
            }

            const freezeFrames = Math.round(fn.freezeDuration * 60 * resistFactor);
            e.frozenTimer = Math.max(e.frozenTimer || 0, freezeFrames);
            e.hp -= frostDamage;
            e.hitFlashTimer = 3;

            // ตัวเลขดาเมจสีฟ้า
            entities.damageTexts.push({
              x: e.x,
              y: e.y - 12,
              text: Math.round(frostDamage),
              isCrit: false,
              alpha: 1.0,
              vy: -1.2,
              color: '#38bdf8'
            });

            if (e.hp <= 0) {
              entities.enemies.splice(j, 1);
              onEnemyKilled(e.rewardCoins || 10);
              triggerSpellKillExplosion(e.x, e.y);
            }
          }
        }

        if (fn.radius >= fn.maxRadius) {
          // รีเซ็ต flag ก่อนล้างคลื่น
          for (const e of entities.enemies) {
            e.hitByCurrentWave = false;
          }
          entities.frostNovaWave = null;
        }
      }

      // 6. ระบบ METEOR STRIKE (+ รองรับ Multicast Mirror หลายลูก)
      const meteorLvl = currentSkills.meteor_strike || 0;
      if (meteorLvl > 0 && entities.enemies.length > 0) {
        entities.meteorTimer += 16;
        const meteorInterval = Math.max(2500, (5000 - meteorLvl * 300) * cooldownMult);
        if (entities.meteorTimer > meteorInterval) {
          entities.meteorTimer = 0;
          const totalMeteors = 1 + extraCasts;

          for (let mCount = 0; mCount < totalMeteors; mCount++) {
            if (entities.enemies.length === 0) break;
            const randomTarget = entities.enemies[Math.floor(Math.random() * entities.enemies.length)];
            const blastRadius = (50 + meteorLvl * 10) * areaMult;
            const meteorDamage = currentStats.damage * (2.5 + meteorLvl * 1.5) * spellDamageMult;

            entities.meteors.push({
              targetX: randomTarget.x,
              targetY: randomTarget.y,
              startX: randomTarget.x - 120,
              startY: -50,
              radius: blastRadius,
              damage: meteorDamage,
              progress: 0,
              hasExploded: false,
              explosionLife: 16
            });
          }
        }
      }

      for (let i = entities.meteors.length - 1; i >= 0; i--) {
        const m = entities.meteors[i];
        m.progress += 0.045; // ความเร็วตกพอดีๆ ให้เห็นวงเตือนชัดเจน
        const currX = m.startX + (m.targetX - m.startX) * m.progress;
        const currY = m.startY + (m.targetY - m.startY) * m.progress;

        if (m.progress < 1) {
          // 1. วงเตือนตำแหน่งตกบนพื้น (Ground AoE Target Indicator)
          ctx.save();
          const pulseAlpha = 0.15 + (m.progress * 0.35);
          ctx.fillStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
          ctx.beginPath();
          ctx.arc(m.targetX, m.targetY, m.radius, 0, Math.PI * 2);
          ctx.fill();

          // ขอบเส้นประหมุนเตือนภัย
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.lineDashOffset = -timestamp * 0.04;
          ctx.beginPath();
          ctx.arc(m.targetX, m.targetY, m.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // วงแหวนหดนับถอยหลังบอกจังหวะกระทบพื้น
          const shrinkR = Math.max(0, m.radius * (1 - m.progress));
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(m.targetX, m.targetY, shrinkR, 0, Math.PI * 2);
          ctx.stroke();

          // เป้ากากบาทตรงกลาง
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(m.targetX - 7, m.targetY);
          ctx.lineTo(m.targetX + 7, m.targetY);
          ctx.moveTo(m.targetX, m.targetY - 7);
          ctx.lineTo(m.targetX + 7, m.targetY);
          ctx.stroke();
          ctx.restore();

          // 2. ลูกอุกกาบาตเพลิงพุ่งลงมาจากฟ้าพร้อมหางไฟ
          const ang = Math.atan2(m.targetY - m.startY, m.targetX - m.startX);
          for (let tr = 1; tr <= 4; tr++) {
            ctx.fillStyle = tr % 2 === 0 ? '#f97316' : '#ef4444';
            ctx.beginPath();
            ctx.arc(
              currX - Math.cos(ang) * (tr * 7),
              currY - Math.sin(ang) * (tr * 7),
              Math.max(2, 14 - tr * 2.5),
              0, Math.PI * 2
            );
            ctx.fill();
          }

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(currX, currY, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(currX, currY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

        } else if (!m.hasExploded) {
          // 3. จังหวะกระทบพื้นระเบิดตูม สร้างความเสียหาย
          m.hasExploded = true;
          for (let j = entities.enemies.length - 1; j >= 0; j--) {
            const e = entities.enemies[j];
            if (getDistance(m.targetX, m.targetY, e.x, e.y) < m.radius + e.radius) {
              e.hp -= m.damage;
              e.hitFlashTimer = 4;
              entities.damageTexts.push({
                x: e.x,
                y: e.y - 12,
                text: Math.round(m.damage),
                isCrit: true,
                alpha: 1.0,
                vy: -1.5
              });
              if (e.hp <= 0) {
                entities.enemies.splice(j, 1);
                onEnemyKilled(e.rewardCoins || 10);
                triggerSpellKillExplosion(e.x, e.y);
              }
            }
          }
        } else {
          // 4. เอฟเฟกต์คลื่นกระแทกกระจายหลังระเบิด
          m.explosionLife--;
          ctx.save();
          const expAlpha = Math.max(0, m.explosionLife / 16);
          ctx.globalAlpha = expAlpha;
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(m.targetX, m.targetY, m.radius * (1 + (16 - m.explosionLife) * 0.03), 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
          ctx.beginPath();
          ctx.arc(m.targetX, m.targetY, m.radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (m.explosionLife <= 0) entities.meteors.splice(i, 1);
        }
      }

      // 6.5. ระบบ RAILGUN PIERCER (ลำแสงทะลวงแถว)
      const railgunLvl = currentSkills.railgun || 0;
      if (railgunLvl > 0 && entities.enemies.length > 0) {
        entities.railgunTimer += 16;
        const railgunInterval = Math.max(2200, (6000 - railgunLvl * 500) * cooldownMult);

        if (entities.railgunTimer > railgunInterval) {
          entities.railgunTimer = 0;

          // เล็งไปทางศัตรูที่ใกล้ที่สุด
          let nearestEnemy = null;
          let minD = 9999;
          for (const enemy of entities.enemies) {
            const d = getDistance(centerX, centerY, enemy.x, enemy.y);
            if (d < minD) {
              minD = d;
              nearestEnemy = enemy;
            }
          }

          if (nearestEnemy) {
            const beamAngle = getAngle(centerX, centerY, nearestEnemy.x, nearestEnemy.y);
            const beamLen = Math.max(canvas.width, canvas.height) * 1.5;
            const endX = centerX + Math.cos(beamAngle) * beamLen;
            const endY = centerY + Math.sin(beamAngle) * beamLen;
            const beamWidth = (10 + railgunLvl * 3) * areaMult;

            const isRailCrit = Math.random() < critChance;
            const railDamage = currentStats.damage * (3.0 + railgunLvl * 0.8) * (isRailCrit ? critDamageMult : 1);

            entities.railgunBeams.push({
              x1: centerX,
              y1: centerY,
              x2: endX,
              y2: endY,
              width: beamWidth,
              life: 10
            });

            for (let j = entities.enemies.length - 1; j >= 0; j--) {
              const e = entities.enemies[j];
              const distToBeam = distToSegment(e.x, e.y, centerX, centerY, endX, endY);

              if (distToBeam < beamWidth + e.radius) {
                e.hp -= railDamage;
                e.hitFlashTimer = 4;

                entities.damageTexts.push({
                  x: e.x,
                  y: e.y - 14,
                  text: Math.round(railDamage),
                  isCrit: isRailCrit,
                  alpha: 1.0,
                  vy: -1.4,
                  color: '#06b6d4'
                });

                if (e.hp <= 0) {
                  entities.enemies.splice(j, 1);
                  onEnemyKilled(e.rewardCoins || 10);
                }
              }
            }
          }
        }
      }

      // 6.6. ระบบ HEAVY SNIPER (สไนเปอร์ล่าบอส เล็งตัวเลือดสูงสุดเสมอ)
      const sniperLvl = currentSkills.sniper || 0;
      if (sniperLvl > 0 && entities.enemies.length > 0) {
        entities.sniperTimer += 16;
        const sniperInterval = Math.max(1800, (4500 - sniperLvl * 400) * cooldownMult);

        if (entities.sniperTimer > sniperInterval) {
          entities.sniperTimer = 0;

          // ค้นหาศัตรูที่มี HP สูงสุดในจอ (Boss / Mini-Boss)
          let bossTarget = entities.enemies[0];
          for (const e of entities.enemies) {
            if (e.hp > bossTarget.hp) bossTarget = e;
          }

          if (bossTarget) {
            const sniperDamage = currentStats.damage * (4.5 + sniperLvl * 1.5) * critDamageMult;
            bossTarget.hp -= sniperDamage;
            bossTarget.hitFlashTimer = 5;

            // ผลักถอยหลังอย่างแรง
            const snAngle = getAngle(centerX, centerY, bossTarget.x, bossTarget.y);
            bossTarget.x += Math.cos(snAngle) * 14;
            bossTarget.y += Math.sin(snAngle) * 14;

            entities.sniperTracers.push({
              x1: centerX,
              y1: centerY,
              x2: bossTarget.x,
              y2: bossTarget.y,
              life: 8
            });

            entities.damageTexts.push({
              x: bossTarget.x,
              y: bossTarget.y - 18,
              text: `🎯${Math.round(sniperDamage)}`,
              isCrit: true,
              alpha: 1.0,
              vy: -1.8,
              color: '#ef4444'
            });

            if (bossTarget.hp <= 0) {
              const idx = entities.enemies.indexOf(bossTarget);
              if (idx !== -1) {
                entities.enemies.splice(idx, 1);
                onEnemyKilled(bossTarget.rewardCoins || 10);
              }
            }
          }
        }
      }

      // 7. ป้อมเล็งยิงกระสุน
      let target = null;
      let minDistance = currentStats.range;
      for (const enemy of entities.enemies) {
        const dist = getDistance(centerX, centerY, enemy.x, enemy.y);
        if (dist <= minDistance) {
          minDistance = dist;
          target = enemy;
        }
      }

      const effectiveAttackSpeed = currentStats.attackSpeed * attackSpeedMult * gatlingSpeedBoost;
      const fireInterval = 1000 / effectiveAttackSpeed;
      if (target && timestamp - entities.lastShotTime > fireInterval) {
        entities.lastShotTime = timestamp;
        const baseAngle = getAngle(centerX, centerY, target.x, target.y);
        entities.lastTargetAngle = baseAngle;
        const isCrit = Math.random() < critChance;
        const actualDamage = isCrit ? currentStats.damage * critDamageMult : currentStats.damage;

        const multishotLevel = currentSkills.multishot || 0;
        const bulletCount = multishotLevel > 0 ? Math.min(4, multishotLevel + 1) : 1;
        const multishotDmgMult = multishotLevel > 0 ? Math.min(1.0, 0.50 + (multishotLevel - 1) * 0.10) : 1.0;
        const actualBulletDmg = actualDamage * multishotDmgMult;

        const spread = 0.14;
        const startAngle = baseAngle - ((bulletCount - 1) * spread) / 2;
        for (let i = 0; i < bulletCount; i++) {
          const angle = startAngle + i * spread;
          entities.bullets.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * bulletSpeed,
            vy: Math.sin(angle) * bulletSpeed,
            damage: actualBulletDmg,
            baseDamage: actualBulletDmg,
            isCrit,
            bouncesLeft: bounceCount,
            isShrapnel: false
          });
        }
      }

      // 8. อัปเดตกระสุนและลอจิกชิ่ง
      for (let i = entities.bullets.length - 1; i >= 0; i--) {
        const b = entities.bullets[i];
        b.x += b.vx * 0.016;
        b.y += b.vy * 0.016;

        if (b.isShrapnel) {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soul Strike Magic Missile
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = b.isCrit ? '#f59e0b' : '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.isCrit ? 5.5 : 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = b.isCrit ? '#fbbf24' : (entities.isGatlingActive ? '#facc15' : '#38bdf8');
          ctx.beginPath();
          ctx.arc(b.x - b.vx * 0.006, b.y - b.vy * 0.006, b.isCrit ? 4 : 2.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        for (let j = entities.enemies.length - 1; j >= 0; j--) {
          const e = entities.enemies[j];
          if (getDistance(b.x, b.y, e.x, e.y) < e.radius + 5) {
            e.hp -= b.damage;
            e.hitFlashTimer = 4;

            // ผลักศัตรูถอยหลัง (Heavy Caliber - บอสและมินิบอสไม่โดนผลัก)
            if (knockbackForce > 0 && !e.isBoss && !e.isMiniBoss) {
              const pushAngle = getAngle(centerX, centerY, e.x, e.y);
              const pushDist = knockbackForce;
              e.x += Math.cos(pushAngle) * pushDist;
              e.y += Math.sin(pushAngle) * pushDist;
            }

            entities.damageTexts.push({
              x: e.x + (Math.random() * 12 - 6),
              y: e.y - 10,
              text: Math.round(b.damage),
              isCrit: b.isCrit,
              alpha: 1.0,
              vy: -1.2,
              color: b.isShrapnel ? '#fb923c' : (b.isCrit ? '#f59e0b' : '#f8fafc')
            });

            // ปล่อยสะเก็ดระเบิด (Shrapnel Round - จำกัดแค่ 4 เม็ด ดาเมจเริ่ม 20% + 10% ต่อเวล)
            const shrapnelLvl = currentSkills.shrapnel || 0;
            if (!b.isShrapnel && shrapnelLvl > 0) {
              const shrapnelCount = 4;
              const shrapnelDmgMult = Math.min(1.0, 0.20 + (shrapnelLvl - 1) * 0.10);
              const shrapnelBase = b.damage * shrapnelDmgMult;
              const shrapnelDmg = Math.min(currentStats.damage * 1.5, shrapnelBase * (kineticLvl > 0 ? kineticMult : 1));
              for (let s = 0; s < shrapnelCount; s++) {
                const sAngle = (Math.PI * 2 / shrapnelCount) * s + (Math.random() * 0.3 - 0.15);
                entities.bullets.push({
                  x: e.x,
                  y: e.y,
                  vx: Math.cos(sAngle) * 420,
                  vy: Math.sin(sAngle) * 420,
                  damage: shrapnelDmg,
                  baseDamage: shrapnelDmg,
                  isCrit: false,
                  bouncesLeft: Math.min(1, bounceCount),
                  isShrapnel: true
                });
              }
            }

            if (b.bouncesLeft > 0) {
              b.bouncesLeft--;
              let nextTarget = null;
              let nextDist = 350;

              for (const other of entities.enemies) {
                if (other !== e && other.hp > 0) {
                  const d = getDistance(e.x, e.y, other.x, other.y);
                  if (d < nextDist) {
                    nextDist = d;
                    nextTarget = other;
                  }
                }
              }

              if (nextTarget) {
                // บัฟดาเมจชิ่งจาก Kinetic Accel (เพิ่มได้มากสุดไม่เกิน 50% ของพลังโจมตี)
                if (kineticLvl > 0) {
                  const maxAllowed = (b.baseDamage || currentStats.damage) + (currentStats.damage * 0.50);
                  b.damage = Math.min(maxAllowed, b.damage * kineticMult);
                }

                entities.lightningBeams.push({
                  x1: e.x,
                  y1: e.y,
                  x2: nextTarget.x,
                  y2: nextTarget.y,
                  alpha: 1.0
                });

                const bounceAngle = getAngle(e.x, e.y, nextTarget.x, nextTarget.y);
                b.x = e.x + Math.cos(bounceAngle) * (e.radius + 6);
                b.y = e.y + Math.sin(bounceAngle) * (e.radius + 6);
                b.vx = Math.cos(bounceAngle) * 550;
                b.vy = Math.sin(bounceAngle) * 550;
              } else {
                entities.bullets.splice(i, 1);
              }
            } else {
              entities.bullets.splice(i, 1);
            }

            if (e.hp <= 0) {
              entities.enemies.splice(j, 1);
              onEnemyKilled(e.rewardCoins || 10);
            }
            break;
          }
        }

        if (b && (b.x < -20 || b.x > canvas.width + 20 || b.y < -20 || b.y > canvas.height + 20)) {
          entities.bullets.splice(i, 1);
        }
      }

      // วาดเส้นสายฟ้าชิ่ง (Lightning VFX)
      for (let i = entities.lightningBeams.length - 1; i >= 0; i--) {
        const beam = entities.lightningBeams[i];
        ctx.save();
        ctx.globalAlpha = Math.max(0, beam.alpha);

        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 4;
        drawLightning(ctx, beam.x1, beam.y1, beam.x2, beam.y2, 5, 14);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        drawLightning(ctx, beam.x1, beam.y1, beam.x2, beam.y2, 5, 6);
        ctx.stroke();

        ctx.restore();

        beam.alpha -= 0.12;
        if (beam.alpha <= 0) entities.lightningBeams.splice(i, 1);
      }

      // วาดลำแสง RAILGUN VFX
      for (let i = entities.railgunBeams.length - 1; i >= 0; i--) {
        const rb = entities.railgunBeams[i];
        rb.life--;
        ctx.save();
        ctx.globalAlpha = Math.max(0, rb.life / 10);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = rb.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(rb.x1, rb.y1);
        ctx.lineTo(rb.x2, rb.y2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(2, rb.width * 0.35);
        ctx.beginPath();
        ctx.moveTo(rb.x1, rb.y1);
        ctx.lineTo(rb.x2, rb.y2);
        ctx.stroke();
        ctx.restore();

        if (rb.life <= 0) entities.railgunBeams.splice(i, 1);
      }

      // วาดเลเซอร์ SNIPER VFX
      for (let i = entities.sniperTracers.length - 1; i >= 0; i--) {
        const st = entities.sniperTracers[i];
        st.life--;
        ctx.save();
        ctx.globalAlpha = Math.max(0, st.life / 8);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(st.x1, st.y1);
        ctx.lineTo(st.x2, st.y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(st.x2, st.y2, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (st.life <= 0) entities.sniperTracers.splice(i, 1);
      }

      // 9. โดรนบริวาร (Drone System)
      const droneCount = currentSkills.drone || 0;
      if (droneCount > 0) {
        entities.droneAngle += 0.035 * droneSpeedMult;
        const baseRadius = 65 * areaMult;
        const outerRadius = 115 * areaMult;

        const totalRings = hasDuplicator ? 2 : 1;
        for (let ring = 0; ring < totalRings; ring++) {
          const currentRadius = ring === 0 ? baseRadius : outerRadius;
          // หมุนไปทางเดียวกันทั้งวงในและวงนอก สลับมุมเหลื่อมกันเล็กน้อยให้กวาดคลุมพื้นที่สวยงาม ไม่ซ้อนทับกัน
          const ringPhaseOffset = ring === 1 ? (Math.PI / droneCount) : 0;
          const ringDmgBonus = ring === 1 ? (1 + duplicatorLvl * 0.3) : 1;

          for (let i = 0; i < droneCount; i++) {
            const offset = (Math.PI * 2 / droneCount) * i;
            const dAngle = entities.droneAngle + offset + ringPhaseOffset;
            const droneX = centerX + Math.cos(dAngle) * currentRadius;
            const droneY = centerY + Math.sin(dAngle) * currentRadius;

            // วาดลูกแก้วมนตราบริวาร (Arcane Familiar Orb)
            drawCombatFamiliar(ctx, droneX, droneY, 1.0);

            // รัศมีใบมีดตัด
            for (let j = entities.enemies.length - 1; j >= 0; j--) {
              const e = entities.enemies[j];
              if (getDistance(droneX, droneY, e.x, e.y) < e.radius + 8) {
                const contactDmg = currentStats.damage * (0.4 + droneCount * 0.08) * droneDmgMult * ringDmgBonus;
                e.hp -= contactDmg;
                e.hitFlashTimer = 2;
                if (e.hp <= 0) {
                  entities.enemies.splice(j, 1);
                  onEnemyKilled(e.rewardCoins || 10);
                }
              }
            }
          }
        }
      }

      // 9.1 โดรนปืนเลเซอร์ (Laser Drone)
      const laserDroneLvl = currentSkills.laser_drone || 0;
      if (laserDroneLvl > 0) {
        entities.laserDroneAngle += 0.028 * droneSpeedMult;
        entities.laserDroneTimer += 16;
        const laserRadius = 85 * areaMult;

        for (let i = 0; i < laserDroneLvl; i++) {
          const offset = (Math.PI * 2 / laserDroneLvl) * i;
          const ldAngle = entities.laserDroneAngle + offset;
          const ldX = centerX + Math.cos(ldAngle) * laserRadius;
          const ldY = centerY + Math.sin(ldAngle) * laserRadius;

          // วาดภูตสายฟ้าคริสตัล (Lightning Oculus)
          drawLaserOculus(ctx, ldX, ldY, 1.0);

          // ยิงแสงเลเซอร์ใส่ศัตรูในระยะ 140px
          const laserInterval = Math.max(600, (1300 - laserDroneLvl * 100) * cooldownMult);
          if (entities.laserDroneTimer > laserInterval && entities.enemies.length > 0) {
            let closeTarget = null;
            let closeDist = 140;

            for (const e of entities.enemies) {
              const d = getDistance(ldX, ldY, e.x, e.y);
              if (d < closeDist) {
                closeDist = d;
                closeTarget = e;
              }
            }

            if (closeTarget) {
              const lDmg = currentStats.damage * (0.8 + laserDroneLvl * 0.35) * droneDmgMult;
              closeTarget.hp -= lDmg;
              closeTarget.hitFlashTimer = 3;

              entities.laserDroneBeams.push({
                x1: ldX,
                y1: ldY,
                x2: closeTarget.x,
                y2: closeTarget.y,
                life: 6
              });

              entities.damageTexts.push({
                x: closeTarget.x,
                y: closeTarget.y - 10,
                text: Math.round(lDmg),
                isCrit: false,
                alpha: 1.0,
                vy: -1.0,
                color: '#38bdf8'
              });

              if (closeTarget.hp <= 0) {
                const idx = entities.enemies.indexOf(closeTarget);
                if (idx !== -1) {
                  entities.enemies.splice(idx, 1);
                  onEnemyKilled(closeTarget.rewardCoins || 10);
                }
              }
            }
          }
        }
        if (entities.laserDroneTimer > Math.max(600, (1300 - laserDroneLvl * 100) * cooldownMult)) {
          entities.laserDroneTimer = 0;
        }
      }

      // วาดเลเซอร์โดรน VFX
      for (let i = entities.laserDroneBeams.length - 1; i >= 0; i--) {
        const lb = entities.laserDroneBeams[i];
        lb.life--;
        ctx.save();
        ctx.globalAlpha = Math.max(0, lb.life / 6);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lb.x1, lb.y1);
        ctx.lineTo(lb.x2, lb.y2);
        ctx.stroke();
        ctx.restore();
        if (lb.life <= 0) entities.laserDroneBeams.splice(i, 1);
      }

      // 9.2 โดรนพยาบาลซ่อมบำรุง (Nanite Repair Drone)
      const repairDroneLvl = currentSkills.repair_drone || 0;
      if (repairDroneLvl > 0) {
        entities.repairDroneAngle += 0.022 * droneSpeedMult;
        entities.repairDroneTimer += 16;
        const repRadius = 45 * areaMult;
        const repX = centerX + Math.cos(entities.repairDroneAngle) * repRadius;
        const repY = centerY + Math.sin(entities.repairDroneAngle) * repRadius;

        // วาดแฟรี่ฮีลพยาบาล (Healing Fairy)
        drawHealingFairy(ctx, repX, repY, 1.1);

        const repairInterval = Math.max(1200, 2500 * cooldownMult);
        if (entities.repairDroneTimer > repairInterval) {
          entities.repairDroneTimer = 0;
          if (entities.towerCurrentHp < currentStats.maxHp) {
            const healVal = 5 + repairDroneLvl * 4;
            entities.towerCurrentHp = Math.min(currentStats.maxHp, entities.towerCurrentHp + healVal);
            onTowerDamaged(entities.towerCurrentHp);

            entities.repairBeams.push({
              x1: repX,
              y1: repY,
              x2: centerX,
              y2: centerY,
              life: 12
            });

            entities.damageTexts.push({
              x: centerX,
              y: centerY - 28,
              text: `+${healVal} HP 💚`,
              isCrit: false,
              alpha: 1.0,
              vy: -1.0,
              color: '#22c55e'
            });
          }
        }
      }

      // วาดลำแสงซ่อมบำรุง VFX
      for (let i = entities.repairBeams.length - 1; i >= 0; i--) {
        const rb = entities.repairBeams[i];
        rb.life--;
        ctx.save();
        ctx.globalAlpha = Math.max(0, rb.life / 12);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rb.x1, rb.y1);
        ctx.lineTo(rb.x2, rb.y2);
        ctx.stroke();
        ctx.restore();
        if (rb.life <= 0) entities.repairBeams.splice(i, 1);
      }

      // 10. อัปเดตและวาดมอนสเตอร์
      for (let i = entities.enemies.length - 1; i >= 0; i--) {
        const e = entities.enemies[i];

        if (e.frozenTimer > 0) {
          e.frozenTimer--;
        } else {
          const angle = getAngle(e.x, e.y, centerX, centerY);
          e.x += Math.cos(angle) * e.speed * 0.016;
          e.y += Math.sin(angle) * e.speed * 0.016;
        }

        if (e.hitFlashTimer > 0) e.hitFlashTimer--;
        if (e.poisonedTimer > 0) e.poisonedTimer--;

        const bounceOffset = Math.abs(Math.sin(timestamp * 0.008 + e.x * 0.05)) * 3;
        const isHit = e.hitFlashTimer > 0;
        const isFrozen = e.frozenTimer > 0;
        const isPoisoned = e.poisonedTimer > 0;

        // วาดพิกเซลอาร์ตมอนสเตอร์ Ragnarok Online
        if (e.monsterType === 'gtb') {
          drawGTB(ctx, e.x, e.y, 1.3, isHit, isFrozen, isPoisoned);
        } else if (e.monsterType === 'baphomet') {
          drawBaphomet(ctx, e.x, e.y, 1.2, isHit, isFrozen, isPoisoned);
        } else if (e.monsterType === 'angeling') {
          drawPoring(ctx, e.x, e.y, 1.45, bounceOffset, { body: '#f472b6', shade: '#db2777', outline: '#be185d', wingColor: '#ffffff' }, true, false, true, isHit, isFrozen, isPoisoned);
        } else if (e.monsterType === 'deviling') {
          drawPoring(ctx, e.x, e.y, 1.45, bounceOffset, { body: '#581c87', shade: '#3b0764', outline: '#2e1065', wingColor: '#3b0764' }, true, true, false, isHit, isFrozen, isPoisoned);
        } else if (e.monsterType === 'ghostring') {
          drawPoring(ctx, e.x, e.y, 1.45, bounceOffset, { body: '#bae6fd', shade: '#7dd3fc', outline: '#38bdf8' }, false, false, false, isHit, isFrozen, isPoisoned, true);
        } else if (e.monsterType === 'drops') {
          drawPoring(ctx, e.x, e.y, 1.2, bounceOffset, { body: '#fb923c', shade: '#ea580c', outline: '#c2410c' }, false, false, false, isHit, isFrozen, isPoisoned);
        } else if (e.monsterType === 'poporing') {
          drawPoring(ctx, e.x, e.y, 1.2, bounceOffset, { body: '#4ade80', shade: '#16a34a', outline: '#15803d' }, false, false, false, isHit, isFrozen, isPoisoned);
        } else if (e.monsterType === 'marin') {
          drawPoring(ctx, e.x, e.y, 1.2, bounceOffset, { body: '#38bdf8', shade: '#0284c7', outline: '#0369a1' }, false, false, false, isHit, isFrozen, isPoisoned);
        } else {
          drawPoring(ctx, e.x, e.y, 1.2, bounceOffset, { body: '#f472b6', shade: '#db2777', outline: '#be185d' }, false, false, false, isHit, isFrozen, isPoisoned);
        }

        // หลอดเลือด HP Bar
        const barWidth = e.isBoss ? 40 : (e.isMiniBoss ? 30 : 24);
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(e.x - barWidth / 2, e.y - e.radius - 12, barWidth, 4);
        ctx.fillStyle = e.isBoss ? '#f59e0b' : (e.isMiniBoss ? '#c084fc' : (isPoisoned ? '#4ade80' : '#22c55e'));
        ctx.fillRect(e.x - barWidth / 2, e.y - e.radius - 12, barWidth * hpPercent, 4);

        // ป้ายหัวบอส / มินิบอส
        if (e.isBoss) {
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = '#fbbf24';
          ctx.textAlign = 'center';
          ctx.fillText('👑 MVP', e.x, e.y - e.radius - 15);
        } else if (e.isMiniBoss) {
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = '#c084fc';
          ctx.textAlign = 'center';
          ctx.fillText('⭐ MINI', e.x, e.y - e.radius - 15);
        }

        // ชนป้อม
        if (getDistance(e.x, e.y, centerX, centerY) < 26) {
          const rawDmg = e.damageToTower || 20;

          // เกราะไททาเนียมลดทอนดาเมจ (Titanium Plating)
          const dmg = Math.max(1, Math.round(rawDmg * (1 - damageReduction)));

          // เกราะหนามสะท้อนดาเมจ (Spiked Retaliation)
          if (thornsMult > 0) {
            const reflectDmg = Math.round(dmg * thornsMult);
            e.hp -= reflectDmg;
            entities.damageTexts.push({
              x: e.x,
              y: e.y - 12,
              text: `🌵${reflectDmg}`,
              isCrit: true,
              alpha: 1.0,
              vy: -1.3,
              color: '#eab308'
            });

            if (e.hp <= 0) {
              onEnemyKilled(e.rewardCoins || 10);
            }
          }

          entities.enemies.splice(i, 1);
          
          entities.towerCurrentHp = Math.max(0, entities.towerCurrentHp - dmg);
          onTowerDamaged(entities.towerCurrentHp);

          if (entities.towerCurrentHp <= 0) {
            cancelAnimationFrame(animationFrameId);
            return;
          }
        }
      }

      // 11. ตัวเลขดาเมจลอย
      ctx.textAlign = 'center';
      for (let i = entities.damageTexts.length - 1; i >= 0; i--) {
        const dt = entities.damageTexts[i];
        dt.y += dt.vy;
        dt.alpha -= 0.025;

        ctx.save();
        ctx.globalAlpha = Math.max(0, dt.alpha);
        if (dt.color) {
          ctx.fillStyle = dt.color;
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(dt.text, dt.x, dt.y);
        } else if (dt.isCrit) {
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText(`💥${dt.text}`, dt.x, dt.y);
        } else {
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(dt.text, dt.x, dt.y);
        }
        ctx.restore();

        if (dt.alpha <= 0) entities.damageTexts.splice(i, 1);
      }

      // 12. วาดจอมเวท High Wizard ตรงกลาง (แทนป้อม)
      const isCasting = (timestamp - entities.lastShotTime < 180);
      drawHighWizard(ctx, centerX, centerY, 1.6, isCasting, entities.lastTargetAngle || 0);

      // วงแหวนออร่าสีทองขณะ Gatling Overdrive ทำงาน
      if (entities.isGatlingActive) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 28 + Math.sin(timestamp * 0.02) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block'
      }} 
    />
  );
}