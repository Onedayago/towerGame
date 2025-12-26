import { Node, Vec3, Prefab, instantiate } from 'cc';
import { WeaponConfig, WEAPON_COMMON_CONFIG } from '../constants/Index';
import { BulletManager } from '../managers/BulletManager';
import { BulletBase } from '../bullets/Index';
import { WeaponLaserBullet } from '../bullets/weapon/WeaponLaserBullet';
import { TargetFinder } from '../utils/Index';

/**
 * 武器攻击管理器
 * 负责处理武器的攻击逻辑
 */
export class WeaponAttack {
    private weaponNode: Node;
    private appearanceNode: Node | null;
    private healthBarNode: Node | null;
    private config: WeaponConfig | null;
    private bulletPrefab: Prefab | null = null;
    private bulletManager: BulletManager | null = null;
    private enemies: Node[] = [];
    private attackSpeed: number = 0;
    private attackTimer: number = 0;
    private rotationOffset: number = 0; // 旋转角度偏移（度）

    constructor(
        weaponNode: Node,
        appearanceNode: Node | null,
        healthBarNode: Node | null,
        config: WeaponConfig | null,
        attackSpeed: number,
        rotationOffset: number = 0
    ) {
        this.weaponNode = weaponNode;
        this.appearanceNode = appearanceNode;
        this.healthBarNode = healthBarNode;
        this.config = config;
        this.attackSpeed = attackSpeed;
        this.rotationOffset = rotationOffset;
    }

    /**
     * 设置子弹预制体
     */
    setBulletPrefab(prefab: Prefab | null) {
        this.bulletPrefab = prefab;
    }

    /**
     * 设置子弹管理器
     */
    setBulletManager(bulletManager: BulletManager | null) {
        this.bulletManager = bulletManager;
    }

    /**
     * 设置敌人列表
     */
    setEnemies(enemies: Node[]) {
        this.enemies = enemies;
    }

    /**
     * 设置配置
     */
    setConfig(config: WeaponConfig | null) {
        this.config = config;
    }

    /**
     * 设置攻击速度
     */
    setAttackSpeed(speed: number) {
        this.attackSpeed = speed;
    }

    /**
     * 更新攻击逻辑
     * @param deltaTime 帧时间
     */
    update(deltaTime: number) {
        if (!this.config) return;

        // 暂时禁用武器攻击敌人
        // TODO: 恢复武器攻击敌人的功能
        return;

        // 检测附近是否有敌人（用于旋转面向目标）
        const targetEnemy = this.findNearestEnemyInRange();
        if (targetEnemy) {
            // 旋转武器面向目标敌人
            this.rotateTowardsTarget(targetEnemy);
        } else {
            // 没有目标时，重置旋转
            this.resetRotation();
        }

        this.attackTimer += deltaTime;
        if (this.attackTimer >= this.attackSpeed) {
            this.attackTimer = 0;

            // 检测附近是否有敌人
            if (targetEnemy) {
                this.performAttack(targetEnemy);
            }
        }
    }

    /**
     * 执行攻击
     * @param targetEnemy 目标敌人
     */
    performAttack(targetEnemy: Node | null = null) {
        if (!targetEnemy || !this.bulletManager || !this.bulletPrefab) {
            return;
        }

        // 发射子弹
        this.fireBullet(targetEnemy);
    }

    /**
     * 发射子弹
     * @param targetEnemy 目标敌人
     */
    private fireBullet(targetEnemy: Node) {
        if (!this.bulletPrefab || !this.bulletManager || !this.config) {
            return;
        }

        // 创建子弹实例
        const bulletNode = instantiate(this.bulletPrefab);
        if (!bulletNode) return;

        // 获取武器中心位置（武器锚点为中心）
        const weaponPos = this.weaponNode.position;
        const weaponCenterX = weaponPos.x;
        const weaponCenterY = weaponPos.y;

        // 获取敌人中心位置（敌人锚点为中心）
        const enemyPos = targetEnemy.position;
        const enemyCenterX = enemyPos.x;
        const enemyCenterY = enemyPos.y;

        // 计算方向向量
        const direction = new Vec3(
            enemyCenterX - weaponCenterX,
            enemyCenterY - weaponCenterY,
            0
        );

        // 设置子弹初始位置（武器中心）
        bulletNode.setPosition(weaponCenterX, weaponCenterY, 0);

        // 检查是否是激光子弹（需要特殊初始化）
        const laserBulletComponent = bulletNode.getComponent(WeaponLaserBullet);
        if (laserBulletComponent) {
            // 激光子弹使用 initBeam 方法
            const startPos = new Vec3(weaponCenterX, weaponCenterY, 0);
            const endPos = new Vec3(enemyCenterX, enemyCenterY, 0);
            laserBulletComponent.initBeam(this.config.damage, startPos, endPos, targetEnemy);
        } else {
            // 其他子弹类型使用标准的 init 方法
            const bulletComponent = bulletNode.getComponent(BulletBase);
            if (bulletComponent) {
                // 最大飞行距离为攻击范围的倍数（从常量配置中获取）
                const maxDistance = this.config.range * WEAPON_COMMON_CONFIG.BULLET_MAX_DISTANCE_MULTIPLIER;
                // 子弹速度由子弹类自己管理，这里只需要传入伤害和方向
                bulletComponent.init(this.config.damage, direction, maxDistance);
            }
        }

        // 添加到子弹管理器
        this.bulletManager.addBullet(bulletNode);
    }

    /**
     * 查找攻击范围内的最近敌人
     * @returns 最近的敌人节点，如果没有则返回 null
     */
    private findNearestEnemyInRange(): Node | null {
        if (!this.config || this.enemies.length === 0) {
            return null;
        }

        // 武器位置
        const weaponPos = this.weaponNode.position;
        const range = this.config.range;

        // 使用 TargetFinder 查找目标（武器可以攻击任何方向的敌人）
        return TargetFinder.findNearestInRange(
            weaponPos,
            this.enemies,
            range
        );
    }

    /**
     * 旋转武器面向目标敌人
     * @param targetEnemy 目标敌人节点
     */
    private rotateTowardsTarget(targetEnemy: Node) {
        if (!targetEnemy || !targetEnemy.isValid) return;

        // 获取武器位置和目标位置
        const weaponPos = this.weaponNode.position;
        const targetPos = targetEnemy.position;

        // 计算方向向量
        const direction = new Vec3(
            targetPos.x - weaponPos.x,
            targetPos.y - weaponPos.y,
            0
        );

        // 计算角度（弧度转角度）
        const angleRad = Math.atan2(direction.y, direction.x);
        let angleDeg = angleRad * (180 / Math.PI);

        // 应用旋转偏移（用于处理不同武器的默认朝向）
        angleDeg += this.rotationOffset;

        // 只旋转外观节点，不旋转根节点
        if (this.appearanceNode) {
            this.appearanceNode.setRotationFromEuler(0, 0, angleDeg);
        }

        // 更新血条旋转，保持水平
        this.updateHealthBarRotation();
    }

    /**
     * 更新血条旋转，保持水平
     */
    private updateHealthBarRotation() {
        if (!this.healthBarNode) return;

        // 血条节点不旋转，保持水平
        this.healthBarNode.setRotationFromEuler(0, 0, 0);
    }

    /**
     * 重置旋转（没有目标时）
     */
    private resetRotation() {
        // 重置外观节点旋转
        if (this.appearanceNode) {
            this.appearanceNode.setRotationFromEuler(0, 0, 0);
        }

        // 更新血条旋转，保持水平
        this.updateHealthBarRotation();
    }
}

