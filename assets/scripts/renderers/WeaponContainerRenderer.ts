import { Graphics, Color } from 'cc';
import { UiColors } from '../constants/Index';
import { DrawHelper } from '../utils/Index';

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

        // 绘制顶部高光线（增强立体感）
        DrawHelper.drawHorizontalLine(
            graphics,
            0, height - 1, width,
            new Color(255, 255, 255, 40),
            1
        );

        // 绘制底部阴影线（增强立体感）
        DrawHelper.drawHorizontalLine(
            graphics,
            0, 1, width,
            new Color(0, 0, 0, 100),
            1
        );

        // 绘制外边框（发光效果，青色，多层叠加增强发光）
        const borderColor = UiColors.WEAPON_CONTAINER_BORDER_COLOR;
        const borderWidth = UiColors.WEAPON_CONTAINER_BORDER_WIDTH;
        
        // 外层发光（更透明，更宽）
        DrawHelper.drawRectBorder(
            graphics,
            0, 0, width, height,
            new Color(borderColor.r, borderColor.g, borderColor.b, 80),
            borderWidth + 2
        );
        
        // 中层边框（中等透明度）
        DrawHelper.drawRectBorder(
            graphics,
            0, 0, width, height,
            new Color(borderColor.r, borderColor.g, borderColor.b, 120),
            borderWidth + 1
        );
        
        // 内层边框（主边框，正常透明度）
        DrawHelper.drawRectBorder(
            graphics,
            0, 0, width, height,
            borderColor,
            borderWidth
        );

        // 绘制内边框（高光，白色半透明）
        const innerPadding = 2;
        DrawHelper.drawRectBorder(
            graphics,
            innerPadding, innerPadding,
            width - innerPadding * 2, height - innerPadding * 2,
            UiColors.WEAPON_CONTAINER_INNER_BORDER_COLOR,
            UiColors.WEAPON_CONTAINER_INNER_BORDER_WIDTH
        );

        // 绘制内部装饰线条（左右两侧的垂直装饰线）
        const decorationColor = new Color(borderColor.r, borderColor.g, borderColor.b, 60);
        
        // 左侧装饰线
        DrawHelper.drawVerticalLine(
            graphics,
            8, 6, height - 6,
            decorationColor,
            1
        );
        
        // 右侧装饰线
        DrawHelper.drawVerticalLine(
            graphics,
            width - 8, 6, height - 6,
            decorationColor,
            1
        );
    }
}

