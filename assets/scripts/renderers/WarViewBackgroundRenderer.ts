import { Graphics, UITransform, Color } from 'cc';
import { CyberpunkColors } from '../constants/Index';
import { UiConfig } from '../config/Index';

/**
 * WarView 背景渲染器
 * 绘制赛博朋克风格的战场废墟背景
 */
export class WarViewBackgroundRenderer {
    /**
     * 绘制赛博朋克战场废墟背景
     * @param graphics Graphics 组件
     * @param transform UITransform 组件
     */
    static renderBackground(graphics: Graphics, transform: UITransform): void {
        if (!graphics || !transform) return;

        const width = transform.width;
        const height = transform.height;
        const x = 0;
        const y = 0;

        graphics.clear();

        // 1. 绘制深色渐变背景（从深蓝紫色到更深的颜色）
        this.renderGradientBackground(graphics, x, y, width, height);

        // 2. 绘制废墟建筑轮廓
        this.renderRuins(graphics, x, y, width, height);

        // 3. 绘制霓虹灯效果
        this.renderNeonLights(graphics, x, y, width, height);

        // 4. 绘制烟雾和粒子效果
        this.renderSmoke(graphics, x, y, width, height);

        // 5. 绘制地面纹理和破损效果
        this.renderGroundTexture(graphics, x, y, width, height);
    }

    /**
     * 绘制渐变背景
     */
    private static renderGradientBackground(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        // 从深蓝紫色渐变到深黑色
        const bgStart = { r: 10, g: 5, b: 25, a: 1.0 }; // 深蓝紫色
        const bgEnd = { r: 5, g: 5, b: 10, a: 1.0 };   // 深黑色
        
        const steps = 50;
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const color = CyberpunkColors.createGradientColor(bgStart, bgEnd, ratio);
            
            const stepHeight = height / steps;
            graphics.fillColor = color;
            graphics.rect(x, y + i * stepHeight, width, stepHeight + 1);
            graphics.fill();
        }
    }

    /**
     * 绘制废墟建筑轮廓
     */
    private static renderRuins(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const cellSize = UiConfig.CELL_SIZE;
        
        // 绘制左侧破损建筑轮廓（使用深色半透明）
        const ruinColor = new Color(20, 15, 30, 180);
        graphics.fillColor = ruinColor;
        graphics.strokeColor = new Color(50, 40, 70, 150);
        graphics.lineWidth = 2;

        // 左侧建筑1（破损的矩形）
        const ruin1X = x + cellSize * 2;
        const ruin1Y = y + cellSize * 2;
        const ruin1Width = cellSize * 1.5;
        const ruin1Height = cellSize * 3;
        graphics.rect(ruin1X, ruin1Y, ruin1Width, ruin1Height);
        graphics.fill();
        graphics.stroke();

        // 左侧建筑2（不规则的破损形状）
        const ruin2X = x + cellSize * 4;
        const ruin2Y = y + cellSize * 1;
        const ruin2Width = cellSize * 2;
        const ruin2Height = cellSize * 4;
        graphics.rect(ruin2X, ruin2Y, ruin2Width, ruin2Height);
        graphics.fill();
        graphics.stroke();

        // 中间区域破损建筑
        const ruin3X = x + width * 0.3;
        const ruin3Y = y + cellSize * 0.5;
        const ruin3Width = cellSize * 1.8;
        const ruin3Height = cellSize * 2.5;
        graphics.rect(ruin3X, ruin3Y, ruin3Width, ruin3Height);
        graphics.fill();
        graphics.stroke();

        // 右侧区域破损建筑
        const ruin4X = x + width * 0.6;
        const ruin4Y = y + cellSize * 1.5;
        const ruin4Width = cellSize * 2.2;
        const ruin4Height = cellSize * 3.5;
        graphics.rect(ruin4X, ruin4Y, ruin4Width, ruin4Height);
        graphics.fill();
        graphics.stroke();

        // 绘制破损线条（表示建筑被破坏）
        graphics.strokeColor = new Color(30, 20, 40, 200);
        graphics.lineWidth = 1.5;
        
        // 破损线条1
        graphics.moveTo(ruin1X + ruin1Width * 0.3, ruin1Y);
        graphics.lineTo(ruin1X + ruin1Width * 0.3, ruin1Y + ruin1Height);
        graphics.stroke();

        // 破损线条2
        graphics.moveTo(ruin2X, ruin2Y + ruin2Height * 0.6);
        graphics.lineTo(ruin2X + ruin2Width, ruin2Y + ruin2Height * 0.6);
        graphics.stroke();
    }

    /**
     * 绘制霓虹灯效果
     */
    private static renderNeonLights(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const cellSize = UiConfig.CELL_SIZE;
        
        // 霓虹灯颜色（半透明，营造发光效果）
        const neonCyan = new Color(0, 255, 255, 80);
        const neonPink = new Color(255, 20, 147, 60);
        const neonPurple = new Color(138, 43, 226, 70);

        graphics.lineWidth = 2;

        // 左侧霓虹灯线条
        graphics.strokeColor = neonCyan;
        const neon1X = x + cellSize * 1.5;
        const neon1Y = y + cellSize * 3;
        graphics.moveTo(neon1X, neon1Y);
        graphics.lineTo(neon1X + cellSize * 2, neon1Y);
        graphics.stroke();

        // 中间霓虹灯线条
        graphics.strokeColor = neonPink;
        const neon2X = x + width * 0.35;
        const neon2Y = y + cellSize * 2;
        graphics.moveTo(neon2X, neon2Y);
        graphics.lineTo(neon2X + cellSize * 1.5, neon2Y);
        graphics.stroke();

        // 右侧霓虹灯线条
        graphics.strokeColor = neonPurple;
        const neon3X = x + width * 0.65;
        const neon3Y = y + cellSize * 4;
        graphics.moveTo(neon3X, neon3Y);
        graphics.lineTo(neon3X + cellSize * 2, neon3Y);
        graphics.stroke();

        // 绘制霓虹灯点（小圆点）
        const dotRadius = 3;
        graphics.fillColor = neonCyan;
        graphics.circle(neon1X + cellSize, neon1Y, dotRadius);
        graphics.fill();

        graphics.fillColor = neonPink;
        graphics.circle(neon2X + cellSize * 0.75, neon2Y, dotRadius);
        graphics.fill();

        graphics.fillColor = neonPurple;
        graphics.circle(neon3X + cellSize, neon3Y, dotRadius);
        graphics.fill();
    }

    /**
     * 绘制烟雾效果
     */
    private static renderSmoke(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const cellSize = UiConfig.CELL_SIZE;
        
        // 烟雾颜色（深灰色半透明）
        const smokeColor = new Color(30, 30, 40, 100);
        graphics.fillColor = smokeColor;

        // 绘制几处烟雾（使用圆形组合来模拟椭圆）
        // 烟雾1
        const smoke1X = x + cellSize * 3;
        const smoke1Y = y + cellSize * 5;
        const smoke1Radius = cellSize * 0.6;
        graphics.circle(smoke1X, smoke1Y, smoke1Radius);
        graphics.fill();
        graphics.circle(smoke1X + cellSize * 0.3, smoke1Y, smoke1Radius * 0.8);
        graphics.fill();

        // 烟雾2
        const smoke2X = x + width * 0.4;
        const smoke2Y = y + cellSize * 6;
        const smoke2Radius = cellSize * 0.75;
        graphics.circle(smoke2X, smoke2Y, smoke2Radius);
        graphics.fill();
        graphics.circle(smoke2X + cellSize * 0.4, smoke2Y, smoke2Radius * 0.7);
        graphics.fill();
        graphics.circle(smoke2X + cellSize * 0.2, smoke2Y - cellSize * 0.2, smoke2Radius * 0.6);
        graphics.fill();

        // 烟雾3
        const smoke3X = x + width * 0.7;
        const smoke3Y = y + cellSize * 4.5;
        const smoke3Radius = cellSize * 0.5;
        graphics.circle(smoke3X, smoke3Y, smoke3Radius);
        graphics.fill();
        graphics.circle(smoke3X + cellSize * 0.25, smoke3Y, smoke3Radius * 0.7);
        graphics.fill();
    }

    /**
     * 绘制地面纹理和破损效果
     */
    private static renderGroundTexture(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const cellSize = UiConfig.CELL_SIZE;
        
        // 地面纹理颜色（深色，低透明度）
        const groundColor = new Color(15, 12, 20, 120);
        graphics.strokeColor = groundColor;
        graphics.lineWidth = 1;

        // 绘制地面裂纹和纹理线条
        // 裂纹1
        graphics.moveTo(x + cellSize * 2, y + cellSize * 1);
        graphics.lineTo(x + cellSize * 3.5, y + cellSize * 2);
        graphics.lineTo(x + cellSize * 5, y + cellSize * 1.5);
        graphics.stroke();

        // 裂纹2
        graphics.moveTo(x + width * 0.3, y + cellSize * 0.5);
        graphics.lineTo(x + width * 0.35, y + cellSize * 1.5);
        graphics.stroke();

        // 裂纹3
        graphics.moveTo(x + width * 0.6, y + cellSize * 2);
        graphics.lineTo(x + width * 0.65, y + cellSize * 3);
        graphics.lineTo(x + width * 0.7, y + cellSize * 2.5);
        graphics.stroke();

        // 绘制地面污渍（小圆点）
        graphics.fillColor = new Color(20, 15, 25, 100);
        const stainRadius = 8;
        
        // 污渍1
        graphics.circle(x + cellSize * 1.5, y + cellSize * 0.8, stainRadius);
        graphics.fill();

        // 污渍2
        graphics.circle(x + width * 0.25, y + cellSize * 1.2, stainRadius);
        graphics.fill();

        // 污渍3
        graphics.circle(x + width * 0.55, y + cellSize * 0.6, stainRadius);
        graphics.fill();

        // 污渍4
        graphics.circle(x + width * 0.8, y + cellSize * 1.8, stainRadius);
        graphics.fill();
    }
}

