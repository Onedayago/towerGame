import { Label, Color, UITransform } from 'cc';
import { CyberpunkColors } from '../constants/Index';

/**
 * 引导标签渲染器
 * 负责美化引导提示文案的样式
 */
export class GuideLabelRenderer {
    // 文字样式配置
    private static readonly LABEL_FONT_SIZE = 24;
    private static readonly LABEL_COLOR = Color.WHITE;
    private static readonly LABEL_OUTLINE_WIDTH = 3;
    private static readonly LABEL_OUTLINE_COLOR = new Color(0, 0, 0, 255); // 黑色描边
    
    /**
     * 美化引导标签文字
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

