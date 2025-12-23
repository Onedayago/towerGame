import { Node, Prefab, UITransform } from 'cc';
import { EnemyType } from '../constants/Index';
import { EnemySpawnHandler } from '../business/EnemySpawnHandler';
import { EnemyUpdateHandler } from '../business/EnemyUpdateHandler';
import { BulletManager } from './BulletManager';
import { WeaponManager } from './WeaponManager';
import { WaveManager } from './WaveManager';

/**
 * 敌人管理器
 * 协调敌人生成和更新逻辑
 */
export class EnemyManager {
    private containerNode: Node;
    private enemyPrefabs: Map<EnemyType, Prefab> = new Map();
    private containerWidth: number = 0;
    
    private spawnHandler: EnemySpawnHandler;
    private updateHandler: EnemyUpdateHandler;
    private waveManager: WaveManager;

    constructor(containerNode: Node, enemyPrefabs: Map<EnemyType, Prefab> | null = null) {
        this.containerNode = containerNode;
        this.waveManager = WaveManager.getInstance();
        
        if (enemyPrefabs) {
            this.enemyPrefabs = enemyPrefabs;
        }
        
        const transform = containerNode.getComponent(UITransform);
        if (transform) {
            this.containerWidth = transform.width;
        }

        // 初始化生成和更新处理器
        this.spawnHandler = new EnemySpawnHandler(containerNode, enemyPrefabs);
        this.updateHandler = new EnemyUpdateHandler(this.containerWidth);
        
        // 初始化波次管理器并开始第一波
        this.waveManager.init();
        this.waveManager.startNewWave();
    }

    /**
     * 更新管理器
     * @param deltaTime 帧时间
     */
    update(deltaTime: number) {
        // 检查波次是否完成，如果完成则开始下一波
        const currentEnemyCount = this.updateHandler.getEnemyCount();
        if (this.waveManager.checkWaveComplete(currentEnemyCount)) {
            // 波次完成，开始下一波
            this.waveManager.startNewWave();
        }
        
        // 更新生成逻辑（只有在波次未完成时才会生成）
        const newEnemy = this.spawnHandler.update(deltaTime);
        if (newEnemy) {
            this.updateHandler.addEnemy(newEnemy);
        }

        // 更新所有敌人
        this.updateHandler.update(deltaTime);
    }

    /**
     * 清理所有敌人
     */
    clearAll() {
        this.updateHandler.clearAll();
    }

    /**
     * 设置生成间隔
     */
    setSpawnInterval(interval: number) {
        this.spawnHandler.setSpawnInterval(interval);
    }

    /**
     * 添加敌人预制体
     */
    addEnemyPrefab(type: EnemyType, prefab: Prefab) {
        this.enemyPrefabs.set(type, prefab);
        this.spawnHandler.addEnemyPrefab(type, prefab);
    }

    /**
     * 移除敌人类型
     */
    removeEnemyType(type: EnemyType) {
        this.enemyPrefabs.delete(type);
        this.spawnHandler.removeEnemyType(type);
    }

    /**
     * 设置启用的敌人类型列表
     */
    setEnabledTypes(types: EnemyType[]) {
        this.spawnHandler.setEnabledTypes(types);
    }

    /**
     * 获取启用的敌人类型列表
     */
    getEnabledTypes(): EnemyType[] {
        return this.spawnHandler.getEnabledTypes();
    }

    /**
     * 获取所有敌人节点
     * @returns 所有有效的敌人节点数组
     */
    getAllEnemies(): Node[] {
        return this.updateHandler.getAllEnemies();
    }
    
    /**
     * 设置子弹管理器和武器管理器
     * @param bulletManager 子弹管理器
     * @param weaponManager 武器管理器
     */
    setManagers(bulletManager: BulletManager, weaponManager: WeaponManager) {
        this.updateHandler.setManagers(bulletManager, weaponManager);
    }
    
    /**
     * 设置敌人生成特效预制体
     * @param prefab 特效预制体
     */
    setSpawnEffectPrefab(prefab: Prefab) {
        this.spawnHandler.setSpawnEffectPrefab(prefab);
    }
}

