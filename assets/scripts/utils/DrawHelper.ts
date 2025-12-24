import { Graphics, Color } from 'cc';

/**
 * 绘制辅助工具类
 * 提供常用的绘制方法，统一管理绘制相关的代码
 */
export class DrawHelper {
    /**
     * 绘制矩形背景
     * @param graphics Graphics 组件
     * @param x X坐标
     * @param y Y坐标
     * @param width 宽度
     * @param height 高度
     * @param fillColor 填充颜色
     * @param strokeColor 边框颜色（可选）
     * @param lineWidth 边框宽度（可选）
     */
    static drawRect(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor: Color,
        strokeColor?: Color,
        lineWidth: number = 1
    ): void {
        if (!graphics) return;

        graphics.clear();
        
        // 绘制填充
        if (fillColor) {
            graphics.fillColor = fillColor;
            graphics.rect(x, y, width, height);
            graphics.fill();
        }

        // 绘制边框
        if (strokeColor) {
            graphics.strokeColor = strokeColor;
            graphics.lineWidth = lineWidth;
            graphics.rect(x, y, width, height);
            graphics.stroke();
        }
    }

    /**
     * 绘制圆形
     * @param graphics Graphics 组件
     * @param x 圆心X坐标
     * @param y 圆心Y坐标
     * @param radius 半径
     * @param fillColor 填充颜色
     * @param strokeColor 边框颜色（可选）
     * @param lineWidth 边框宽度（可选）
     */
    static drawCircle(
        graphics: Graphics,
        x: number,
        y: number,
        radius: number,
        fillColor: Color,
        strokeColor?: Color,
        lineWidth: number = 1
    ): void {
        if (!graphics) return;

        // 绘制填充
        if (fillColor) {
            graphics.fillColor = fillColor;
            graphics.circle(x, y, radius);
            graphics.fill();
        }

        // 绘制边框
        if (strokeColor) {
            graphics.strokeColor = strokeColor;
            graphics.lineWidth = lineWidth;
            graphics.circle(x, y, radius);
            graphics.stroke();
        }
    }

    /**
     * 绘制半透明矩形背景（带边框）
     * @param graphics Graphics 组件
     * @param x X坐标
     * @param y Y坐标
     * @param width 宽度
     * @param height 高度
     * @param fillColor 填充颜色（带透明度）
     * @param strokeColor 边框颜色
     * @param lineWidth 边框宽度
     */
    static drawTransparentRect(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor: Color,
        strokeColor: Color,
        lineWidth: number = 2
    ): void {
        if (!graphics) return;

        graphics.clear();

        // 绘制半透明填充
        graphics.fillColor = fillColor;
        graphics.rect(x, y, width, height);
        graphics.fill();

        // 绘制边框
        graphics.strokeColor = strokeColor;
        graphics.lineWidth = lineWidth;
        graphics.rect(x, y, width, height);
        graphics.stroke();
    }

    /**
     * 绘制小圆点（用于小地图标记）
     * @param graphics Graphics 组件
     * @param x X坐标
     * @param y Y坐标
     * @param radius 半径
     * @param color 颜色
     */
    static drawDot(
        graphics: Graphics,
        x: number,
        y: number,
        radius: number,
        color: Color
    ): void {
        if (!graphics) return;

        graphics.fillColor = color;
        graphics.circle(x, y, radius);
        graphics.fill();
    }

    /**
     * 绘制小方块（用于小地图标记）
     * @param graphics Graphics 组件
     * @param x 中心X坐标
     * @param y 中心Y坐标
     * @param size 大小
     * @param color 颜色
     */
    static drawSquare(
        graphics: Graphics,
        x: number,
        y: number,
        size: number,
        color: Color
    ): void {
        if (!graphics) return;

        const halfSize = size / 2;
        graphics.fillColor = color;
        graphics.rect(x - halfSize, y - halfSize, size, size);
        graphics.fill();
    }

    /**
     * 绘制纯色背景
     * @param graphics Graphics 组件
     * @param x X坐标
     * @param y Y坐标
     * @param width 宽度
     * @param height 高度
     * @param color 颜色
     */
    static drawSolidBackground(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number,
        color: Color
    ): void {
        if (!graphics) return;

        graphics.clear();
        graphics.fillColor = color;
        graphics.rect(x, y, width, height);
        graphics.fill();
    }

    /**
     * 绘制矩形边框（使用 moveTo 和 lineTo，不填充）
     * @param graphics Graphics 组件
     * @param x 起始X坐标
     * @param y 起始Y坐标
     * @param width 宽度
     * @param height 高度
     * @param strokeColor 边框颜色
     * @param lineWidth 边框宽度
     */
    static drawRectBorder(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number,
        strokeColor: Color,
        lineWidth: number = 1
    ): void {
        if (!graphics) return;

        graphics.strokeColor = strokeColor;
        graphics.lineWidth = lineWidth;
        // 绘制矩形边框：上、右、下、左
        graphics.moveTo(x, y);
        graphics.lineTo(x + width, y);
        graphics.lineTo(x + width, y + height);
        graphics.lineTo(x, y + height);
        graphics.lineTo(x, y);
        graphics.stroke();
    }

    /**
     * 绘制水平线
     * @param graphics Graphics 组件
     * @param x1 起始X坐标
     * @param y Y坐标
     * @param x2 结束X坐标
     * @param strokeColor 线条颜色
     * @param lineWidth 线条宽度
     */
    static drawHorizontalLine(
        graphics: Graphics,
        x1: number,
        y: number,
        x2: number,
        strokeColor: Color,
        lineWidth: number = 1
    ): void {
        if (!graphics) return;

        graphics.strokeColor = strokeColor;
        graphics.lineWidth = lineWidth;
        graphics.moveTo(x1, y);
        graphics.lineTo(x2, y);
        graphics.stroke();
    }

    /**
     * 绘制垂直线
     * @param graphics Graphics 组件
     * @param x X坐标
     * @param y1 起始Y坐标
     * @param y2 结束Y坐标
     * @param strokeColor 线条颜色
     * @param lineWidth 线条宽度
     */
    static drawVerticalLine(
        graphics: Graphics,
        x: number,
        y1: number,
        y2: number,
        strokeColor: Color,
        lineWidth: number = 1
    ): void {
        if (!graphics) return;

        graphics.strokeColor = strokeColor;
        graphics.lineWidth = lineWidth;
        graphics.moveTo(x, y1);
        graphics.lineTo(x, y2);
        graphics.stroke();
    }
}

