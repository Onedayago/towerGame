import { Node, Prefab, instantiate, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType, getEnemyConfig, DEFAULT_ENEMY_TYPE, EnemyConfig } from '../constants/Index';

/**
 * 敌人管理器
 */
export class EnemyManager {
    private enemyTanks: Node[] = [];
    private spawnInterval: number = 2; // 生成间隔（秒）
    private spawnTimer: number = 0;
    private containerNode: Node;
    private enemyTankPrefab: Prefab | null = null;
    private containerWidth: number = 0;
    private defaultEnemyType: EnemyType = DEFAULT_ENEMY_TYPE;

    constructor(containerNode: Node, enemyTankPrefab: Prefab | null, defaultEnemyType: EnemyType = DEFAULT_ENEMY_TYPE) {
        this.containerNode = containerNode;
        this.enemyTankPrefab = enemyTankPrefab;
        this.defaultEnemyType = defaultEnemyType;
        
        const transform = containerNode.getComponent(UITransform);
        if (transform) {
            this.containerWidth = transform.width;
        }

        // 根据默认敌人类型设置生成间隔
        const config = getEnemyConfig(defaultEnemyType);
        if (config.spawnInterval) {
            this.spawnInterval = config.spawnInterval;
        }
    }

    /**
     * 更新管理器
     * @param deltaTime 帧时间
     */
    update(deltaTime: number) {
        // 定时生成坦克
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnEnemyTank();
            this.spawnTimer = 0;
        }

        // 更新所有坦克的位置
        for (let i = this.enemyTanks.length - 1; i >= 0; i--) {
            const tank = this.enemyTanks[i];
            if (!tank || !tank.isValid) {
                this.enemyTanks.splice(i, 1);
                continue;
            }

            // 让坦克自己更新位置和攻击
            const tankComponent = tank.getComponent('EnemyTank');
            if (tankComponent) {
                if (typeof (tankComponent as any).updatePosition === 'function') {
                    (tankComponent as any).updatePosition(deltaTime, this.containerWidth);
                }
                if (typeof (tankComponent as any).updateAttack === 'function') {
                    (tankComponent as any).updateAttack(deltaTime);
                }
            }

            // 检查是否超出边界
            const currentPos = tank.position;
            if (currentPos.x > this.containerWidth) {
                tank.destroy();
                this.enemyTanks.splice(i, 1);
            }
        }
    }

    /**
     * 生成敌人坦克
     */
    private spawnEnemyTank() {
        if (!this.enemyTankPrefab) return;

        const cellSize = UiConfig.CELL_SIZE;
        const containerHeight = this.containerNode.getComponent(UITransform)!.height;
        const cellCountY = Math.floor(containerHeight / cellSize);

        // 随机选择一行
        const randomRow = Math.floor(Math.random() * cellCountY);

        // 计算最左边格子的位置
        const startX = 0;
        const startY = randomRow * cellSize;

        // 创建坦克
        const tank = instantiate(this.enemyTankPrefab);
        tank.setParent(this.containerNode);
        tank.setPosition(startX, startY, 0);

        // 设置敌人类型
        const tankComponent = tank.getComponent('EnemyTank');
        if (tankComponent && (tankComponent as any).enemyType !== undefined) {
            (tankComponent as any).enemyType = this.defaultEnemyType;
        }

        this.enemyTanks.push(tank);
    }

    /**
     * 清理所有敌人
     */
    clearAll() {
        this.enemyTanks.forEach(tank => {
            if (tank && tank.isValid) {
                tank.destroy();
            }
        });
        this.enemyTanks = [];
    }

    /**
     * 设置生成间隔
     */
    setSpawnInterval(interval: number) {
        this.spawnInterval = interval;
    }

    /**
     * 设置默认敌人类型
     */
    setDefaultEnemyType(type: EnemyType) {
        this.defaultEnemyType = type;
        const config = getEnemyConfig(type);
        if (config.spawnInterval) {
            this.spawnInterval = config.spawnInterval;
        }
    }
}

