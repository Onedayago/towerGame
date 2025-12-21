import { Graphics, UITransform } from 'cc';
import { UiColors } from '../constants/Index';

/**
 * 开始界面渲染器
 * 负责开始界面的绘制逻辑
 */
export class StartScreenRenderer {
    /**
     * 绘制开始界面背景
     * @param graphics Graphics 组件
     * @param transform UITransform 组件
     */
    static renderBackground(graphics: Graphics, transform: UITransform): void {
        if (!graphics || !transform) return;

        const width = transform.width;
        const height = transform.height;

        graphics.clear();

        // 绘制渐变背景（从黑色到深蓝紫色）
        const gradientSteps = UiColors.START_SCREEN_GRADIENT_STEPS;
        const stepHeight = height / gradientSteps;

        for (let i = 0; i < gradientSteps; i++) {
            const ratio = i / (gradientSteps - 1);
            
            // 使用常量创建渐变颜色
            const color = UiColors.createGradientColor(
                UiColors.START_SCREEN_BG_START,
                UiColors.START_SCREEN_BG_END,
                ratio
            );
            
            const y = stepHeight * i;
            
            graphics.fillColor = color;
            graphics.rect(0, y, width, stepHeight + 1); // +1 避免间隙
            graphics.fill();
        }
    }
}

