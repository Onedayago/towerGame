import { Node, Prefab, instantiate, UITransform, Vec3 } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType, getEnemyConfig, ENEMY_CONFIGS } from '../constants/Index';
import { WaveManager } from '../managers/WaveManager';
import { EnemyBase } from '../enemys/Index';
import { EnemySpawnEffect } from '../effects/Index';

/**
 * 敌人生成处理器
 * 负责处理敌人的生成逻辑
 */
export class EnemySpawnHandler {
    private containerNode: Node;
    private enemyPrefabs: Map<EnemyType, Prefab> = new Map(); // 敌人类型到预制体的映射
    private spawnEffectPrefab: Prefab | null = null; // 敌人生成特效预制体
    private spawnInterval: number = 2; // 生成间隔（秒）
    private spawnTimer: number = 0;
    private enabledTypes: EnemyType[] = []; // 启用的敌人类型列表
    private waveManager: WaveManager;

    constructor(containerNode: Node, enemyPrefabs: Map<EnemyType, Prefab> | null = null) {
        this.containerNode = containerNode;
        this.waveManager = WaveManager.getInstance();
        
        if (enemyPrefabs) {
            this.enemyPrefabs = enemyPrefabs;
            this.enabledTypes = Array.from(enemyPrefabs.keys());
            
        } else {
            // 默认启用所有类型
            this.enabledTypes = Object.keys(ENEMY_CONFIGS) as EnemyType[];
        }
        
        // 使用最短的生成间隔作为默认间隔
        this.updateSpawnInterval();
        
        // 设置基础生成间隔
        this.waveManager.setBaseSpawnInterval(this.spawnInterval);
    }

    /**
     * 更新生成逻辑
     * @param deltaTime 帧时间
     * @returns 新生成的敌人节点，如果没有生成则返回 null
     */
    update(deltaTime: number): Node | null {
        // 检查是否可以生成敌人（波次限制）
        if (!this.waveManager.canSpawnEnemy()) {
            return null;
        }
        
        // 根据波次更新生成间隔
        const currentSpawnInterval = this.waveManager.getSpawnInterval(this.spawnInterval);
        
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= currentSpawnInterval) {
            this.spawnTimer = 0;
            return this.spawn();
        }
        return null;
    }

    /**
     * 生成敌人
     * @returns 生成的敌人节点
     */
    spawn(): Node | null {
        if (this.enabledTypes.length === 0) return null;
        
        // 检查是否可以生成（波次限制）
        if (!this.waveManager.canSpawnEnemy()) {
            return null;
        }

        // 优先从波次类型池中选择，如果池为空则随机选择
        let selectedType: EnemyType | null = this.waveManager.getNextEnemyType();
        
        // 如果类型池返回的类型不在可用类型中，或者池为空，则随机选择
        if (!selectedType || this.enabledTypes.indexOf(selectedType) === -1 || !this.enemyPrefabs.has(selectedType)) {
            const randomIndex = Math.floor(Math.random() * this.enabledTypes.length);
            selectedType = this.enabledTypes[randomIndex];
        }
        
        const prefab = this.enemyPrefabs.get(selectedType);
        if (!prefab) return null;

        const cellSize = UiConfig.CELL_SIZE;
        const containerHeight = this.containerNode.getComponent(UITransform)!.height;
        const cellCountY = Math.floor(containerHeight / cellSize);

        // 随机选择一行
        const randomRow = Math.floor(Math.random() * cellCountY);

        // 计算最左边格子的中心位置（敌人锚点在中心）
        const startX = cellSize / 2; // 第一个格子的中心X
        const startY = randomRow * cellSize + cellSize / 2; // 随机行的中心Y

        // 创建敌人生成特效
        this.createSpawnEffect(startX, startY, selectedType);
        
        // 创建敌人
        const enemy = instantiate(prefab);
        enemy.setParent(this.containerNode);
        enemy.setPosition(startX, startY, 0);
        
        // 应用波次血量加成
        const enemyComponent = enemy.getComponent(EnemyBase);
        if (enemyComponent) {
            const hpBonus = this.waveManager.getHpBonus();
            enemyComponent.setHpBonus(hpBonus);
        }
        
        // 更新波次管理器
        this.waveManager.addEnemy();

        return enemy;
    }

    /**
     * 更新生成间隔（使用最短的间隔）
     */
    private updateSpawnInterval() {
        if (this.enabledTypes.length === 0) return;
        
        let minInterval = Infinity;
        for (const type of this.enabledTypes) {
            const config = getEnemyConfig(type);
            if (config.spawnInterval && config.spawnInterval < minInterval) {
                minInterval = config.spawnInterval;
            }
        }
        
        if (minInterval !== Infinity) {
            this.spawnInterval = minInterval;
        }
    }

    /**
     * 设置生成间隔
     */
    setSpawnInterval(interval: number) {
        this.spawnInterval = interval;
    }

    /**
     * 添加敌人预制体
     */
    addEnemyPrefab(type: EnemyType, prefab: Prefab) {
        this.enemyPrefabs.set(type, prefab);
        if (this.enabledTypes.indexOf(type) === -1) {
            this.enabledTypes.push(type);
        }
        this.updateSpawnInterval();
    }

    /**
     * 移除敌人类型
     */
    removeEnemyType(type: EnemyType) {
        this.enemyPrefabs.delete(type);
        const index = this.enabledTypes.indexOf(type);
        if (index !== -1) {
            this.enabledTypes.splice(index, 1);
        }
        this.updateSpawnInterval();
    }

    /**
     * 设置启用的敌人类型列表
     */
    setEnabledTypes(types: EnemyType[]) {
        this.enabledTypes = types.filter(type => this.enemyPrefabs.has(type));
        this.updateSpawnInterval();
    }

    /**
     * 获取启用的敌人类型列表
     */
    getEnabledTypes(): EnemyType[] {
        return [...this.enabledTypes];
    }
    
    /**
     * 设置敌人生成特效预制体
     * @param prefab 特效预制体
     */
    setSpawnEffectPrefab(prefab: Prefab) {
        this.spawnEffectPrefab = prefab;
    }
    
    /**
     * 创建敌人生成特效
     * @param x 特效X坐标
     * @param y 特效Y坐标
     * @param enemyType 敌人类型
     */
    private createSpawnEffect(x: number, y: number, enemyType: EnemyType) {
        // 如果提供了预制体，使用预制体创建
        if (this.spawnEffectPrefab) {
            const effectNode = instantiate(this.spawnEffectPrefab);
            effectNode.setParent(this.containerNode);
            effectNode.setPosition(x, y, 0);
            
            // 获取特效组件并初始化
            const effectComponent = effectNode.getComponent(EnemySpawnEffect);
            if (effectComponent) {
                effectComponent.init(new Vec3(x, y, 0), enemyType);
            }
        }
    }
}

