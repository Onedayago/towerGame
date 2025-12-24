import { Graphics, Color } from 'cc';
import { UiLineConfig } from '../../config/Index';
import { DrawHelper } from '../../utils/Index';

/**
 * 箱子障碍物渲染器
 * 负责绘制箱子/集装箱障碍物的外观
 * 参考原游戏：方形箱子，使用金属材质
 */
export class BoxObstacleRenderer {
    // 箱子颜色配置
    private static readonly BOX_COLOR = new Color(120, 100, 80, 255); // 金属棕色
    private static readonly BOX_HIGHLIGHT = new Color(160, 140, 120, 255); // 高光色
    private static readonly BOX_SHADOW = new Color(80, 70, 60, 255); // 阴影色
    
    /**
     * 绘制箱子障碍物
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
        
        // 绘制箱子主体
        this.drawBoxBody(graphics, drawWidth, drawHeight, padding);
        
        // 绘制金属纹理
        this.drawMetalTexture(graphics, drawWidth, drawHeight, padding);
    }
    
    /**
     * 绘制箱子主体
     */
    private static drawBoxBody(graphics: Graphics, width: number, height: number, padding: number): void {
        graphics.fillColor = this.BOX_COLOR;
        graphics.rect(padding, padding, width, height);
        graphics.fill();
        
        // 绘制高光（左上角）
        graphics.fillColor = this.BOX_HIGHLIGHT;
        graphics.rect(padding, padding + height * 0.7, width * 0.3, height * 0.3);
        graphics.fill();
        
        // 绘制阴影（右下角）
        graphics.fillColor = this.BOX_SHADOW;
        graphics.rect(padding + width * 0.7, padding, width * 0.3, height * 0.3);
        graphics.fill();
    }
    
    /**
     * 绘制金属纹理（线条）
     */
    private static drawMetalTexture(graphics: Graphics, width: number, height: number, padding: number): void {
        const lineColor = new Color(100, 90, 70, 255);
        graphics.strokeColor = lineColor;
        graphics.lineWidth = UiLineConfig.THIN_LINE_WIDTH;
        
        // 绘制水平纹理线
        for (let i = 1; i < 3; i++) {
            const y = padding + (height / 3) * i;
            DrawHelper.drawHorizontalLine(graphics, padding, y, padding + width, lineColor, UiLineConfig.THIN_LINE_WIDTH);
        }
        
        // 绘制垂直纹理线
        for (let i = 1; i < 3; i++) {
            const x = padding + (width / 3) * i;
            DrawHelper.drawVerticalLine(graphics, x, padding, padding + height, lineColor, UiLineConfig.THIN_LINE_WIDTH);
        }
    }
    
}

