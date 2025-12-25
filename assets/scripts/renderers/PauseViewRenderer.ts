import { Graphics, Label, Button, Color, UITransform } from 'cc';
import { CyberpunkColors, UiColors } from '../constants/Index';
import { UiFontConfig, UiOutlineConfig, UiBorderConfig } from '../config/Index';
import { DrawHelper, UIStyleHelper } from '../utils/Index';

/**
 * 暂停界面渲染器
 * 负责暂停界面的绘制逻辑
 * 参考原游戏：半透明遮罩 + 赛博朋克风格标题和按钮
 */
export class PauseViewRenderer {
    // 标题样式配置
    private static readonly TITLE_FONT_SIZE = UiFontConfig.LARGE_FONT_SIZE;
    private static readonly TITLE_COLOR = CyberpunkColors.NEON_CYAN;
    
    // 副标题样式配置
    private static readonly SUBTITLE_FONT_SIZE = UiFontConfig.MEDIUM_FONT_SIZE;
    private static readonly SUBTITLE_COLOR = new Color(200, 200, 200, 255);
    
    // 按钮样式配置
    private static readonly BUTTON_COLORS = {
        RESUME: CyberpunkColors.NEON_CYAN, // 青色（继续）
        MENU: CyberpunkColors.NEON_ORANGE, // 橙色（返回主菜单）
    };
    
    /**
     * 绘制暂停界面背景（赛博朋克风格半透明遮罩）
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

        // 1. 绘制半透明深色渐变遮罩（参考 wegame：深色背景 + 半透明）
        const darkPurpleBg = { r: 15, g: 10, b: 30, a: 0.78 }; // 半透明深蓝紫色
        const darkBg = { r: 5, g: 5, b: 15, a: 0.78 }; // 半透明深色
        
        // 绘制渐变背景（从上到下）
        const steps = 30;
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const color = UiColors.createGradientColor(darkPurpleBg, darkBg, ratio);
            
            const stepHeight = height / steps;
            graphics.fillColor = color;
            graphics.rect(x, y + i * stepHeight, width, stepHeight + 1);
            graphics.fill();
        }
        
        // 2. 绘制外边框（霓虹青色发光，多层叠加增强发光效果）
        const borderColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.8);
        
        // 外层发光（更透明，更宽）
        DrawHelper.drawRectBorder(
            graphics,
            x, y, width, height,
            new Color(borderColor.r, borderColor.g, borderColor.b, 100),
            UiBorderConfig.THICK_BORDER_WIDTH + 2
        );
        
        // 中层边框（中等透明度）
        DrawHelper.drawRectBorder(
            graphics,
            x, y, width, height,
            new Color(borderColor.r, borderColor.g, borderColor.b, 150),
            UiBorderConfig.THICK_BORDER_WIDTH + 1
        );
        
        // 内层边框（主边框，正常透明度）
        DrawHelper.drawRectBorder(
            graphics,
            x, y, width, height,
            borderColor,
            UiBorderConfig.THICK_BORDER_WIDTH
        );
        
        // 3. 绘制内边框（高光，白色半透明）
        const innerPadding = 3;
        DrawHelper.drawRectBorder(
            graphics,
            x + innerPadding, y + innerPadding,
            width - innerPadding * 2, height - innerPadding * 2,
            new Color(255, 255, 255, 60),
            UiBorderConfig.DEFAULT_BORDER_WIDTH
        );
    }
    
    /**
     * 美化标题标签
     * @param label Label 组件
     */
    static styleTitleLabel(label: Label | null): void {
        if (!label) return;
        
        label.string = '游戏暂停';
        UIStyleHelper.styleLabel(
            label,
            this.TITLE_FONT_SIZE,
            this.TITLE_COLOR,
            UiOutlineConfig.THICK_OUTLINE_WIDTH,
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
        
        label.string = '按继续游戏键继续游戏';
        UIStyleHelper.styleLabel(
            label,
            this.SUBTITLE_FONT_SIZE,
            this.SUBTITLE_COLOR,
            UiOutlineConfig.DEFAULT_OUTLINE_WIDTH,
            new Color(0, 0, 0, 150),
            true
        );
    }
    
    /**
     * 美化继续按钮
     * @param button Button 组件
     */
    static styleResumeButton(button: Button | null): void {
        if (!button) return;
        
        UIStyleHelper.styleButton(button, this.BUTTON_COLORS.RESUME);
        UIStyleHelper.setButtonLabel(
            button.node,
            '继续游戏',
            Color.WHITE,
            UiFontConfig.DEFAULT_FONT_SIZE,
            UiOutlineConfig.DEFAULT_OUTLINE_WIDTH
        );
    }
    
    /**
     * 美化返回主菜单按钮（可选）
     * @param button Button 组件
     */
    static styleMenuButton(button: Button | null): void {
        if (!button) return;
        
        UIStyleHelper.styleButton(button, this.BUTTON_COLORS.MENU);
        UIStyleHelper.setButtonLabel(
            button.node,
            '返回主菜单',
            Color.WHITE,
            UiFontConfig.DEFAULT_FONT_SIZE,
            UiOutlineConfig.DEFAULT_OUTLINE_WIDTH
        );
    }
}

