import { Button, Label, Color, UITransform } from 'cc';
import { CyberpunkColors } from '../constants/Index';

/**
 * 游戏状态按钮渲染器
 * 负责美化暂停/继续按钮的样式
 * 参考原游戏实现
 */
export class GameStateBtnRenderer {
    // 按钮颜色配置 - 赛博朋克风格：霓虹黄色
    private static readonly BUTTON_COLOR = CyberpunkColors.NEON_YELLOW;
    
    // 文字样式配置
    private static readonly LABEL_FONT_SIZE = 20;
    private static readonly LABEL_COLOR = Color.WHITE;
    private static readonly LABEL_OUTLINE_WIDTH = 2;
    private static readonly LABEL_OUTLINE_COLOR = new Color(0, 0, 0, 200); // 黑色描边，半透明
    
    /**
     * 美化游戏状态按钮
     * @param button Button 组件
     */
    static styleButton(button: Button | null): void {
        if (!button) return;
        
        // 设置按钮颜色（金黄色）
        button.normalColor = this.BUTTON_COLOR;
        
        // 悬停状态：稍微变亮
        const hoverColor = this.BUTTON_COLOR.clone();
        hoverColor.r = Math.min(255, hoverColor.r * 1.2);
        hoverColor.g = Math.min(255, hoverColor.g * 1.2);
        hoverColor.b = Math.min(255, hoverColor.b * 1.2);
        button.hoverColor = hoverColor;
        
        // 按下状态：稍微变暗
        const pressedColor = this.BUTTON_COLOR.clone();
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
        
        // 启用描边效果（增强视觉效果）
        label.enableOutline = true;
        label.outlineWidth = this.LABEL_OUTLINE_WIDTH;
        label.outlineColor = this.LABEL_OUTLINE_COLOR;
        
        // 确保节点居中
        const transform = label.node.getComponent(UITransform);
        if (transform) {
            transform.setAnchorPoint(0.5, 0.5);
        }
    }
}

