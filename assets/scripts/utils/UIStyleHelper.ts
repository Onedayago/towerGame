import { Button, Label, Color, Node, UITransform } from 'cc';
import { UiFontConfig, UiOutlineConfig } from '../config/Index';

/**
 * UI 样式辅助工具类
 * 提供统一的按钮和文字美化方法
 */
export class UIStyleHelper {
    // 默认文字样式配置
    private static readonly DEFAULT_LABEL_FONT_SIZE = UiFontConfig.DEFAULT_FONT_SIZE;
    private static readonly DEFAULT_LABEL_COLOR = Color.WHITE;
    private static readonly DEFAULT_LABEL_OUTLINE_WIDTH = UiOutlineConfig.DEFAULT_OUTLINE_WIDTH;
    private static readonly DEFAULT_LABEL_OUTLINE_COLOR = new Color(0, 0, 0, 200);

    // 按钮状态颜色调整系数
    private static readonly HOVER_BRIGHTNESS = 1.2;
    private static readonly PRESSED_BRIGHTNESS = 0.8;
    private static readonly DISABLED_COLOR = new Color(128, 128, 128, 255);

    /**
     * 美化按钮（通用方法）
     * @param button Button 组件
     * @param baseColor 基础颜色
     * @param hoverBrightness 悬停亮度系数（默认 1.2）
     * @param pressedBrightness 按下亮度系数（默认 0.8）
     */
    static styleButton(
        button: Button | null,
        baseColor: Color,
        hoverBrightness: number = this.HOVER_BRIGHTNESS,
        pressedBrightness: number = this.PRESSED_BRIGHTNESS
    ): void {
        if (!button) return;

        // 设置按钮颜色
        button.normalColor = baseColor;

        // 悬停状态：稍微变亮
        const hoverColor = baseColor.clone();
        hoverColor.r = Math.min(255, Math.floor(hoverColor.r * hoverBrightness));
        hoverColor.g = Math.min(255, Math.floor(hoverColor.g * hoverBrightness));
        hoverColor.b = Math.min(255, Math.floor(hoverColor.b * hoverBrightness));
        button.hoverColor = hoverColor;

        // 按下状态：稍微变暗
        const pressedColor = baseColor.clone();
        pressedColor.r = Math.max(0, Math.floor(pressedColor.r * pressedBrightness));
        pressedColor.g = Math.max(0, Math.floor(pressedColor.g * pressedBrightness));
        pressedColor.b = Math.max(0, Math.floor(pressedColor.b * pressedBrightness));
        button.pressedColor = pressedColor;

        // 禁用状态：灰色
        button.disabledColor = this.DISABLED_COLOR.clone();
        button.transition = Button.Transition.COLOR;
    }

    /**
     * 美化标签文字（通用方法）
     * @param label Label 组件
     * @param fontSize 字体大小（可选，默认 20）
     * @param color 文字颜色（可选，默认白色）
     * @param outlineWidth 描边宽度（可选，默认 2）
     * @param outlineColor 描边颜色（可选，默认黑色半透明）
     * @param centerAnchor 是否设置锚点为居中（可选，默认 false）
     */
    static styleLabel(
        label: Label | null,
        fontSize?: number,
        color?: Color,
        outlineWidth?: number,
        outlineColor?: Color,
        centerAnchor: boolean = false
    ): void {
        if (!label) return;

        // 设置文字样式
        label.fontSize = fontSize ?? this.DEFAULT_LABEL_FONT_SIZE;
        label.color = color ?? this.DEFAULT_LABEL_COLOR;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;

        // 启用描边效果
        label.enableOutline = true;
        label.outlineWidth = outlineWidth ?? this.DEFAULT_LABEL_OUTLINE_WIDTH;
        label.outlineColor = outlineColor ?? this.DEFAULT_LABEL_OUTLINE_COLOR;

        // 确保节点居中（如果需要）
        if (centerAnchor) {
            const transform = label.node.getComponent(UITransform);
            if (transform) {
                transform.setAnchorPoint(0.5, 0.5);
            }
        }
    }

    /**
     * 设置按钮标签文字
     * @param buttonNode 按钮节点
     * @param text 文字内容
     * @param textColor 文字颜色（可选，默认白色）
     * @param fontSize 字体大小（可选，默认 20）
     * @param outlineWidth 描边宽度（可选，默认 2）
     */
    static setButtonLabel(
        buttonNode: Node,
        text: string,
        textColor: Color = Color.WHITE,
        fontSize: number = this.DEFAULT_LABEL_FONT_SIZE,
        outlineWidth: number = this.DEFAULT_LABEL_OUTLINE_WIDTH
    ): void {
        if (!buttonNode) return;

        // 查找或创建 Label 子节点
        let labelNode = buttonNode.getChildByName('Label');
        let label: Label | null = null;

        if (!labelNode) {
            // 如果没有 Label 子节点，尝试在按钮节点本身查找
            label = buttonNode.getComponent(Label);
            if (label) {
                label.string = text;
                this.styleLabel(label, fontSize, textColor, outlineWidth);
                return;
            }
        } else {
            label = labelNode.getComponent(Label);
        }

        // 如果找到了 Label，设置文字
        if (label) {
            label.string = text;
            this.styleLabel(label, fontSize, textColor, outlineWidth);
        }
    }
}

