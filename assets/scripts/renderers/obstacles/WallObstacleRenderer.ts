import { Graphics, Color } from 'cc';
import { UiLineConfig } from '../../config/Index';
import { DrawHelper } from '../../utils/Index';

/**
 * 墙壁障碍物渲染器
 * 负责绘制墙壁障碍物的外观
 * 参考原游戏：直线墙壁，使用混凝土或金属材质
 */
export class WallObstacleRenderer {
    // 墙壁颜色配置
    private static readonly WALL_COLOR = new Color(100, 100, 110, 255); // 混凝土灰色
    private static readonly WALL_HIGHLIGHT = new Color(140, 140, 150, 255); // 高光色
    private static readonly WALL_SHADOW = new Color(70, 70, 80, 255); // 阴影色
    
    /**
     * 绘制墙壁障碍物
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;
        
        graphics.clear();
        
        // 设置绘制区域限制，确保障碍物不会超出格子
        const padding = 1; // 内边距，确保不超出边界
        const drawWidth = width - padding * 2;
        const drawHeight = height - padding * 2;
        
        // 绘制墙壁主体
        this.drawWallBody(graphics, drawWidth, drawHeight, padding);
        
        // 绘制砖块纹理
        this.drawBrickPattern(graphics, drawWidth, drawHeight, padding);
    }
    
    /**
     * 绘制墙壁主体
     */
    private static drawWallBody(graphics: Graphics, width: number, height: number, padding: number): void {
        graphics.fillColor = this.WALL_COLOR;
        graphics.rect(padding, padding, width, height);
        graphics.fill();
        
        // 绘制高光（顶部）
        graphics.fillColor = this.WALL_HIGHLIGHT;
        graphics.rect(padding, padding + height * 0.9, width, height * 0.1);
        graphics.fill();
        
        // 绘制阴影（底部）
        graphics.fillColor = this.WALL_SHADOW;
        graphics.rect(padding, padding, width, height * 0.1);
        graphics.fill();
    }
    
    /**
     * 绘制砖块纹理
     */
    private static drawBrickPattern(graphics: Graphics, width: number, height: number, padding: number): void {
        const brickWidth = width / 2;
        const brickHeight = height / 3;
        const lineColor = new Color(60, 60, 70, 255);
        
        graphics.strokeColor = lineColor;
        graphics.lineWidth = UiLineConfig.THIN_LINE_WIDTH;
        
        // 绘制水平线
        for (let i = 1; i < 3; i++) {
            const y = padding + i * brickHeight;
            DrawHelper.drawHorizontalLine(graphics, padding, y, padding + width, lineColor, UiLineConfig.THIN_LINE_WIDTH);
        }
        
        // 绘制垂直线（交错排列）
        for (let i = 0; i < 2; i++) {
            const x = padding + i * brickWidth;
            const startY = padding + (i % 2 === 0 ? 0 : brickHeight);
            const endY = padding + (i % 2 === 0 ? height : height - brickHeight);
            DrawHelper.drawVerticalLine(graphics, x, startY, endY, lineColor, UiLineConfig.THIN_LINE_WIDTH);
        }
    }
    
}

