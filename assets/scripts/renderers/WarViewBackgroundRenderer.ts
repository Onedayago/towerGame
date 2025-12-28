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
        
        // 6. 绘制能量波纹效果
        this.renderEnergyWaves(graphics, x, y, width, height);
    }
    
    /**
     * 绘制能量波纹效果（新增，注意 y 轴向上）
     */
    private static renderEnergyWaves(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const cellSize = UiConfig.CELL_SIZE;
        
        // 绘制能量波纹线条（多层同心圆）
        // 波纹1（左侧，中上部区域，y 值大表示位置高）
        const wave1X = x + width * 0.12;
        const wave1Y = y + height * 0.75; // 顶部区域
        const wave1Radius = cellSize * 1.2;
        // 使用多个圆弧来模拟波纹
        for (let i = 0; i < 3; i++) {
            graphics.strokeColor = new Color(0, 255, 255, 30 - i * 8);
            graphics.lineWidth = 1.5 - i * 0.3;
            graphics.circle(wave1X, wave1Y, wave1Radius + i * cellSize * 0.4);
            graphics.stroke();
        }
        
        // 波纹2（右侧，上部区域）
        const wave2X = x + width * 0.85;
        const wave2Y = y + height * 0.65; // 中上部
        for (let i = 0; i < 3; i++) {
            graphics.strokeColor = new Color(138, 43, 226, 30 - i * 8);
            graphics.lineWidth = 1.5 - i * 0.3;
            graphics.circle(wave2X, wave2Y, wave1Radius + i * cellSize * 0.4);
            graphics.stroke();
        }
        
        // 波纹3（中间，顶部区域）
        const wave3X = x + width * 0.5;
        const wave3Y = y + height * 0.85; // 顶部
        for (let i = 0; i < 2; i++) {
            graphics.strokeColor = new Color(0, 191, 255, 25 - i * 8);
            graphics.lineWidth = 1.2 - i * 0.3;
            graphics.circle(wave3X, wave3Y, wave1Radius * 0.8 + i * cellSize * 0.3);
            graphics.stroke();
        }
    }

    /**
     * 绘制渐变背景（增强版：多色渐变）
     */
    private static renderGradientBackground(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        // 从深蓝紫色渐变到深黑色，中间加入紫色和蓝色调
        const bgStart = { r: 15, g: 5, b: 30, a: 1.0 }; // 深蓝紫色
        const bgMid1 = { r: 10, g: 8, b: 35, a: 1.0 };  // 中间紫色
        const bgMid2 = { r: 8, g: 5, b: 20, a: 1.0 };   // 中间深紫
        const bgEnd = { r: 5, g: 5, b: 12, a: 1.0 };    // 深黑色
        
        const steps = 60;
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            let color: Color;
            
            // 注意：y 轴向上，i=0 是底部，i=steps-1 是顶部
            // ratio=0 对应底部（bgStart），ratio=1 对应顶部（bgEnd）
            if (ratio < 0.33) {
                // 底部1/3：从深蓝紫色到中间紫色
                const localRatio = ratio / 0.33;
                color = CyberpunkColors.createGradientColor(bgStart, bgMid1, localRatio);
            } else if (ratio < 0.66) {
                // 中间1/3：从中间紫色到中间深紫
                const localRatio = (ratio - 0.33) / 0.33;
                color = CyberpunkColors.createGradientColor(bgMid1, bgMid2, localRatio);
            } else {
                // 顶部1/3：从中间深紫到深黑色
                const localRatio = (ratio - 0.66) / 0.34;
                color = CyberpunkColors.createGradientColor(bgMid2, bgEnd, localRatio);
            }
            
            // y 轴向上：从底部 y 开始，向上绘制
            const stepHeight = height / steps;
            graphics.fillColor = color;
            graphics.rect(x, y + i * stepHeight, width, stepHeight + 1);
            graphics.fill();
        }
    }

    /**
     * 绘制废墟建筑轮廓（增强版：带发光边框）
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
        const ruinColor = new Color(25, 18, 35, 200);
        graphics.fillColor = ruinColor;
        graphics.strokeColor = new Color(60, 50, 80, 180);
        graphics.lineWidth = 2;

        // 左侧建筑1（破损的矩形）
        const ruin1X = x + cellSize * 2;
        const ruin1Y = y + cellSize * 2;
        const ruin1Width = cellSize * 1.5;
        const ruin1Height = cellSize * 3;
        graphics.rect(ruin1X, ruin1Y, ruin1Width, ruin1Height);
        graphics.fill();
        graphics.stroke();
        
        // 建筑1的发光边框
        graphics.strokeColor = new Color(100, 80, 150, 100);
        graphics.lineWidth = 1;
        graphics.rect(ruin1X - 1, ruin1Y - 1, ruin1Width + 2, ruin1Height + 2);
        graphics.stroke();

        // 左侧建筑2（不规则的破损形状）
        const ruin2X = x + cellSize * 4;
        const ruin2Y = y + cellSize * 1;
        const ruin2Width = cellSize * 2;
        const ruin2Height = cellSize * 4;
        graphics.fillColor = ruinColor;
        graphics.strokeColor = new Color(60, 50, 80, 180);
        graphics.lineWidth = 2;
        graphics.rect(ruin2X, ruin2Y, ruin2Width, ruin2Height);
        graphics.fill();
        graphics.stroke();
        
        // 建筑2的发光边框
        graphics.strokeColor = new Color(100, 80, 150, 100);
        graphics.lineWidth = 1;
        graphics.rect(ruin2X - 1, ruin2Y - 1, ruin2Width + 2, ruin2Height + 2);
        graphics.stroke();

        // 中间区域破损建筑（位置调整以适应宽度）
        const ruin3X = x + width * 0.25;
        const ruin3Y = y + cellSize * 0.5;
        const ruin3Width = cellSize * 1.8;
        const ruin3Height = cellSize * 2.5;
        graphics.fillColor = ruinColor;
        graphics.strokeColor = new Color(60, 50, 80, 180);
        graphics.lineWidth = 2;
        graphics.rect(ruin3X, ruin3Y, ruin3Width, ruin3Height);
        graphics.fill();
        graphics.stroke();
        
        // 建筑3的发光边框
        graphics.strokeColor = new Color(100, 80, 150, 100);
        graphics.lineWidth = 1;
        graphics.rect(ruin3X - 1, ruin3Y - 1, ruin3Width + 2, ruin3Height + 2);
        graphics.stroke();

        // 右侧区域破损建筑（分散到更宽的区域）
        const ruin4X = x + width * 0.55;
        const ruin4Y = y + cellSize * 1.5;
        const ruin4Width = cellSize * 2.2;
        const ruin4Height = cellSize * 3.5;
        
        // 右侧额外建筑5（更右侧）
        const ruin5X = x + width * 0.75;
        const ruin5Y = y + cellSize * 0.8;
        const ruin5Width = cellSize * 1.6;
        const ruin5Height = cellSize * 2.8;
        graphics.fillColor = ruinColor;
        graphics.strokeColor = new Color(60, 50, 80, 180);
        graphics.lineWidth = 2;
        graphics.rect(ruin5X, ruin5Y, ruin5Width, ruin5Height);
        graphics.fill();
        graphics.stroke();
        // 建筑5的发光边框
        graphics.strokeColor = new Color(100, 80, 150, 100);
        graphics.lineWidth = 1;
        graphics.rect(ruin5X - 1, ruin5Y - 1, ruin5Width + 2, ruin5Height + 2);
        graphics.stroke();
        graphics.fillColor = ruinColor;
        graphics.strokeColor = new Color(60, 50, 80, 180);
        graphics.lineWidth = 2;
        graphics.rect(ruin4X, ruin4Y, ruin4Width, ruin4Height);
        graphics.fill();
        graphics.stroke();
        
        // 建筑4的发光边框
        graphics.strokeColor = new Color(100, 80, 150, 100);
        graphics.lineWidth = 1;
        graphics.rect(ruin4X - 1, ruin4Y - 1, ruin4Width + 2, ruin4Height + 2);
        graphics.stroke();

        // 绘制破损线条（表示建筑被破坏，带发光效果）
        graphics.strokeColor = new Color(40, 30, 55, 220);
        graphics.lineWidth = 2;
        
        // 破损线条1
        graphics.moveTo(ruin1X + ruin1Width * 0.3, ruin1Y);
        graphics.lineTo(ruin1X + ruin1Width * 0.3, ruin1Y + ruin1Height);
        graphics.stroke();
        
        // 破损线条1的发光
        graphics.strokeColor = new Color(80, 60, 120, 100);
        graphics.lineWidth = 1;
        graphics.moveTo(ruin1X + ruin1Width * 0.3 - 1, ruin1Y);
        graphics.lineTo(ruin1X + ruin1Width * 0.3 - 1, ruin1Y + ruin1Height);
        graphics.stroke();

        // 破损线条2
        graphics.strokeColor = new Color(40, 30, 55, 220);
        graphics.lineWidth = 2;
        graphics.moveTo(ruin2X, ruin2Y + ruin2Height * 0.6);
        graphics.lineTo(ruin2X + ruin2Width, ruin2Y + ruin2Height * 0.6);
        graphics.stroke();
        
        // 破损线条2的发光
        graphics.strokeColor = new Color(80, 60, 120, 100);
        graphics.lineWidth = 1;
        graphics.moveTo(ruin2X, ruin2Y + ruin2Height * 0.6 - 1);
        graphics.lineTo(ruin2X + ruin2Width, ruin2Y + ruin2Height * 0.6 - 1);
        graphics.stroke();
    }

    /**
     * 绘制霓虹灯效果（增强版：多层发光）
     */
    private static renderNeonLights(
        graphics: Graphics,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const cellSize = UiConfig.CELL_SIZE;
        
        // 霓虹灯颜色（多层发光效果）
        const neonCyan = CyberpunkColors.NEON_CYAN;
        const neonPink = CyberpunkColors.NEON_PINK;
        const neonPurple = CyberpunkColors.NEON_PURPLE;
        const neonBlue = CyberpunkColors.NEON_BLUE;
        const neonGreen = CyberpunkColors.NEON_GREEN;

        // === 左侧霓虹灯线条（青色，中上部区域）===
        // 注意：y 轴向上，使用高度百分比更准确
        const neon1X = x + cellSize * 1.5;
        const neon1Y = y + height * 0.65; // 65% 位置（中上部）
        // 外层发光
        graphics.strokeColor = new Color(neonCyan.r, neonCyan.g, neonCyan.b, 40);
        graphics.lineWidth = 5;
        graphics.moveTo(neon1X, neon1Y);
        graphics.lineTo(neon1X + cellSize * 2, neon1Y);
        graphics.stroke();
        // 内层发光
        graphics.strokeColor = new Color(neonCyan.r, neonCyan.g, neonCyan.b, 150);
        graphics.lineWidth = 3;
        graphics.moveTo(neon1X, neon1Y);
        graphics.lineTo(neon1X + cellSize * 2, neon1Y);
        graphics.stroke();
        // 核心线条
        graphics.strokeColor = new Color(neonCyan.r, neonCyan.g, neonCyan.b, 255);
        graphics.lineWidth = 2;
        graphics.moveTo(neon1X, neon1Y);
        graphics.lineTo(neon1X + cellSize * 2, neon1Y);
        graphics.stroke();
        
        // 霓虹灯点（带多层发光）
        const dotRadius = 4;
        // 外层光晕
        graphics.fillColor = new Color(neonCyan.r, neonCyan.g, neonCyan.b, 80);
        graphics.circle(neon1X + cellSize, neon1Y, dotRadius * 2);
        graphics.fill();
        // 内层光晕
        graphics.fillColor = new Color(neonCyan.r, neonCyan.g, neonCyan.b, 150);
        graphics.circle(neon1X + cellSize, neon1Y, dotRadius * 1.3);
        graphics.fill();
        // 核心点
        graphics.fillColor = new Color(neonCyan.r, neonCyan.g, neonCyan.b, 255);
        graphics.circle(neon1X + cellSize, neon1Y, dotRadius);
        graphics.fill();

        // === 中间霓虹灯线条（粉色，上部区域）===
        const neon2X = x + width * 0.35;
        const neon2Y = y + height * 0.75; // 75% 位置（上部）
        // 外层发光
        graphics.strokeColor = new Color(neonPink.r, neonPink.g, neonPink.b, 50);
        graphics.lineWidth = 6;
        graphics.moveTo(neon2X, neon2Y);
        graphics.lineTo(neon2X + cellSize * 1.5, neon2Y);
        graphics.stroke();
        // 内层发光
        graphics.strokeColor = new Color(neonPink.r, neonPink.g, neonPink.b, 140);
        graphics.lineWidth = 3.5;
        graphics.moveTo(neon2X, neon2Y);
        graphics.lineTo(neon2X + cellSize * 1.5, neon2Y);
        graphics.stroke();
        // 核心线条
        graphics.strokeColor = new Color(neonPink.r, neonPink.g, neonPink.b, 255);
        graphics.lineWidth = 2;
        graphics.moveTo(neon2X, neon2Y);
        graphics.lineTo(neon2X + cellSize * 1.5, neon2Y);
        graphics.stroke();
        
        // 霓虹灯点
        graphics.fillColor = new Color(neonPink.r, neonPink.g, neonPink.b, 80);
        graphics.circle(neon2X + cellSize * 0.75, neon2Y, dotRadius * 2);
        graphics.fill();
        graphics.fillColor = new Color(neonPink.r, neonPink.g, neonPink.b, 150);
        graphics.circle(neon2X + cellSize * 0.75, neon2Y, dotRadius * 1.3);
        graphics.fill();
        graphics.fillColor = new Color(neonPink.r, neonPink.g, neonPink.b, 255);
        graphics.circle(neon2X + cellSize * 0.75, neon2Y, dotRadius);
        graphics.fill();

        // === 右侧霓虹灯线条（紫色，上部区域）===
        const neon3X = x + width * 0.65;
        const neon3Y = y + height * 0.8; // 80% 位置（上部）
        // 外层发光
        graphics.strokeColor = new Color(neonPurple.r, neonPurple.g, neonPurple.b, 45);
        graphics.lineWidth = 5;
        graphics.moveTo(neon3X, neon3Y);
        graphics.lineTo(neon3X + cellSize * 2, neon3Y);
        graphics.stroke();
        // 内层发光
        graphics.strokeColor = new Color(neonPurple.r, neonPurple.g, neonPurple.b, 130);
        graphics.lineWidth = 3;
        graphics.moveTo(neon3X, neon3Y);
        graphics.lineTo(neon3X + cellSize * 2, neon3Y);
        graphics.stroke();
        // 核心线条
        graphics.strokeColor = new Color(neonPurple.r, neonPurple.g, neonPurple.b, 255);
        graphics.lineWidth = 2;
        graphics.moveTo(neon3X, neon3Y);
        graphics.lineTo(neon3X + cellSize * 2, neon3Y);
        graphics.stroke();
        
        // 霓虹灯点
        graphics.fillColor = new Color(neonPurple.r, neonPurple.g, neonPurple.b, 80);
        graphics.circle(neon3X + cellSize, neon3Y, dotRadius * 2);
        graphics.fill();
        graphics.fillColor = new Color(neonPurple.r, neonPurple.g, neonPurple.b, 150);
        graphics.circle(neon3X + cellSize, neon3Y, dotRadius * 1.3);
        graphics.fill();
        graphics.fillColor = new Color(neonPurple.r, neonPurple.g, neonPurple.b, 255);
        graphics.circle(neon3X + cellSize, neon3Y, dotRadius);
        graphics.fill();
        
        // === 额外的垂直霓虹灯线条（分布在更宽的区域，注意 y 轴向上）===
        // 垂直线条1（蓝色，左侧，从下到上）
        const neon4X = x + width * 0.15;
        const neon4Y1 = y + height * 0.25; // 底部起点（25% 位置）
        const neon4Y2 = y + height * 0.8; // 顶部终点（80% 位置，y 值大，位置高）
        graphics.strokeColor = new Color(neonBlue.r, neonBlue.g, neonBlue.b, 60);
        graphics.lineWidth = 4;
        graphics.moveTo(neon4X, neon4Y1);
        graphics.lineTo(neon4X, neon4Y2);
        graphics.stroke();
        graphics.strokeColor = new Color(neonBlue.r, neonBlue.g, neonBlue.b, 180);
        graphics.lineWidth = 2;
        graphics.moveTo(neon4X, neon4Y1);
        graphics.lineTo(neon4X, neon4Y2);
        graphics.stroke();
        
        // 垂直线条2（绿色，中间偏右，从下到上）
        const neon5X = x + width * 0.45;
        const neon5Y1 = y + height * 0.3; // 底部起点（30% 位置）
        const neon5Y2 = y + height * 0.85; // 顶部终点（85% 位置，y 值大，位置高）
        graphics.strokeColor = new Color(neonGreen.r, neonGreen.g, neonGreen.b, 55);
        graphics.lineWidth = 4;
        graphics.moveTo(neon5X, neon5Y1);
        graphics.lineTo(neon5X, neon5Y2);
        graphics.stroke();
        graphics.strokeColor = new Color(neonGreen.r, neonGreen.g, neonGreen.b, 170);
        graphics.lineWidth = 2;
        graphics.moveTo(neon5X, neon5Y1);
        graphics.lineTo(neon5X, neon5Y2);
        graphics.stroke();
        
        // 垂直线条3（青色，右侧，从下到上）
        const neon6X = x + width * 0.8;
        const neon6Y1 = y + height * 0.35; // 底部起点（35% 位置）
        const neon6Y2 = y + height * 0.9; // 顶部终点（90% 位置，y 值大，位置高）
        graphics.strokeColor = new Color(neonCyan.r, neonCyan.g, neonCyan.b, 50);
        graphics.lineWidth = 3.5;
        graphics.moveTo(neon6X, neon6Y1);
        graphics.lineTo(neon6X, neon6Y2);
        graphics.stroke();
        graphics.strokeColor = new Color(neonCyan.r, neonCyan.g, neonCyan.b, 160);
        graphics.lineWidth = 2;
        graphics.moveTo(neon6X, neon6Y1);
        graphics.lineTo(neon6X, neon6Y2);
        graphics.stroke();
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
        // 注意：y 轴向上，y 值大表示位置高（顶部），y 值小表示位置低（底部）
        // 烟雾1（中上部区域）
        const smoke1X = x + cellSize * 3;
        const smoke1Y = y + height * 0.7; // 使用高度百分比，70% 位置（中上部）
        const smoke1Radius = cellSize * 0.6;
        graphics.circle(smoke1X, smoke1Y, smoke1Radius);
        graphics.fill();
        graphics.circle(smoke1X + cellSize * 0.3, smoke1Y, smoke1Radius * 0.8);
        graphics.fill();

        // 烟雾2（上部区域）
        const smoke2X = x + width * 0.42;
        const smoke2Y = y + height * 0.8; // 80% 位置（上部）
        const smoke2Radius = cellSize * 0.75;
        graphics.circle(smoke2X, smoke2Y, smoke2Radius);
        graphics.fill();
        graphics.circle(smoke2X + cellSize * 0.4, smoke2Y, smoke2Radius * 0.7);
        graphics.fill();
        graphics.circle(smoke2X + cellSize * 0.2, smoke2Y - cellSize * 0.2, smoke2Radius * 0.6);
        graphics.fill();

        // 烟雾3（中上部区域）
        const smoke3X = x + width * 0.68;
        const smoke3Y = y + height * 0.65; // 65% 位置（中上部）
        const smoke3Radius = cellSize * 0.5;
        graphics.circle(smoke3X, smoke3Y, smoke3Radius);
        graphics.fill();
        graphics.circle(smoke3X + cellSize * 0.25, smoke3Y, smoke3Radius * 0.7);
        graphics.fill();
        
        // 烟雾4（顶部区域）
        const smoke4X = x + width * 0.88;
        const smoke4Y = y + height * 0.85; // 85% 位置（顶部）
        const smoke4Radius = cellSize * 0.55;
        graphics.circle(smoke4X, smoke4Y, smoke4Radius);
        graphics.fill();
        graphics.circle(smoke4X + cellSize * 0.3, smoke4Y, smoke4Radius * 0.75);
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

        // 绘制地面裂纹和纹理线条（y 轴向上，地面在底部，y 值小）
        // 裂纹1（底部区域）
        graphics.moveTo(x + cellSize * 2, y + cellSize * 0.5); // y 值小，底部
        graphics.lineTo(x + cellSize * 3.5, y + cellSize * 1.2);
        graphics.lineTo(x + cellSize * 5, y + cellSize * 0.8);
        graphics.stroke();

        // 裂纹2（底部区域）
        graphics.moveTo(x + width * 0.25, y + cellSize * 0.3); // y 值小，底部
        graphics.lineTo(x + width * 0.28, y + cellSize * 1.2);
        graphics.stroke();

        // 裂纹3（中下部）
        graphics.moveTo(x + width * 0.5, y + cellSize * 1); // y 值小，底部
        graphics.lineTo(x + width * 0.52, y + cellSize * 2);
        graphics.lineTo(x + width * 0.54, y + cellSize * 1.5);
        graphics.stroke();
        
        // 裂纹4（右侧区域，中下部）
        graphics.moveTo(x + width * 0.7, y + cellSize * 0.8); // y 值小，底部
        graphics.lineTo(x + width * 0.72, y + cellSize * 2.2);
        graphics.stroke();
        
        // 裂纹5（最右侧，底部）
        graphics.moveTo(x + width * 0.85, y + cellSize * 0.5); // y 值小，底部
        graphics.lineTo(x + width * 0.87, y + cellSize * 1.8);
        graphics.stroke();

        // 绘制地面污渍（小圆点，y 轴向上，地面在底部，y 值小）
        graphics.fillColor = new Color(20, 15, 25, 100);
        const stainRadius = 8;
        
        // 污渍1（底部）
        graphics.circle(x + cellSize * 1.5, y + cellSize * 0.5, stainRadius); // y 值小，底部
        graphics.fill();

        // 污渍2（底部）
        graphics.circle(x + width * 0.22, y + cellSize * 0.8, stainRadius); // y 值小，底部
        graphics.fill();

        // 污渍3（底部）
        graphics.circle(x + width * 0.48, y + cellSize * 0.4, stainRadius); // y 值小，底部
        graphics.fill();

        // 污渍4（中下部）
        graphics.circle(x + width * 0.65, y + cellSize * 1.2, stainRadius); // y 值小，底部
        graphics.fill();
        
        // 污渍5（右侧区域，中下部）
        graphics.circle(x + width * 0.78, y + cellSize * 0.7, stainRadius); // y 值小，底部
        graphics.fill();
        
        // 污渍6（最右侧，中下部）
        graphics.circle(x + width * 0.92, y + cellSize * 1.5, stainRadius); // y 值小，底部
        graphics.fill();
    }
}

