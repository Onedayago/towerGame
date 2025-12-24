import { Graphics, Color } from 'cc';

/**
 * 岩石障碍物渲染器
 * 负责绘制岩石障碍物的外观
 * 参考原游戏：不规则的岩石形状，使用深灰色和赛博朋克风格
 */
export class RockObstacleRenderer {
    // 岩石颜色配置
    private static readonly ROCK_COLOR = new Color(80, 80, 90, 255); // 深灰蓝色
    private static readonly ROCK_HIGHLIGHT = new Color(120, 120, 130, 255); // 高光色
    private static readonly ROCK_SHADOW = new Color(50, 50, 60, 255); // 阴影色
    
    /**
     * 绘制岩石障碍物
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;
        
        graphics.clear();
        
        // 设置绘制区域限制，确保障碍物不会超出格子
        const padding = 2; // 内边距，确保不超出边界
        const drawWidth = width - padding * 2;
        const drawHeight = height - padding * 2;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(drawWidth, drawHeight) / 2;
        const radius = maxRadius * 0.9; // 使用 90% 确保不超出
        
        // 绘制岩石主体（不规则圆形）
        this.drawRockBody(graphics, centerX, centerY, radius);
        
        // 绘制高光和阴影
        this.drawHighlights(graphics, centerX, centerY, radius);
    }
    
    /**
     * 绘制岩石主体
     */
    private static drawRockBody(graphics: Graphics, centerX: number, centerY: number, radius: number): void {
        graphics.fillColor = this.ROCK_COLOR;
        
        // 绘制不规则多边形（模拟岩石形状）
        const points = this.generateRockPoints(centerX, centerY, radius, 8);
        
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.close();
        graphics.fill();
    }
    
    /**
     * 生成岩石点（不规则多边形）
     * 使用固定的偏移值，确保每次绘制形状一致
     */
    private static generateRockPoints(centerX: number, centerY: number, radius: number, pointCount: number): { x: number; y: number }[] {
        const points: { x: number; y: number }[] = [];
        const angleStep = (Math.PI * 2) / pointCount;
        
        // 使用固定的偏移值数组，模拟不规则形状
        const offsets = [0.85, 0.95, 0.75, 0.9, 0.8, 0.88, 0.92, 0.78];
        
        for (let i = 0; i < pointCount; i++) {
            const angle = i * angleStep;
            // 使用固定的偏移值，使形状不规则但一致
            const offset = offsets[i % offsets.length];
            const r = radius * offset;
            points.push({
                x: centerX + Math.cos(angle) * r,
                y: centerY + Math.sin(angle) * r
            });
        }
        
        return points;
    }
    
    /**
     * 绘制高光和阴影
     */
    private static drawHighlights(graphics: Graphics, centerX: number, centerY: number, radius: number): void {
        // 绘制高光（左上角）
        graphics.fillColor = this.ROCK_HIGHLIGHT;
        const highlightRadius = radius * 0.3;
        const highlightX = centerX - radius * 0.2;
        const highlightY = centerY + radius * 0.2;
        // 确保高光不超出边界（使用更小的半径确保安全）
        const safeHighlightRadius = Math.min(highlightRadius, Math.min(highlightX, highlightY) * 0.8);
        if (safeHighlightRadius > 0) {
            graphics.circle(highlightX, highlightY, safeHighlightRadius);
            graphics.fill();
        }
        
        // 绘制阴影（右下角）
        graphics.fillColor = this.ROCK_SHADOW;
        const shadowRadius = radius * 0.25;
        const shadowX = centerX + radius * 0.2;
        const shadowY = centerY - radius * 0.2;
        // 确保阴影不超出边界
        const maxShadowX = centerX * 2 - shadowX;
        const maxShadowY = shadowY;
        const safeShadowRadius = Math.min(shadowRadius, Math.min(maxShadowX, maxShadowY) * 0.8);
        if (safeShadowRadius > 0) {
            graphics.circle(shadowX, shadowY, safeShadowRadius);
            graphics.fill();
        }
    }
    
}

