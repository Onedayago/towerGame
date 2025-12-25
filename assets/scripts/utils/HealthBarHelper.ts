import { Node, Graphics, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { HealthBarRenderer } from '../renderers/HealthBarRenderer';
import { HealthBarComponent } from '../components/HealthBarComponent';

/**
 * 血条辅助类
 * 使用预制体中已有的血条节点，确保血条不受父节点旋转影响
 */
export class HealthBarHelper {
    private static readonly HEALTH_BAR_WIDTH_RATIO = 0.9; // 血条宽度比例
    private static readonly HEALTH_BAR_OFFSET_Y = 0.25; // 血条Y偏移比例（增大间距）
    
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

        // 查找预制体中已有的血条节点
        const healthBarNode = parentNode.getChildByName('HealthBar');
        
        if (!healthBarNode) {
            console.warn(`HealthBar node not found in ${parentNode.name}, please add it in the editor.`);
            return null;
        }

        // 更新血条
        this.updateHealthBar(healthBarNode, parentNode, currentHealth, maxHealth);
        
        return healthBarNode;
    }
    
    /**
     * 更新血条显示
     * @param healthBarNode 血条节点
     * @param parentNode 父节点（敌人或武器）
     * @param currentHealth 当前生命值
     * @param maxHealth 最大生命值
     */
    private static updateHealthBar(
        healthBarNode: Node,
        parentNode: Node,
        currentHealth: number,
        maxHealth: number
    ): void {
        const graphics = healthBarNode.getComponent(Graphics);
        const transform = healthBarNode.getComponent(UITransform);
        
        if (!graphics || !transform) return;

        // 获取父节点的大小
        const parentTransform = parentNode.getComponent(UITransform);
        if (!parentTransform) return;

        // 计算血条宽度和高度
        const cellSize = UiConfig.CELL_SIZE;
        const healthBarWidth = cellSize * this.HEALTH_BAR_WIDTH_RATIO;
        const healthBarHeight = HealthBarRenderer.getHeight();
        
        // 设置血条节点大小和位置
        transform.setContentSize(healthBarWidth, healthBarHeight);
        transform.setAnchorPoint(0.5, 0.5);
        
        // 血条位置：节点顶部，更靠近实体
        const offsetY = (parentTransform.height / 2) + (cellSize * this.HEALTH_BAR_OFFSET_Y);
        healthBarNode.setPosition(0, offsetY, 0);
        
        // 确保血条不旋转（保持水平）
        healthBarNode.setRotationFromEuler(0, 0, 0);

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
        
        // 在父节点中查找血条（因为血条可能已经移动到父节点的父节点）
        let healthBarNode = parentNode.getChildByName('HealthBar');
        
        // 如果没找到，尝试在父节点的父节点中查找
        if (!healthBarNode && parentNode.parent) {
            healthBarNode = parentNode.parent.getChildByName('HealthBar');
        }
        
        // 如果还是没找到，遍历所有子节点查找（包括子节点的子节点）
        if (!healthBarNode && parentNode.parent) {
            const findHealthBar = (node: Node): Node | null => {
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    if (child.name === 'HealthBar') {
                        const component = child.getComponent(HealthBarComponent);
                        if (component && component.targetNode === parentNode) {
                            return child;
                        }
                    }
                    const found = findHealthBar(child);
                    if (found) return found;
                }
                return null;
            };
            healthBarNode = findHealthBar(parentNode.parent);
        }
        
        if (healthBarNode) {
            healthBarNode.destroy();
        }
    }
    
    /**
     * 保持血条水平显示（已废弃，使用新的组件系统）
     * @param healthBarNode 血条节点
     */
    static keepHealthBarHorizontal(healthBarNode: Node): void {
        // 新系统不需要此方法，血条组件会自动处理
    }
}

