import { Graphics, Color } from 'cc';
import { WeaponType, getWeaponColor } from '../../constants/Index';

/**
 * 激光武器渲染器
 * 负责激光武器的绘制逻辑（美化版：六边形基座、能量导管、能量核心、全息投影环）
 */
export class WeaponLaserRenderer {
    /**
     * 绘制激光武器外观（美化版）
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();
        
        const baseSize = width * 0.5;
        const towerRadius = width * 0.20;
        const coreRadius = width * 0.12;
        
        // === 1. 激光塔阴影 ===
        this.drawLaserShadow(graphics, width, towerRadius);
        
        // === 2. 六边形基座（双层）===
        this.drawHexagonBase(graphics, baseSize);
        
        // === 3. 能量导管（从六个角向中心）===
        this.drawEnergyConduits(graphics, baseSize);
        
        // === 4. 能量电池组（六个角的能量电池）===
        this.drawPowerCells(graphics, baseSize);
        
        // === 5. 激光发射器（四方向主发射器）===
        this.drawLaserEmitters(graphics, width, baseSize);
        
        // === 6. 能量核心（脉冲效果）===
        this.drawEnergyCore(graphics, coreRadius);
        
        // === 7. 全息投影环（三层全息环）===
        this.drawHolographicRing(graphics, baseSize);
    }
    
    /**
     * 绘制激光塔阴影
     */
    private static drawLaserShadow(graphics: Graphics, size: number, towerRadius: number): void {
        // 多层阴影增强科技感
        graphics.fillColor = new Color(0, 0, 0, 102); // rgba(0, 0, 0, 0.4)
        graphics.circle(0, 4, size * 0.45);
        graphics.fill();
        
        graphics.fillColor = new Color(0, 0, 0, 64); // rgba(0, 0, 0, 0.25)
        graphics.circle(0, 6, size * 0.4);
        graphics.fill();
        
        graphics.fillColor = new Color(0, 0, 0, 26); // rgba(0, 0, 0, 0.1)
        graphics.circle(0, 8, size * 0.35);
        graphics.fill();
    }
    
    /**
     * 绘制六边形基座
     */
    private static drawHexagonBase(graphics: Graphics, baseSize: number): void {
        const sides = 6;
        const angleStep = (Math.PI * 2) / sides;
        
        // 外层六边形基座（深色科技感）
        graphics.strokeColor = new Color(0, 255, 136, 204); // rgba(0, 255, 136, 0.8) - 青色发光边框
        graphics.lineWidth = 2.5;
        graphics.moveTo(baseSize, 0);
        for (let i = 1; i <= sides; i++) {
            const angle = i * angleStep;
            const x = Math.cos(angle) * baseSize;
            const y = Math.sin(angle) * baseSize;
            graphics.lineTo(x, y);
        }
        graphics.close();
        graphics.stroke();
        
        // 内层六边形（旋转30度）
        const innerSize = baseSize * 0.65;
        graphics.strokeColor = new Color(0, 255, 136, 128); // rgba(0, 255, 136, 0.5)
        graphics.lineWidth = 1.5;
        graphics.moveTo(innerSize, 0);
        for (let i = 1; i <= sides; i++) {
            const angle = i * angleStep + Math.PI / 6;
            const x = Math.cos(angle) * innerSize;
            const y = Math.sin(angle) * innerSize;
            graphics.lineTo(x, y);
        }
        graphics.close();
        graphics.stroke();
    }
    
    /**
     * 绘制能量导管
     */
    private static drawEnergyConduits(graphics: Graphics, baseSize: number): void {
        // 从六个角向中心的能量导管
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const startX = Math.cos(angle) * baseSize * 0.9;
            const startY = Math.sin(angle) * baseSize * 0.9;
            const endX = Math.cos(angle) * baseSize * 0.4;
            const endY = Math.sin(angle) * baseSize * 0.4;
            
            // 导管发光
            graphics.strokeColor = new Color(0, 255, 136, 204); // rgba(0, 255, 136, 0.8)
            graphics.lineWidth = 3;
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制能量电池组
     */
    private static drawPowerCells(graphics: Graphics, baseSize: number): void {
        const cellCount = 6;
        const cellRadius = baseSize * 0.12;
        const cellDist = baseSize * 0.85;
        
        for (let i = 0; i < cellCount; i++) {
            const angle = (Math.PI / 3) * i;
            const cx = Math.cos(angle) * cellDist;
            const cy = Math.sin(angle) * cellDist;
            
            // 电池外壳
            graphics.fillColor = new Color(26, 58, 46, 255); // #1a3a2e
            graphics.circle(cx, cy, cellRadius);
            graphics.fill();
            
            graphics.strokeColor = new Color(0, 255, 136, 179); // rgba(0, 255, 136, 0.7)
            graphics.lineWidth = 2;
            graphics.circle(cx, cy, cellRadius);
            graphics.stroke();
            
            // 能量指示器
            graphics.fillColor = new Color(0, 255, 136, 230); // rgba(0, 255, 136, 0.9)
            graphics.circle(cx, cy, cellRadius * 0.7);
            graphics.fill();
        }
    }
    
    /**
     * 绘制激光发射器
     */
    private static drawLaserEmitters(graphics: Graphics, size: number, baseSize: number): void {
        const emitterCount = 4;
        const emitterDist = baseSize * 0.72;
        const emitterWidth = size * 0.08;
        const emitterHeight = size * 0.15;
        
        for (let i = 0; i < emitterCount; i++) {
            const angle = (Math.PI / 2) * i;
            const ex = Math.cos(angle) * emitterDist;
            const ey = Math.sin(angle) * emitterDist;
            
            // 发射器外壳
            graphics.fillColor = new Color(45, 90, 69, 255); // #2d5a45
            graphics.rect(ex - emitterWidth / 2, ey - emitterHeight / 2, emitterWidth, emitterHeight);
            graphics.fill();
            
            graphics.strokeColor = new Color(0, 255, 136, 179); // rgba(0, 255, 136, 0.7)
            graphics.lineWidth = 1.5;
            graphics.rect(ex - emitterWidth / 2, ey - emitterHeight / 2, emitterWidth, emitterHeight);
            graphics.stroke();
            
            // 发射口发光
            const muzzleHeight = emitterHeight * 0.4;
            graphics.fillColor = new Color(0, 255, 136, 204); // rgba(0, 255, 136, 0.8)
            graphics.rect(ex - emitterWidth / 2 + 1, ey - muzzleHeight / 2, emitterWidth - 2, muzzleHeight);
            graphics.fill();
        }
    }
    
    /**
     * 绘制能量核心
     */
    private static drawEnergyCore(graphics: Graphics, coreRadius: number): void {
        // 最外层光晕（脉冲效果）
        graphics.fillColor = new Color(0, 255, 136, 128); // rgba(0, 255, 136, 0.5)
        graphics.circle(0, 0, coreRadius * 2.2);
        graphics.fill();
        
        // 外层发光环
        graphics.fillColor = new Color(0, 255, 136, 102); // rgba(0, 255, 136, 0.4)
        graphics.circle(0, 0, coreRadius * 1.6);
        graphics.fill();
        
        // 核心主体（亮白中心）
        graphics.fillColor = new Color(255, 255, 255, 255); // 白色
        graphics.circle(0, 0, coreRadius);
        graphics.fill();
        
        // 核心边框（强发光）
        graphics.strokeColor = new Color(0, 255, 136, 255); // #00ff88
        graphics.lineWidth = 2.5;
        graphics.circle(0, 0, coreRadius);
        graphics.stroke();
        
        // 核心旋转装饰环
        const innerRingRadius = coreRadius * 0.6;
        graphics.strokeColor = new Color(255, 255, 255, 179); // rgba(255, 255, 255, 0.7)
        graphics.lineWidth = 1.5;
        graphics.circle(0, 0, innerRingRadius);
        graphics.stroke();
    }
    
    /**
     * 绘制全息投影环
     */
    private static drawHolographicRing(graphics: Graphics, baseSize: number): void {
        // 三层全息环
        const ringRadii = [baseSize * 0.92, baseSize * 0.96, baseSize * 1.0];
        
        for (let i = 0; i < ringRadii.length; i++) {
            const radius = ringRadii[i];
            const opacity = Math.floor(128 - i * 26); // 递减透明度
            
            graphics.strokeColor = new Color(0, 255, 136, opacity);
            graphics.lineWidth = 1.5 - i * 0.3;
            graphics.circle(0, 0, radius);
            graphics.stroke();
        }
        
        // 全息扫描线（12条径向线）
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI / 6) * i;
            const startR = baseSize * 0.88;
            const endR = baseSize * 1.0;
            const startX = Math.cos(angle) * startR;
            const startY = Math.sin(angle) * startR;
            const endX = Math.cos(angle) * endR;
            const endY = Math.sin(angle) * endR;
            
            graphics.strokeColor = new Color(0, 255, 136, 153); // rgba(0, 255, 136, 0.6)
            graphics.lineWidth = 1;
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
            graphics.stroke();
        }
    }
}

