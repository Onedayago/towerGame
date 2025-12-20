import { Node, Prefab, instantiate, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType, getEnemyConfig, ENEMY_CONFIGS } from '../constants/Index';

/**
 * 敌人生成处理器
 * 负责处理敌人的生成逻辑
 */
export class EnemySpawnHandler {
    private containerNode: Node;
    private enemyPrefabs: Map<EnemyType, Prefab> = new Map(); // 敌人类型到预制体的映射
    private spawnInterval: number = 2; // 生成间隔（秒）
    private spawnTimer: number = 0;
    private enabledTypes: EnemyType[] = []; // 启用的敌人类型列表

    constructor(containerNode: Node, enemyPrefabs: Map<EnemyType, Prefab> | null = null) {
        this.containerNode = containerNode;
        
        if (enemyPrefabs) {
            this.enemyPrefabs = enemyPrefabs;
            this.enabledTypes = Array.from(enemyPrefabs.keys());
            
        } else {
            // 默认启用所有类型
            this.enabledTypes = Object.values(EnemyType);
        }
        
        // 使用最短的生成间隔作为默认间隔
        this.updateSpawnInterval();
    }

    /**
     * 更新生成逻辑
     * @param deltaTime 帧时间
     * @returns 新生成的敌人节点，如果没有生成则返回 null
     */
    update(deltaTime: number): Node | null {
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
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

        // 随机选择敌人类型
        const randomIndex = Math.floor(Math.random() * this.enabledTypes.length);
        const selectedType = this.enabledTypes[randomIndex];
        const prefab = this.enemyPrefabs.get(selectedType);
        
        if (!prefab) return null;

        const cellSize = UiConfig.CELL_SIZE;
        const containerHeight = this.containerNode.getComponent(UITransform)!.height;
        const cellCountY = Math.floor(containerHeight / cellSize);

        // 随机选择一行
        const randomRow = Math.floor(Math.random() * cellCountY);

        // 计算最左边格子的位置
        const startX = 0;
        const startY = randomRow * cellSize;

        // 创建敌人
        const enemy = instantiate(prefab);
        enemy.setParent(this.containerNode);
        enemy.setPosition(startX, startY, 0);

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
        if (!this.enabledTypes.includes(type)) {
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
}

