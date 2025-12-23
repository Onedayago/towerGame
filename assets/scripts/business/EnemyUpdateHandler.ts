import { Node, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { BulletManager } from '../managers/BulletManager';
import { WeaponManager } from '../managers/WeaponManager';

/**
 * 敌人更新处理器
 * 负责处理所有敌人的更新逻辑（移动、攻击、边界检查等）
 */
export class EnemyUpdateHandler {
    private enemies: Node[] = [];
    private containerWidth: number = 0;
    private bulletManager: BulletManager | null = null;
    private weaponManager: WeaponManager | null = null;

    constructor(containerWidth: number) {
        this.containerWidth = containerWidth;
    }
    
    /**
     * 设置子弹管理器和武器管理器
     * @param bulletManager 子弹管理器
     * @param weaponManager 武器管理器
     */
    setManagers(bulletManager: BulletManager, weaponManager: WeaponManager) {
        this.bulletManager = bulletManager;
        this.weaponManager = weaponManager;
    }

    /**
     * 添加敌人到更新列表
     */
    addEnemy(enemy: Node) {
        this.enemies.push(enemy);
    }

    /**
     * 更新所有敌人
     * @param deltaTime 帧时间
     */
    update(deltaTime: number) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (!enemy || !enemy.isValid) {
                this.enemies.splice(i, 1);
                continue;
            }

            // 更新敌人位置和攻击
            this.updateEnemy(enemy, deltaTime);

            // 检查是否超出边界
            if (this.isOutOfBounds(enemy)) {
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }
    }

    /**
     * 更新单个敌人
     */
    private updateEnemy(enemy: Node, deltaTime: number) {
        // 尝试查找 EnemyBase 或其子类组件
        const enemyComponent = enemy.getComponent('EnemyBase') || 
                               enemy.getComponent('EnemyTank') ||
                               enemy.getComponent('EnemyFastTank') ||
                               enemy.getComponent('EnemyHeavyTank') ||
                               enemy.getComponent('EnemyBoss');
        
        if (enemyComponent) {
            // 设置管理器的引用（如果还没有设置）
            if (this.bulletManager && this.weaponManager) {
                if (typeof (enemyComponent as any).setManagers === 'function') {
                    (enemyComponent as any).setManagers(this.bulletManager, this.weaponManager);
                }
            }
            
            // 更新出现动画（如果正在出现动画中）
            if (typeof (enemyComponent as any).updateSpawnAnimation === 'function') {
                (enemyComponent as any).updateSpawnAnimation(deltaTime);
            }
            
            // 更新位置（出现动画完成后才移动）
            if (typeof (enemyComponent as any).updatePosition === 'function') {
                (enemyComponent as any).updatePosition(deltaTime, this.containerWidth);
            }
            if (typeof (enemyComponent as any).updateAttack === 'function') {
                (enemyComponent as any).updateAttack(deltaTime);
            }
        }
    }

    /**
     * 检查敌人是否超出边界
     * 当敌人的左边缘超过容器右边界时，认为已移出
     */
    private isOutOfBounds(enemy: Node): boolean {
        const currentPos = enemy.position;
        const enemyTransform = enemy.getComponent(UITransform);
        if (!enemyTransform) return false;
        
        // 敌人锚点在中心(0.5, 0.5)，所以需要计算左边缘位置
        // 左边缘 = position.x - width/2
        const leftEdge = currentPos.x - enemyTransform.width / 2;
        // 当左边缘超过容器宽度时，敌人已经完全移出右边界
        return leftEdge >= this.containerWidth;
    }

    /**
     * 移除敌人
     */
    removeEnemy(enemy: Node) {
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }
    }

    /**
     * 清理所有敌人
     */
    clearAll() {
        this.enemies.forEach(enemy => {
            if (enemy && enemy.isValid) {
                enemy.destroy();
            }
        });
        this.enemies = [];
    }

    /**
     * 设置容器宽度
     */
    setContainerWidth(width: number) {
        this.containerWidth = width;
    }

    /**
     * 获取当前敌人数量
     */
    getEnemyCount(): number {
        return this.enemies.length;
    }

    /**
     * 获取所有敌人节点
     * @returns 所有有效的敌人节点数组
     */
    getAllEnemies(): Node[] {
        // 过滤掉无效的敌人节点
        return this.enemies.filter(enemy => enemy && enemy.isValid);
    }
}

