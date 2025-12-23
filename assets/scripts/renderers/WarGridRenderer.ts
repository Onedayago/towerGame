import { Graphics, Color } from 'cc';
import { UiConfig } from '../config/Index';
import { CyberpunkColors } from '../constants/Index';

/**
 * 战场格子渲染器
 * 负责绘制战场的网格格子
 * 参考原游戏实现
 */
export class WarGridRenderer {
    // 格子线条颜色 - 赛博朋克风格：深色半透明
    private static readonly GRID_LINE_COLOR = new Color(0, 255, 255, 30); // 霓虹青色，低透明度
    private static readonly GRID_LINE_WIDTH = 1;
    
    /**
     * 绘制战场格子
     * @param graphics Graphics 组件
     * @param width 战场宽度
     * @param height 战场高度
     */
    static renderGrid(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;
        
        const cellSize = UiConfig.CELL_SIZE;
        const cellCountX = Math.floor(width / cellSize);
        const cellCountY = Math.floor(height / cellSize);
        
        graphics.strokeColor = this.GRID_LINE_COLOR;
        graphics.lineWidth = this.GRID_LINE_WIDTH;
        
        // 绘制竖线
        for (let j = 0; j <= cellCountX; j++) {
            const x = j * cellSize;
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
            graphics.stroke();
        }
        
        // 绘制横线
        for (let i = 0; i <= cellCountY; i++) {
            const y = i * cellSize;
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
            graphics.stroke();
        }
    }
}

