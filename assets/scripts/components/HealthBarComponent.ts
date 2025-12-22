import { _decorator, Component, Node, Graphics, UITransform, Vec3 } from 'cc';
import { UiConfig } from '../config/Index';
import { HealthBarRenderer } from '../renderers/HealthBarRenderer';
const { ccclass } = _decorator;

/**
 * 血条组件
 * 参考微信小游戏实现，使用世界坐标定位，不受父节点旋转影响
 */
@ccclass('HealthBarComponent')
export class HealthBarComponent extends Component {
    public targetNode: Node | null = null; // 目标节点（敌人或武器）
    private currentHealth: number = 0;
    private maxHealth: number = 0;
    private graphics: Graphics | null = null;
    private transform: UITransform | null = null;
    
    // 血条配置
    private static readonly HEALTH_BAR_WIDTH_RATIO = 0.9; // 血条宽度比例
    private static readonly HEALTH_BAR_OFFSET_Y = 0.1; // 血条Y偏移比例
    
    /**
     * 初始化血条
     * @param targetNode 目标节点（敌人或武器）
     * @param currentHealth 当前生命值
     * @param maxHealth 最大生命值
     */
    init(targetNode: Node, currentHealth: number, maxHealth: number) {
        this.targetNode = targetNode;
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
        
        this.graphics = this.node.getComponent(Graphics);
        this.transform = this.node.getComponent(UITransform);
        
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
        
        if (!this.transform) {
            this.transform = this.node.addComponent(UITransform);
        }
        
        // 设置血条大小
        const cellSize = UiConfig.CELL_SIZE;
        const healthBarWidth = cellSize * HealthBarComponent.HEALTH_BAR_WIDTH_RATIO;
        const healthBarHeight = HealthBarRenderer.getHeight();
        
        if (this.transform) {
            this.transform.setContentSize(healthBarWidth, healthBarHeight);
            this.transform.setAnchorPoint(0.5, 0.5);
        }
        
        // 确保血条不旋转
        this.node.setRotationFromEuler(0, 0, 0);
        
        // 初始更新位置和绘制
        this.updatePosition();
        this.updateRender();
    }
    
    /**
     * 更新生命值
     * @param currentHealth 当前生命值
     * @param maxHealth 最大生命值
     */
    updateHealth(currentHealth: number, maxHealth: number) {
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
        this.updateRender();
    }
    
    /**
     * 更新血条位置（使用世界坐标）
     */
    private updatePosition() {
        if (!this.targetNode || !this.targetNode.isValid || !this.transform) return;
        
        // 获取目标节点的大小
        const targetTransform = this.targetNode.getComponent(UITransform);
        if (!targetTransform) return;
        
        // 计算血条在目标节点本地坐标系中的偏移（在目标节点上方）
        const cellSize = UiConfig.CELL_SIZE;
        const offsetY = (targetTransform.height / 2) + (cellSize * HealthBarComponent.HEALTH_BAR_OFFSET_Y);
        const localOffset = new Vec3(0, offsetY, 0);
        
        // 将偏移转换为世界坐标
        const worldOffset = new Vec3();
        this.targetNode.transform.transformPoint(localOffset, worldOffset);
        
        // 将血条节点设置到目标节点的父节点层级（通常是WarView）
        // 这样血条就不会受到目标节点旋转的影响
        const targetParent = this.targetNode.parent;
        if (targetParent && this.node.parent !== targetParent) {
            this.node.setParent(targetParent);
        }
        
        // 将世界坐标转换为血条父节点的本地坐标
        if (this.node.parent) {
            const localPos = new Vec3();
            this.node.parent.inverseTransformPoint(worldOffset, localPos);
            this.node.setPosition(localPos);
        } else {
            // 如果没有父节点，直接使用世界坐标
            this.node.setPosition(worldOffset);
        }
        
        // 确保血条不旋转
        this.node.setRotationFromEuler(0, 0, 0);
    }
    
    /**
     * 更新血条渲染
     */
    private updateRender() {
        if (!this.graphics || !this.transform) return;
        
        const width = this.transform.width;
        const height = this.transform.height;
        const healthPercent = this.maxHealth > 0 ? Math.max(0, Math.min(1, this.currentHealth / this.maxHealth)) : 0;
        
        HealthBarRenderer.render(this.graphics, width, height, healthPercent);
    }
    
    /**
     * 每帧更新血条位置
     */
    update() {
        if (!this.targetNode || !this.targetNode.isValid) {
            // 目标节点已销毁，销毁血条
            this.node.destroy();
            return;
        }
        
        // 持续更新位置，确保血条始终在目标上方
        this.updatePosition();
    }
}

