import { Graphics, UITransform, Color } from 'cc';
import { UiBorderConfig } from '../config/Index';
import { CyberpunkColors, UiColors } from '../constants/Index';
import { DrawHelper } from '../utils/Index';

/**
 * 战争界面渲染器
 * 负责绘制战争界面的背景
 * 参考 wegame 实现：深色渐变背景 + 发光边框
 */
export class WarScreenRenderer {
    /**
     * 绘制战争界面背景（赛博朋克风格）
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

        // 1. 绘制深色渐变背景（参考 wegame：从深蓝灰色到更深的颜色）
        const bgStart = UiColors.WEAPON_CONTAINER_BG_START;
        const bgEnd = UiColors.WEAPON_CONTAINER_BG_END;
        const steps = UiColors.WEAPON_CONTAINER_GRADIENT_STEPS;
        
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const color = UiColors.createGradientColor(bgStart, bgEnd, ratio);
            
            const stepHeight = height / steps;
            graphics.fillColor = color;
            graphics.rect(x, y + i * stepHeight, width, stepHeight + 1);
            graphics.fill();
        }
        
        // 2. 绘制外边框（发光效果，青色）
        const borderColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.6);
        DrawHelper.drawRectBorder(graphics, x, y, width, height, borderColor, UiBorderConfig.DEFAULT_BORDER_WIDTH);
        
        // 3. 绘制内边框（高光，白色半透明）
        const innerPadding = 2;
        const innerBorderColor = new Color(255, 255, 255, 40);
        DrawHelper.drawRectBorder(
            graphics,
            x + innerPadding,
            y + innerPadding,
            width - innerPadding * 2,
            height - innerPadding * 2,
            innerBorderColor,
            1
        );
    }
}

