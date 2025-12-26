import { Node, Prefab, instantiate, Vec3, UITransform } from 'cc';
import { EnemyConfig, ENEMY_COMMON_CONFIG } from '../constants/Index';
import { BulletManager } from '../managers/BulletManager';
import { WeaponManager } from '../managers/WeaponManager';
import { BulletBase } from '../bullets/Index';
import { TargetFinder } from '../utils/Index';
import { BaseManager } from '../managers/BaseManager';

/**
 * 敌人攻击管理器
 * 负责处理敌人的攻击逻辑
 */
export class EnemyAttack {
    private enemyNode: Node;
    private appearanceNode: Node | null = null;
    private healthBarNode: Node | null = null;
    private config: EnemyConfig | null = null;
    private bulletManager: BulletManager | null = null;
    private weaponManager: WeaponManager | null = null;
    private bulletPrefab: Prefab | null = null;

    private attackSpeed: number = 0;
    private attackTimer: number = 0;
    private isAttacking: boolean = false;
    private attackDuration: number = 0;
    private attackDurationTimer: number = 0;
    private lockedTarget: Node | null = null;

    constructor(enemyNode: Node, appearanceNode: Node | null, config: EnemyConfig | null, healthBarNode: Node | null = null) {
        this.enemyNode = enemyNode;
        this.appearanceNode = appearanceNode;
        this.healthBarNode = healthBarNode;
        this.config = config;
        if (config) {
            this.attackSpeed = config.attackSpeed;
        }
    }

    /**
     * 设置配置
     */
    setConfig(config: EnemyConfig) {
        this.config = config;
        this.attackSpeed = config.attackSpeed;
    }

    /**
     * 设置攻击速度
     */
    setAttackSpeed(speed: number) {
        this.attackSpeed = speed;
    }

    /**
     * 设置管理器
     */
    setManagers(bulletManager: BulletManager, weaponManager: WeaponManager) {
        this.bulletManager = bulletManager;
        this.weaponManager = weaponManager;
    }

    /**
     * 设置子弹预制体
     */
    setBulletPrefab(prefab: Prefab | null) {
        this.bulletPrefab = prefab;
    }

    /**
     * 更新攻击逻辑
     * @param deltaTime 帧时间
     * @returns 是否锁定了目标
     */
    update(deltaTime: number): boolean {
        if (!this.config) return false;

        // 优先检查是否有武器在攻击范围内
        let targetWeapon = this.findNearestWeaponInRange();
        
        // 如果没有武器在范围内，检查是否可以攻击基地
        if (!targetWeapon) {
            targetWeapon = this.findBaseInRange();
        }

        // 如果找到了目标，锁定目标并旋转面向目标
        if (targetWeapon) {
            this.lockedTarget = targetWeapon;
            this.rotateTowardsTarget(targetWeapon);
        } else {
            this.lockedTarget = null;
        }

        // 如果正在攻击，更新攻击持续时间
        if (this.isAttacking) {
            this.attackDurationTimer += deltaTime;
            if (this.attackDurationTimer >= this.attackDuration) {
                this.isAttacking = false;
                this.attackDurationTimer = 0;

                if (!this.lockedTarget) {
                    this.resetRotation();
                }
            }
            return !!this.lockedTarget;
        }

        // 只有在锁定目标时才进行攻击
        if (this.lockedTarget) {
            this.attackTimer += deltaTime;
            if (this.attackTimer >= this.attackSpeed) {
                this.attackTimer = 0;
                this.startAttack();
            }
        } else {
            this.attackTimer = 0;
            this.resetRotation();
        }

        return !!this.lockedTarget;
    }

    /**
     * 开始攻击
     */
    private startAttack() {
        if (!this.config) return;

        this.isAttacking = true;
        this.attackDuration = this.config.attackDuration;
        this.attackDurationTimer = 0;
        this.performAttack();
    }

    /**
     * 执行攻击
     */
    private performAttack() {
        if (!this.config) return;

        if (this.lockedTarget && this.lockedTarget.isValid) {
            // 检查目标是否仍然有效（武器或基地）
            const currentWeaponTarget = this.findNearestWeaponInRange();
            const currentBaseTarget = this.findBaseInRange();
            const currentTarget = currentWeaponTarget || currentBaseTarget;
            
            if (currentTarget === this.lockedTarget) {
                this.fireBullet(this.lockedTarget);
            } else {
                this.lockedTarget = null;
            }
        } else {
            this.lockedTarget = null;
        }
    }

    /**
     * 查找攻击范围内的最近武器
     */
    private findNearestWeaponInRange(): Node | null {
        if (!this.weaponManager || !this.config) return null;

        const weapons = this.weaponManager.getAllWeapons();
        if (weapons.length === 0) return null;

        const enemyPos = this.enemyNode.position;
        const attackRange = this.config.attackRange;
        const rightFilter = TargetFinder.createDirectionFilter('right');

        return TargetFinder.findNearestInRange(
            enemyPos,
            weapons,
            attackRange,
            rightFilter
        );
    }
    
    /**
     * 查找攻击范围内的基地
     */
    private findBaseInRange(): Node | null {
        if (!this.config) return null;
        
        const baseManager = BaseManager.getInstance();
        if (!baseManager.isAlive()) return null;
        
        const baseNode = baseManager.getBaseNode();
        if (!baseNode || !baseNode.isValid) return null;
        
        const enemyPos = this.enemyNode.position;
        const basePos = baseNode.position;
        const baseTransform = baseNode.getComponent(UITransform);
        if (!baseTransform) return null;
        
        // 计算基地中心位置（基地锚点在左下角）
        const baseCenterX = basePos.x + baseTransform.width / 2;
        const baseCenterY = basePos.y + baseTransform.height / 2;
        const baseCenter = new Vec3(baseCenterX, baseCenterY, 0);
        
        // 计算敌人到基地中心的距离
        const distance = Vec3.distance(enemyPos, baseCenter);
        const attackRange = this.config.attackRange;
        
        // 如果基地在攻击范围内，返回基地节点
        if (distance <= attackRange) {
            return baseNode;
        }
        
        return null;
    }

    /**
     * 旋转敌人面向目标（武器或基地）
     */
    private rotateTowardsTarget(targetWeapon: Node) {
        if (!targetWeapon || !targetWeapon.isValid) return;

        const enemyPos = this.enemyNode.position;
        let targetPos = targetWeapon.position;
        
        // 如果是基地，需要计算基地中心位置
        const baseManager = BaseManager.getInstance();
        if (baseManager.getBaseNode() === targetWeapon) {
            const baseTransform = targetWeapon.getComponent(UITransform);
            if (baseTransform) {
                // 基地锚点在左下角，计算中心位置
                targetPos = new Vec3(
                    targetPos.x + baseTransform.width / 2,
                    targetPos.y + baseTransform.height / 2,
                    targetPos.z
                );
            }
        }

        const direction = new Vec3(
            targetPos.x - enemyPos.x,
            targetPos.y - enemyPos.y,
            0
        );

        const angleRad = Math.atan2(direction.y, direction.x);
        const angleDeg = angleRad * (180 / Math.PI);

        if (this.appearanceNode) {
            this.appearanceNode.setRotationFromEuler(0, 0, angleDeg);
        }
        // 更新血条旋转，保持水平
        if (this.healthBarNode) {
            this.healthBarNode.setRotationFromEuler(0, 0, 0);
        }
    }

    /**
     * 恢复方向向右
     */
    private resetRotation() {
        if (this.appearanceNode) {
            this.appearanceNode.setRotationFromEuler(0, 0, 0);
        }
        // 更新血条旋转，保持水平
        if (this.healthBarNode) {
            this.healthBarNode.setRotationFromEuler(0, 0, 0);
        }
    }

    /**
     * 发射子弹攻击目标（武器或基地）
     */
    private fireBullet(targetWeapon: Node) {
        if (!this.bulletManager || !this.config) return;

        const bulletPrefab = this.bulletPrefab;
        if (!bulletPrefab) return;

        const bulletNode = instantiate(bulletPrefab);
        if (!bulletNode) return;

        const enemyPos = this.enemyNode.position;
        let targetPos = targetWeapon.position;
        
        // 如果是基地，需要计算基地中心位置
        const baseManager = BaseManager.getInstance();
        if (baseManager.getBaseNode() === targetWeapon) {
            const baseTransform = targetWeapon.getComponent(UITransform);
            if (baseTransform) {
                // 基地锚点在左下角，计算中心位置
                targetPos = new Vec3(
                    targetPos.x + baseTransform.width / 2,
                    targetPos.y + baseTransform.height / 2,
                    targetPos.z
                );
            }
        }

        const direction = new Vec3(
            targetPos.x - enemyPos.x,
            targetPos.y - enemyPos.y,
            0
        );

        bulletNode.setPosition(enemyPos.x, enemyPos.y, 0);

        const bulletComponent = bulletNode.getComponent(BulletBase);
        if (bulletComponent) {
            const maxDistance = this.config.attackRange * ENEMY_COMMON_CONFIG.BULLET_MAX_DISTANCE_MULTIPLIER;
            bulletComponent.init(this.config.damage, direction, maxDistance);
        }

        this.bulletManager.addBullet(bulletNode);
    }

    /**
     * 是否正在攻击
     */
    isAttackingNow(): boolean {
        return this.isAttacking;
    }

    /**
     * 是否有锁定目标
     */
    hasLockedTarget(): boolean {
        return !!this.lockedTarget;
    }
}

