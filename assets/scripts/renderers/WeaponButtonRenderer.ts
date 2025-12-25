import { Graphics, Color, UITransform, Button, Sprite, Label, Node as CCNode } from 'cc';
import { UiConfig } from '../config/Index';
import { CyberpunkColors } from '../constants/Index';

/**
 * 武器按钮渲染器
 * 负责升级和移除按钮的美化绘制
 * 参考微信小游戏的按钮设计
 */
export class WeaponButtonRenderer {
    // 按钮配置常量（适配缩小）
    private static readonly BUTTON_SIZE = 32; // 按钮高度（像素）- 从40缩小到32
    private static readonly BUTTON_WIDTH = 65; // 按钮宽度（像素）- 增大以容纳文字
    private static readonly BUTTON_RADIUS = 6; // 圆角半径 - 从8缩小到6
    private static readonly BORDER_WIDTH = 2; // 边框宽度
    
    // 升级按钮颜色 - 赛博朋克风格：霓虹绿色
    private static readonly UPGRADE_BG_COLOR = CyberpunkColors.NEON_GREEN;
    private static readonly UPGRADE_BORDER_COLOR = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_GREEN, 0.8);
    private static readonly UPGRADE_ICON_COLOR = Color.WHITE; // 白色图标
    
    // 移除按钮颜色 - 赛博朋克风格：霓虹红色
    private static readonly REMOVE_BG_COLOR = CyberpunkColors.ENEMY_PRIMARY;
    private static readonly REMOVE_BORDER_COLOR = CyberpunkColors.createNeonGlow(CyberpunkColors.ENEMY_PRIMARY, 0.8);
    private static readonly REMOVE_ICON_COLOR = Color.WHITE; // 白色图标
    
    // 悬停效果颜色（稍微变亮）
    private static readonly HOVER_BRIGHTNESS = 1.2;
    
    /**
     * 渲染升级按钮
     * @param graphics Graphics 组件
     * @param width 按钮宽度
     * @param height 按钮高度
     * @param isHovered 是否悬停（可选）
     */
    static renderUpgradeButton(
        graphics: Graphics,
        width: number,
        height: number,
        isHovered: boolean = false
    ): void {
        if (!graphics) return;
        
        graphics.clear();
        
        const radius = Math.min(width, height) / 2 - this.BORDER_WIDTH;
        
        // 背景颜色（悬停时变亮）
        let bgColor = this.UPGRADE_BG_COLOR.clone();
        let borderColor = this.UPGRADE_BORDER_COLOR.clone();
        
        if (isHovered) {
            bgColor.r = Math.min(255, bgColor.r * this.HOVER_BRIGHTNESS);
            bgColor.g = Math.min(255, bgColor.g * this.HOVER_BRIGHTNESS);
            bgColor.b = Math.min(255, bgColor.b * this.HOVER_BRIGHTNESS);
        }
        
        // 绘制背景（圆形）
        graphics.fillColor = bgColor;
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // 绘制边框
        graphics.strokeColor = borderColor;
        graphics.lineWidth = this.BORDER_WIDTH;
        graphics.circle(0, 0, radius);
        graphics.stroke();
        
        // 绘制升级图标（向上箭头）
        this.drawUpgradeIcon(graphics, width, height);
    }
    
    /**
     * 渲染移除按钮
     * @param graphics Graphics 组件
     * @param width 按钮宽度
     * @param height 按钮高度
     * @param isHovered 是否悬停（可选）
     */
    static renderRemoveButton(
        graphics: Graphics,
        width: number,
        height: number,
        isHovered: boolean = false
    ): void {
        if (!graphics) return;
        
        graphics.clear();
        
        const radius = Math.min(width, height) / 2 - this.BORDER_WIDTH;
        
        // 背景颜色（悬停时变亮）
        let bgColor = this.REMOVE_BG_COLOR.clone();
        let borderColor = this.REMOVE_BORDER_COLOR.clone();
        
        if (isHovered) {
            bgColor.r = Math.min(255, bgColor.r * this.HOVER_BRIGHTNESS);
            bgColor.g = Math.min(255, bgColor.g * this.HOVER_BRIGHTNESS);
            bgColor.b = Math.min(255, bgColor.b * this.HOVER_BRIGHTNESS);
        }
        
        // 绘制背景（圆形）
        graphics.fillColor = bgColor;
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // 绘制边框
        graphics.strokeColor = borderColor;
        graphics.lineWidth = this.BORDER_WIDTH;
        graphics.circle(0, 0, radius);
        graphics.stroke();
        
        // 绘制移除图标（X符号）
        this.drawRemoveIcon(graphics, width, height);
    }
    
    /**
     * 绘制升级图标（向上箭头）
     */
    private static drawUpgradeIcon(graphics: Graphics, width: number, height: number): void {
        graphics.strokeColor = this.UPGRADE_ICON_COLOR;
        graphics.fillColor = this.UPGRADE_ICON_COLOR;
        graphics.lineWidth = 3;
        
        const iconSize = Math.min(width, height) * 0.5;
        const arrowWidth = iconSize * 0.6;
        const arrowHeight = iconSize * 0.5;
        
        // 绘制向上箭头
        // 箭头主体（三角形）
        graphics.moveTo(0, arrowHeight / 2);
        graphics.lineTo(-arrowWidth / 2, -arrowHeight / 2);
        graphics.lineTo(arrowWidth / 2, -arrowHeight / 2);
        graphics.close();
        graphics.fill();
        
        // 箭头底部横线
        const lineWidth = arrowWidth * 0.8;
        graphics.moveTo(-lineWidth / 2, -arrowHeight / 2);
        graphics.lineTo(lineWidth / 2, -arrowHeight / 2);
        graphics.stroke();
    }
    
    /**
     * 绘制移除图标（X符号）
     */
    private static drawRemoveIcon(graphics: Graphics, width: number, height: number): void {
        graphics.strokeColor = this.REMOVE_ICON_COLOR;
        graphics.lineWidth = 3;
        
        const iconSize = Math.min(width, height) * 0.5;
        const lineLength = iconSize * 0.7;
        
        // 绘制X符号（两条交叉的线）
        // 左上到右下
        graphics.moveTo(-lineLength / 2, lineLength / 2);
        graphics.lineTo(lineLength / 2, -lineLength / 2);
        graphics.stroke();
        
        // 右上到左下
        graphics.moveTo(lineLength / 2, lineLength / 2);
        graphics.lineTo(-lineLength / 2, -lineLength / 2);
        graphics.stroke();
    }
    
    /**
     * 获取推荐的按钮大小（高度）
     */
    static getRecommendedSize(): number {
        return this.BUTTON_SIZE;
    }
    
    /**
     * 获取推荐的按钮宽度
     */
    static getRecommendedWidth(): number {
        return this.BUTTON_WIDTH;
    }
    
    /**
     * 美化升级按钮（使用 Button 组件）
     * @param buttonNode 按钮节点
     * @param upgradeCost 升级所需金币数量
     */
    static styleUpgradeButton(buttonNode: CCNode, upgradeCost: number = 0): void {
        if (!buttonNode) return;
        
        const button = buttonNode.getComponent(Button);
        if (!button) return;
        
        // 设置按钮的过渡颜色
        // 正常状态：绿色
        button.normalColor = this.UPGRADE_BG_COLOR;
        // 悬停状态：稍微变亮的绿色
        const hoverColor = this.UPGRADE_BG_COLOR.clone();
        hoverColor.r = Math.min(255, hoverColor.r * this.HOVER_BRIGHTNESS);
        hoverColor.g = Math.min(255, hoverColor.g * this.HOVER_BRIGHTNESS);
        hoverColor.b = Math.min(255, hoverColor.b * this.HOVER_BRIGHTNESS);
        button.hoverColor = hoverColor;
        // 按下状态：深绿色
        button.pressedColor = this.UPGRADE_BORDER_COLOR;
        // 禁用状态：灰色
        button.disabledColor = new Color(128, 128, 128, 255);
        
        // 设置过渡类型为颜色
        button.transition = Button.Transition.COLOR;
        
        // 设置按钮的目标节点（通常是 Sprite）
        if (button.target) {
            const sprite = button.target.getComponent(Sprite);
            if (sprite) {
                sprite.color = this.UPGRADE_BG_COLOR;
            }
        }
        
        // 确保按钮节点有 UITransform 并设置锚点和大小
        let buttonTransform = buttonNode.getComponent(UITransform);
        if (!buttonTransform) {
            buttonTransform = buttonNode.addComponent(UITransform);
        }
        if (buttonTransform) {
            buttonTransform.setAnchorPoint(0.5, 0.5);
            // 设置按钮大小：宽度增大以容纳文字
            buttonTransform.setContentSize(this.BUTTON_WIDTH, this.BUTTON_SIZE);
        }
        
        // 查找按钮节点上的 Label 组件（可能是直接组件，也可能是子节点的组件）
        let label = buttonNode.getComponent(Label);
        if (!label) {
            // 如果没有直接组件，查找子节点的 Label
            const labelNode = buttonNode.getChildByName('Label');
            if (labelNode) {
                label = labelNode.getComponent(Label);
            }
        }
        
        // 设置 Label 文字：升级和所需金币数量（同一行）
        if (label) {
            label.string = `升级 ${upgradeCost}`;
            label.color = Color.WHITE;
            label.fontSize = 14; // 字体大小 - 从16缩小到14（适配按钮缩小）
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            label.enableOutline = true;
            label.outlineWidth = 2;
            label.outlineColor = new Color(0, 0, 0, 200); // 黑色描边，增强可读性
        }
    }
    
    /**
     * 美化移除按钮（使用 Button 组件）
     * @param buttonNode 按钮节点
     * @param sellValue 卖掉获得的金币数量
     */
    static styleRemoveButton(buttonNode: CCNode, sellValue: number = 0): void {
        if (!buttonNode) return;
        
        const button = buttonNode.getComponent(Button);
        if (!button) return;
        
        // 设置按钮的过渡颜色
        // 正常状态：红色
        button.normalColor = this.REMOVE_BG_COLOR;
        // 悬停状态：稍微变亮的红色
        const hoverColor = this.REMOVE_BG_COLOR.clone();
        hoverColor.r = Math.min(255, hoverColor.r * this.HOVER_BRIGHTNESS);
        hoverColor.g = Math.min(255, hoverColor.g * this.HOVER_BRIGHTNESS);
        hoverColor.b = Math.min(255, hoverColor.b * this.HOVER_BRIGHTNESS);
        button.hoverColor = hoverColor;
        // 按下状态：深红色
        button.pressedColor = this.REMOVE_BORDER_COLOR;
        // 禁用状态：灰色
        button.disabledColor = new Color(128, 128, 128, 255);
        
        // 设置过渡类型为颜色
        button.transition = Button.Transition.COLOR;
        
        // 设置按钮的目标节点（通常是 Sprite）
        if (button.target) {
            const sprite = button.target.getComponent(Sprite);
            if (sprite) {
                sprite.color = this.REMOVE_BG_COLOR;
            }
        }
        
        // 确保按钮节点有 UITransform 并设置锚点和大小
        let buttonTransform = buttonNode.getComponent(UITransform);
        if (!buttonTransform) {
            buttonTransform = buttonNode.addComponent(UITransform);
        }
        if (buttonTransform) {
            buttonTransform.setAnchorPoint(0.5, 0.5);
            // 设置按钮大小：宽度增大以容纳文字
            buttonTransform.setContentSize(this.BUTTON_WIDTH, this.BUTTON_SIZE);
        }
        
        // 查找按钮节点上的 Label 组件（可能是直接组件，也可能是子节点的组件）
        let label = buttonNode.getComponent(Label);
        if (!label) {
            // 如果没有直接组件，查找子节点的 Label
            const labelNode = buttonNode.getChildByName('Label');
            if (labelNode) {
                label = labelNode.getComponent(Label);
            }
        }
        
        // 设置 Label 文字：卖掉和卖掉获得的金币数量（同一行）
        if (label) {
            label.string = `卖掉 ${sellValue}`;
            label.color = Color.WHITE;
            label.fontSize = 14; // 字体大小 - 从16缩小到14（适配按钮缩小）
            label.horizontalAlign = Label.HorizontalAlign.CENTER;
            label.verticalAlign = Label.VerticalAlign.CENTER;
            label.enableOutline = true;
            label.outlineWidth = 2;
            label.outlineColor = new Color(0, 0, 0, 200); // 黑色描边，增强可读性
        }
    }
    
}

