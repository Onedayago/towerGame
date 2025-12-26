import { Node, UITransform } from 'cc';

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
    }
}

