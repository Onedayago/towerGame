import { Label, Color, UITransform } from 'cc';
import { CyberpunkColors } from '../constants/Index';
import { UIStyleHelper } from '../utils/Index';
import { UiFontConfig, UiOutlineConfig } from '../config/Index';

/**
 * 引导标签渲染器
 * 负责美化引导提示文案的样式
 */
export class GuideLabelRenderer {
    // 文字样式配置
    private static readonly LABEL_FONT_SIZE = UiFontConfig.MEDIUM_FONT_SIZE;
    private static readonly LABEL_COLOR = Color.WHITE;
    private static readonly LABEL_OUTLINE_WIDTH = UiOutlineConfig.THICK_OUTLINE_WIDTH;
    private static readonly LABEL_OUTLINE_COLOR = new Color(0, 0, 0, 255); // 黑色描边
    
    /**
     * 美化引导标签文字
     * @param label Label 组件
     */
    static styleLabel(label: Label | null): void {
        UIStyleHelper.styleLabel(
            label,
            this.LABEL_FONT_SIZE,
            this.LABEL_COLOR,
            this.LABEL_OUTLINE_WIDTH,
            this.LABEL_OUTLINE_COLOR,
            true // 设置锚点为居中
        );
    }
}

