import React, { useRef, useEffect } from 'react';
import { getDistance, getAngle } from '../utils/gameMath';

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
    poisonSpawnTimer: 0,
    spawnTimer: 0,
    lastTriggeredWave: 0
  });

  const towerStatsRef = useRef(towerStats);
  const waveRef = useRef(wave);
  const skillsRef = useRef(skills);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    towerStatsRef.current = towerStats;
    waveRef.current = wave;
    skillsRef.current = skills;
    isPausedRef.current = isPaused;
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
      gameEntitiesRef.current.spawnTimer = 0;
      gameEntitiesRef.current.poisonSpawnTimer = 0;
      gameEntitiesRef.current.lastTriggeredWave = 0;
      gameEntitiesRef.current.isShieldActive = true;
      gameEntitiesRef.current.shieldActiveTimer = 0;
      gameEntitiesRef.current.shieldCooldownTimer = 0;
    }
  }, [wave, towerStats.maxHp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const entities = gameEntitiesRef.current;
    let animationFrameId;

    const loop = (timestamp) => {
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
        const spawnRadius = Math.max(canvas.width, canvas.height) * 0.75;

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
        let speed = Math.min(50, 22 + currentWave * 0.8);
        let rewardCoins = 10 + currentWave * 2;
        let damageToTower = Math.min(45, 12 + currentWave);

        if (isBoss) {
          finalHp = baseHp * 5;
          radius = 22;
          speed = 16;
          rewardCoins = 60 + currentWave * 4;
          damageToTower = Math.min(80, 35 + currentWave * 1.5);
        } else if (isMiniBoss) {
          finalHp = baseHp * 2.5;
          radius = 17;
          speed = 20;
          rewardCoins = 35 + currentWave * 3;
          damageToTower = Math.min(60, 25 + currentWave * 1.2);
        }

        entities.enemies.push({
          x: centerX + Math.cos(angle) * spawnRadius,
          y: centerY + Math.sin(angle) * spawnRadius,
          hp: finalHp,
          maxHp: finalHp,
          speed,
          radius,
          isBoss,
          isMiniBoss,
          rewardCoins,
          damageToTower,
          frozenTimer: 0,
          hitFlashTimer: 0
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
            const puddleDist = 40 + Math.random() * 90;
            entities.poisonPuddles.push({
              x: centerX + Math.cos(puddleAngle) * puddleDist,
              y: centerY + Math.sin(puddleAngle) * puddleDist,
              radius: (26 + poisonLvl * 4) * areaMult,
              duration: 4000 * durationMult,
              damagePerTick: currentStats.damage * (0.35 + poisonLvl * 0.15) * spellDamageMult
            });
          }
        }
      }

      for (let i = entities.poisonPuddles.length - 1; i >= 0; i--) {
        const p = entities.poisonPuddles[i];
        p.duration -= 16;

        ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1;
        ctx.stroke();

        for (let k = entities.enemies.length - 1; k >= 0; k--) {
          const e = entities.enemies[k];
          if (getDistance(p.x, p.y, e.x, e.y) < p.radius + e.radius) {
            e.hp -= p.damagePerTick * 0.016;
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

      // 4. ระบบเกราะหมุน (Orbiting Shield)
      const shieldLvl = currentSkills.orbit_shield || 0;
      if (shieldLvl > 0) {
        if (entities.isShieldActive) {
          entities.shieldActiveTimer += 16;
          entities.shieldAngle += 0.05;

          const shieldDist = (55 + shieldLvl * 5) * areaMult;
          const shieldX = centerX + Math.cos(entities.shieldAngle) * shieldDist;
          const shieldY = centerY + Math.sin(entities.shieldAngle) * shieldDist;

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
              const pushAngle = getAngle(centerX, centerY, e.x, e.y);
              e.x += Math.cos(pushAngle) * 30;
              e.y += Math.sin(pushAngle) * 30;

              if (e.hp <= 0) {
                entities.enemies.splice(j, 1);
                onEnemyKilled(e.rewardCoins || 10);
                triggerSpellKillExplosion(e.x, e.y);
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
          if (Math.abs(d - fn.radius) < 15 && !e.hitByCurrentWave) {
            e.hitByCurrentWave = true;
            e.frozenTimer = Math.max(e.frozenTimer || 0, Math.round(fn.freezeDuration * 60));
            e.hp -= frostDamage;
            e.hitFlashTimer = 3;

            // ตัวเลขดาเมจสีฟ้า
            entities.damageTexts.push({
              x: e.x,
              y: e.y - 12,
              text: Math.round(frostDamage),
              isCrit: false,
              alpha: 1.0,
              vy: -1.2
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
              x: randomTarget.x,
              y: randomTarget.y,
              radius: blastRadius,
              damage: meteorDamage,
              life: 18
            });

            for (let j = entities.enemies.length - 1; j >= 0; j--) {
              const e = entities.enemies[j];
              if (getDistance(randomTarget.x, randomTarget.y, e.x, e.y) < blastRadius + e.radius) {
                e.hp -= meteorDamage;
                e.hitFlashTimer = 4;
                entities.damageTexts.push({
                  x: e.x,
                  y: e.y - 12,
                  text: Math.round(meteorDamage),
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
          }
        }
      }

      for (let i = entities.meteors.length - 1; i >= 0; i--) {
        const m = entities.meteors[i];
        m.life--;
        ctx.save();
        ctx.globalAlpha = Math.max(0, m.life / 18);
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        if (m.life <= 0) entities.meteors.splice(i, 1);
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

      const fireInterval = 1000 / currentStats.attackSpeed;
      if (target && timestamp - entities.lastShotTime > fireInterval) {
        entities.lastShotTime = timestamp;
        const baseAngle = getAngle(centerX, centerY, target.x, target.y);
        const isCrit = Math.random() < 0.2;
        const actualDamage = isCrit ? currentStats.damage * 2 : currentStats.damage;

        const bounceCount = currentSkills.bouncing || 0;
        const multishotLevel = currentSkills.multishot || 0;
        const bulletCount = multishotLevel > 0 ? multishotLevel + 1 : 1;

        const spread = 0.14;
        const startAngle = baseAngle - ((bulletCount - 1) * spread) / 2;
        for (let i = 0; i < bulletCount; i++) {
          const angle = startAngle + i * spread;
          entities.bullets.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * 500,
            vy: Math.sin(angle) * 500,
            damage: actualDamage,
            isCrit,
            bouncesLeft: bounceCount
          });
        }
      }

      // 8. อัปเดตกระสุนและลอจิกชิ่ง
      for (let i = entities.bullets.length - 1; i >= 0; i--) {
        const b = entities.bullets[i];
        b.x += b.vx * 0.016;
        b.y += b.vy * 0.016;

        ctx.fillStyle = b.isCrit ? '#fbbf24' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.isCrit ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        for (let j = entities.enemies.length - 1; j >= 0; j--) {
          const e = entities.enemies[j];
          if (getDistance(b.x, b.y, e.x, e.y) < e.radius + 5) {
            e.hp -= b.damage;
            e.hitFlashTimer = 4;

            entities.damageTexts.push({
              x: e.x + (Math.random() * 12 - 6),
              y: e.y - 10,
              text: Math.round(b.damage),
              isCrit: b.isCrit,
              alpha: 1.0,
              vy: -1.2
            });

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

      // 9. โดรนบริวาร (Drone)
      const droneCount = currentSkills.drone || 0;
      if (droneCount > 0) {
        entities.droneAngle += 0.035;
        const droneRadius = 65 * areaMult;

        for (let i = 0; i < droneCount; i++) {
          const offset = (Math.PI * 2 / droneCount) * i;
          const dAngle = entities.droneAngle + offset;
          const droneX = centerX + Math.cos(dAngle) * droneRadius;
          const droneY = centerY + Math.sin(dAngle) * droneRadius;

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(droneX, droneY, 7, 0, Math.PI * 2);
          ctx.fill();

          for (let j = entities.enemies.length - 1; j >= 0; j--) {
            const e = entities.enemies[j];
            if (getDistance(droneX, droneY, e.x, e.y) < e.radius + 7) {
              e.hp -= currentStats.damage * 0.4;
              e.hitFlashTimer = 2;
              if (e.hp <= 0) {
                entities.enemies.splice(j, 1);
                onEnemyKilled(e.rewardCoins || 10);
              }
            }
          }
        }
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

        if (e.frozenTimer > 0) {
          ctx.fillStyle = '#38bdf8';
        } else if (e.hitFlashTimer > 0) {
          ctx.fillStyle = '#ffffff';
          e.hitFlashTimer--;
        } else if (e.isBoss) {
          ctx.fillStyle = '#dc2626';
        } else if (e.isMiniBoss) {
          ctx.fillStyle = '#9333ea';
        } else {
          ctx.fillStyle = '#ef4444';
        }

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();

        if (e.isBoss) {
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else if (e.isMiniBoss) {
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        const barWidth = e.isBoss ? 36 : (e.isMiniBoss ? 28 : 22);
        const hpPercent = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(e.x - barWidth / 2, e.y - e.radius - 8, barWidth, 4);
        ctx.fillStyle = e.isBoss ? '#f59e0b' : (e.isMiniBoss ? '#a855f7' : '#22c55e');
        ctx.fillRect(e.x - barWidth / 2, e.y - e.radius - 8, barWidth * hpPercent, 4);

        // ชนป้อม
        if (getDistance(e.x, e.y, centerX, centerY) < 26) {
          const dmg = e.damageToTower || 20;
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
        if (dt.isCrit) {
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

      // 12. วาดป้อมตรงกลาง
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onGameOver, onEnemyKilled, onTowerDamaged, onTriggerCardPick]);

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