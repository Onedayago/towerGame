import { Graphics, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { CyberpunkColors } from '../constants/Index';

/**
 * 战争界面渲染器
 * 负责绘制战争界面的背景
 */
export class WarScreenRenderer {
    /**
     * 绘制战争界面背景
     * @param graphics Graphics 组件
     * @param transform UITransform 组件
     */
    static renderBackground(graphics: Graphics, transform: UITransform): void {
        if (!graphics || !transform) return;

        const width = transform.width;
        const height = transform.height;

        graphics.clear();

        // 绘制渐变背景（从深蓝紫色到更深色，赛博朋克风格）
        const gradientSteps = 50;
        const stepHeight = height / gradientSteps;

        for (let i = 0; i < gradientSteps; i++) {
            const ratio = i / (gradientSteps - 1);
            
            // 创建渐变颜色（从深蓝紫色到更深色）
            const color = CyberpunkColors.createGradientColor(
                CyberpunkColors.START_SCREEN_BG_START,
                CyberpunkColors.START_SCREEN_BG_END,
                ratio
            );
            
            const y = stepHeight * i;
            
            graphics.fillColor = color;
            graphics.rect(0, y, width, stepHeight + 1); // +1 避免间隙
            graphics.fill();
        }
    }
}

