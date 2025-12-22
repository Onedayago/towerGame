import { WaveConfig } from '../config/WaveConfig';
import { EnemyType } from '../constants/Index';

/**
 * 波次管理器
 * 管理游戏中的波次系统
 */
export class WaveManager {
    private static instance: WaveManager | null = null;
    private waveLevel: number = 0;
    private waveEnemyCount: number = 0;
    private maxEnemiesPerWave: number = 15;
    private isWaveComplete: boolean = false;
    private hpBonus: number = 0; // 血量加成倍数
    private currentWaveEnemyTypes: EnemyType[] = []; // 当前波次的敌人类型池
    private baseSpawnInterval: number = 2.0; // 基础生成间隔
    
    private constructor() {}
    
    /**
     * 获取单例实例
     */
    static getInstance(): WaveManager {
        if (!WaveManager.instance) {
            WaveManager.instance = new WaveManager();
        }
        return WaveManager.instance;
    }
    
    /**
     * 初始化波次管理器
     */
    init() {
        this.waveLevel = 0;
        this.waveEnemyCount = 0;
        this.isWaveComplete = false;
        this.hpBonus = 0;
        this.currentWaveEnemyTypes = [];
    }
    
    /**
     * 开始新波次
     */
    startNewWave() {
        this.waveLevel++;
        this.waveEnemyCount = 0;
        this.isWaveComplete = false;
        
        // 计算血量加成：每波增加 HP_BONUS_PER_WAVE 倍
        this.hpBonus = (this.waveLevel - 1) * WaveConfig.HP_BONUS_PER_WAVE;
        
        // 生成当前波次的敌人类型池
        this.generateWaveEnemyTypes();
    }
    
    /**
     * 为当前波次生成随机的敌人种类组合
     * 参考原游戏实现：确保每种类型至少出现一次，然后根据权重随机生成
     */
    private generateWaveEnemyTypes() {
        // 所有可用的敌人类型及其权重
        const allEnemyTypes: Array<{ type: EnemyType; weight: number }> = [
            { type: EnemyType.TANK, weight: 30 },      // 普通坦克：30% 权重
            { type: EnemyType.FAST_TANK, weight: 25 },  // 快速坦克：25% 权重
            { type: EnemyType.HEAVY_TANK, weight: 20 }, // 重型坦克：20% 权重
            { type: EnemyType.BOSS, weight: 10 }         // Boss：10% 权重
        ];
        
        // 根据波次调整权重（后期波次增加难度）
        const waveMultiplier = Math.min(1 + (this.waveLevel - 1) * 0.1, 2); // 最多2倍权重
        
        // 计算总权重
        let totalWeight = 0;
        for (const enemyType of allEnemyTypes) {
            totalWeight += enemyType.weight * waveMultiplier;
        }
        
        // 生成当前波次的敌人类型池
        this.currentWaveEnemyTypes = [];
        
        // 确保每种类型至少出现一次（前几个）
        const minTypes = Math.min(allEnemyTypes.length, this.maxEnemiesPerWave);
        for (let i = 0; i < minTypes; i++) {
            this.currentWaveEnemyTypes.push(allEnemyTypes[i].type);
        }
        
        // 剩余敌人根据权重随机生成
        for (let i = this.currentWaveEnemyTypes.length; i < this.maxEnemiesPerWave; i++) {
            const random = Math.random() * totalWeight;
            let currentWeight = 0;
            
            for (const enemyType of allEnemyTypes) {
                currentWeight += enemyType.weight * waveMultiplier;
                if (random <= currentWeight) {
                    this.currentWaveEnemyTypes.push(enemyType.type);
                    break;
                }
            }
        }
        
        // 打乱顺序，使敌人种类更随机
        for (let i = this.currentWaveEnemyTypes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentWaveEnemyTypes[i], this.currentWaveEnemyTypes[j]] = 
                [this.currentWaveEnemyTypes[j], this.currentWaveEnemyTypes[i]];
        }
    }
    
    /**
     * 从当前波次的敌人类型池中获取下一个敌人类型
     * @returns 敌人类型，如果池为空则返回 null
     */
    getNextEnemyType(): EnemyType | null {
        if (this.currentWaveEnemyTypes.length === 0) {
            return null;
        }
        // 从池中取出第一个类型
        return this.currentWaveEnemyTypes.shift() || null;
    }
    
    /**
     * 获取当前波次的血量加成倍数
     */
    getHpBonus(): number {
        return this.hpBonus;
    }
    
    /**
     * 获取当前波次的生成间隔（根据波次递减）
     * @param baseInterval 基础生成间隔
     */
    getSpawnInterval(baseInterval: number): number {
        // 每波生成间隔递减，但不超过最小值
        const calculatedInterval = baseInterval * Math.pow(WaveConfig.SPAWN_INTERVAL_REDUCTION, this.waveLevel - 1);
        return Math.max(WaveConfig.MIN_SPAWN_INTERVAL, calculatedInterval);
    }
    
    /**
     * 设置基础生成间隔
     */
    setBaseSpawnInterval(interval: number) {
        this.baseSpawnInterval = interval;
    }
    
    /**
     * 增加当前波次的敌人数量
     * @returns 是否成功添加（如果已达到上限则返回 false）
     */
    addEnemy(): boolean {
        if (this.waveEnemyCount >= this.maxEnemiesPerWave) {
            return false;
        }
        this.waveEnemyCount++;
        return true;
    }
    
    /**
     * 检查是否可以生成更多敌人
     */
    canSpawnEnemy(): boolean {
        return !this.isWaveComplete && this.waveEnemyCount < this.maxEnemiesPerWave;
    }
    
    /**
     * 检查波次是否完成
     * @param currentEnemyCount 当前存活的敌人数量
     */
    checkWaveComplete(currentEnemyCount: number): boolean {
        // 波次完成条件：已生成足够敌人且所有敌人都已被消灭或离开
        if (!this.isWaveComplete && 
            this.waveEnemyCount >= this.maxEnemiesPerWave && 
            currentEnemyCount === 0) {
            this.isWaveComplete = true;
            return true;
        }
        return false;
    }
    
    /**
     * 获取当前波次
     */
    getWaveLevel(): number {
        return this.waveLevel;
    }
    
    /**
     * 获取当前波次进度
     */
    getWaveProgress(): { current: number; max: number } {
        return {
            current: this.waveEnemyCount,
            max: this.maxEnemiesPerWave
        };
    }
    
    /**
     * 设置每波最大敌人数量
     */
    setMaxEnemiesPerWave(max: number) {
        this.maxEnemiesPerWave = max;
    }
    
    /**
     * 检查波次是否已完成
     */
    isCurrentWaveComplete(): boolean {
        return this.isWaveComplete;
    }
}

