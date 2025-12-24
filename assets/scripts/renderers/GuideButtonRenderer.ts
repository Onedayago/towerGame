import { Button, Label, Color } from 'cc';
import { CyberpunkColors } from '../constants/Index';
import { UIStyleHelper } from '../utils/Index';
import { UiFontConfig, UiOutlineConfig } from '../config/Index';

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
    private static readonly LABEL_FONT_SIZE = UiFontConfig.GUIDE_BUTTON_FONT_SIZE;
    private static readonly LABEL_COLOR = Color.WHITE;
    private static readonly LABEL_OUTLINE_WIDTH = UiOutlineConfig.DEFAULT_OUTLINE_WIDTH;
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
        UIStyleHelper.styleButton(button, baseColor);
    }
    
    /**
     * 美化按钮标签文字
     * @param label Label 组件
     */
    static styleLabel(label: Label | null): void {
        UIStyleHelper.styleLabel(
            label,
            this.LABEL_FONT_SIZE,
            this.LABEL_COLOR,
            this.LABEL_OUTLINE_WIDTH,
            this.LABEL_OUTLINE_COLOR
        );
    }
}

