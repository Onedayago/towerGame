import { Button, Label, Color, UITransform } from 'cc';
import { CyberpunkColors } from '../constants/Index';
import { UIStyleHelper } from '../utils/Index';
import { UiFontConfig, UiOutlineConfig } from '../config/Index';

/**
 * 游戏状态按钮渲染器
 * 负责美化暂停/继续按钮的样式
 * 参考原游戏实现
 */
export class GameStateBtnRenderer {
    // 按钮颜色配置 - 赛博朋克风格：霓虹黄色
    private static readonly BUTTON_COLOR = CyberpunkColors.NEON_YELLOW;
    
    // 文字样式配置
    private static readonly LABEL_FONT_SIZE = UiFontConfig.DEFAULT_FONT_SIZE;
    private static readonly LABEL_COLOR = Color.WHITE;
    private static readonly LABEL_OUTLINE_WIDTH = UiOutlineConfig.DEFAULT_OUTLINE_WIDTH;
    private static readonly LABEL_OUTLINE_COLOR = new Color(0, 0, 0, 200); // 黑色描边，半透明
    
    /**
     * 美化游戏状态按钮
     * @param button Button 组件
     */
    static styleButton(button: Button | null): void {
        UIStyleHelper.styleButton(button, this.BUTTON_COLOR);
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
            this.LABEL_OUTLINE_COLOR,
            true
        );
    }
}

