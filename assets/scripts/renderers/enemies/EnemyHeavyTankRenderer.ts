import { Graphics, Color } from 'cc';
import { EnemyType, getEnemyColor, CyberpunkColors } from '../../constants/Index';

/**
 * 重型坦克敌人渲染器
 * 负责重型坦克的绘制逻辑（美化版：多层装甲板、反应装甲、威胁指示器）
 */
export class EnemyHeavyTankRenderer {
    /**
     * 绘制重型坦克外观（美化版）
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();
        
        // === 1. 多层阴影（厚重感）===
        this.drawShadowLayers(graphics, width);
        
        // === 2. 主装甲车体（渐变增强金属质感）===
        this.drawMainBody(graphics, width);
        
        // === 3. 多层装甲板系统 ===
        this.drawArmorPlates(graphics, width);
        
        // === 4. 装甲铆钉和焊接细节 ===
        this.drawArmorDetails(graphics, width);
        
        // === 5. 侧边装甲护板（立体感）===
        this.drawSideArmor(graphics, width);
        
        // === 6. 前方反应装甲（最新设计）===
        this.drawReactiveArmor(graphics, width);
        
        // === 7. 装甲条纹和警告标识 ===
        this.drawWarningStripes(graphics, width);
        
        // === 8. 中心威胁指示器（脉冲发光）===
        this.drawThreatIndicator(graphics, width);
        
        // === 9. 顶部金属高光（增强质感）===
        this.drawMetalHighlight(graphics, width);
    }
    
    /**
     * 绘制多层阴影
     */
    private static drawShadowLayers(graphics: Graphics, size: number): void {
        // 第一层主阴影
        graphics.fillColor = new Color(0, 0, 0, 102); // rgba(0, 0, 0, 0.4)
        graphics.rect(-size / 2 + 5, -size / 2 + 6, size - 10, size - 6);
        graphics.fill();
        
        // 第二层次阴影
        graphics.fillColor = new Color(0, 0, 0, 64); // rgba(0, 0, 0, 0.25)
        graphics.rect(-size / 2 + 6, -size / 2 + 7, size - 12, size - 8);
        graphics.fill();
        
        // 第三层柔和阴影
        graphics.fillColor = new Color(0, 0, 0, 38); // rgba(0, 0, 0, 0.15)
        graphics.rect(-size / 2 + 7, -size / 2 + 8, size - 14, size - 10);
        graphics.fill();
    }
    
    /**
     * 绘制主装甲车体（渐变）
     */
    private static drawMainBody(graphics: Graphics, size: number): void {
        // 主车体（霓虹蓝色）- 赛博朋克风格
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_BLUE, 0.95);
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.fill();
        
        // 厚重边框（霓虹蓝色发光）
        graphics.strokeColor = CyberpunkColors.NEON_BLUE;
        graphics.lineWidth = 3.5;
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.stroke();
        
        graphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.8);
        graphics.lineWidth = 2;
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.stroke();
    }
    
    /**
     * 绘制多层装甲板
     */
    private static drawArmorPlates(graphics: Graphics, size: number): void {
        // 外层装甲板
        graphics.fillColor = new Color(153, 0, 0, 230); // rgba(153, 0, 0, 0.9)
        graphics.rect(-size / 2 + 4, -size / 2 + 4, size - 8, size - 8);
        graphics.fill();
        
        graphics.strokeColor = new Color(68, 0, 0, 230); // rgba(68, 0, 0, 0.9)
        graphics.lineWidth = 2;
        graphics.rect(-size / 2 + 4, -size / 2 + 4, size - 8, size - 8);
        graphics.stroke();
        
        // 中层装甲（六边形设计）
        const midSize = size * 0.75;
        graphics.fillColor = new Color(102, 0, 0, 242); // rgba(102, 0, 0, 0.95)
        graphics.rect(-midSize / 2, -midSize / 2, midSize, midSize);
        graphics.fill();
        
        graphics.strokeColor = new Color(255, 68, 68, 102); // rgba(255, 68, 68, 0.4)
        graphics.lineWidth = 1.5;
        graphics.rect(-midSize / 2, -midSize / 2, midSize, midSize);
        graphics.stroke();
        
        // 内层装甲核心
        const innerSize = size * 0.55;
        graphics.fillColor = new Color(85, 0, 0, 230); // rgba(85, 0, 0, 0.9)
        graphics.rect(-innerSize / 2, -innerSize / 2, innerSize, innerSize);
        graphics.fill();
    }
    
    /**
     * 绘制装甲细节（铆钉和焊接痕迹）
     */
    private static drawArmorDetails(graphics: Graphics, size: number): void {
        const rivetRadius = size * 0.04;
        
        // 四角铆钉组
        const cornerPositions = [
            [-size * 0.35, -size * 0.35],
            [size * 0.35, -size * 0.35],
            [-size * 0.35, size * 0.35],
            [size * 0.35, size * 0.35]
        ];
        
        for (const [cx, cy] of cornerPositions) {
            // 铆钉组（3个一组）
            for (let i = 0; i < 3; i++) {
                const offset = (i - 1) * size * 0.08;
                const rx = cx + (cx > 0 ? -offset : offset);
                const ry = cy;
                
                // 铆钉阴影
                graphics.fillColor = new Color(0, 0, 0, 153); // rgba(0, 0, 0, 0.6)
                graphics.circle(rx + 1.5, ry + 1.5, rivetRadius);
                graphics.fill();
                
                // 铆钉主体（金属渐变模拟）
                graphics.fillColor = new Color(136, 119, 119, 255); // #887777
                graphics.circle(rx, ry, rivetRadius);
                graphics.fill();
                
                // 铆钉高光
                graphics.fillColor = new Color(170, 153, 153, 204); // rgba(170, 153, 153, 0.8)
                graphics.circle(rx - size * 0.015, ry - size * 0.015, size * 0.02);
                graphics.fill();
            }
        }
    }
    
    /**
     * 绘制侧边装甲护板
     */
    private static drawSideArmor(graphics: Graphics, size: number): void {
        // 左侧装甲板
        graphics.fillColor = new Color(85, 0, 0, 242); // rgba(85, 0, 0, 0.95)
        graphics.rect(-size / 2 + 5, -size * 0.35, size * 0.15, size * 0.7);
        graphics.fill();
        
        graphics.strokeColor = new Color(255, 68, 68, 102); // rgba(255, 68, 68, 0.4)
        graphics.lineWidth = 1.5;
        graphics.rect(-size / 2 + 5, -size * 0.35, size * 0.15, size * 0.7);
        graphics.stroke();
        
        // 右侧装甲板（对称）
        graphics.fillColor = new Color(85, 0, 0, 230); // rgba(85, 0, 0, 0.9)
        graphics.rect(size / 2 - 5 - size * 0.15, -size * 0.35, size * 0.15, size * 0.7);
        graphics.fill();
        
        graphics.strokeColor = new Color(255, 68, 68, 102); // rgba(255, 68, 68, 0.4)
        graphics.lineWidth = 1.5;
        graphics.rect(size / 2 - 5 - size * 0.15, -size * 0.35, size * 0.15, size * 0.7);
        graphics.stroke();
    }
    
    /**
     * 绘制前方反应装甲
     */
    private static drawReactiveArmor(graphics: Graphics, size: number): void {
        // 主反应装甲块
        graphics.fillColor = new Color(139, 0, 0, 242); // rgba(139, 0, 0, 0.95)
        graphics.rect(-size * 0.3, -size * 0.15, size * 0.6, size * 0.3);
        graphics.fill();
        
        // 装甲边框（发光效果）
        graphics.strokeColor = new Color(255, 102, 102, 204); // rgba(255, 102, 102, 0.8)
        graphics.lineWidth = 2;
        graphics.rect(-size * 0.3, -size * 0.15, size * 0.6, size * 0.3);
        graphics.stroke();
        
        // 三段式装甲板纹理
        for (let i = 0; i < 3; i++) {
            const px = -size * 0.25 + i * size * 0.18;
            graphics.fillColor = new Color(i % 2 === 0 ? 102 : 85, 0, 0, 204); // 交替颜色
            graphics.rect(px, -size * 0.12, size * 0.15, size * 0.24);
            graphics.fill();
            
            graphics.strokeColor = new Color(136, 0, 0, 153); // rgba(136, 0, 0, 0.6)
            graphics.lineWidth = 0.5;
            graphics.rect(px, -size * 0.12, size * 0.15, size * 0.24);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制警告条纹
     */
    private static drawWarningStripes(graphics: Graphics, size: number): void {
        // 顶部警告条纹
        for (let i = 0; i < 3; i++) {
            const sy = -size * 0.38 + i * size * 0.08;
            graphics.fillColor = new Color(i % 2 === 0 ? 102 : 68, 0, 0, 230); // 交替颜色
            graphics.rect(-size * 0.4, sy, size * 0.8, size * 0.03);
            graphics.fill();
            
            graphics.fillColor = new Color(255, 68, 68, 102); // rgba(255, 68, 68, 0.4)
            graphics.rect(-size * 0.4, sy, size * 0.8, size * 0.015);
            graphics.fill();
        }
        
        // 底部警告条纹（对称）
        for (let i = 0; i < 3; i++) {
            const sy = size * 0.22 + i * size * 0.08;
            graphics.fillColor = new Color(i % 2 === 0 ? 102 : 68, 0, 0, 230); // 交替颜色
            graphics.rect(-size * 0.4, sy, size * 0.8, size * 0.03);
            graphics.fill();
            
            graphics.fillColor = new Color(255, 68, 68, 102); // rgba(255, 68, 68, 0.4)
            graphics.rect(-size * 0.4, sy, size * 0.8, size * 0.015);
            graphics.fill();
        }
    }
    
    /**
     * 绘制威胁指示器（脉冲发光）
     */
    private static drawThreatIndicator(graphics: Graphics, size: number): void {
        const indicatorRadius = size * 0.16;
        
        // 最外层脉冲光晕
        graphics.fillColor = new Color(255, 0, 0, 89); // rgba(255, 0, 0, 0.35)
        graphics.circle(0, 0, indicatorRadius * 1.3);
        graphics.fill();
        
        // 主指示器（径向渐变模拟）
        graphics.fillColor = new Color(255, 255, 255, 255); // 白色
        graphics.circle(0, 0, indicatorRadius);
        graphics.fill();
        
        // 指示器边框（发光）
        graphics.strokeColor = new Color(255, 136, 136, 255); // #ff8888
        graphics.lineWidth = 2.5;
        graphics.circle(0, 0, indicatorRadius);
        graphics.stroke();
        
        // 内层高亮核心
        graphics.fillColor = new Color(255, 255, 255, 230); // rgba(255, 255, 255, 0.9)
        graphics.circle(0, 0, indicatorRadius * 0.45);
        graphics.fill();
        
        // 危险标识线（十字）
        graphics.strokeColor = new Color(68, 0, 0, 204); // rgba(68, 0, 0, 0.8)
        graphics.lineWidth = 2;
        graphics.moveTo(-indicatorRadius * 0.6, 0);
        graphics.lineTo(indicatorRadius * 0.6, 0);
        graphics.moveTo(0, -indicatorRadius * 0.6);
        graphics.lineTo(0, indicatorRadius * 0.6);
        graphics.stroke();
    }
    
    /**
     * 绘制金属高光
     */
    private static drawMetalHighlight(graphics: Graphics, size: number): void {
        // 顶部主高光（增强金属感）
        graphics.fillColor = new Color(255, 255, 255, 102); // rgba(255, 255, 255, 0.4)
        graphics.rect(-size / 2 + 8, -size / 2 + 8, size - 16, size * 0.3);
        graphics.fill();
        
        // 左侧边缘高光
        graphics.fillColor = new Color(255, 255, 255, 77); // rgba(255, 255, 255, 0.3)
        graphics.rect(-size / 2 + 8, -size * 0.3, size * 0.15, size * 0.6);
        graphics.fill();
    }
}

