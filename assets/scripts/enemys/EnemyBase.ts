import { _decorator, Component, Graphics, UITransform, Prefab, instantiate, Vec3, Node } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType, getEnemyConfig, EnemyConfig, ENEMY_COMMON_CONFIG } from '../constants/Index';
import { BulletManager } from '../managers/BulletManager';
import { WeaponManager } from '../managers/WeaponManager';
import { BulletBase } from '../bullets/Index';
import { TargetFinder, HealthBarHelper } from '../utils/Index';
const { ccclass, property } = _decorator;

/**
 * 敌人基类
 * 所有敌人类型都继承此类
 */
@ccclass('EnemyBase')
export class EnemyBase extends Component {
    
    @property({ type: Prefab, displayName: '子弹预制体', tooltip: '敌人发射的子弹预制体（可选，如果不设置则根据敌人类型自动选择）' })
    protected bulletPrefab: Prefab | null = null;
    
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

    /**
     * 初始化敌人
     * @param type 敌人类型
     */
    protected init(type: EnemyType) {
        this.enemyType = type;
        
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        if (!graphics || !transform) return;
        
        transform.setAnchorPoint(0.5, 0.5);
        
        // 所有敌人大小相同（缩小到80%）
        const sizeScale = 0.8;
        const width = UiConfig.CELL_SIZE * sizeScale;
        const height = UiConfig.CELL_SIZE * sizeScale;
        transform.setContentSize(width, height);

        // 加载敌人配置
        this.config = getEnemyConfig(type);
        this.moveSpeed = this.config.moveSpeed;
        this.attackSpeed = this.config.attackSpeed;
        this.maxHealth = this.config.health; // 保存最大生命值

        // 绘制敌人外观（不使用背景色填充）
        // 由子类实现具体的绘制逻辑，调用对应的渲染器
        this.drawAppearance(graphics, width, height);
        
        // 创建血条
        this.updateHealthBar();
    }
    
    /**
     * 绘制敌人外观
     * 子类必须重写此方法实现自己的外观绘制
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        // 基类不绘制任何内容，由子类实现
        graphics.clear();
    }
    
    /**
     * 更新血条显示
     */
    protected updateHealthBar() {
        if (!this.config) return;
        HealthBarHelper.createOrUpdateHealthBar(
            this.node,
            this.config.health,
            this.maxHealth
        );
    }

    /**
     * 更新敌人位置（由 EnemyManager 调用）
     * @param deltaTime 帧时间
     * @param boundaryWidth 右边界宽度（容器宽度）
     */
    updatePosition(deltaTime: number, boundaryWidth: number) {
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
        
        // 如果找到了目标，锁定目标（停止移动）
        if (targetWeapon) {
            this.lockedTarget = targetWeapon;
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
            // 如果没有锁定目标，重置攻击计时器
            this.attackTimer = 0;
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
        
        this.config.health -= damage;
        
        // 更新血条
        this.updateHealthBar();
        
        if (this.config.health <= 0) {
            this.onDeath();
        }
    }
    

    /**
     * 死亡处理
     * 子类可以重写此方法实现不同的死亡效果
     */
    protected onDeath() {
        // 移除血条
        HealthBarHelper.removeHealthBar(this.node);
        this.node.destroy();
    }
}

