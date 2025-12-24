import { Graphics, UITransform, Label, Node, Button, Color } from 'cc';
import { UiColors } from '../constants/Index';
import { UiFontConfig, UiBorderConfig } from '../config/Index';
import { DrawHelper, UIStyleHelper } from '../utils/Index';

/**
 * 开始界面渲染器
 * 负责开始界面的绘制逻辑
 * 参考原游戏实现
 */
export class StartScreenRenderer {
    // 标题样式配置
    private static readonly TITLE_FONT_SIZE = UiFontConfig.LARGE_FONT_SIZE;
    private static readonly TITLE_COLOR = new Color(255, 165, 0, 255); // 橙色（火箭塔颜色）
    private static readonly TITLE_GRADIENT_COLORS = [
        new Color(255, 165, 0, 255), // 橙色
        new Color(255, 255, 255, 255), // 白色
        new Color(255, 200, 100, 255) // 浅橙色
    ];
    
    // 副标题样式配置
    private static readonly SUBTITLE_FONT_SIZE = UiFontConfig.MEDIUM_FONT_SIZE;
    private static readonly SUBTITLE_COLOR = new Color(200, 200, 200, 255); // 浅灰色
    
    // 按钮样式配置
    private static readonly BUTTON_COLORS = {
        START: new Color(255, 165, 0, 255), // 橙色（火箭塔颜色）
        HELP: new Color(0, 255, 255, 255), // 青色（激光塔颜色）
    };
    
    /**
     * 绘制开始界面背景
     * @param graphics Graphics 组件
     * @param transform UITransform 组件
     */
    static renderBackground(graphics: Graphics, transform: UITransform): void {
        if (!graphics || !transform) return;

        const width = transform.width;
        const height = transform.height;
        
        // 获取锚点（应该是 0.5, 0.5 中心点）
        const anchorPoint = transform.anchorPoint;
        const anchorX = width * anchorPoint.x;
        const anchorY = height * anchorPoint.y;

        graphics.clear();

        // 只绘制边框
        const x = -width / 2;
        const y = -height / 2;
        DrawHelper.drawRectBorder(graphics, x, y, width, height, UiColors.START_SCREEN_BG_END, UiBorderConfig.DEFAULT_BORDER_WIDTH);
    }
    
    /**
     * 美化标题标签
     * @param label Label 组件
     */
    static styleTitleLabel(label: Label | null): void {
        if (!label) return;
        
        label.string = '塔防游戏';
        UIStyleHelper.styleLabel(
            label,
            this.TITLE_FONT_SIZE,
            this.TITLE_COLOR,
            3,
            new Color(0, 0, 0, 200),
            true
        );
    }
    
    /**
     * 美化副标题标签
     * @param label Label 组件
     */
    static styleSubtitleLabel(label: Label | null): void {
        if (!label) return;
        
        label.string = '点击开始游戏';
        UIStyleHelper.styleLabel(
            label,
            this.SUBTITLE_FONT_SIZE,
            this.SUBTITLE_COLOR,
            2,
            new Color(0, 0, 0, 150),
            true
        );
    }
    
    /**
     * 美化开始按钮
     * @param button Button 组件
     */
    static styleStartButton(button: Button | null): void {
        if (!button) return;
        
        UIStyleHelper.styleButton(button, this.BUTTON_COLORS.START);
        UIStyleHelper.setButtonLabel(button.node, '开始游戏', Color.WHITE);
    }
    
    /**
     * 美化帮助按钮（可选）
     * @param button Button 组件
     */
    static styleHelpButton(button: Button | null): void {
        if (!button) return;
        
        UIStyleHelper.styleButton(button, this.BUTTON_COLORS.HELP);
        UIStyleHelper.setButtonLabel(button.node, '游戏帮助', Color.WHITE);
    }
}
