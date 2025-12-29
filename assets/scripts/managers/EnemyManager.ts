import { Node, Prefab, UITransform, Vec3 } from 'cc';
import { EnemyType } from '../constants/Index';
import { EnemySpawnHandler } from '../business/EnemySpawnHandler';
import { EnemyUpdateHandler } from '../business/EnemyUpdateHandler';
import { BulletManager } from './BulletManager';
import { WeaponManager } from './WeaponManager';
import { WaveManager } from './WaveManager';
import { PathFinder } from '../utils/PathFinder';

/**
 * 敌人管理器
 * 协调敌人生成和更新逻辑
 */
export class EnemyManager {
    private containerNode: Node;
    private enemyPrefabs: Map<EnemyType, Prefab> = new Map();
    private containerWidth: number = 0;
    private containerHeight: number = 0;
    
    private spawnHandler: EnemySpawnHandler;
    private updateHandler: EnemyUpdateHandler;
    private waveManager: WaveManager;
    private pathFinder: PathFinder | null = null;

    constructor(containerNode: Node, enemyPrefabs: Map<EnemyType, Prefab> | null = null) {
        this.containerNode = containerNode;
        this.waveManager = WaveManager.getInstance();
        
        if (enemyPrefabs) {
            this.enemyPrefabs = enemyPrefabs;
        }
        
        const transform = containerNode.getComponent(UITransform);
        if (transform) {
            this.containerWidth = transform.width;
            this.containerHeight = transform.height;
        }

        // 初始化生成和更新处理器
        this.spawnHandler = new EnemySpawnHandler(containerNode, enemyPrefabs);
        this.updateHandler = new EnemyUpdateHandler(this.containerWidth, this.containerHeight);
        
        // 初始化波次管理器（不开始第一波，等待游戏开始）
        this.waveManager.init();
    }

    /**
     * 开始第一波（游戏开始时调用）
     */
    startFirstWave() {
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
     * 检查指定位置是否有敌人
     * @param x X坐标（世界坐标）
     * @param y Y坐标（世界坐标）
     * @returns 是否有敌人
     */
    hasEnemyAt(x: number, y: number): boolean {
        const enemies = this.getAllEnemies();
        const epsilon = 0.1; // 允许的误差范围
        
        for (const enemy of enemies) {
            if (!enemy || !enemy.isValid) continue;
            
            const enemyPos = enemy.position;
            const enemyTransform = enemy.getComponent(UITransform);
            if (!enemyTransform) continue;
            
            // 敌人锚点在中心，计算敌人占据的范围
            const enemyWidth = enemyTransform.width;
            const enemyHeight = enemyTransform.height;
            const enemyLeft = enemyPos.x - enemyWidth / 2;
            const enemyRight = enemyPos.x + enemyWidth / 2;
            const enemyBottom = enemyPos.y - enemyHeight / 2;
            const enemyTop = enemyPos.y + enemyHeight / 2;
            
            // 检查位置是否在敌人范围内
            if (x >= enemyLeft - epsilon && x <= enemyRight + epsilon &&
                y >= enemyBottom - epsilon && y <= enemyTop + epsilon) {
                return true;
            }
        }
        return false;
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
     * 设置寻路器和基地目标位置
     * @param pathFinder 寻路器
     * @param baseTarget 基地目标位置
     */
    setPathfinding(pathFinder: PathFinder, baseTarget: Vec3) {
        this.pathFinder = pathFinder;
        this.updateHandler.setPathfinding(pathFinder, baseTarget);
    }

    /**
     * 初始化寻路器
     * @param weaponManager 武器管理器（可选，用于将武器作为障碍物）
     * @returns 初始化后的寻路器实例
     */
    initPathfinder(weaponManager?: WeaponManager): PathFinder {
        if (!this.pathFinder) {
            this.pathFinder = new PathFinder();
        }
        this.pathFinder.init(this.containerWidth, this.containerHeight, weaponManager);
        if (weaponManager) {
            this.pathFinder.setWeaponManager(weaponManager);
        }
        return this.pathFinder;
    }
    
    /**
     * 设置敌人生成特效预制体
     * @param prefab 特效预制体
     */
    setSpawnEffectPrefab(prefab: Prefab) {
        this.spawnHandler.setSpawnEffectPrefab(prefab);
    }
    
    /**
     * 获取寻路器实例（供外部调用）
     * @returns 寻路器实例，如果未初始化则返回 null
     */
    getPathFinder(): PathFinder | null {
        return this.pathFinder;
    }
}

