import { Graphics, Color } from 'cc';
import { WeaponType, getWeaponColor } from '../../constants/Index';

/**
 * 基础武器渲染器
 * 负责基础武器的绘制逻辑（参考加农炮塔设计）
 */
export class WeaponBasicRenderer {
    /**
     * 绘制基础武器外观（美化版：多层阴影、装甲底座、铆钉、炮塔转台、炮管系统）
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();
        
        const baseRadius = width * 0.5;
        const turretRadius = width * 0.25;
        const barrelLength = width * 0.55;
        const barrelWidth = width * 0.18;
        const baseY = 0;
        
        // === 1. 多层阴影（增强厚重感）===
        this.drawShadowLayers(graphics, baseRadius, baseY);
        
        // === 2. 装甲底座（径向渐变）===
        this.drawArmoredBase(graphics, baseRadius, baseY);
        
        // === 3. 底座铆钉（12个外圈 + 8个内圈）===
        this.drawBaseRivets(graphics, baseRadius, baseY);
        
        // === 4. 炮塔转台（发光效果）===
        this.drawTurretPlatform(graphics, turretRadius, baseY);
        
        // === 5. 炮管系统（多层渐变、加强环、炮口制退器）===
        this.drawBarrelSystem(graphics, barrelLength, barrelWidth, baseY);
        
        // === 6. 瞄准系统（瞄准镜）===
        this.drawTargetingSystem(graphics, width, baseY);
    }
    
    /**
     * 绘制多层阴影
     */
    private static drawShadowLayers(graphics: Graphics, baseRadius: number, baseY: number): void {
        // 第一层阴影（最深）
        graphics.fillColor = new Color(0, 0, 0, 102); // rgba(0, 0, 0, 0.4)
        graphics.circle(0, baseY + 5, baseRadius + 3);
        graphics.fill();
        
        // 第二层阴影（中等）
        graphics.fillColor = new Color(0, 0, 0, 64); // rgba(0, 0, 0, 0.25)
        graphics.circle(0, baseY + 7, baseRadius + 1);
        graphics.fill();
        
        // 第三层阴影（浅）
        graphics.fillColor = new Color(0, 0, 0, 26); // rgba(0, 0, 0, 0.1)
        graphics.circle(0, baseY + 9, baseRadius - 1);
        graphics.fill();
    }
    
    /**
     * 绘制装甲底座（径向渐变效果）
     */
    private static drawArmoredBase(graphics: Graphics, baseRadius: number, baseY: number): void {
        // 外层装甲环（径向渐变模拟）
        graphics.strokeColor = new Color(100, 116, 139, 255); // #64748b
        graphics.lineWidth = 3;
        graphics.circle(0, baseY, baseRadius);
        graphics.stroke();
        
        // 内层装甲板
        const innerRadius = baseRadius * 0.7;
        graphics.strokeColor = new Color(51, 65, 85, 255); // #334155
        graphics.lineWidth = 2;
        graphics.circle(0, baseY, innerRadius);
        graphics.stroke();
        
        // 装甲分段线（6段）
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const startR = innerRadius;
            const endR = baseRadius;
            const startX = Math.cos(angle) * startR;
            const startY = baseY + Math.sin(angle) * startR;
            const endX = Math.cos(angle) * endR;
            const endY = baseY + Math.sin(angle) * endR;
            
            graphics.strokeColor = new Color(30, 41, 59, 153); // rgba(30, 41, 59, 0.6)
            graphics.lineWidth = 2;
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制底座铆钉
     */
    private static drawBaseRivets(graphics: Graphics, baseRadius: number, baseY: number): void {
        const rivetRadius = baseRadius * 0.06;
        const rivetDist = baseRadius * 0.88;
        
        // 外圈铆钉（12个）
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            const rx = Math.cos(angle) * rivetDist;
            const ry = baseY + Math.sin(angle) * rivetDist;
            
            // 铆钉阴影
            graphics.fillColor = new Color(0, 0, 0, 102); // rgba(0, 0, 0, 0.4)
            graphics.circle(rx + 1, ry + 1, rivetRadius);
            graphics.fill();
            
            // 铆钉主体（金属渐变模拟）
            graphics.fillColor = new Color(148, 163, 184, 255); // #94a3b8
            graphics.circle(rx, ry, rivetRadius);
            graphics.fill();
            
            // 铆钉边框
            graphics.strokeColor = new Color(51, 65, 85, 204); // rgba(51, 65, 85, 0.8)
            graphics.lineWidth = 1;
            graphics.circle(rx, ry, rivetRadius);
            graphics.stroke();
        }
        
        // 内圈铆钉（8个）
        const innerRivetDist = baseRadius * 0.55;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const rx = Math.cos(angle) * innerRivetDist;
            const ry = baseY + Math.sin(angle) * innerRivetDist;
            
            graphics.fillColor = new Color(100, 116, 139, 204); // rgba(100, 116, 139, 0.8)
            graphics.circle(rx, ry, rivetRadius * 0.7);
            graphics.fill();
            
            graphics.strokeColor = new Color(51, 65, 85, 153); // rgba(51, 65, 85, 0.6)
            graphics.lineWidth = 1;
            graphics.circle(rx, ry, rivetRadius * 0.7);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制炮塔转台
     */
    private static drawTurretPlatform(graphics: Graphics, turretRadius: number, baseY: number): void {
        // 转台主体（圆形）
        graphics.strokeColor = new Color(96, 165, 250, 255); // #60a5fa
        graphics.lineWidth = 3;
        graphics.circle(0, baseY, turretRadius);
        graphics.stroke();
        
        // 中心能量核心
        const coreRadius = turretRadius * 0.35;
        graphics.fillColor = new Color(96, 165, 250, 255); // #60a5fa
        graphics.circle(0, baseY, coreRadius);
        graphics.fill();
        
        graphics.strokeColor = new Color(30, 64, 175, 255); // #1e40af
        graphics.lineWidth = 2;
        graphics.circle(0, baseY, coreRadius);
        graphics.stroke();
    }
    
    /**
     * 绘制炮管系统（炮管默认向左）
     */
    private static drawBarrelSystem(graphics: Graphics, barrelLength: number, barrelWidth: number, baseY: number): void {
        // 炮管从中心向左绘制
        const barrelStartX = 0; // 中心点
        const barrelEndX = -barrelLength; // 向左延伸
        const barrelY = baseY;
        
        // 炮管主体（圆角矩形模拟）
        graphics.strokeColor = new Color(100, 116, 139, 255); // #64748b
        graphics.lineWidth = barrelWidth;
        graphics.moveTo(barrelStartX, barrelY - barrelWidth / 2);
        graphics.lineTo(barrelEndX, barrelY - barrelWidth / 2);
        graphics.lineTo(barrelEndX, barrelY + barrelWidth / 2);
        graphics.lineTo(barrelStartX, barrelY + barrelWidth / 2);
        graphics.close();
        graphics.stroke();
        
        // 炮管加强环（4个）
        graphics.strokeColor = new Color(51, 65, 85, 230); // rgba(51, 65, 85, 0.9)
        graphics.lineWidth = 2.5;
        for (let i = 0; i < 4; i++) {
            const ringX = barrelStartX - barrelLength * (0.2 + i * 0.2); // 向左计算位置
            graphics.moveTo(ringX, barrelY - barrelWidth / 2);
            graphics.lineTo(ringX, barrelY + barrelWidth / 2);
            graphics.stroke();
        }
        
        // 炮口制退器（在炮管左端）
        const muzzleX = barrelEndX;
        const muzzleWidth = barrelWidth * 1.3;
        const muzzleLength = barrelWidth * 0.6;
        
        graphics.fillColor = new Color(71, 85, 105, 242); // rgba(71, 85, 105, 0.95)
        graphics.rect(muzzleX, barrelY - muzzleWidth / 2, muzzleLength, muzzleWidth);
        graphics.fill();
        
        graphics.strokeColor = new Color(30, 41, 59, 204); // rgba(30, 41, 59, 0.8)
        graphics.lineWidth = 2;
        graphics.rect(muzzleX, barrelY - muzzleWidth / 2, muzzleLength, muzzleWidth);
        graphics.stroke();
        
        // 炮口光环（3层）
        const muzzleRadius = barrelWidth * 0.5;
        
        // 外层
        graphics.fillColor = new Color(239, 68, 68, 77); // rgba(239, 68, 68, 0.3)
        graphics.circle(muzzleX, barrelY, muzzleRadius * 1.5);
        graphics.fill();
        
        // 中层
        graphics.fillColor = new Color(239, 68, 68, 242); // rgba(239, 68, 68, 0.95)
        graphics.circle(muzzleX, barrelY, muzzleRadius);
        graphics.fill();
        
        // 内层高光
        graphics.fillColor = new Color(255, 255, 255, 179); // rgba(255, 255, 255, 0.7)
        graphics.circle(muzzleX, barrelY, muzzleRadius * 0.5);
        graphics.fill();
    }
    
    /**
     * 绘制瞄准系统
     */
    private static drawTargetingSystem(graphics: Graphics, size: number, baseY: number): void {
        const sightSize = size * 0.08;
        const sightY = baseY - size * 0.35;
        
        // 瞄准镜主体
        graphics.fillColor = new Color(6, 182, 212, 255); // #06b6d4
        graphics.circle(0, sightY, sightSize);
        graphics.fill();
        
        graphics.strokeColor = new Color(34, 211, 238, 255); // #22d3ee
        graphics.lineWidth = 2;
        graphics.circle(0, sightY, sightSize);
        graphics.stroke();
        
        // 十字准星
        const crossSize = sightSize * 0.6;
        graphics.strokeColor = new Color(34, 211, 238, 230); // rgba(34, 211, 238, 0.9)
        graphics.lineWidth = 1.5;
        graphics.moveTo(-crossSize, sightY);
        graphics.lineTo(crossSize, sightY);
        graphics.moveTo(0, sightY - crossSize);
        graphics.lineTo(0, sightY + crossSize);
        graphics.stroke();
    }
}

