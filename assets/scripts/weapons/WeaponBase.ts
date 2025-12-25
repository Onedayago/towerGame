import { _decorator, Component, Graphics, UITransform, Node, Vec3, Prefab, instantiate, EventTouch, Button } from 'cc';
import { UiConfig } from '../config/Index';
import { WeaponType, WeaponConfig, WEAPON_COMMON_CONFIG } from '../constants/Index';
import { getWeaponUpgradeConfig, getWeaponLevelConfig, WeaponUpgradeConfig, WeaponLevelConfig } from '../config/Index';
import { BulletManager, WeaponManager, GoldManager } from '../managers/Index';
import { BulletBase } from '../bullets/Index';
import { TargetFinder, HealthBarHelper } from '../utils/Index';
import { WeaponButtonRenderer } from '../renderers/Index';
import { HealthBarRenderer } from '../renderers/HealthBarRenderer';
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
    protected level: number = 1; // 武器等级（从1开始）
    protected upgradeConfig: WeaponUpgradeConfig | null = null; // 升级配置
    
    @property(Prefab)
    protected bulletPrefab: Prefab = null; // 子弹预制体
    
    protected bulletManager: BulletManager | null = null; // 子弹管理器
    protected weaponManager: WeaponManager | null = null; // 武器管理器
    protected enemies: Node[] = []; // 敌人列表（由 WeaponManager 设置）
    protected isSelected: boolean = false; // 是否被选中
    
    // 子节点引用（从预制体中获取）
    protected healthBarNode: Node | null = null; // 血条节点
    protected upgradeButtonNode: Node | null = null; // 升级按钮节点
    protected removeButtonNode: Node | null = null; // 移除按钮节点
    protected appearanceNode: Node | null = null; // 外观展示节点

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
        
        this.attackSpeed = level1Config.attackSpeed;
        this.maxHealth = level1Config.health; // 保存最大生命值

        // 绘制武器外观（在外观节点上绘制）
        this.drawAppearance(width, height);
        
        // 初始化血条（如果不在武器容器中）
        if (!this.isInWeaponContainer()) {
            this.updateHealthBar();
        }
        
        // 初始化按钮外观和事件
        this.initButtons();
        
        // 初始隐藏按钮
        this.setSelected(false);
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
     * 初始化按钮事件和外观
     * 按钮外观由编辑器中的 Button 组件配置，通过代码美化
     */
    protected initButtons() {
        const buttonSize = WeaponButtonRenderer.getRecommendedSize();
        const buttonWidth = WeaponButtonRenderer.getRecommendedWidth();
        // 武器大小现在是 0.6，血条在武器上方（偏移0.25），按钮需要在血条上方
        const weaponHeight = UiConfig.CELL_SIZE * 0.6;
        const healthBarOffset = UiConfig.CELL_SIZE * 0.25; // 血条偏移（与 HealthBarHelper 保持一致）
        const healthBarHeight = HealthBarRenderer.getHeight(); // 血条高度
        const buttonOffsetY = (weaponHeight / 2) + healthBarOffset + (healthBarHeight / 2) + buttonSize / 2 + 10; // 按钮在血条上方
        const buttonSpacing = buttonWidth + 10; // 按钮之间的间距（使用宽度）
        
        // 从配置中获取当前等级的升级成本和出售价格
        if (!this.upgradeConfig) {
            console.error(`Upgrade config not found for weapon type: ${this.weaponType}`);
            return;
        }
        
        const currentLevelConfig = getWeaponLevelConfig(this.upgradeConfig, this.level);
        if (!currentLevelConfig) {
            console.error(`Level ${this.level} config not found`);
            return;
        }
        
        // 获取下一级的升级成本（如果已满级则为0）
        const nextLevel = this.level + 1;
        const nextLevelConfig = getWeaponLevelConfig(this.upgradeConfig, nextLevel);
        const upgradeCost = nextLevelConfig ? nextLevelConfig.upgradeCost : 0;
        
        // 获取当前等级的出售价格
        const sellValue = currentLevelConfig.sellPrice;
        
        // 初始化升级按钮
        if (this.upgradeButtonNode) {
            // 设置按钮位置（在武器上方左侧）
            this.upgradeButtonNode.setPosition(-buttonSpacing / 2, buttonOffsetY, 0);
            
            const upgradeButton = this.upgradeButtonNode.getComponent(Button);
            if (upgradeButton) {
                // 美化按钮外观，传入升级成本
                WeaponButtonRenderer.styleUpgradeButton(this.upgradeButtonNode, upgradeCost);
                // 使用 Button 组件的 click 事件
                upgradeButton.node.on(Button.EventType.CLICK, this.onUpgradeButtonClick, this);
            } else {
                // 如果没有 Button 组件，使用触摸事件（兼容旧代码）
                this.upgradeButtonNode.on(Node.EventType.TOUCH_END, this.onUpgradeButtonClick, this);
            }
        }
        
        // 初始化移除按钮
        if (this.removeButtonNode) {
            // 设置按钮位置（在武器上方右侧）
            this.removeButtonNode.setPosition(buttonSpacing / 2, buttonOffsetY, 0);
            
            const removeButton = this.removeButtonNode.getComponent(Button);
            if (removeButton) {
                // 美化按钮外观，传入出售价格
                WeaponButtonRenderer.styleRemoveButton(this.removeButtonNode, sellValue);
                // 使用 Button 组件的 click 事件
                removeButton.node.on(Button.EventType.CLICK, this.onRemoveButtonClick, this);
            } else {
                // 如果没有 Button 组件，使用触摸事件（兼容旧代码）
                this.removeButtonNode.on(Node.EventType.TOUCH_END, this.onRemoveButtonClick, this);
            }
        }
        
        // 武器节点点击事件（用于选中武器）
        this.node.on(Node.EventType.TOUCH_END, this.onWeaponClick, this);
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
     * 升级按钮点击事件
     */
    protected onUpgradeButtonClick(event?: EventTouch) {
        if (event) {
            event.propagationStopped = true;
        }
        this.onUpgrade();
    }
    
    /**
     * 移除按钮点击事件
     */
    protected onRemoveButtonClick(event?: EventTouch) {
        if (event) {
            event.propagationStopped = true;
        }
        this.onRemove();
    }
    
    /**
     * 设置选中状态
     * @param selected 是否选中
     */
    setSelected(selected: boolean) {
        this.isSelected = selected;
        this.updateButtonsVisibility();
    }
    
    /**
     * 更新按钮显示状态
     */
    protected updateButtonsVisibility() {
        // 只在非武器容器中且被选中时显示按钮
        const shouldShow = this.isSelected && !this.isInWeaponContainer();
        
        if (this.upgradeButtonNode) {
            this.upgradeButtonNode.active = shouldShow;
            
            // 检查金币是否足够升级
            if (shouldShow && this.upgradeConfig) {
                const goldManager = GoldManager.getInstance();
                const nextLevel = this.level + 1;
                const nextLevelConfig = getWeaponLevelConfig(this.upgradeConfig, nextLevel);
                
                // 如果已达到最大等级，禁用升级按钮
                if (!nextLevelConfig) {
                    const button = this.upgradeButtonNode.getComponent(Button);
                    if (button) {
                        button.interactable = false;
                    }
                } else {
                    const upgradeCost = nextLevelConfig.upgradeCost;
                    const canAfford = goldManager.canAfford(upgradeCost);
                    
                    // 禁用或启用按钮
                    const button = this.upgradeButtonNode.getComponent(Button);
                    if (button) {
                        button.interactable = canAfford;
                    }
                }
            }
        }
        
        if (this.removeButtonNode) {
            this.removeButtonNode.active = shouldShow;
        }
    }
    
    /**
     * 升级武器
     */
    protected onUpgrade() {
        if (!this.upgradeConfig || !this.config) return;
        
        // 检查是否已达到最大等级
        if (this.level >= this.upgradeConfig.maxLevel) {
            console.log(`Weapon already at max level ${this.upgradeConfig.maxLevel}`);
            return;
        }
        
        // 获取下一级配置
        const nextLevel = this.level + 1;
        const nextLevelConfig = getWeaponLevelConfig(this.upgradeConfig, nextLevel);
        if (!nextLevelConfig) {
            console.log(`Next level ${nextLevel} config not found`);
            return;
        }
        
        const goldManager = GoldManager.getInstance();
        const upgradeCost = nextLevelConfig.upgradeCost;
        
        // 检查是否有足够的金币
        if (!goldManager.canAfford(upgradeCost)) {
            console.log(`Not enough gold to upgrade. Need: ${upgradeCost}, Have: ${goldManager.getGold()}`);
            return;
        }
        
        // 扣除金币
        if (!goldManager.spend(upgradeCost)) {
            console.log(`Failed to spend gold for upgrade`);
            return;
        }
        
        // 提升等级
        this.level = nextLevel;
        
        // 应用下一级的属性
        this.config.health = nextLevelConfig.health;
        this.config.damage = nextLevelConfig.damage;
        this.config.range = nextLevelConfig.range;
        this.config.attackSpeed = nextLevelConfig.attackSpeed;
        
        // 更新攻击速度和最大生命值
        this.attackSpeed = nextLevelConfig.attackSpeed;
        this.maxHealth = nextLevelConfig.health;
        
        // 更新血条
        this.updateHealthBar();
        
        // 更新按钮显示（升级成本会变化）
        this.updateButtonLabels();
        
        // 更新按钮可用状态
        this.updateButtonsVisibility();
        
        console.log(`Weapon upgraded to level ${this.level}. Damage: ${this.config.damage}, Speed: ${this.config.attackSpeed}, Range: ${this.config.range}, Health: ${this.config.health}`);
    }
    
    /**
     * 移除武器
     */
    protected onRemove() {
        if (!this.upgradeConfig) return;
        
        // 获取当前等级的出售价格
        const currentLevelConfig = getWeaponLevelConfig(this.upgradeConfig, this.level);
        if (!currentLevelConfig) {
            console.error(`Level ${this.level} config not found for sell`);
            return;
        }
        
        const sellValue = currentLevelConfig.sellPrice;
        
        // 返还金币
        const goldManager = GoldManager.getInstance();
        goldManager.addGold(sellValue);
        
        console.log(`Weapon sold at level ${this.level}. Returned ${sellValue} gold.`);
        
        // 通知武器管理器移除此武器
        if (this.weaponManager) {
            this.weaponManager.removeWeapon(this.node);
        }
        
        // 销毁武器节点
        this.node.destroy();
    }
    
    /**
     * 设置武器管理器
     * @param weaponManager 武器管理器
     */
    setWeaponManager(weaponManager: WeaponManager) {
        this.weaponManager = weaponManager;
    }
    
    /**
     * 更新按钮标签（升级成本和出售价格）
     */
    protected updateButtonLabels() {
        if (!this.upgradeConfig) return;
        
        // 获取当前等级配置
        const currentLevelConfig = getWeaponLevelConfig(this.upgradeConfig, this.level);
        if (!currentLevelConfig) return;
        
        // 获取下一级的升级成本（如果已满级则为0）
        const nextLevel = this.level + 1;
        const nextLevelConfig = getWeaponLevelConfig(this.upgradeConfig, nextLevel);
        const upgradeCost = nextLevelConfig ? nextLevelConfig.upgradeCost : 0;
        
        // 获取当前等级的出售价格
        const sellValue = currentLevelConfig.sellPrice;
        
        // 更新升级按钮
        if (this.upgradeButtonNode) {
            WeaponButtonRenderer.styleUpgradeButton(this.upgradeButtonNode, upgradeCost);
        }
        
        // 更新移除按钮
        if (this.removeButtonNode) {
            WeaponButtonRenderer.styleRemoveButton(this.removeButtonNode, sellValue);
        }
    }
    
    /**
     * 获取武器等级
     */
    getLevel(): number {
        return this.level;
    }
    
    /**
     * 更新血条显示
     */
    protected updateHealthBar() {
        if (!this.config || !this.healthBarNode) return;
        
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
        
        // 检测附近是否有敌人（用于旋转面向目标）
        const targetEnemy = this.findNearestEnemyInRange();
        if (targetEnemy) {
            // 旋转武器面向目标敌人
            this.rotateTowardsTarget(targetEnemy);
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
     * 旋转武器面向目标敌人
     * @param targetEnemy 目标敌人节点
     */
    protected rotateTowardsTarget(targetEnemy: Node) {
        if (!targetEnemy || !targetEnemy.isValid) return;
        
        // 获取武器位置和目标位置
        const weaponPos = this.node.position;
        const targetPos = targetEnemy.position;
        
        // 计算方向向量
        const direction = new Vec3(
            targetPos.x - weaponPos.x,
            targetPos.y - weaponPos.y,
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
    
    /**
     * 组件销毁时清理事件监听
     */
    onDestroy() {
        // 移除按钮事件监听
        if (this.upgradeButtonNode && this.upgradeButtonNode.isValid) {
            const upgradeButton = this.upgradeButtonNode.getComponent(Button);
            if (upgradeButton) {
                upgradeButton.node.off(Button.EventType.CLICK, this.onUpgradeButtonClick, this);
            } else {
                this.upgradeButtonNode.off(Node.EventType.TOUCH_END, this.onUpgradeButtonClick, this);
            }
        }
        
        if (this.removeButtonNode && this.removeButtonNode.isValid) {
            const removeButton = this.removeButtonNode.getComponent(Button);
            if (removeButton) {
                removeButton.node.off(Button.EventType.CLICK, this.onRemoveButtonClick, this);
            } else {
                this.removeButtonNode.off(Node.EventType.TOUCH_END, this.onRemoveButtonClick, this);
            }
        }
        
        // 移除武器点击事件监听
        if (this.node && this.node.isValid) {
            this.node.off(Node.EventType.TOUCH_END, this.onWeaponClick, this);
        }
        
        // 如果当前被选中，取消选中
        if (this.isSelected && this.weaponManager) {
            this.weaponManager.deselectWeapon();
        }
    }
}

