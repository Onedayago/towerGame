import { Graphics, Color, UITransform } from 'cc';
import { UiConfig } from '../config/Index';

/**
 * 网格绘制工具类
 */
export class GridHelper {
    /**
     * 绘制网格
     * @param graphics Graphics 组件
     * @param width 网格宽度
     * @param height 网格高度
     * @param cellSize 格子大小
     * @param color 线条颜色
     */
    static drawGrid(
        graphics: Graphics,
        width: number,
        height: number,
        cellSize: number = UiConfig.CELL_SIZE,
        color: Color = Color.RED
    ) {
        const cellCountX = Math.floor(width / cellSize);
        const cellCountY = Math.floor(height / cellSize);

        graphics.strokeColor = color;
        graphics.lineWidth = 1;

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

    /**
     * 将坐标对齐到网格
     * @param x X坐标
     * @param y Y坐标
     * @param cellSize 格子大小
     * @param centerAnchor 是否对齐到网格中心（默认 false，对齐到左下角）
     * @returns 对齐后的坐标
     */
    static snapToGrid(x: number, y: number, cellSize: number = UiConfig.CELL_SIZE, centerAnchor: boolean = false): { x: number; y: number } {
        if (centerAnchor) {
            // 对齐到网格中心
            return {
                x: Math.floor(x / cellSize) * cellSize + cellSize / 2,
                y: Math.floor(y / cellSize) * cellSize + cellSize / 2
            };
        } else {
            // 对齐到网格左下角
            return {
                x: Math.floor(x / cellSize) * cellSize,
                y: Math.floor(y / cellSize) * cellSize
            };
        }
    }

    /**
     * 检查坐标是否在指定区域内
     * @param x X坐标
     * @param y Y坐标
     * @param width 区域宽度
     * @param height 区域高度
     * @returns 是否在区域内
     */
    static isInBounds(x: number, y: number, width: number, height: number): boolean {
        return x >= 0 && x <= width && y >= 0 && y <= height;
    }
}

