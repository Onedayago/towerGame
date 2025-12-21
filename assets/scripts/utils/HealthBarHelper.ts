import { Node, Graphics, UITransform, Color, Vec3 } from 'cc';
import { UiConfig } from '../config/Index';
import { HealthBarRenderer } from '../renderers/HealthBarRenderer';

/**
 * 血条辅助类
 * 用于在节点顶部绘制血条
 */
export class HealthBarHelper {
    private static readonly HEALTH_BAR_WIDTH_RATIO = 0.9; // 血条宽度比例（相对于格子大小，不超过格子）
    private static readonly HEALTH_BAR_OFFSET_Y = 0.1; // 血条Y偏移比例（相对于格子大小，更靠近实体）

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

        // 计算血条宽度（不超过格子大小）
        const cellSize = UiConfig.CELL_SIZE;
        const healthBarWidth = cellSize * this.HEALTH_BAR_WIDTH_RATIO;
        const healthBarHeight = HealthBarRenderer.getHeight();
        
        // 设置血条节点大小和位置
        transform.setContentSize(healthBarWidth, healthBarHeight);
        transform.setAnchorPoint(0.5, 0.5);
        
        // 血条位置：节点顶部，更靠近实体
        const offsetY = (parentTransform.height / 2) + (cellSize * this.HEALTH_BAR_OFFSET_Y);
        healthBarNode.setPosition(0, offsetY, 0);

        // 计算血量百分比
        const healthPercent = Math.max(0, Math.min(1, currentHealth / maxHealth));
        
        // 使用渲染器绘制美化的血条
        HealthBarRenderer.render(graphics, healthBarWidth, healthBarHeight, healthPercent);
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

