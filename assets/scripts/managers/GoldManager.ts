/**
 * 金币管理器
 * 管理游戏中的金币系统
 */
export class GoldManager {
    private static instance: GoldManager | null = null;
    private gold: number = 0;
    
    private constructor() {}
    
    /**
     * 获取单例实例
     */
    static getInstance(): GoldManager {
        if (!GoldManager.instance) {
            GoldManager.instance = new GoldManager();
        }
        return GoldManager.instance;
    }
    
    /**
     * 初始化金币
     * @param initialGold 初始金币数量
     */
    init(initialGold: number = 1000) {
        this.gold = initialGold;
    }
    
    /**
     * 获取当前金币
     */
    getGold(): number {
        return this.gold;
    }
    
    /**
     * 增加金币
     * @param amount 增加的数量
     */
    addGold(amount: number) {
        this.gold += amount;
    }
    
    /**
     * 消费金币
     * @param amount 消费的数量
     * @returns 是否成功消费
     */
    spend(amount: number): boolean {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * 检查是否有足够的金币
     * @param amount 需要的数量
     */
    canAfford(amount: number): boolean {
        return this.gold >= amount;
    }
}

