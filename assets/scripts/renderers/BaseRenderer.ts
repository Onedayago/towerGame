import { Graphics, Color } from 'cc';
import { CyberpunkColors } from '../constants/Index';
import { UiLineConfig, UiBorderConfig } from '../config/Index';
import { DrawHelper } from '../utils/Index';

/**
 * 基地渲染器
 * 负责绘制我方基地的外观
 * 赛博朋克风格：参考武器细节，增加多层阴影、装甲板、铆钉、观察窗等细节
 */
export class BaseRenderer {
    // 基地颜色配置
    private static readonly BASE_DARK = new Color(10, 15, 25, 255); // 深色金属主体
    private static readonly BASE_METAL = new Color(30, 40, 55, 255); // 金属色
    private static readonly BASE_HIGHLIGHT = new Color(50, 70, 90, 255); // 金属高光
    private static readonly NEON_CYAN = CyberpunkColors.NEON_CYAN; // 霓虹青色
    private static readonly NEON_BLUE = CyberpunkColors.NEON_BLUE; // 霓虹蓝色
    private static readonly NEON_PINK = CyberpunkColors.NEON_PINK; // 霓虹粉色（装饰）
    
    /**
     * 绘制基地
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;
        
        graphics.clear();
        
        // 设置绘制区域限制，确保不超出边界
        const padding = 3;
        const drawWidth = width - padding * 2;
        const drawHeight = height - padding * 2;
        
        // === 1. 多层阴影（增强厚重感）===
        this.drawShadowLayers(graphics, drawWidth, drawHeight, padding);
        
        // === 2. 基地主体（深色金属质感 + 装甲板）===
        this.drawBaseBody(graphics, drawWidth, drawHeight, padding);
        
        // === 3. 装甲板结构（分段装甲）===
        this.drawArmorPlates(graphics, drawWidth, drawHeight, padding);
        
        // === 4. 铆钉和螺栓（结构细节）===
        this.drawRivets(graphics, drawWidth, drawHeight, padding);
        
        // === 5. 观察窗/显示屏（科技感）===
        this.drawObservationWindows(graphics, drawWidth, drawHeight, padding);
        
        // === 6. 内部网格和科技线条 ===
        this.drawTechPatterns(graphics, drawWidth, drawHeight, padding);
        
        // === 7. 霓虹发光边框（多层叠加）===
        this.drawNeonBorders(graphics, drawWidth, drawHeight, padding);
        
        // === 8. 能量核心和流动效果 ===
        this.drawEnergyEffects(graphics, drawWidth, drawHeight, padding);
        
    
    }
    
    /**
     * 绘制多层阴影
     */
    private static drawShadowLayers(graphics: Graphics, width: number, height: number, padding: number): void {
        // 第一层阴影（最深）
        graphics.fillColor = new Color(0, 0, 0, 102); // rgba(0, 0, 0, 0.4)
        graphics.rect(padding, padding + 5, width, height);
        graphics.fill();
        
        // 第二层阴影（中等）
        graphics.fillColor = new Color(0, 0, 0, 64); // rgba(0, 0, 0, 0.25)
        graphics.rect(padding + 2, padding + 7, width - 4, height - 4);
        graphics.fill();
        
        // 第三层阴影（浅）
        graphics.fillColor = new Color(0, 0, 0, 26); // rgba(0, 0, 0, 0.1)
        graphics.rect(padding + 4, padding + 9, width - 8, height - 8);
        graphics.fill();
    }
    
    /**
     * 绘制基地主体（深色金属质感）
     */
    private static drawBaseBody(graphics: Graphics, width: number, height: number, padding: number): void {
        // 绘制主体（深色金属）
        graphics.fillColor = this.BASE_DARK;
        graphics.rect(padding, padding, width, height);
        graphics.fill();
        
        // 绘制金属质感（渐变）
        const metalGradientSteps = 10;
        for (let i = 0; i < metalGradientSteps; i++) {
            const ratio = i / metalGradientSteps;
            const r = Math.floor(this.BASE_DARK.r + (this.BASE_METAL.r - this.BASE_DARK.r) * ratio);
            const g = Math.floor(this.BASE_DARK.g + (this.BASE_METAL.g - this.BASE_DARK.g) * ratio);
            const b = Math.floor(this.BASE_DARK.b + (this.BASE_METAL.b - this.BASE_DARK.b) * ratio);
            
            graphics.fillColor = new Color(r, g, b, 255);
            const y = padding + height * (1 - ratio * 0.7);
            graphics.rect(padding, y, width, height * 0.08);
            graphics.fill();
        }
        
        // 绘制顶部高光（金属反射效果）
        graphics.fillColor = new Color(this.BASE_HIGHLIGHT.r, this.BASE_HIGHLIGHT.g, this.BASE_HIGHLIGHT.b, 200);
        graphics.rect(padding, padding + height * 0.7, width, height * 0.3);
        graphics.fill();
        
        // 绘制底部阴影
        graphics.fillColor = new Color(5, 8, 12, 220);
        graphics.rect(padding, padding, width, height * 0.2);
        graphics.fill();
    }
    
    /**
     * 绘制装甲板结构（分段装甲）
     */
    private static drawArmorPlates(graphics: Graphics, width: number, height: number, padding: number): void {
        // 外层装甲边框
        graphics.strokeColor = new Color(100, 116, 139, 255); // #64748b
        graphics.lineWidth = 3;
        graphics.rect(padding, padding, width, height);
        graphics.stroke();
        
        // 内层装甲板（分段）
        const plateCount = 4;
        const plateHeight = height / plateCount;
        
        for (let i = 0; i < plateCount; i++) {
            const plateY = padding + plateHeight * i;
            const plateWidth = width * (0.9 - i * 0.05); // 每层稍微窄一点
            const plateX = padding + (width - plateWidth) / 2;
            
            // 装甲板主体
            graphics.fillColor = new Color(30, 41, 59, 204); // rgba(30, 41, 59, 0.8)
            graphics.rect(plateX, plateY, plateWidth, plateHeight * 0.9);
            graphics.fill();
            
            // 装甲板边框
            graphics.strokeColor = new Color(51, 65, 85, 179); // rgba(51, 65, 85, 0.7)
            graphics.lineWidth = 2;
            graphics.rect(plateX, plateY, plateWidth, plateHeight * 0.9);
            graphics.stroke();
            
            // 装甲板分段线（垂直）
            const segmentCount = 3;
            for (let j = 1; j < segmentCount; j++) {
                const segmentX = plateX + (plateWidth / segmentCount) * j;
                graphics.strokeColor = new Color(15, 23, 42, 153); // rgba(15, 23, 42, 0.6)
                graphics.lineWidth = 1.5;
                graphics.moveTo(segmentX, plateY);
                graphics.lineTo(segmentX, plateY + plateHeight * 0.9);
                graphics.stroke();
            }
        }
    }
    
    /**
     * 绘制铆钉和螺栓
     */
    private static drawRivets(graphics: Graphics, width: number, height: number, padding: number): void {
        const rivetRadius = Math.min(width, height) * 0.04;
        const rivetDist = Math.min(width, height) * 0.4;
        
        // 外圈铆钉（12个）
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            const centerX = padding + width * 0.5;
            const centerY = padding + height * 0.5;
            const rx = centerX + Math.cos(angle) * rivetDist;
            const ry = centerY + Math.sin(angle) * rivetDist;
            
            // 铆钉阴影
            graphics.fillColor = new Color(0, 0, 0, 102); // rgba(0, 0, 0, 0.4)
            graphics.circle(rx + 1, ry + 1, rivetRadius);
            graphics.fill();
            
            // 铆钉主体（金属渐变模拟）
            graphics.fillColor = new Color(148, 163, 184, 255); // #94a3b8
            graphics.circle(rx, ry, rivetRadius);
            graphics.fill();
            
            // 铆钉边框
            graphics.strokeColor = new Color(51, 65, 85, 204); // rgba(51, 65, 85, 0.8)
            graphics.lineWidth = 1;
            graphics.circle(rx, ry, rivetRadius);
            graphics.stroke();
            
            // 铆钉高光点
            graphics.fillColor = new Color(255, 255, 255, 179); // rgba(255, 255, 255, 0.7)
            graphics.circle(rx - rivetRadius * 0.3, ry - rivetRadius * 0.3, rivetRadius * 0.3);
            graphics.fill();
        }
        
        // 内圈铆钉（8个）
        const innerRivetDist = rivetDist * 0.5;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const centerX = padding + width * 0.5;
            const centerY = padding + height * 0.5;
            const rx = centerX + Math.cos(angle) * innerRivetDist;
            const ry = centerY + Math.sin(angle) * innerRivetDist;
            
            graphics.fillColor = new Color(100, 116, 139, 204); // rgba(100, 116, 139, 0.8)
            graphics.circle(rx, ry, rivetRadius * 0.7);
            graphics.fill();
            
            graphics.strokeColor = new Color(51, 65, 85, 153); // rgba(51, 65, 85, 0.6)
            graphics.lineWidth = 1;
            graphics.circle(rx, ry, rivetRadius * 0.7);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制观察窗/显示屏
     */
    private static drawObservationWindows(graphics: Graphics, width: number, height: number, padding: number): void {
        const windowWidth = width * 0.25;
        const windowHeight = height * 0.15;
        const windowCount = 3;
        
        for (let i = 0; i < windowCount; i++) {
            const windowX = padding + width * 0.5 - windowWidth / 2;
            const windowY = padding + height * (0.25 + i * 0.25);
            
            // 窗口主体（青色发光）
            graphics.fillColor = new Color(6, 182, 212, 255); // #06b6d4
            graphics.rect(windowX, windowY, windowWidth, windowHeight);
            graphics.fill();
            
            // 窗口边框
            graphics.strokeColor = new Color(34, 211, 238, 255); // #22d3ee
            graphics.lineWidth = 2;
            graphics.rect(windowX, windowY, windowWidth, windowHeight);
            graphics.stroke();
            
            // 内部扫描线（科技感）
            graphics.strokeColor = new Color(34, 211, 238, 128); // rgba(34, 211, 238, 0.5)
            graphics.lineWidth = 1;
            for (let j = 1; j < 3; j++) {
                const lineY = windowY + (windowHeight / 3) * j;
                graphics.moveTo(windowX + windowWidth * 0.1, lineY);
                graphics.lineTo(windowX + windowWidth * 0.9, lineY);
                graphics.stroke();
            }
            
            // 内部反光点
            graphics.fillColor = new Color(255, 255, 255, 179); // rgba(255, 255, 255, 0.7)
            graphics.circle(windowX + windowWidth * 0.2, windowY + windowHeight * 0.3, windowWidth * 0.08);
            graphics.fill();
        }
    }
    
    /**
     * 绘制内部网格和科技线条
     */
    private static drawTechPatterns(graphics: Graphics, width: number, height: number, padding: number): void {
        const gridColor = new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 50);
        const lineColor = new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 100);
        
        // 绘制内部网格（更密集）
        // 垂直线
        for (let i = 1; i < 5; i++) {
            const x = padding + (width / 5) * i;
            DrawHelper.drawVerticalLine(
                graphics,
                x,
                padding + height * 0.15,
                padding + height * 0.85,
                gridColor,
                UiLineConfig.THIN_LINE_WIDTH
            );
        }
        
        // 水平线
        for (let i = 1; i < 5; i++) {
            const y = padding + (height / 5) * i;
            DrawHelper.drawHorizontalLine(
                graphics,
                padding + width * 0.15,
                y,
                padding + width * 0.85,
                gridColor,
                UiLineConfig.THIN_LINE_WIDTH
            );
        }
        
        // 绘制中心十字线（更亮）
        const centerX = padding + width * 0.5;
        const centerY = padding + height * 0.5;
        
        DrawHelper.drawHorizontalLine(
            graphics,
            padding + width * 0.2,
            centerY,
            padding + width * 0.8,
            lineColor,
            UiLineConfig.MEDIUM_LINE_WIDTH
        );
        
        DrawHelper.drawVerticalLine(
            graphics,
            centerX,
            padding + height * 0.2,
            padding + height * 0.8,
            lineColor,
            UiLineConfig.MEDIUM_LINE_WIDTH
        );
        
        // 绘制四个角的连接线（科技感）
        const cornerLineColor = new Color(this.NEON_BLUE.r, this.NEON_BLUE.g, this.NEON_BLUE.b, 120);
        const cornerOffset = 10;
        
        // 左上角到中心
        graphics.strokeColor = cornerLineColor;
        graphics.lineWidth = UiLineConfig.THIN_LINE_WIDTH;
        graphics.moveTo(padding + cornerOffset, padding + height - cornerOffset);
        graphics.lineTo(centerX - 8, centerY);
        graphics.stroke();
        
        // 右上角到中心
        graphics.moveTo(padding + width - cornerOffset, padding + height - cornerOffset);
        graphics.lineTo(centerX + 8, centerY);
        graphics.stroke();
        
        // 左下角到中心
        graphics.moveTo(padding + cornerOffset, padding + cornerOffset);
        graphics.lineTo(centerX - 8, centerY);
        graphics.stroke();
        
        // 右下角到中心
        graphics.moveTo(padding + width - cornerOffset, padding + cornerOffset);
        graphics.lineTo(centerX + 8, centerY);
        graphics.stroke();
    }
    
    /**
     * 绘制霓虹发光边框（多层叠加，强烈发光效果）
     */
    private static drawNeonBorders(graphics: Graphics, width: number, height: number, padding: number): void {
        // 外层发光（最宽，最透明）
        DrawHelper.drawRectBorder(
            graphics,
            padding - 3, padding - 3,
            width + 6, height + 6,
            new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 50),
            UiBorderConfig.THICK_BORDER_WIDTH + 4
        );
        
        // 中层发光（中等宽度，中等透明度）
        DrawHelper.drawRectBorder(
            graphics,
            padding - 2, padding - 2,
            width + 4, height + 4,
            new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 80),
            UiBorderConfig.THICK_BORDER_WIDTH + 3
        );
        
        // 主边框（正常宽度，正常透明度）
        DrawHelper.drawRectBorder(
            graphics,
            padding, padding,
            width, height,
            new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 255),
            UiBorderConfig.THICK_BORDER_WIDTH
        );
        
        // 内层边框（高光，白色半透明）
        const innerPadding = padding + 3;
        DrawHelper.drawRectBorder(
            graphics,
            innerPadding, innerPadding,
            width - 6, height - 6,
            new Color(255, 255, 255, 100),
            UiBorderConfig.DEFAULT_BORDER_WIDTH
        );
        
        // 四个角的装饰（霓虹点，更大）
        const cornerSize = 6;
        const cornerColor = new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 220);
        
        // 左上角
        DrawHelper.drawSquare(
            graphics,
            padding + cornerSize,
            padding + height - cornerSize,
            cornerSize * 2,
            cornerColor
        );
        
        // 右上角
        DrawHelper.drawSquare(
            graphics,
            padding + width - cornerSize,
            padding + height - cornerSize,
            cornerSize * 2,
            cornerColor
        );
        
        // 左下角
        DrawHelper.drawSquare(
            graphics,
            padding + cornerSize,
            padding + cornerSize,
            cornerSize * 2,
            cornerColor
        );
        
        // 右下角
        DrawHelper.drawSquare(
            graphics,
            padding + width - cornerSize,
            padding + cornerSize,
            cornerSize * 2,
            cornerColor
        );
    }
    
    /**
     * 绘制能量核心和流动效果
     */
    private static drawEnergyEffects(graphics: Graphics, width: number, height: number, padding: number): void {
        const energyColor = new Color(this.NEON_PINK.r, this.NEON_PINK.g, this.NEON_PINK.b, 140);
        const centerX = padding + width * 0.5;
        const centerY = padding + height * 0.5;
        
        // 绘制中心能量核心（多层脉冲效果）
        const coreRadius = Math.min(width, height) * 0.12;
        
        // 最外层光晕
        graphics.fillColor = new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 80);
        graphics.circle(centerX, centerY, coreRadius * 2.5);
        graphics.fill();
        
        // 外层发光环
        graphics.fillColor = new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 120);
        graphics.circle(centerX, centerY, coreRadius * 1.8);
        graphics.fill();
        
        // 核心主体
        graphics.fillColor = new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 200);
        graphics.circle(centerX, centerY, coreRadius);
        graphics.fill();
        
        // 核心边框（强发光）
        graphics.strokeColor = new Color(this.NEON_CYAN.r, this.NEON_CYAN.g, this.NEON_CYAN.b, 255);
        graphics.lineWidth = UiLineConfig.MEDIUM_LINE_WIDTH;
        graphics.circle(centerX, centerY, coreRadius);
        graphics.stroke();
        
        // 核心内部装饰环
        graphics.strokeColor = new Color(255, 255, 255, 179); // rgba(255, 255, 255, 0.7)
        graphics.lineWidth = 1.5;
        graphics.circle(centerX, centerY, coreRadius * 0.6);
        graphics.stroke();
        
        // 绘制能量流动线条（从中心向八个方向）
        const flowLength = Math.min(width, height) * 0.35;
        const directions = 8;
        
        for (let i = 0; i < directions; i++) {
            const angle = (Math.PI * 2 / directions) * i;
            const endX = centerX + Math.cos(angle) * flowLength;
            const endY = centerY + Math.sin(angle) * flowLength;
            
            graphics.strokeColor = energyColor;
            graphics.lineWidth = UiLineConfig.THIN_LINE_WIDTH;
            graphics.moveTo(centerX, centerY);
            graphics.lineTo(endX, endY);
            graphics.stroke();
            
            // 能量节点（在线条末端）
            const nodeSize = 4;
            const nodeColor = new Color(this.NEON_PINK.r, this.NEON_PINK.g, this.NEON_PINK.b, 200);
            DrawHelper.drawSquare(graphics, endX, endY, nodeSize, nodeColor);
        }
    }
    
   
}
