import { Button, Label, Color } from 'cc';
import { CyberpunkColors } from '../constants/Index';

/**
 * 引导按钮渲染器
 * 负责美化引导按钮的样式
 */
export class GuideButtonRenderer {
    // 下一步按钮颜色 - 赛博朋克风格：霓虹青色
    private static readonly NEXT_BUTTON_COLOR = CyberpunkColors.NEON_CYAN;
    
    // 跳过按钮颜色 - 赛博朋克风格：霓虹橙色（如果没有红色，使用橙色）
    private static readonly SKIP_BUTTON_COLOR = CyberpunkColors.NEON_ORANGE;
    
    // 文字样式配置
    private static readonly LABEL_FONT_SIZE = 18;
    private static readonly LABEL_COLOR = Color.WHITE;
    private static readonly LABEL_OUTLINE_WIDTH = 2;
    private static readonly LABEL_OUTLINE_COLOR = new Color(0, 0, 0, 200);
    
    /**
     * 美化下一步按钮
     * @param button Button 组件
     */
    static styleNextButton(button: Button | null): void {
        if (!button) return;
        
        this.styleButton(button, this.NEXT_BUTTON_COLOR);
    }
    
    /**
     * 美化跳过按钮
     * @param button Button 组件
     */
    static styleSkipButton(button: Button | null): void {
        if (!button) return;
        
        this.styleButton(button, this.SKIP_BUTTON_COLOR);
    }
    
    /**
     * 美化按钮（通用方法）
     * @param button Button 组件
     * @param baseColor 基础颜色
     */
    private static styleButton(button: Button, baseColor: Color): void {
        // 设置按钮颜色
        button.normalColor = baseColor;
        
        // 悬停状态：稍微变亮
        const hoverColor = baseColor.clone();
        hoverColor.r = Math.min(255, hoverColor.r * 1.2);
        hoverColor.g = Math.min(255, hoverColor.g * 1.2);
        hoverColor.b = Math.min(255, hoverColor.b * 1.2);
        button.hoverColor = hoverColor;
        
        // 按下状态：稍微变暗
        const pressedColor = baseColor.clone();
        pressedColor.r = Math.max(0, pressedColor.r * 0.8);
        pressedColor.g = Math.max(0, pressedColor.g * 0.8);
        pressedColor.b = Math.max(0, pressedColor.b * 0.8);
        button.pressedColor = pressedColor;
        
        // 禁用状态：灰色
        button.disabledColor = new Color(128, 128, 128, 255);
        button.transition = Button.Transition.COLOR;
    }
    
    /**
     * 美化按钮标签文字
     * @param label Label 组件
     */
    static styleLabel(label: Label | null): void {
        if (!label) return;
        
        // 设置文字样式
        label.fontSize = this.LABEL_FONT_SIZE;
        label.color = this.LABEL_COLOR;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        
        // 启用描边效果
        label.enableOutline = true;
        label.outlineWidth = this.LABEL_OUTLINE_WIDTH;
        label.outlineColor = this.LABEL_OUTLINE_COLOR;
    }
}

