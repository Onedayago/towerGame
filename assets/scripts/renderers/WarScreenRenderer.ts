import { Graphics, UITransform } from 'cc';
import { UiBorderConfig } from '../config/Index';
import { CyberpunkColors } from '../constants/Index';
import { DrawHelper } from '../utils/Index';

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

        // 只绘制边框
        DrawHelper.drawRectBorder(graphics, 0, 0, width, height, CyberpunkColors.NEON_CYAN, UiBorderConfig.DEFAULT_BORDER_WIDTH);
    }
}

