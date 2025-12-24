import { Graphics, Color } from 'cc';

/**
 * 树木障碍物渲染器
 * 负责绘制树木障碍物的外观
 * 参考原游戏：圆形树冠和树干
 */
export class TreeObstacleRenderer {
    // 树木颜色配置
    private static readonly TRUNK_COLOR = new Color(60, 40, 20, 255); // 树干棕色
    private static readonly LEAF_COLOR = new Color(30, 80, 30, 255); // 树叶绿色
    private static readonly LEAF_HIGHLIGHT = new Color(50, 120, 50, 255); // 树叶高光
    
    /**
     * 绘制树木障碍物
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;
        
        graphics.clear();
        
        // 设置绘制区域限制，确保障碍物不会超出格子
        const padding = 3; // 内边距，确保不超出边界
        const drawWidth = width - padding * 2;
        const drawHeight = height - padding * 2;
        const centerX = width / 2;
        const trunkWidth = Math.min(drawWidth * 0.2, drawWidth * 0.2);
        const trunkHeight = Math.min(drawHeight * 0.4, drawHeight * 0.4);
        const trunkY = padding + drawHeight * 0.1;
        // 树冠半径需要更严格限制，确保不超出边界
        const maxLeafRadius = Math.min(drawWidth, drawHeight) / 2;
        const leafRadius = maxLeafRadius * 0.75; // 使用 75% 确保不超出
        const leafY = padding + drawHeight * 0.65; // 稍微降低位置，确保不超出
        
        // 绘制树干
        this.drawTrunk(graphics, centerX, trunkY, trunkWidth, trunkHeight);
        
        // 绘制树冠（圆形）
        this.drawLeaves(graphics, centerX, leafY, leafRadius);
    }
    
    /**
     * 绘制树干
     */
    private static drawTrunk(graphics: Graphics, centerX: number, y: number, width: number, height: number): void {
        graphics.fillColor = this.TRUNK_COLOR;
        graphics.rect(centerX - width / 2, y, width, height);
        graphics.fill();
    }
    
    /**
     * 绘制树冠
     */
    private static drawLeaves(graphics: Graphics, centerX: number, centerY: number, radius: number): void {
        // 计算安全边界
        const maxX = centerX * 2;
        const maxY = centerY * 2;
        
        // 确保树冠不超出边界
        const safeRadius = Math.min(
            radius,
            Math.min(centerX, maxX - centerX), // 左右边界
            Math.min(centerY, maxY - centerY) // 上下边界
        ) * 0.95; // 再乘以 0.95 作为额外安全边距
        
        if (safeRadius > 0) {
            // 绘制主树冠
            graphics.fillColor = this.LEAF_COLOR;
            graphics.circle(centerX, centerY, safeRadius);
            graphics.fill();
            
            // 绘制高光（确保不超出边界）
            graphics.fillColor = this.LEAF_HIGHLIGHT;
            const highlightRadius = safeRadius * 0.4; // 减小高光半径
            const highlightX = centerX - safeRadius * 0.15;
            const highlightY = centerY + safeRadius * 0.15;
            
            // 检查高光是否在边界内
            if (highlightX - highlightRadius >= 0 && highlightX + highlightRadius <= maxX &&
                highlightY - highlightRadius >= 0 && highlightY + highlightRadius <= maxY) {
                graphics.circle(highlightX, highlightY, highlightRadius);
                graphics.fill();
            }
        }
    }
}

