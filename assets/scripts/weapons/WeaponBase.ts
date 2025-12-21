import { _decorator, Component, Graphics, UITransform, Node, Vec3, Prefab, instantiate } from 'cc';
import { UiConfig } from '../config/Index';
import { WeaponType, getWeaponConfig, WeaponConfig, WEAPON_COMMON_CONFIG } from '../constants/Index';
import { BulletManager } from '../managers/Index';
import { BulletBase } from '../bullets/Index';
import { TargetFinder, HealthBarHelper } from '../utils/Index';
const { ccclass, property } = _decorator;

/**
 * 武器基类
 * 所有武器类型都继承此类
 * 武器没有移动速度，只能固定在位置上
 */
@ccclass('WeaponBase')
export class WeaponBase extends Component {
    
    protected attackSpeed: number = 0;
    protected attackTimer: number = 0;
    protected config: WeaponConfig | null = null;
    protected weaponType: WeaponType;
    protected maxHealth: number = 0; // 最大生命值（用于血条显示）
    
    @property(Prefab)
    protected bulletPrefab: Prefab = null; // 子弹预制体
    
    protected bulletManager: BulletManager | null = null; // 子弹管理器
    protected enemies: Node[] = []; // 敌人列表（由 WeaponManager 设置）

    /**
     * 初始化武器
     * @param type 武器类型
     */
    protected init(type: WeaponType) {
        this.weaponType = type;
        
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        if (!graphics || !transform) return;
        
        transform.setAnchorPoint(0.5, 0.5);
        
        // 所有武器大小相同
        const width = UiConfig.CELL_SIZE;
        const height = UiConfig.CELL_SIZE;
        transform.setContentSize(width, height);
        

        // 加载武器配置
        this.config = getWeaponConfig(type);
        this.attackSpeed = this.config.attackSpeed;
        this.maxHealth = this.config.health; // 保存最大生命值

        // 绘制武器外观（不使用背景色填充）
        // 由子类实现具体的绘制逻辑
        this.drawAppearance(graphics, width, height);
        
        // 创建血条
        this.updateHealthBar();
    }
    
    /**
     * 绘制武器外观
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
     * 更新攻击逻辑
     * @param deltaTime 帧时间
     * @param enemies 敌人列表
     * @param bulletManager 子弹管理器
     */
    updateAttack(deltaTime: number, enemies: Node[] = [], bulletManager: BulletManager | null = null) {
        if (!this.config) return;
        
        // 保存敌人列表和子弹管理器
        this.enemies = enemies;
        this.bulletManager = bulletManager;
        
        this.attackTimer += deltaTime;
        if (this.attackTimer >= this.attackSpeed) {
            this.attackTimer = 0;
            
            // 检测附近是否有敌人
            const targetEnemy = this.findNearestEnemyInRange();
            if (targetEnemy) {
                this.performAttack(targetEnemy);
            }
        }
    }

    /**
     * 执行攻击
     * 子类可以重写此方法实现不同的攻击逻辑
     * @param targetEnemy 目标敌人
     */
    protected performAttack(targetEnemy: Node | null = null) {
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
    protected fireBullet(targetEnemy: Node) {
        if (!this.bulletPrefab || !this.bulletManager || !this.config) {
            return;
        }
        
        // 创建子弹实例
        const bulletNode = instantiate(this.bulletPrefab);
        if (!bulletNode) return;
        
        // 获取武器中心位置（武器锚点为中心）
        const weaponPos = this.node.position;
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
        
        // 初始化子弹（使用 BulletBase，支持所有子弹类型）
        const bulletComponent = bulletNode.getComponent(BulletBase);
        if (bulletComponent) {
            // 最大飞行距离为攻击范围的倍数（从常量配置中获取）
            const maxDistance = this.config.range * WEAPON_COMMON_CONFIG.BULLET_MAX_DISTANCE_MULTIPLIER;
            // 子弹速度由子弹类自己管理，这里只需要传入伤害和方向
            bulletComponent.init(this.config.damage, direction, maxDistance);
        }
        
        // 添加到子弹管理器
        this.bulletManager.addBullet(bulletNode);
    }
    
    /**
     * 查找攻击范围内的最近敌人
     * @returns 最近的敌人节点，如果没有则返回 null
     */
    protected findNearestEnemyInRange(): Node | null {
        if (!this.config || this.enemies.length === 0) {
            return null;
        }
        
        // 武器位置
        const weaponPos = this.node.position;
        const range = this.config.range;
        
        // 使用 TargetFinder 查找目标（武器可以攻击任何方向的敌人）
        return TargetFinder.findNearestInRange(
            weaponPos,
            this.enemies,
            range
        );
    }

    /**
     * 获取武器配置
     */
    getConfig(): WeaponConfig | null {
        return this.config;
    }

    /**
     * 获取武器类型
     */
    getWeaponType(): WeaponType {
        return this.weaponType;
    }

    /**
     * 设置攻击速度（覆盖配置）
     */
    setAttackSpeed(speed: number) {
        this.attackSpeed = speed;
    }

    /**
     * 获取攻击范围
     */
    getRange(): number {
        return this.config?.range || 0;
    }

    /**
     * 获取攻击力
     */
    getDamage(): number {
        return this.config?.damage || 0;
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

