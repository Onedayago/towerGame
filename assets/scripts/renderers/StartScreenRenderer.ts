import { Graphics, UITransform, Label, Node, Button, Color } from 'cc';
import { UiColors } from '../constants/Index';
import { UiConfig } from '../config/Index';

/**
 * 开始界面渲染器
 * 负责开始界面的绘制逻辑
 * 参考原游戏实现
 */
export class StartScreenRenderer {
    // 标题样式配置
    private static readonly TITLE_FONT_SIZE = 48;
    private static readonly TITLE_COLOR = new Color(255, 165, 0, 255); // 橙色（火箭塔颜色）
    private static readonly TITLE_GRADIENT_COLORS = [
        new Color(255, 165, 0, 255), // 橙色
        new Color(255, 255, 255, 255), // 白色
        new Color(255, 200, 100, 255) // 浅橙色
    ];
    
    // 副标题样式配置
    private static readonly SUBTITLE_FONT_SIZE = 24;
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

        graphics.clear();

        // 绘制渐变背景（从黑色到深蓝紫色）
        const gradientSteps = UiColors.START_SCREEN_GRADIENT_STEPS;
        const stepHeight = height / gradientSteps;

        for (let i = 0; i < gradientSteps; i++) {
            const ratio = i / (gradientSteps - 1);
            
            // 使用常量创建渐变颜色
            const color = UiColors.createGradientColor(
                UiColors.START_SCREEN_BG_START,
                UiColors.START_SCREEN_BG_END,
                ratio
            );
            
            const y = stepHeight * i;
            
            graphics.fillColor = color;
            graphics.rect(0, y, width, stepHeight + 1); // +1 避免间隙
            graphics.fill();
        }
    }
    
    /**
     * 美化标题标签
     * @param label Label 组件
     */
    static styleTitleLabel(label: Label | null): void {
        if (!label) return;
        
        // 设置标题样式（参考原游戏）
        label.string = '塔防游戏';
        label.fontSize = this.TITLE_FONT_SIZE;
        label.color = this.TITLE_COLOR;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        
        // 启用描边和阴影效果（增强视觉效果）
        label.enableOutline = true;
        label.outlineWidth = 3;
        label.outlineColor = new Color(0, 0, 0, 200); // 黑色描边
        
        // 确保节点居中
        const transform = label.node.getComponent(UITransform);
        if (transform) {
            transform.setAnchorPoint(0.5, 0.5);
        }
    }
    
    /**
     * 美化副标题标签
     * @param label Label 组件
     */
    static styleSubtitleLabel(label: Label | null): void {
        if (!label) return;
        
        // 设置副标题样式
        label.string = '点击开始游戏';
        label.fontSize = this.SUBTITLE_FONT_SIZE;
        label.color = this.SUBTITLE_COLOR;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        
        // 启用描边
        label.enableOutline = true;
        label.outlineWidth = 2;
        label.outlineColor = new Color(0, 0, 0, 150); // 黑色描边，半透明
        
        // 确保节点居中
        const transform = label.node.getComponent(UITransform);
        if (transform) {
            transform.setAnchorPoint(0.5, 0.5);
        }
    }
    
    /**
     * 美化开始按钮
     * @param button Button 组件
     */
    static styleStartButton(button: Button | null): void {
        if (!button) return;
        
        // 设置按钮颜色（参考原游戏：橙色）
        button.normalColor = this.BUTTON_COLORS.START;
        
        // 悬停状态：稍微变亮
        const hoverColor = this.BUTTON_COLORS.START.clone();
        hoverColor.r = Math.min(255, hoverColor.r * 1.2);
        hoverColor.g = Math.min(255, hoverColor.g * 1.2);
        hoverColor.b = Math.min(255, hoverColor.b * 1.2);
        button.hoverColor = hoverColor;
        
        // 按下状态：稍微变暗
        const pressedColor = this.BUTTON_COLORS.START.clone();
        pressedColor.r = Math.max(0, pressedColor.r * 0.8);
        pressedColor.g = Math.max(0, pressedColor.g * 0.8);
        pressedColor.b = Math.max(0, pressedColor.b * 0.8);
        button.pressedColor = pressedColor;
        
        // 禁用状态：灰色
        button.disabledColor = new Color(128, 128, 128, 255);
        button.transition = Button.Transition.COLOR;
        
        // 设置按钮文字
        this.setButtonLabel(button.node, '开始游戏', Color.WHITE);
    }
    
    /**
     * 美化帮助按钮（可选）
     * @param button Button 组件
     */
    static styleHelpButton(button: Button | null): void {
        if (!button) return;
        
        // 设置按钮颜色（参考原游戏：青色）
        button.normalColor = this.BUTTON_COLORS.HELP;
        
        // 悬停状态：稍微变亮
        const hoverColor = this.BUTTON_COLORS.HELP.clone();
        hoverColor.r = Math.min(255, hoverColor.r * 1.2);
        hoverColor.g = Math.min(255, hoverColor.g * 1.2);
        hoverColor.b = Math.min(255, hoverColor.b * 1.2);
        button.hoverColor = hoverColor;
        
        // 按下状态：稍微变暗
        const pressedColor = this.BUTTON_COLORS.HELP.clone();
        pressedColor.r = Math.max(0, pressedColor.r * 0.8);
        pressedColor.g = Math.max(0, pressedColor.g * 0.8);
        pressedColor.b = Math.max(0, pressedColor.b * 0.8);
        button.pressedColor = pressedColor;
        
        // 禁用状态：灰色
        button.disabledColor = new Color(128, 128, 128, 255);
        button.transition = Button.Transition.COLOR;
        
        // 设置按钮文字
        this.setButtonLabel(button.node, '游戏帮助', Color.WHITE);
    }
    
    /**
     * 设置按钮标签文字
     * @param buttonNode 按钮节点
     * @param text 文字内容
     * @param textColor 文字颜色
     */
    private static setButtonLabel(buttonNode: Node, text: string, textColor: Color): void {
        if (!buttonNode) return;
        
        // 查找或创建 Label 子节点
        let labelNode = buttonNode.getChildByName('Label');
        let label: Label | null = null;
        
        if (!labelNode) {
            // 如果没有 Label 子节点，尝试在按钮节点本身查找
            label = buttonNode.getComponent(Label);
            if (label) {
                label.string = text;
                label.color = textColor;
                label.fontSize = 20;
                label.horizontalAlign = Label.HorizontalAlign.CENTER;
                label.verticalAlign = Label.VerticalAlign.CENTER;
                label.enableOutline = true;
                label.outlineWidth = 2;
                label.outlineColor = new Color(0, 0, 0, 200);
                return;
            }
        } else {
            label = labelNode.getComponent(Label);
        }
        
        // 如果找到了 Label，设置文字
        if (label) {
            label.string = text;
            label.color = textColor;
            label.fontSize = 20;
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            label.enableOutline = true;
            label.outlineWidth = 2;
            label.outlineColor = new Color(0, 0, 0, 200);
        }
    }
}
