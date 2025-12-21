import { Graphics, Color } from 'cc';
import { EnemyType, getEnemyColor } from '../../constants/Index';

/**
 * Boss 敌人渲染器
 * 负责 Boss 的绘制逻辑（美化版：危险脉冲光晕、警告条纹、爆破标识）
 */
export class EnemyBossRenderer {
    /**
     * 绘制Boss外观（美化版）
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();
        
        // === 1. 危险脉冲光晕（多层闪烁基础）===
        this.drawDangerPulse(graphics, width);
        
        // === 2. 爆炸性阴影 ===
        this.drawExplosiveShadow(graphics, width);
        
        // === 3. 主装甲外壳（渐变）===
        this.drawExplosiveShell(graphics, width);
        
        // === 4. 警告条纹系统（黑黄相间）===
        this.drawWarningStripes(graphics, width);
        
        // === 5. 爆炸物核心容器 ===
        this.drawExplosiveCore(graphics, width);
        
        // === 6. 四角危险警示灯 ===
        this.drawCornerWarningLights(graphics, width);
        
        // === 7. 中心爆破标识（X标记）===
        this.drawExplosiveSymbol(graphics, width);
        
        // === 8. 引爆装置细节 ===
        this.drawDetonatorDetails(graphics, width);
    }
    
    /**
     * 绘制危险脉冲光晕
     */
    private static drawDangerPulse(graphics: Graphics, size: number): void {
        // 最外层红色警告脉冲
        graphics.fillColor = new Color(255, 0, 0, 89); // rgba(255, 0, 0, 0.35)
        graphics.circle(0, 0, size * 0.65);
        graphics.fill();
        
        // 中层橙色辉光
        graphics.fillColor = new Color(255, 102, 34, 64); // rgba(255, 102, 34, 0.25)
        graphics.circle(0, 0, size * 0.58);
        graphics.fill();
    }
    
    /**
     * 绘制爆炸性阴影
     */
    private static drawExplosiveShadow(graphics: Graphics, size: number): void {
        // 第一层阴影（强烈）
        graphics.fillColor = new Color(0, 0, 0, 89); // rgba(0, 0, 0, 0.35)
        graphics.rect(-size / 2 + 4, -size / 2 + 5, size - 8, size - 5);
        graphics.fill();
        
        // 第二层阴影
        graphics.fillColor = new Color(0, 0, 0, 51); // rgba(0, 0, 0, 0.2)
        graphics.rect(-size / 2 + 5, -size / 2 + 6, size - 10, size - 7);
        graphics.fill();
    }
    
    /**
     * 绘制爆炸物外壳
     */
    private static drawExplosiveShell(graphics: Graphics, size: number): void {
        // 主体渐变（橙红色警告色）
        graphics.fillColor = new Color(255, 136, 68, 242); // rgba(255, 136, 68, 0.95)
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.fill();
        
        // 双层危险边框
        graphics.strokeColor = new Color(170, 34, 0, 255); // #aa2200
        graphics.lineWidth = 3;
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.stroke();
        
        graphics.strokeColor = new Color(255, 0, 0, 204); // rgba(255, 0, 0, 0.8)
        graphics.lineWidth = 2;
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.stroke();
        
        // 内层装甲
        graphics.fillColor = new Color(221, 85, 51, 230); // rgba(221, 85, 51, 0.9)
        graphics.rect(-size / 2 + 5, -size / 2 + 5, size - 10, size - 10);
        graphics.fill();
    }
    
    /**
     * 绘制警告条纹（黑黄相间）
     */
    private static drawWarningStripes(graphics: Graphics, size: number): void {
        const stripeCount = 6;
        const stripeWidth = (size * 1.2) / stripeCount;
        
        // 倾斜的警告条纹（简化版：水平条纹）
        for (let i = 0; i < stripeCount; i++) {
            const sx = -size * 0.6 + i * stripeWidth;
            
            if (i % 2 === 0) {
                // 黑色条纹
                graphics.fillColor = new Color(34, 34, 0, 204); // rgba(34, 34, 0, 0.8)
            } else {
                // 黄色条纹
                graphics.fillColor = new Color(255, 255, 0, 230); // rgba(255, 255, 0, 0.9)
            }
            graphics.rect(sx, -size * 0.5, stripeWidth * 0.5, size);
            graphics.fill();
        }
    }
    
    /**
     * 绘制爆炸物核心容器
     */
    private static drawExplosiveCore(graphics: Graphics, size: number): void {
        const coreSize = size * 0.5;
        
        // 核心容器外框
        graphics.fillColor = new Color(68, 0, 0, 230); // rgba(68, 0, 0, 0.9)
        graphics.rect(-coreSize / 2, -coreSize / 2, coreSize, coreSize);
        graphics.fill();
        
        graphics.strokeColor = new Color(255, 0, 0, 204); // rgba(255, 0, 0, 0.8)
        graphics.lineWidth = 2;
        graphics.rect(-coreSize / 2, -coreSize / 2, coreSize, coreSize);
        graphics.stroke();
        
        // 核心能量（脉冲渐变模拟）
        graphics.fillColor = new Color(255, 255, 255, 230); // rgba(255, 255, 255, 0.9)
        graphics.rect(-coreSize / 2 + 3, -coreSize / 2 + 3, coreSize - 6, coreSize - 6);
        graphics.fill();
    }
    
    /**
     * 绘制四角危险警示灯
     */
    private static drawCornerWarningLights(graphics: Graphics, size: number): void {
        const lightRadius = size * 0.1;
        const corners = [
            { x: -size * 0.38, y: -size * 0.38 },
            { x: size * 0.38, y: -size * 0.38 },
            { x: -size * 0.38, y: size * 0.38 },
            { x: size * 0.38, y: size * 0.38 }
        ];
        
        for (const corner of corners) {
            // 外层脉冲光晕
            graphics.fillColor = new Color(255, 0, 0, 102); // rgba(255, 0, 0, 0.4)
            graphics.circle(corner.x, corner.y, lightRadius * 1.4);
            graphics.fill();
            
            // 中层辉光
            graphics.fillColor = new Color(255, 255, 0, 255); // 黄色
            graphics.circle(corner.x, corner.y, lightRadius);
            graphics.fill();
            
            // 警示灯边框（发光）
            graphics.strokeColor = new Color(255, 0, 0, 255); // 红色
            graphics.lineWidth = 2;
            graphics.circle(corner.x, corner.y, lightRadius);
            graphics.stroke();
            
            // 内层高光
            graphics.fillColor = new Color(255, 255, 255, 230); // rgba(255, 255, 255, 0.9)
            graphics.circle(corner.x - lightRadius * 0.3, corner.y - lightRadius * 0.3, lightRadius * 0.35);
            graphics.fill();
        }
    }
    
    /**
     * 绘制爆破标识（X标记）
     */
    private static drawExplosiveSymbol(graphics: Graphics, size: number): void {
        const symbolSize = size * 0.35;
        
        // X标记（红色）
        graphics.strokeColor = new Color(255, 0, 0, 255); // 红色
        graphics.lineWidth = 3;
        graphics.moveTo(-symbolSize / 3, -symbolSize / 3);
        graphics.lineTo(symbolSize / 3, symbolSize / 3);
        graphics.moveTo(symbolSize / 3, -symbolSize / 3);
        graphics.lineTo(-symbolSize / 3, symbolSize / 3);
        graphics.stroke();
    }
    
    /**
     * 绘制引爆装置细节
     */
    private static drawDetonatorDetails(graphics: Graphics, size: number): void {
        // 上下两个引爆按钮
        const buttonPositions = [
            { x: 0, y: -size * 0.42 },
            { x: 0, y: size * 0.42 }
        ];
        
        for (const pos of buttonPositions) {
            // 按钮基座
            graphics.fillColor = new Color(51, 0, 0, 230); // rgba(51, 0, 0, 0.9)
            graphics.rect(pos.x - size * 0.08, pos.y - size * 0.05, size * 0.16, size * 0.1);
            graphics.fill();
            
            // 按钮主体（红色）
            graphics.fillColor = new Color(255, 0, 0, 255); // 红色
            graphics.circle(pos.x, pos.y, size * 0.045);
            graphics.fill();
            
            // 按钮高光
            graphics.fillColor = new Color(255, 136, 136, 204); // rgba(255, 136, 136, 0.8)
            graphics.circle(pos.x - size * 0.015, pos.y - size * 0.015, size * 0.02);
            graphics.fill();
            
            // 按钮边框（发光）
            graphics.strokeColor = new Color(255, 0, 0, 255); // 红色
            graphics.lineWidth = 1.5;
            graphics.circle(pos.x, pos.y, size * 0.045);
            graphics.stroke();
        }
    }
}

