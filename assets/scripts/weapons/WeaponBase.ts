import { _decorator, Component, Graphics, UITransform, Node, EventTouch, Prefab } from 'cc';
import { UiConfig } from '../config/Index';
import { WeaponType, WeaponConfig } from '../constants/Index';
import { getWeaponUpgradeConfig, getWeaponLevelConfig, WeaponUpgradeConfig } from '../constants/Index';
import { BulletManager, WeaponManager } from '../managers/Index';
import { WeaponAttack } from './WeaponAttack';
import { WeaponUpgrade } from './WeaponUpgrade';
import { WeaponHealth } from './WeaponHealth';
const { ccclass, property } = _decorator;

/**
 * 武器基类
 * 所有武器类型都继承此类
 * 武器没有移动速度，只能固定在位置上
 */
@ccclass('WeaponBase')
export class WeaponBase extends Component {
    
    protected config: WeaponConfig | null = null;
    protected weaponType: WeaponType;
    protected maxHealth: number = 0; // 最大生命值（用于血条显示）
    protected upgradeConfig: WeaponUpgradeConfig | null = null; // 升级配置
    
    @property({ type: Prefab })
    protected bulletPrefab: Prefab = null; // 子弹预制体
    
    protected weaponManager: WeaponManager | null = null; // 武器管理器
    
    // 子节点引用（从预制体中获取）
    protected healthBarNode: Node | null = null; // 血条节点
    protected upgradeButtonNode: Node | null = null; // 升级按钮节点
    protected removeButtonNode: Node | null = null; // 移除按钮节点
    protected appearanceNode: Node | null = null; // 外观展示节点

    // 功能模块
    private attack: WeaponAttack | null = null;
    private upgrade: WeaponUpgrade | null = null;
    private health: WeaponHealth | null = null;

    /**
     * 初始化武器
     * @param type 武器类型
     */
    protected init(type: WeaponType) {
        this.weaponType = type;
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        transform.setAnchorPoint(0.5, 0.5);
        
        // 所有武器大小相同（整体缩小）
        const sizeScale = 0.6;
        const width = UiConfig.CELL_SIZE * sizeScale;
        const height = UiConfig.CELL_SIZE * sizeScale;
        transform.setContentSize(width, height);
        
        // 初始化子节点引用
        this.initChildNodes();
        
        // 加载升级配置
        this.upgradeConfig = getWeaponUpgradeConfig(type);
        
        // 获取1级配置（初始等级）
        const level1Config = getWeaponLevelConfig(this.upgradeConfig, 1);
        if (!level1Config) {
            console.error(`Level 1 config not found for weapon type: ${type}`);
            return;
        }
        
        // 创建配置对象并应用1级属性
        this.config = {
            type: type,
            health: level1Config.health,
            damage: level1Config.damage,
            range: level1Config.range,
            attackSpeed: level1Config.attackSpeed,
            cost: this.upgradeConfig.buildCost
        };
        
        this.maxHealth = level1Config.health; // 保存最大生命值

        // 初始化功能模块
        this.initModules();

        // 绘制武器外观（在外观节点上绘制）
        this.drawAppearance(width, height);
        
        // 初始化血条（如果不在武器容器中）
        if (!this.isInWeaponContainer()) {
            if (this.health) {
                this.health.updateHealthBar();
            }
        }
        
        // 初始隐藏按钮
        this.setSelected(false);

        // 武器节点点击事件（用于选中武器）
        this.node.on(Node.EventType.TOUCH_END, this.onWeaponClick, this);
    }

    /**
     * 获取旋转角度偏移
     * 子类可以重写此方法返回自定义的旋转偏移
     * @returns 旋转角度偏移（度），默认0
     */
    protected getRotationOffset(): number {
        return 0;
    }

    /**
     * 是否应该在攻击时旋转
     * 子类可以重写此方法禁用旋转（例如火箭塔）
     * @returns 是否应该旋转，默认true
     */
    protected shouldRotateWhenAttacking(): boolean {
        return true;
    }

    /**
     * 初始化功能模块
     */
    private initModules() {
        if (!this.config || !this.upgradeConfig) return;

        // 获取旋转偏移（子类可以重写此方法）
        const rotationOffset = this.getRotationOffset();

        // 初始化攻击模块
        // 检查是否需要旋转（火箭塔不需要旋转）
        const shouldRotate = this.shouldRotateWhenAttacking();
        this.attack = new WeaponAttack(
            this.node,
            this.appearanceNode,
            this.healthBarNode,
            this.config,
            this.config.attackSpeed,
            rotationOffset,
            shouldRotate
        );
        this.attack.setBulletPrefab(this.bulletPrefab);

        // 初始化升级模块
        this.upgrade = new WeaponUpgrade(
            this.node,
            this.upgradeButtonNode,
            this.removeButtonNode,
            this.upgradeConfig,
            this.getLevel()
        );
        this.upgrade.setWeaponManager(this.weaponManager);
        this.upgrade.setOnUpgradeCallback((newLevel) => {
            this.handleUpgrade(newLevel);
        });
        this.upgrade.setOnRemoveCallback(() => {
            this.handleRemove();
        });
        this.upgrade.initButtons();

        // 初始化生命值模块
        this.health = new WeaponHealth(
            this.node,
            this.healthBarNode,
            this.config,
            this.maxHealth
        );
        this.health.setOnDeathCallback(() => {
            this.node.destroy();
        });
    }

    /**
     * 处理升级
     */
    private handleUpgrade(newLevel: number) {
        if (!this.upgradeConfig || !this.config) return;

        const nextLevelConfig = getWeaponLevelConfig(this.upgradeConfig, newLevel);
        if (!nextLevelConfig) return;

        // 应用下一级的属性
        this.config.health = nextLevelConfig.health;
        this.config.damage = nextLevelConfig.damage;
        this.config.range = nextLevelConfig.range;
        this.config.attackSpeed = nextLevelConfig.attackSpeed;

        // 更新最大生命值
        this.maxHealth = nextLevelConfig.health;

        // 更新模块配置
        if (this.attack) {
            this.attack.setConfig(this.config);
            this.attack.setAttackSpeed(this.config.attackSpeed);
        }
        if (this.health) {
            this.health.setConfig(this.config);
            this.health.setMaxHealth(this.maxHealth);
            this.health.updateHealthBar();
        }

        console.log(`Weapon upgraded to level ${newLevel}. Damage: ${this.config.damage}, Speed: ${this.config.attackSpeed}, Range: ${this.config.range}, Health: ${this.config.health}`);
    }

    /**
     * 处理移除
     */
    private handleRemove() {
        // 通知武器管理器移除此武器
        if (this.weaponManager) {
            this.weaponManager.removeWeapon(this.node);
        }

        // 销毁武器节点
        this.node.destroy();
    }
    
    /**
     * 初始化子节点引用
     */
    protected initChildNodes() {
        // 查找血条节点
        this.healthBarNode = this.node.getChildByName('HealthBar');
        
        // 查找升级按钮节点
        this.upgradeButtonNode = this.node.getChildByName('UpgradeButton');
        
        // 查找移除按钮节点
        this.removeButtonNode = this.node.getChildByName('RemoveButton');
        
        // 查找外观展示节点
        this.appearanceNode = this.node.getChildByName('AppearanceNode');
    }
    
    /**
     * 判断是否在武器容器中
     * @returns 是否在武器容器中
     */
    protected isInWeaponContainer(): boolean {
        let parent = this.node.parent;
        while (parent) {
            if (parent.name === 'WeaponContainer' || parent.name.startsWith('WeaponCard_')) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    }
    
    /**
     * 绘制武器外观
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
     * 武器点击事件
     */
    protected onWeaponClick(event: EventTouch) {
        // 阻止事件冒泡
        event.propagationStopped = true;
        
        // 通知武器管理器选中此武器
        if (this.weaponManager) {
            this.weaponManager.selectWeapon(this.node);
        }
    }
    
    /**
     * 设置武器管理器
     * @param weaponManager 武器管理器
     */
    setWeaponManager(weaponManager: WeaponManager) {
        this.weaponManager = weaponManager;
        if (this.upgrade) {
            this.upgrade.setWeaponManager(weaponManager);
        }
    }
    
    /**
     * 设置选中状态
     * @param selected 是否选中
     */
    setSelected(selected: boolean) {
        if (this.upgrade) {
            this.upgrade.setSelected(selected);
        }
    }
    
    /**
     * 获取武器等级
     */
    getLevel(): number {
        return this.upgrade ? this.upgrade.getLevel() : 1;
    }

    /**
     * 更新攻击逻辑
     * @param deltaTime 帧时间
     * @param enemies 敌人列表
     * @param bulletManager 子弹管理器
     */
    updateAttack(deltaTime: number, enemies: Node[] = [], bulletManager: BulletManager | null = null) {
        if (this.attack) {
            this.attack.setEnemies(enemies);
            this.attack.setBulletManager(bulletManager);
            this.attack.update(deltaTime);
        }
    }

    /**
     * 执行攻击
     * 子类可以重写此方法实现不同的攻击逻辑
     * @param targetEnemy 目标敌人
     */
    protected performAttack(targetEnemy: Node | null = null) {
        if (this.attack && targetEnemy) {
            this.attack.performAttack(targetEnemy);
        }
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
        if (this.attack) {
            this.attack.setAttackSpeed(speed);
        }
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
        if (this.health) {
            this.health.takeDamage(damage);
        }
    }
    
    /**
     * 组件销毁时清理事件监听
     */
    onDestroy() {
        // 清理升级模块
        if (this.upgrade) {
            this.upgrade.cleanup();
        }
        
        // 移除武器点击事件监听
        if (this.node && this.node.isValid) {
            this.node.off(Node.EventType.TOUCH_END, this.onWeaponClick, this);
        }
        
        // 如果当前被选中，取消选中
        if (this.weaponManager) {
            this.weaponManager.deselectWeapon();
        }
    }
}

