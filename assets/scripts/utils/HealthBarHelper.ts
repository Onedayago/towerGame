import { Node, Graphics, UITransform, Color, Vec3 } from 'cc';
import { UiConfig } from '../config/Index';

/**
 * 血条辅助类
 * 用于在节点顶部绘制血条
 */
export class HealthBarHelper {
    private static readonly HEALTH_BAR_HEIGHT = 4; // 血条高度
    private static readonly HEALTH_BAR_MARGIN = 4; // 血条边距（距离格子边缘的距离）
    private static readonly HEALTH_BAR_BG_COLOR = new Color(50, 50, 50, 255); // 血条背景颜色（深灰色）
    private static readonly HEALTH_BAR_COLOR = new Color(0, 255, 0, 255); // 血条颜色（绿色）
    private static readonly HEALTH_BAR_LOW_COLOR = new Color(255, 0, 0, 255); // 低血量颜色（红色）

    /**
     * 创建或更新血条
     * @param parentNode 父节点（敌人或武器节点）
     * @param currentHealth 当前生命值
     * @param maxHealth 最大生命值
     * @returns 血条节点
     */
    static createOrUpdateHealthBar(
        parentNode: Node,
        currentHealth: number,
        maxHealth: number
    ): Node | null {
        if (!parentNode || !parentNode.isValid || maxHealth <= 0) return null;

        // 查找或创建血条节点
        let healthBarNode = parentNode.getChildByName('HealthBar');
        
        if (!healthBarNode) {
            // 创建血条节点
            healthBarNode = new Node('HealthBar');
            healthBarNode.setParent(parentNode);
            
            // 添加 Graphics 组件用于绘制
            const graphics = healthBarNode.addComponent(Graphics);
            const transform = healthBarNode.getComponent(UITransform);
            
            if (!transform) {
                healthBarNode.addComponent(UITransform);
            }
        }

        // 更新血条
        this.updateHealthBar(healthBarNode, currentHealth, maxHealth);
        
        return healthBarNode;
    }

    /**
     * 更新血条显示
     * @param healthBarNode 血条节点
     * @param currentHealth 当前生命值
     * @param maxHealth 最大生命值
     */
    private static updateHealthBar(
        healthBarNode: Node,
        currentHealth: number,
        maxHealth: number
    ): void {
        const graphics = healthBarNode.getComponent(Graphics);
        const transform = healthBarNode.getComponent(UITransform);
        
        if (!graphics || !transform) return;

        // 获取父节点（敌人或武器）的大小
        const parentTransform = healthBarNode.parent?.getComponent(UITransform);
        if (!parentTransform) return;

        // 计算血条宽度（格子大小减去边距）
        const cellSize = UiConfig.CELL_SIZE;
        const healthBarWidth = cellSize - this.HEALTH_BAR_MARGIN * 2;
        
        // 设置血条节点大小和位置
        transform.setContentSize(healthBarWidth, this.HEALTH_BAR_HEIGHT);
        transform.setAnchorPoint(0.5, 0.5);
        
        // 血条位置：节点顶部，但限制在格子内
        // 计算血条应该位于格子顶部边缘内部
        const offsetY = (parentTransform.height / 2) - (this.HEALTH_BAR_HEIGHT / 2) - this.HEALTH_BAR_MARGIN;
        healthBarNode.setPosition(0, offsetY, 0);

        // 计算血量百分比
        const healthPercent = Math.max(0, Math.min(1, currentHealth / maxHealth));
        
        // 绘制血条
        graphics.clear();
        
        // 绘制背景（深灰色）
        graphics.fillColor = this.HEALTH_BAR_BG_COLOR;
        graphics.rect(
            -healthBarWidth / 2,
            -this.HEALTH_BAR_HEIGHT / 2,
            healthBarWidth,
            this.HEALTH_BAR_HEIGHT
        );
        graphics.fill();
        
        // 绘制血量条
        const healthWidth = healthBarWidth * healthPercent;
        if (healthWidth > 0) {
            // 根据血量百分比选择颜色（低于30%显示红色）
            graphics.fillColor = healthPercent <= 0.3 ? this.HEALTH_BAR_LOW_COLOR : this.HEALTH_BAR_COLOR;
            graphics.rect(
                -healthBarWidth / 2,
                -this.HEALTH_BAR_HEIGHT / 2,
                healthWidth,
                this.HEALTH_BAR_HEIGHT
            );
            graphics.fill();
        }
    }

    /**
     * 移除血条
     * @param parentNode 父节点
     */
    static removeHealthBar(parentNode: Node): void {
        if (!parentNode) return;
        
        const healthBarNode = parentNode.getChildByName('HealthBar');
        if (healthBarNode) {
            healthBarNode.destroy();
        }
    }
}

