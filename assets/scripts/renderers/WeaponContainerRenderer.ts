import { Graphics } from 'cc';
import { UiColors } from '../constants/Index';

/**
 * 武器容器渲染器
 * 负责武器容器的绘制逻辑
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
            graphics.rect(0, y, width, stepHeight + 1);
            graphics.fill();
        }

        // 绘制外边框（发光效果，青色）
        graphics.strokeColor = UiColors.WEAPON_CONTAINER_BORDER_COLOR;
        graphics.lineWidth = UiColors.WEAPON_CONTAINER_BORDER_WIDTH;
        graphics.rect(0, 0, width, height);
        graphics.stroke();

        // 绘制内边框（高光，白色半透明）
        graphics.strokeColor = UiColors.WEAPON_CONTAINER_INNER_BORDER_COLOR;
        graphics.lineWidth = UiColors.WEAPON_CONTAINER_INNER_BORDER_WIDTH;
        graphics.rect(1, 1, width - 2, height - 2);
        graphics.stroke();
    }
}

