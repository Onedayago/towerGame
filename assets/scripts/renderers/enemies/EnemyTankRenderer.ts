import { Graphics, Color } from 'cc';
import { EnemyType, getEnemyColor, CyberpunkColors } from '../../constants/Index';

/**
 * 普通坦克敌人渲染器
 * 负责普通坦克的绘制逻辑（美化版：多层阴影、履带系统、主车体、装甲板、炮塔系统）
 */
export class EnemyTankRenderer {
    /**
     * 绘制基础坦克外观（美化版）
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();
        
        const trackHeight = width * 0.22;
        const hullRadius = width * 0.25;
        const turretRadius = width * 0.22;
        const barrelLength = width * 0.78;
        const barrelHalfHeight = width * 0.08;
        
        // === 1. 履带系统（上下履带 + 装甲板 + 滚轮）===
        this.drawTrackSystem(graphics, width, trackHeight);
        
        // === 3. 主车体（重装甲多边形车体）===
        this.drawMainHull(graphics, width, trackHeight, hullRadius);
        
        // === 4. 装甲板（前后装甲 + 侧裙板）===
        this.drawArmorPlates(graphics, width, trackHeight);
        
        // === 5. 炮塔系统（重型炮塔 + 装甲环）===
        this.drawTurretSystem(graphics, width, turretRadius);
        
        // === 6. 主炮（长炮管 + 炮口制退器）===
        this.drawMainGun(graphics, barrelLength, barrelHalfHeight);
        
        // === 7. 威胁标记（红色警示灯）===
        this.drawThreatMarkers(graphics, width);
    }
    
    /**
     * 绘制履带系统
     */
    private static drawTrackSystem(graphics: Graphics, size: number, trackHeight: number): void {
        const wheelRadius = trackHeight * 0.35;
        const wheelCount = 5;
        
        // 绘制上下履带主体
        for (let side = 0; side < 2; side++) {
            const trackY = side === 0 ? -size / 2 : size / 2 - trackHeight;
            
            // 履带外壳（深黑色）
            graphics.fillColor = new Color(10, 15, 26, 255); // #0a0f1a
            graphics.rect(-size / 2, trackY, size, trackHeight);
            graphics.fill();
            
            // 履带边框
            graphics.strokeColor = new Color(100, 116, 139, 153); // rgba(100, 116, 139, 0.6)
            graphics.lineWidth = 1.5;
            graphics.rect(-size / 2, trackY, size, trackHeight);
            graphics.stroke();
            
            // 履带装甲板（6块）
            const plateCount = 6;
            for (let i = 0; i < plateCount; i++) {
                const px = -size / 2 + (size / plateCount) * i + 2;
                const plateWidth = size / plateCount - 3;
                
                graphics.fillColor = new Color(71, 85, 105, 128); // rgba(71, 85, 105, 0.5)
                graphics.rect(px, trackY + 2, plateWidth, trackHeight - 4);
                graphics.fill();
                
                graphics.strokeColor = new Color(30, 41, 59, 204); // rgba(30, 41, 59, 0.8)
                graphics.lineWidth = 0.5;
                graphics.rect(px, trackY + 2, plateWidth, trackHeight - 4);
                graphics.stroke();
            }
        }
        
        // 绘制负重轮（5个，带金属质感）
        for (let i = 0; i < wheelCount; i++) {
            const t = wheelCount === 1 ? 0.5 : i / (wheelCount - 1);
            const wx = -size / 2 + size * (0.12 + 0.76 * t);
            const wyTop = -size / 2 + trackHeight / 2;
            const wyBottom = size / 2 - trackHeight / 2;
            
            for (let side = 0; side < 2; side++) {
                const wy = side === 0 ? wyTop : wyBottom;
                
                // 滚轮外圈（金属灰）
                graphics.fillColor = new Color(100, 116, 139, 255); // #64748b
                graphics.circle(wx, wy, wheelRadius);
                graphics.fill();
                
                // 滚轮边框
                graphics.strokeColor = new Color(30, 41, 59, 255); // #1e293b
                graphics.lineWidth = 1.5;
                graphics.circle(wx, wy, wheelRadius);
                graphics.stroke();
                
                // 滚轮轴心
                graphics.fillColor = new Color(148, 163, 184, 255); // #94a3b8
                graphics.circle(wx, wy, wheelRadius * 0.4);
                graphics.fill();
                
                // 轴心高光
                graphics.fillColor = new Color(203, 213, 225, 179); // rgba(203, 213, 225, 0.7)
                graphics.circle(wx - wheelRadius * 0.15, wy - wheelRadius * 0.15, wheelRadius * 0.15);
                graphics.fill();
            }
        }
    }
    
    /**
     * 绘制主车体
     */
    private static drawMainHull(graphics: Graphics, size: number, trackHeight: number, hullRadius: number): void {
        const hullTop = -size / 2 + trackHeight * 0.7;
        const hullBottom = size / 2 - trackHeight * 0.7;
        const hullHeight = hullBottom - hullTop;
        const hullWidth = size - 14;
        
        // 主车体（倾斜前装甲设计）
        graphics.fillColor = new Color(30, 41, 59, 255); // #1e293b
        graphics.rect(-hullWidth / 2, hullTop, hullWidth, hullHeight);
        graphics.fill();
        
        // 车体主边框（加粗）
        graphics.strokeColor = new Color(15, 23, 42, 255); // #0f172a
        graphics.lineWidth = 3.5;
        graphics.rect(-hullWidth / 2, hullTop, hullWidth, hullHeight);
        graphics.stroke();
        
        // 车体内边框（细节）
        graphics.strokeColor = new Color(71, 85, 105, 153); // rgba(71, 85, 105, 0.6)
        graphics.lineWidth = 1.5;
        graphics.rect(-hullWidth / 2 + 3, hullTop + 3, hullWidth - 6, hullHeight - 6);
        graphics.stroke();
        
        // 顶部高光（金属光泽）
        graphics.fillColor = new Color(148, 163, 184, 89); // rgba(148, 163, 184, 0.35)
        graphics.rect(-hullWidth / 2 + 5, hullTop + 4, hullWidth - 10, hullHeight * 0.3);
        graphics.fill();
    }
    
    /**
     * 绘制装甲板
     */
    private static drawArmorPlates(graphics: Graphics, size: number, trackHeight: number): void {
        const hullWidth = size - 14;
        
        // 前装甲板（倾斜设计）
        graphics.fillColor = new Color(51, 65, 85, 242); // rgba(51, 65, 85, 0.95)
        graphics.rect(-hullWidth / 2 + 8, -size * 0.12, hullWidth - 16, size * 0.24);
        graphics.fill();
        
        graphics.strokeColor = new Color(30, 41, 59, 255); // #1e293b
        graphics.lineWidth = 2;
        graphics.rect(-hullWidth / 2 + 8, -size * 0.12, hullWidth - 16, size * 0.24);
        graphics.stroke();
        
        // 装甲板细节纹理（3条加强筋）- 赛博朋克风格：霓虹红色
        graphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.ENEMY_PRIMARY, 0.35);
        graphics.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const grooveY = -size * 0.08 + i * (size * 0.16 / 2);
            graphics.moveTo(-hullWidth / 2 + 12, grooveY);
            graphics.lineTo(hullWidth / 2 - 12, grooveY);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制炮塔系统
     */
    private static drawTurretSystem(graphics: Graphics, size: number, turretRadius: number): void {
        const turretY = -size * 0.06;
        
        // 炮塔主体（圆形）- 赛博朋克风格：霓虹红色
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.ENEMY_PRIMARY, 0.8);
        graphics.circle(0, turretY, turretRadius);
        graphics.fill();
        
        graphics.strokeColor = new Color(15, 23, 42, 255); // #0f172a
        graphics.lineWidth = 2.5;
        graphics.circle(0, turretY, turretRadius);
        graphics.stroke();
        
        // 炮塔装甲环（3圈同心圆）
        for (let i = 0; i < 3; i++) {
            const ringRadius = turretRadius * (0.55 + i * 0.12);
            graphics.strokeColor = new Color(71, 85, 105, Math.floor(102 - i * 26)); // 递减透明度
            graphics.lineWidth = 1.2;
            graphics.circle(0, turretY, ringRadius);
            graphics.stroke();
        }
        
        // 炮塔顶部指挥舱 - 赛博朋克风格：霓虹红色
        const hatchWidth = size * 0.14;
        const hatchHeight = size * 0.32;
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.ENEMY_PRIMARY, 0.95);
        graphics.rect(-hatchWidth / 2, -size * 0.22, hatchWidth, hatchHeight);
        graphics.fill();
        
        graphics.strokeColor = new Color(30, 41, 59, 255); // #1e293b
        graphics.lineWidth = 2;
        graphics.rect(-hatchWidth / 2, -size * 0.22, hatchWidth, hatchHeight);
        graphics.stroke();
    }
    
    /**
     * 绘制主炮
     */
    private static drawMainGun(graphics: Graphics, barrelLength: number, barrelHalfHeight: number): void {
        // 炮管主体 - 赛博朋克风格：霓虹红色
        graphics.strokeColor = CyberpunkColors.ENEMY_PRIMARY;
        graphics.lineWidth = barrelHalfHeight * 2;
        graphics.moveTo(0, -barrelHalfHeight);
        graphics.lineTo(barrelLength, -barrelHalfHeight);
        graphics.lineTo(barrelLength, barrelHalfHeight);
        graphics.lineTo(0, barrelHalfHeight);
        graphics.close();
        graphics.stroke();
        
        // 炮管加强环（3个）
        graphics.strokeColor = new Color(30, 41, 59, 230); // rgba(30, 41, 59, 0.9)
        graphics.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const ringX = barrelLength * (0.25 + i * 0.2);
            graphics.moveTo(ringX, -barrelHalfHeight * 0.5);
            graphics.lineTo(ringX, barrelHalfHeight * 0.5);
            graphics.stroke();
        }
        
        // 炮口光环（3层，红色威胁）
        const muzzleEndX = barrelLength;
        const muzzleRadius = barrelHalfHeight * 0.6;
        
        // 最外层光晕 - 赛博朋克风格：霓虹红色
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.ENEMY_PRIMARY, 0.4);
        graphics.circle(muzzleEndX, 0, muzzleRadius * 1.5);
        graphics.fill();
        
        // 中层 - 赛博朋克风格：霓虹红色
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.ENEMY_PRIMARY, 0.95);
        graphics.circle(muzzleEndX, 0, muzzleRadius);
        graphics.fill();
        
        // 内层高光
        graphics.fillColor = new Color(255, 255, 255, 179); // rgba(255, 255, 255, 0.7)
        graphics.circle(muzzleEndX, 0, muzzleRadius * 0.5);
        graphics.fill();
    }
    
    /**
     * 绘制威胁标记
     */
    private static drawThreatMarkers(graphics: Graphics, size: number): void {
        // 主威胁标识（左前方）
        const mainIndicatorX = -size * 0.2;
        const mainIndicatorY = -size * 0.02;
        const mainRadius = size * 0.095;
        
        // 外层脉冲光晕 - 赛博朋克风格：霓虹红色
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.ENEMY_PRIMARY, 0.5);
        graphics.circle(mainIndicatorX, mainIndicatorY, mainRadius * 1.4);
        graphics.fill();
        
        // 中层（径向渐变模拟）- 赛博朋克风格：霓虹红色
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.ENEMY_PRIMARY, 0.95);
        graphics.circle(mainIndicatorX, mainIndicatorY, mainRadius * 0.8);
        graphics.fill();
        
        // 边框 - 赛博朋克风格：霓虹粉色
        graphics.strokeColor = CyberpunkColors.NEON_PINK;
        graphics.lineWidth = 2;
        graphics.circle(mainIndicatorX, mainIndicatorY, mainRadius * 0.8);
        graphics.stroke();
        
        // 内层高光
        graphics.fillColor = new Color(255, 255, 255, 242); // rgba(255, 255, 255, 0.95)
        graphics.circle(mainIndicatorX, mainIndicatorY, mainRadius * 0.45);
        graphics.fill();
    }
}

