import { Graphics, UITransform, Label, Node, Button, Color } from 'cc';
import { UiColors, CyberpunkColors } from '../constants/Index';
import { UiFontConfig, UiBorderConfig } from '../config/Index';
import { DrawHelper, UIStyleHelper } from '../utils/Index';

/**
 * 开始界面渲染器
 * 负责开始界面的绘制逻辑
 * 参考原游戏实现
 */
export class StartScreenRenderer {
    // 标题样式配置（参考原游戏：ROCKET_TOWER 紫色）
    private static readonly TITLE_FONT_SIZE = UiFontConfig.LARGE_FONT_SIZE;
    private static readonly TITLE_COLOR = new Color(157, 0, 255, 255); // 紫色（ROCKET_TOWER: 0x9d00ff）
    
    // 副标题样式配置（参考原游戏：TEXT_LIGHT 浅灰色）
    private static readonly SUBTITLE_FONT_SIZE = UiFontConfig.MEDIUM_FONT_SIZE;
    private static readonly SUBTITLE_COLOR = new Color(204, 204, 204, 230); // 浅灰色（TEXT_LIGHT: 0xcccccc，90%透明度）
    
    // 按钮样式配置（参考原游戏）
    private static readonly BUTTON_COLORS = {
        START: new Color(157, 0, 255, 255), // 紫色（ROCKET_TOWER: 0x9d00ff）
        HELP: new Color(0, 255, 65, 255), // 绿色（LASER_TOWER: 0x00ff41）
    };
    
    /**
     * 绘制开始界面背景（参考原游戏：简单渐变背景）
     * @param graphics Graphics 组件
     * @param transform UITransform 组件
     */
    static renderBackground(graphics: Graphics, transform: UITransform): void {
        if (!graphics || !transform) return;

        const width = transform.width;
        const height = transform.height;
        
        // 获取锚点（应该是 0.5, 0.5 中心点）
        const anchorPoint = transform.anchorPoint;
        const x = -width / 2;
        const y = -height / 2;

        graphics.clear();

        // 参考原游戏：简单的渐变背景（从黑色到深蓝灰色）
        // rgba(0, 0, 0, 0.85) -> rgba(26, 26, 46, 0.9)
        const black = { r: 0, g: 0, b: 0, a: 0.85 };
        const darkBlueGray = { r: 26, g: 26, b: 46, a: 0.9 };
        
        // 绘制渐变背景（从上到下）
        const steps = 30;
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const color = UiColors.createGradientColor(black, darkBlueGray, ratio);
            
            const stepHeight = height / steps;
            graphics.fillColor = color;
            graphics.rect(x, y + i * stepHeight, width, stepHeight + 1);
            graphics.fill();
        }
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
