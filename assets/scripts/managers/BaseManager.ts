import { Node, UITransform, Graphics } from 'cc';
import { HealthBarHelper } from '../utils/Index';
import { HealthBarRenderer } from '../renderers/HealthBarRenderer';
import { UiConfig } from '../config/Index';

/**
 * 基地管理器
 * 管理基地的生命值和状态
 */
export class BaseManager {
    private static instance: BaseManager | null = null;
    private baseNode: Node | null = null;
    private maxHealth: number = 1000; // 基地最大生命值
    private currentHealth: number = 1000; // 当前生命值
    private onBaseDestroyedCallback: (() => void) | null = null;

    private constructor() {}

    /**
     * 获取单例实例
     */
    static getInstance(): BaseManager {
        if (!BaseManager.instance) {
            BaseManager.instance = new BaseManager();
        }
        return BaseManager.instance;
    }

    /**
     * 初始化基地
     * @param baseNode 基地节点
     * @param maxHealth 最大生命值（可选，默认1000）
     */
    init(baseNode: Node, maxHealth: number = 1000) {
        this.baseNode = baseNode;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }

    /**
     * 基地受到伤害
     * @param damage 伤害值
     */
    takeDamage(damage: number) {
        if (this.currentHealth <= 0) {
            return; // 基地已被摧毁
        }

        this.currentHealth -= damage;
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }

        // 更新血条显示
        this.updateHealthBar();

        // 检查基地是否被摧毁
        if (this.currentHealth <= 0) {
            this.onBaseDestroyed();
        }
    }

    /**
     * 设置基地被摧毁的回调
     * @param callback 回调函数
     */
    setOnDestroyedCallback(callback: () => void) {
        this.onBaseDestroyedCallback = callback;
    }

    /**
     * 基地被摧毁时的处理
     */
    private onBaseDestroyed() {
        if (this.onBaseDestroyedCallback) {
            this.onBaseDestroyedCallback();
        }
    }

    /**
     * 获取当前生命值
     */
    getCurrentHealth(): number {
        return this.currentHealth;
    }

    /**
     * 获取最大生命值
     */
    getMaxHealth(): number {
        return this.maxHealth;
    }

    /**
     * 获取生命值百分比
     */
    getHealthPercentage(): number {
        if (this.maxHealth <= 0) return 0;
        return this.currentHealth / this.maxHealth;
    }

    /**
     * 检查基地是否存活
     */
    isAlive(): boolean {
        return this.currentHealth > 0;
    }

    /**
     * 获取基地节点
     */
    getBaseNode(): Node | null {
        return this.baseNode;
    }

    /**
     * 重置基地（重新开始游戏时调用）
     */
    reset() {
        this.currentHealth = this.maxHealth;
        this.updateHealthBar();
    }
    
    /**
     * 更新血条显示
     * 基地锚点在左下角(0,0)，血条需要显示在基地顶部
     */
    updateHealthBar() {
        if (!this.baseNode || !this.baseNode.isValid) return;
        
        // 查找血条节点
        let healthBarNode = this.baseNode.getChildByName('HealthBar');
        if (!healthBarNode) {
            // 如果血条节点不存在，创建它
            healthBarNode = new Node('HealthBar');
            healthBarNode.setParent(this.baseNode);
            healthBarNode.addComponent(Graphics);
            healthBarNode.addComponent(UITransform);
        }
        
        const graphics = healthBarNode.getComponent(Graphics);
        const transform = healthBarNode.getComponent(UITransform);
        const baseTransform = this.baseNode.getComponent(UITransform);
        
        if (!graphics || !transform || !baseTransform) return;
        
        // 计算血条宽度和高度
        const cellSize = UiConfig.CELL_SIZE;
        const healthBarWidth = cellSize * 1.8; // 基地是2x2格子，血条稍小一点
        const healthBarHeight = HealthBarRenderer.getHeight();
        
        // 设置血条节点大小和位置
        transform.setContentSize(healthBarWidth, healthBarHeight);
        transform.setAnchorPoint(0.5, 0.5);
        
        // 基地锚点在左下角(0,0)，血条位置在基地顶部上方
        // 基地顶部在 y = baseHeight，血条在顶部上方需要加上偏移
        const baseHeight = baseTransform.height;
        const offsetY = baseHeight + (cellSize * 0.25); // 在基地顶部上方
        const baseWidth = baseTransform.width;
        const centerX = baseWidth / 2; // 基地中心X位置
        
        healthBarNode.setPosition(centerX, offsetY, 0);
        
        // 确保血条不旋转（保持水平）
        healthBarNode.setRotationFromEuler(0, 0, 0);
        
        // 计算血量百分比
        const healthPercent = Math.max(0, Math.min(1, this.currentHealth / this.maxHealth));
        
        // 使用渲染器绘制美化的血条
        HealthBarRenderer.render(graphics, healthBarWidth, healthBarHeight, healthPercent);
    }
}

