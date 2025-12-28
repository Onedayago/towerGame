import { Node, Prefab, instantiate, Vec3, UITransform } from 'cc';
import { EnemyConfig, ENEMY_COMMON_CONFIG } from '../constants/Index';
import { BulletManager } from '../managers/BulletManager';
import { BulletBase } from '../bullets/Index';
import { BaseManager } from '../managers/BaseManager';

/**
 * 敌人攻击管理器
 * 负责处理敌人的攻击逻辑（只攻击基地）
 */
export class EnemyAttack {
    private enemyNode: Node;
    private appearanceNode: Node | null = null;
    private healthBarNode: Node | null = null;
    private config: EnemyConfig | null = null;
    private bulletManager: BulletManager | null = null;
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
    setManagers(bulletManager: BulletManager, weaponManager: any) {
        this.bulletManager = bulletManager;
        // 不再需要武器管理器，但保留参数以兼容现有代码
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

        // 只检查是否可以攻击基地
        const targetBase = this.findBaseInRange();

        // 如果找到了目标，锁定目标
        if (targetBase) {
            this.lockedTarget = targetBase;
        } else {
            this.lockedTarget = null;
        }
        // 注意：不再控制旋转，让移动逻辑根据移动方向控制旋转

        // 如果正在攻击，更新攻击持续时间
        if (this.isAttacking) {
            this.attackDurationTimer += deltaTime;
            if (this.attackDurationTimer >= this.attackDuration) {
                this.isAttacking = false;
                this.attackDurationTimer = 0;
                // 攻击结束后，如果还锁定目标，会继续面向目标；如果没有目标，移动逻辑会控制旋转
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
            // 没有目标时，移动逻辑会控制旋转
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
            // 检查目标是否仍然有效（只检查基地）
            const currentBaseTarget = this.findBaseInRange();
            
            if (currentBaseTarget === this.lockedTarget) {
                this.fireBullet(this.lockedTarget);
            } else {
                this.lockedTarget = null;
            }
        } else {
            this.lockedTarget = null;
        }
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
        
        // 敌人只能攻击右侧的目标，检查基地是否在敌人右侧
        if (baseCenterX <= enemyPos.x) {
            return null;
        }
        
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
     * 发射子弹攻击目标（基地）
     */
    private fireBullet(targetBase: Node) {
        if (!this.bulletManager || !this.config) return;

        const bulletPrefab = this.bulletPrefab;
        if (!bulletPrefab) return;

        const bulletNode = instantiate(bulletPrefab);
        if (!bulletNode) return;

        const enemyPos = this.enemyNode.position;
        let targetPos = targetBase.position;
        
        // 计算基地中心位置
        const baseTransform = targetBase.getComponent(UITransform);
        if (baseTransform) {
            // 基地锚点在左下角，计算中心位置
            targetPos = new Vec3(
                targetPos.x + baseTransform.width / 2,
                targetPos.y + baseTransform.height / 2,
                targetPos.z
            );
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

