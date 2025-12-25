import { _decorator, Component, Graphics, UITransform, Prefab, instantiate, Vec3, Node, UIOpacity } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType, getEnemyConfig, EnemyConfig, ENEMY_COMMON_CONFIG } from '../constants/Index';
import { BulletManager } from '../managers/BulletManager';
import { WeaponManager } from '../managers/WeaponManager';
import { BulletBase } from '../bullets/Index';
import { TargetFinder, HealthBarHelper } from '../utils/Index';
import { HitParticleEffect, ExplosionEffect } from '../effects/Index';
const { ccclass, property } = _decorator;

/**
 * 敌人基类
 * 所有敌人类型都继承此类
 */
@ccclass('EnemyBase')
export class EnemyBase extends Component {
    
    @property({ type: Prefab, displayName: '子弹预制体', tooltip: '敌人发射的子弹预制体（可选，如果不设置则根据敌人类型自动选择）' })
    protected bulletPrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '被攻击特效预制体', tooltip: '敌人被攻击时的粒子特效预制体' })
    protected hitEffectPrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '爆炸特效预制体', tooltip: '敌人死亡时的爆炸特效预制体' })
    protected explosionEffectPrefab: Prefab | null = null;
    
    protected moveSpeed: number = 0;
    protected attackSpeed: number = 0;
    protected attackTimer: number = 0;
    protected config: EnemyConfig | null = null;
    protected enemyType: EnemyType;
    protected isAttacking: boolean = false; // 是否正在攻击
    protected attackDuration: number = 0; // 攻击持续时间（秒）
    protected attackDurationTimer: number = 0; // 攻击持续时间计时器
    protected lockedTarget: Node | null = null; // 锁定的目标武器
    
    protected bulletManager: BulletManager | null = null; // 子弹管理器
    protected weaponManager: WeaponManager | null = null; // 武器管理器
    protected maxHealth: number = 0; // 最大生命值（用于血条显示）
    private baseHealth: number = 0; // 基础生命值（未加成前的血量）
    
    // 出现动画相关
    private isSpawning: boolean = true; // 是否正在出现动画中
    private spawnAnimationDuration: number = 0.6; // 出现动画持续时间（秒），与特效持续时间一致
    private spawnAnimationElapsed: number = 0; // 出现动画已用时间
    private uiOpacity: UIOpacity | null = null; // 透明度组件
    
    // 子节点引用（从预制体中获取）
    protected healthBarNode: Node | null = null; // 血条节点
    protected appearanceNode: Node | null = null; // 外观展示节点
    
    /**
     * 设置血量加成（根据波次）
     * @param hpBonus 血量加成倍数（例如：1.5 表示增加 1.5 倍，即最终为 2.5 倍）
     */
    setHpBonus(hpBonus: number) {
        if (!this.config || hpBonus <= 0) return;
        
        // 如果还没有保存基础血量，则保存当前血量作为基础值（安全措施）
        if (this.baseHealth === 0) {
            this.baseHealth = this.config.health;
        }
        
        // 应用血量加成：基础血量 * (1 + 加成倍数)
        const bonusMultiplier = 1 + hpBonus;
        const newMaxHealth = this.baseHealth * bonusMultiplier;
        
        // 计算当前血量比例（通常在生成时是满血，即 1.0）
        const healthRatio = this.maxHealth > 0 ? (this.config.health / this.maxHealth) : 1.0;
        
        // 更新最大血量和当前血量（保持比例）
        this.maxHealth = newMaxHealth;
        this.config.health = newMaxHealth * healthRatio;
        
        // 更新血条
        this.updateHealthBar();
    }

    /**
     * 初始化敌人
     * @param type 敌人类型
     */
    protected init(type: EnemyType) {
        this.enemyType = type;
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        transform.setAnchorPoint(0.5, 0.5);
        
        // 所有敌人大小相同（整体缩小）
        const sizeScale = 0.6;
        const width = UiConfig.CELL_SIZE * sizeScale;
        const height = UiConfig.CELL_SIZE * sizeScale;
        transform.setContentSize(width, height);
        
        // 初始化子节点引用
        this.initChildNodes();

        // 加载敌人配置
        this.config = getEnemyConfig(type);
        this.moveSpeed = this.config.moveSpeed;
        this.attackSpeed = this.config.attackSpeed;
        this.baseHealth = this.config.health; // 保存基础生命值（未加成前）
        this.maxHealth = this.config.health; // 保存最大生命值

        // 绘制敌人外观（在外观节点上绘制）
        this.drawAppearance(width, height);
        
        // 初始化血条
        this.updateHealthBar();
        
        // 初始化出现动画
        this.initSpawnAnimation();
    }
    
    /**
     * 初始化出现动画
     * 设置初始状态：缩放为0，透明度为0
     */
    private initSpawnAnimation() {
        // 设置初始缩放为0（从小到大）
        this.node.setScale(0, 0, 1);
        
        // 添加或获取 UIOpacity 组件（用于透明度控制）
        this.uiOpacity = this.node.getComponent(UIOpacity);
        if (!this.uiOpacity) {
            this.uiOpacity = this.node.addComponent(UIOpacity);
        }
        // 设置初始透明度为0（从隐身到显示）
        this.uiOpacity.opacity = 0;
        
        // 初始化动画状态
        this.isSpawning = true;
        this.spawnAnimationElapsed = 0;
    }
    
    /**
     * 更新出现动画
     * @param deltaTime 帧时间
     */
    updateSpawnAnimation(deltaTime: number) {
        if (!this.isSpawning) return;
        
        this.spawnAnimationElapsed += deltaTime;
        const progress = Math.min(this.spawnAnimationElapsed / this.spawnAnimationDuration, 1);
        
        // 缩放动画：从0到1
        const scale = progress;
        this.node.setScale(scale, scale, 1);
        
        // 透明度动画：从0到255
        const opacity = Math.floor(progress * 255);
        if (this.uiOpacity) {
            this.uiOpacity.opacity = opacity;
        }
        
        // 血条也跟随透明度变化
        if (this.healthBarNode) {
            let healthBarOpacity = this.healthBarNode.getComponent(UIOpacity);
            if (!healthBarOpacity) {
                healthBarOpacity = this.healthBarNode.addComponent(UIOpacity);
            }
            healthBarOpacity.opacity = opacity;
        }
        
        // 动画完成后，允许移动
        if (progress >= 1) {
            this.isSpawning = false;
            // 确保最终状态正确
            this.node.setScale(1, 1, 1);
            if (this.uiOpacity) {
                this.uiOpacity.opacity = 255;
            }
            // 血条也恢复完全不透明
            if (this.healthBarNode) {
                const healthBarOpacity = this.healthBarNode.getComponent(UIOpacity);
                if (healthBarOpacity) {
                    healthBarOpacity.opacity = 255;
                }
            }
        }
    }
    
    /**
     * 初始化子节点引用
     */
    protected initChildNodes() {
        // 查找血条节点
        this.healthBarNode = this.node.getChildByName('HealthBar');
        
        // 查找外观展示节点
        this.appearanceNode = this.node.getChildByName('AppearanceNode');
    }
    
    /**
     * 绘制敌人外观
     * 子类必须重写此方法实现自己的外观绘制
     * @param width 宽度
     * @param height 高度
     */
    protected drawAppearance(width: number, height: number) {
        if (!this.appearanceNode) return;
        
        const graphics = this.appearanceNode.getComponent(Graphics);
        if (!graphics) return;
        
        // 基类不绘制任何内容，由子类实现
        graphics.clear();
    }
    
    /**
     * 更新血条显示
     */
    protected updateHealthBar() {
        if (!this.config) return;
        
        // 使用预制体中已有的血条节点
        HealthBarHelper.createOrUpdateHealthBar(
            this.node,
            this.config.health,
            this.maxHealth
        );
        
        // 确保血条节点不随父节点旋转
        if (this.healthBarNode) {
            const parentRotation = this.node.eulerAngles.z;
            this.healthBarNode.setRotationFromEuler(0, 0, -parentRotation);
        }
    }

    /**
     * 更新敌人位置（由 EnemyManager 调用）
     * @param deltaTime 帧时间
     * @param boundaryWidth 右边界宽度（容器宽度）
     */
    updatePosition(deltaTime: number, boundaryWidth: number) {
        // 如果正在出现动画中，不移动
        if (this.isSpawning) {
            return;
        }
        
        // 如果锁定了目标或正在攻击，停止移动
        if (this.lockedTarget || this.isAttacking) {
            return;
        }
        
        const currentPos = this.node.position;
        const newX = currentPos.x + this.moveSpeed * deltaTime;
        
        // 允许移动到边界位置，超出边界的敌人由 EnemyUpdateHandler 移除
        // 敌人会一直移动，直到中心位置达到或超过容器宽度（边界检查会计算左边缘）
        this.node.setPosition(newX, currentPos.y, 0);
    }

    /**
     * 更新攻击逻辑
     * @param deltaTime 帧时间
     */
    updateAttack(deltaTime: number) {
        if (!this.config) return;
        
        // 检查是否有目标在攻击范围内
        const targetWeapon = this.findNearestWeaponInRange();
        
        // 如果找到了目标，锁定目标（停止移动）并旋转面向目标
        if (targetWeapon) {
            this.lockedTarget = targetWeapon;
            // 旋转敌人面向目标武器
            this.rotateTowardsTarget(targetWeapon);
        } else {
            // 如果目标不在范围内，解除锁定
            this.lockedTarget = null;
        }
        
        // 如果正在攻击，更新攻击持续时间
        if (this.isAttacking) {
            this.attackDurationTimer += deltaTime;
            if (this.attackDurationTimer >= this.attackDuration) {
                // 攻击完成，恢复移动（如果目标还在范围内，会继续锁定）
                this.isAttacking = false;
                this.attackDurationTimer = 0;
                
                // 如果目标不在范围内，恢复方向向右
                if (!this.lockedTarget) {
                    this.resetRotation();
                }
            }
            return;
        }
        
        // 只有在锁定目标时才进行攻击
        if (this.lockedTarget) {
            // 更新攻击计时器
            this.attackTimer += deltaTime;
            if (this.attackTimer >= this.attackSpeed) {
                this.attackTimer = 0;
                this.startAttack();
            }
        } else {
            // 如果没有锁定目标，重置攻击计时器，并恢复方向向右
            this.attackTimer = 0;
            this.resetRotation();
        }
    }
    
    /**
     * 开始攻击
     */
    protected startAttack() {
        if (!this.config) return;
        
        this.isAttacking = true;
        this.attackDuration = this.config.attackDuration; // 从配置中获取攻击持续时间
        this.attackDurationTimer = 0;
        this.performAttack();
    }

    /**
     * 执行攻击
     * 子类可以重写此方法实现不同的攻击逻辑
     */
    protected performAttack() {
        if (!this.config) return;
        
        // 使用锁定的目标进行攻击
        if (this.lockedTarget && this.lockedTarget.isValid) {
            // 再次检查目标是否仍在攻击范围内
            const currentTarget = this.findNearestWeaponInRange();
            if (currentTarget === this.lockedTarget) {
                // 发射子弹攻击武器
                this.fireBullet(this.lockedTarget);
            } else {
                // 目标已不在范围内，解除锁定
                this.lockedTarget = null;
                console.log(`Enemy ${this.enemyType} lost target`);
            }
        } else {
            // 如果锁定的目标无效，解除锁定
            this.lockedTarget = null;
            console.log(`Enemy ${this.enemyType} attacks with damage ${this.config.damage} (no target)`);
        }
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
     * 查找攻击范围内的最近武器
     * @returns 最近的武器节点，如果没有则返回 null
     */
    protected findNearestWeaponInRange(): Node | null {
        if (!this.weaponManager || !this.config) return null;
        
        const weapons = this.weaponManager.getAllWeapons();
        if (weapons.length === 0) return null;
        
        // 敌人位置
        const enemyPos = this.node.position;
        const attackRange = this.config.attackRange;
        
        // 使用 TargetFinder 查找目标，敌人只能攻击右边的武器
        const rightFilter = TargetFinder.createDirectionFilter('right');
        
        return TargetFinder.findNearestInRange(
            enemyPos,
            weapons,
            attackRange,
            rightFilter
        );
    }
    
    /**
     * 旋转敌人面向目标武器
     * @param targetWeapon 目标武器节点
     */
    protected rotateTowardsTarget(targetWeapon: Node) {
        if (!targetWeapon || !targetWeapon.isValid) return;
        
        // 获取敌人位置和目标位置
        const enemyPos = this.node.position;
        const targetPos = targetWeapon.position;
        
        // 计算方向向量（从敌人指向武器）
        const direction = new Vec3(
            targetPos.x - enemyPos.x,
            targetPos.y - enemyPos.y,
            0
        );
        
        // 计算角度（弧度转角度）
        const angleRad = Math.atan2(direction.y, direction.x);
        const angleDeg = angleRad * (180 / Math.PI);
        
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
    protected updateHealthBarRotation() {
        if (!this.healthBarNode) return;
        
        // 血条节点不旋转，保持水平
        this.healthBarNode.setRotationFromEuler(0, 0, 0);
    }
    
    /**
     * 恢复方向向右（0度）
     */
    protected resetRotation() {
        if (this.appearanceNode) {
            this.appearanceNode.setRotationFromEuler(0, 0, 0);
        }
        // 更新血条旋转，保持水平
        this.updateHealthBarRotation();
    }
    
    /**
     * 发射子弹攻击武器
     * @param targetWeapon 目标武器节点
     */
    protected fireBullet(targetWeapon: Node) {
        if (!this.bulletManager || !this.config) return;
        
        // 获取子弹预制体
        const bulletPrefab = this.getBulletPrefab();
        if (!bulletPrefab) {
            console.warn(`Enemy ${this.enemyType} has no bullet prefab`);
            return;
        }
        
        // 创建子弹实例
        const bulletNode = instantiate(bulletPrefab);
        if (!bulletNode) return;
        
        // 获取敌人中心位置（敌人锚点为中心）
        const enemyPos = this.node.position;
        const enemyCenterX = enemyPos.x;
        const enemyCenterY = enemyPos.y;
        
        // 获取武器中心位置（武器锚点为中心）
        const weaponPos = targetWeapon.position;
        const weaponCenterX = weaponPos.x;
        const weaponCenterY = weaponPos.y;
        
        // 计算方向向量（从敌人指向武器，从右往左）
        const direction = new Vec3(
            weaponCenterX - enemyCenterX,
            weaponCenterY - enemyCenterY,
            0
        );
        
        // 设置子弹初始位置（敌人中心）
        bulletNode.setPosition(enemyCenterX, enemyCenterY, 0);
        
        // 初始化子弹（使用 BulletBase，支持所有子弹类型）
        const bulletComponent = bulletNode.getComponent(BulletBase);
        if (bulletComponent) {
            // 最大飞行距离为攻击范围的倍数（从常量配置中获取）
            const maxDistance = this.config.attackRange * ENEMY_COMMON_CONFIG.BULLET_MAX_DISTANCE_MULTIPLIER;
            // 子弹速度由子弹类自己管理，这里只需要传入伤害和方向
            bulletComponent.init(this.config.damage, direction, maxDistance);
        }
        
        // 添加到子弹管理器
        this.bulletManager.addBullet(bulletNode);
    }
    
    /**
     * 获取子弹预制体
     * 如果设置了 bulletPrefab 则使用，否则根据敌人类型返回对应的子弹类型
     * @returns 子弹预制体，如果没有则返回 null
     */
    protected getBulletPrefab(): Prefab | null {
        // 如果已经设置了子弹预制体，直接使用
        if (this.bulletPrefab) {
            return this.bulletPrefab;
        }
        
        // 否则，需要根据敌人类型获取对应的子弹预制体
        // 这里返回 null，子类或外部可以设置 bulletPrefab
        return null;
    }

    /**
     * 获取敌人配置
     */
    getConfig(): EnemyConfig | null {
        return this.config;
    }

    /**
     * 获取敌人类型
     */
    getEnemyType(): EnemyType {
        return this.enemyType;
    }

    /**
     * 设置移动速度（覆盖配置）
     */
    setMoveSpeed(speed: number) {
        this.moveSpeed = speed;
    }

    /**
     * 设置攻击速度（覆盖配置）
     */
    setAttackSpeed(speed: number) {
        this.attackSpeed = speed;
    }

    /**
     * 受到伤害
     * @param damage 伤害值
     */
    takeDamage(damage: number) {
        if (!this.config) return;
        
        // 创建被攻击特效
        this.createHitEffect();
        
        this.config.health -= damage;
        
        // 更新血条
        this.updateHealthBar();
        
        if (this.config.health <= 0) {
            this.onDeath();
        }
    }
    
    /**
     * 创建被攻击特效
     */
    private createHitEffect() {
        if (!this.hitEffectPrefab) return;
        
        const position = this.node.position;
        const effectNode = instantiate(this.hitEffectPrefab);
        effectNode.setParent(this.node.parent);
        effectNode.setPosition(position);
        
        // 获取特效组件并初始化
        const effectComponent = effectNode.getComponent(HitParticleEffect);
        if (effectComponent) {
            effectComponent.init(position);
        }
    }
    

    /**
     * 死亡处理
     * 子类可以重写此方法实现不同的死亡效果
     */
    protected onDeath() {
        // 创建爆炸特效
        this.createExplosionEffect();
        
        // 移除血条
        HealthBarHelper.removeHealthBar(this.node);
        this.node.destroy();
    }
    
    /**
     * 创建爆炸特效
     */
    private createExplosionEffect() {
        if (!this.explosionEffectPrefab) return;
        
        const position = this.node.position;
        const effectNode = instantiate(this.explosionEffectPrefab);
        effectNode.setParent(this.node.parent);
        effectNode.setPosition(position);
        
        // 获取特效组件并初始化
        const effectComponent = effectNode.getComponent(ExplosionEffect);
        if (effectComponent) {
            effectComponent.init(position);
        }
    }
}

