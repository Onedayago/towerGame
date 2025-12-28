import { Node, Prefab, UITransform, Vec3 } from 'cc';
import { BulletBase } from '../bullets/Index';
import { EnemyManager } from './EnemyManager';
import { EnemyBase } from '../enemys/Index';
import { WeaponManager } from './WeaponManager';
import { WeaponBase } from '../weapons/Index';
import { BulletType } from '../constants/Index';
import { GameManager } from './GameManager';
import { BaseManager } from './BaseManager';

/**
 * 子弹管理器
 * 管理所有子弹的生命周期
 */
export class BulletManager {
    private containerNode: Node;
    private bullets: Node[] = [];
    private enemyManager: EnemyManager | null = null;
    private weaponManager: WeaponManager | null = null;

    constructor(containerNode: Node) {
        this.containerNode = containerNode;
    }

    /**
     * 设置敌人管理器
     * @param enemyManager 敌人管理器
     */
    setEnemyManager(enemyManager: EnemyManager) {
        this.enemyManager = enemyManager;
    }
    
    /**
     * 设置武器管理器
     * @param weaponManager 武器管理器
     */
    setWeaponManager(weaponManager: WeaponManager) {
        this.weaponManager = weaponManager;
    }

    /**
     * 添加子弹
     * @param bulletNode 子弹节点
     */
    addBullet(bulletNode: Node) {
        if (!bulletNode || !bulletNode.isValid) return;
        
        // 确保子弹节点是容器的子节点
        if (bulletNode.parent !== this.containerNode) {
            bulletNode.setParent(this.containerNode);
        }
        
        // 设置子弹节点层级，确保子弹显示在基地上面（siblingIndex 越大，越后渲染，显示在顶层）
        // 将子弹放在较高的层级，确保显示在基地、武器、敌人等之上
        bulletNode.setSiblingIndex(999);
    
        this.bullets.push(bulletNode);
    }

    /**
     * 移除子弹
     * @param bulletNode 子弹节点
     */
    removeBullet(bulletNode: Node) {
        const index = this.bullets.indexOf(bulletNode);
        if (index !== -1) {
            this.bullets.splice(index, 1);
        }
    }

    /**
     * 更新所有子弹
     * @param deltaTime 帧时间
     */
    update(deltaTime: number) {
        // 检查游戏状态，如果游戏未开始或已暂停，不更新子弹
        const gameManager = GameManager.getInstance();
        if (!gameManager.canUpdate()) {
            return;
        }
        
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // 检查子弹节点是否有效
            if (!bullet || !bullet.isValid) {
                this.bullets.splice(i, 1);
                continue;
            }

            // 更新子弹位置
            const bulletComponent = bullet.getComponent(BulletBase);
            if (bulletComponent) {
                // 检查子弹是否已经被销毁（例如 WeaponRocketBullet 自己处理碰撞后销毁）
                if (!bullet.isValid) {
                    this.bullets.splice(i, 1);
                    continue;
                }
                
                bulletComponent.update(deltaTime);
                
                // 再次检查子弹是否在 update 过程中被销毁（例如 WeaponRocketBullet 的 onHitTarget 会销毁子弹）
                if (!bullet.isValid) {
                    this.bullets.splice(i, 1);
                    continue;
                }
                
                // 根据子弹类型检测碰撞
                const bulletType = this.getBulletType(bulletComponent);
                let hit = false;
                
                if (this.isWeaponBullet(bulletType)) {
                    // 武器子弹：检测与敌人的碰撞
                    // 注意：WeaponRocketBullet 有自己的碰撞检测逻辑，会在 update 中自己处理碰撞
                    // 所以这里只检测非火箭子弹，或者火箭子弹没有被自己处理的情况
                    if (bulletType !== BulletType.WEAPON_ROCKET) {
                        const hitEnemy = this.checkCollisionWithEnemies(bullet, bulletComponent);
                        if (hitEnemy) {
                            hit = true;
                        }
                    }
                } else if (this.isEnemyBullet(bulletType)) {
                    // 敌人子弹：只检测与基地的碰撞
                    const hitBase = this.checkCollisionWithBase(bullet, bulletComponent);
                    if (hitBase) {
                        hit = true;
                    }
                }
                
                if (hit) {
                    // 击中目标，销毁子弹
                    this.removeBullet(bullet);
                    bullet.destroy();
                    continue;
                }
            }
        }
    }

    /**
     * 检测子弹与敌人的碰撞
     * @param bullet 子弹节点
     * @param bulletComponent 子弹组件
     * @returns 被击中的敌人节点，如果没有击中则返回 null
     */
    private checkCollisionWithEnemies(bullet: Node, bulletComponent: BulletBase): Node | null {
        if (!this.enemyManager) return null;

        const enemies = this.enemyManager.getAllEnemies();
        if (enemies.length === 0) return null;

        const bulletTransform = bullet.getComponent(UITransform);
        if (!bulletTransform) return null;

        const bulletPos = bullet.position;
        const bulletRadius = Math.max(bulletTransform.width, bulletTransform.height) / 2;

        // 遍历所有敌人，检测碰撞
        for (const enemy of enemies) {
            if (!enemy || !enemy.isValid) continue;

            const enemyTransform = enemy.getComponent(UITransform);
            if (!enemyTransform) continue;

            const enemyPos = enemy.position;
            const enemyRadius = Math.max(enemyTransform.width, enemyTransform.height) / 2;

            // 计算距离
            const distance = Vec3.distance(bulletPos, enemyPos);

            // 检测碰撞（使用圆形碰撞检测）
            if (distance < bulletRadius + enemyRadius) {
                // 击中敌人，造成伤害
                const enemyComponent = enemy.getComponent(EnemyBase);
                if (enemyComponent) {
                    enemyComponent.takeDamage(bulletComponent.getDamage());
                }
                return enemy;
            }
        }

        return null;
    }
    

    /**
     * 检测子弹与基地的碰撞
     * @param bullet 子弹节点
     * @param bulletComponent 子弹组件
     * @returns 是否击中基地
     */
    private checkCollisionWithBase(bullet: Node, bulletComponent: BulletBase): boolean {
        const baseManager = BaseManager.getInstance();
        const baseNode = baseManager.getBaseNode();
        
        if (!baseNode || !baseNode.isValid || !baseManager.isAlive()) {
            return false;
        }

        const bulletTransform = bullet.getComponent(UITransform);
        if (!bulletTransform) return false;

        const bulletPos = bullet.position;
        const bulletRadius = Math.max(bulletTransform.width, bulletTransform.height) / 2;

        const baseTransform = baseNode.getComponent(UITransform);
        if (!baseTransform) return false;

        const basePos = baseNode.position;
        const baseWidth = baseTransform.width;
        const baseHeight = baseTransform.height;

        // 基地锚点在左下角 (0, 0)，使用矩形碰撞检测
        // 基地的边界框
        const baseLeft = basePos.x;
        const baseRight = basePos.x + baseWidth;
        const baseBottom = basePos.y;
        const baseTop = basePos.y + baseHeight;

        // 子弹位置（考虑子弹半径，扩展碰撞范围）
        const bulletLeft = bulletPos.x - bulletRadius;
        const bulletRight = bulletPos.x + bulletRadius;
        const bulletBottom = bulletPos.y - bulletRadius;
        const bulletTop = bulletPos.y + bulletRadius;

        // 矩形碰撞检测
        if (bulletRight >= baseLeft && bulletLeft <= baseRight &&
            bulletTop >= baseBottom && bulletBottom <= baseTop) {
            // 击中基地，造成伤害
            baseManager.takeDamage(bulletComponent.getDamage());
            return true;
        }

        return false;
    }
    
    /**
     * 获取子弹类型
     * @param bulletComponent 子弹组件
     * @returns 子弹类型
     */
    private getBulletType(bulletComponent: BulletBase): BulletType {
        // 使用公开方法获取子弹类型
        if (typeof bulletComponent.getBulletTypePublic === 'function') {
            return bulletComponent.getBulletTypePublic();
        }
        // 默认返回武器子弹类型
        return BulletType.WEAPON_BASIC;
    }
    
    /**
     * 判断是否为武器子弹
     * @param bulletType 子弹类型
     * @returns 是否为武器子弹
     */
    private isWeaponBullet(bulletType: BulletType): boolean {
        return bulletType === BulletType.WEAPON_BASIC ||
               bulletType === BulletType.WEAPON_LASER ||
               bulletType === BulletType.WEAPON_ROCKET;
    }
    
    /**
     * 判断是否为敌人子弹
     * @param bulletType 子弹类型
     * @returns 是否为敌人子弹
     */
    private isEnemyBullet(bulletType: BulletType): boolean {
        return bulletType === BulletType.ENEMY_TANK ||
               bulletType === BulletType.ENEMY_FAST_TANK ||
               bulletType === BulletType.ENEMY_HEAVY_TANK ||
               bulletType === BulletType.ENEMY_BOSS;
    }

    /**
     * 清理所有子弹
     */
    clearAll() {
        this.bullets.forEach(bullet => {
            if (bullet && bullet.isValid) {
                bullet.destroy();
            }
        });
        this.bullets = [];
    }

    /**
     * 获取子弹数量
     */
    getBulletCount(): number {
        return this.bullets.length;
    }

    /**
     * 获取所有子弹节点
     */
    getAllBullets(): Node[] {
        return this.bullets.slice(); // 返回副本，避免外部修改
    }
}

