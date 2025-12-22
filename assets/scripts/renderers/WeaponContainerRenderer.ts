import { Graphics, Color } from 'cc';
import { UiColors } from '../constants/Index';

/**
 * 武器容器渲染器
 * 负责武器容器的绘制逻辑
 * 参考原游戏实现，增强视觉效果
 */
export class WeaponContainerRenderer {
    /**
     * 绘制武器容器背景
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static renderBackground(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();

        // 绘制渐变背景（从深蓝灰色到更深的蓝灰色）
        const gradientSteps = UiColors.WEAPON_CONTAINER_GRADIENT_STEPS;
        const stepHeight = height / gradientSteps;

        for (let i = 0; i < gradientSteps; i++) {
            const ratio = i / (gradientSteps - 1);
            
            // 使用常量创建渐变颜色
            const color = UiColors.createGradientColor(
                UiColors.WEAPON_CONTAINER_BG_START,
                UiColors.WEAPON_CONTAINER_BG_END,
                ratio
            );
            
            const y = stepHeight * i;
            
            graphics.fillColor = color;
            graphics.rect(0, y, width, stepHeight + 1); // +1 避免间隙
            graphics.fill();
        }

        // 绘制顶部高光线（增强立体感）
        graphics.strokeColor = new Color(255, 255, 255, 40); // 白色，低透明度
        graphics.lineWidth = 1;
        graphics.moveTo(0, height - 1);
        graphics.lineTo(width, height - 1);
        graphics.stroke();

        // 绘制底部阴影线（增强立体感）
        graphics.strokeColor = new Color(0, 0, 0, 100); // 黑色，低透明度
        graphics.lineWidth = 1;
        graphics.moveTo(0, 1);
        graphics.lineTo(width, 1);
        graphics.stroke();

        // 绘制外边框（发光效果，青色，多层叠加增强发光）
        const borderColor = UiColors.WEAPON_CONTAINER_BORDER_COLOR;
        const borderWidth = UiColors.WEAPON_CONTAINER_BORDER_WIDTH;
        
        // 外层发光（更透明，更宽）
        graphics.strokeColor = new Color(borderColor.r, borderColor.g, borderColor.b, 80);
        graphics.lineWidth = borderWidth + 2;
        graphics.rect(0, 0, width, height);
        graphics.stroke();
        
        // 中层边框（中等透明度）
        graphics.strokeColor = new Color(borderColor.r, borderColor.g, borderColor.b, 120);
        graphics.lineWidth = borderWidth + 1;
        graphics.rect(0, 0, width, height);
        graphics.stroke();
        
        // 内层边框（主边框，正常透明度）
        graphics.strokeColor = borderColor;
        graphics.lineWidth = borderWidth;
        graphics.rect(0, 0, width, height);
        graphics.stroke();

        // 绘制内边框（高光，白色半透明）
        graphics.strokeColor = UiColors.WEAPON_CONTAINER_INNER_BORDER_COLOR;
        graphics.lineWidth = UiColors.WEAPON_CONTAINER_INNER_BORDER_WIDTH;
        const innerPadding = 2;
        graphics.rect(innerPadding, innerPadding, width - innerPadding * 2, height - innerPadding * 2);
        graphics.stroke();

        // 绘制内部装饰线条（左右两侧的垂直装饰线）
        const decorationColor = new Color(borderColor.r, borderColor.g, borderColor.b, 60);
        graphics.strokeColor = decorationColor;
        graphics.lineWidth = 1;
        
        // 左侧装饰线
        const leftLineX = 8;
        graphics.moveTo(leftLineX, 6);
        graphics.lineTo(leftLineX, height - 6);
        graphics.stroke();
        
        // 右侧装饰线
        const rightLineX = width - 8;
        graphics.moveTo(rightLineX, 6);
        graphics.lineTo(rightLineX, height - 6);
        graphics.stroke();
    }
}

