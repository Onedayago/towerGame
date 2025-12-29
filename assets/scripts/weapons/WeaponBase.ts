import { _decorator, Component, Graphics, UITransform, Node, EventTouch, Prefab, Color } from 'cc';
import { UiConfig } from '../config/Index';
import { WeaponType, WeaponConfig } from '../constants/Index';
import { getWeaponUpgradeConfig, getWeaponLevelConfig, WeaponUpgradeConfig } from '../constants/Index';
import { BulletManager, WeaponManager } from '../managers/Index';
import { WeaponAttack } from './WeaponAttack';
import { WeaponUpgrade } from './WeaponUpgrade';
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
    protected upgradeConfig: WeaponUpgradeConfig | null = null; // 升级配置
    
    @property({ type: Prefab })
    protected bulletPrefab: Prefab = null; // 子弹预制体
    
    protected weaponManager: WeaponManager | null = null; // 武器管理器
    
    // 子节点引用（从预制体中获取）
    protected upgradeButtonNode: Node | null = null; // 升级按钮节点
    protected removeButtonNode: Node | null = null; // 移除按钮节点
    protected appearanceNode: Node | null = null; // 外观展示节点

    // 功能模块
    private attack: WeaponAttack | null = null;
    private upgrade: WeaponUpgrade | null = null;
    
    // 范围指示器节点
    private rangeIndicatorNode: Node | null = null; // 升级时的临时指示器
    private selectedRangeIndicatorNode: Node | null = null; // 选中时的持续指示器

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
            damage: level1Config.damage,
            range: level1Config.range,
            attackSpeed: level1Config.attackSpeed,
            cost: this.upgradeConfig.buildCost
        };

        // 初始化功能模块
        this.initModules();

        // 绘制武器外观（在外观节点上绘制）
        this.drawAppearance(width, height);
        
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
            null, // 不再需要血条节点
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
    }

    /**
     * 处理升级
     */
    private handleUpgrade(newLevel: number) {
        if (!this.upgradeConfig || !this.config) return;

        const nextLevelConfig = getWeaponLevelConfig(this.upgradeConfig, newLevel);
        if (!nextLevelConfig) return;

        // 应用下一级的属性
        this.config.damage = nextLevelConfig.damage;
        this.config.range = nextLevelConfig.range;
        this.config.attackSpeed = nextLevelConfig.attackSpeed;

        // 更新模块配置
        if (this.attack) {
            this.attack.setConfig(this.config);
            this.attack.setAttackSpeed(this.config.attackSpeed);
        }

        // 显示升级后的攻击范围（临时显示，如果武器是选中的会在临时指示器消失后自动恢复显示选中范围）
        this.showUpgradeRange(nextLevelConfig.range);

        console.log(`Weapon upgraded to level ${newLevel}. Damage: ${this.config.damage}, Speed: ${this.config.attackSpeed}, Range: ${this.config.range}`);
    }
    
    /**
     * 短暂显示升级后的攻击范围
     * @param range 攻击范围（半径，像素）
     */
    private showUpgradeRange(range: number) {
        // 如果已有范围指示器，先销毁
        if (this.rangeIndicatorNode && this.rangeIndicatorNode.isValid) {
            this.rangeIndicatorNode.destroy();
            this.rangeIndicatorNode = null;
        }
        
        // 临时隐藏选中范围指示器（如果存在）
        const wasSelected = this.selectedRangeIndicatorNode && this.selectedRangeIndicatorNode.isValid;
        if (wasSelected && this.selectedRangeIndicatorNode) {
            this.selectedRangeIndicatorNode.active = false;
        }
        
        // 创建范围指示器节点
        this.rangeIndicatorNode = new Node('UpgradeRangeIndicator');
        this.rangeIndicatorNode.setParent(this.node);
        
        // 设置为最下层（在武器外观之后）
        this.rangeIndicatorNode.setSiblingIndex(0);
        
        // 添加 UITransform
        const transform = this.rangeIndicatorNode.addComponent(UITransform);
        const size = range * 2; // 直径 = 半径 * 2
        transform.setContentSize(size, size);
        transform.setAnchorPoint(0.5, 0.5);
        this.rangeIndicatorNode.setPosition(0, 0, 0);
        
        // 添加 Graphics 组件并绘制圆圈
        const graphics = this.rangeIndicatorNode.addComponent(Graphics);
        graphics.clear();
        
        // 使用半透明的蓝色显示升级后的范围
        graphics.fillColor = new Color(100, 150, 255, 120); // 半透明蓝色
        graphics.strokeColor = new Color(100, 150, 255, 200); // 稍微更深的蓝色边框
        graphics.lineWidth = 2;
        
        const radius = size / 2;
        graphics.circle(0, 0, radius);
        graphics.fill();
        graphics.stroke();
        
        // 1.5秒后自动销毁，如果武器是选中的则恢复显示选中范围指示器
        this.scheduleOnce(() => {
            if (this.rangeIndicatorNode && this.rangeIndicatorNode.isValid) {
                this.rangeIndicatorNode.destroy();
                this.rangeIndicatorNode = null;
            }
            
            // 如果武器是选中的，恢复显示选中范围指示器（并更新范围）
            if (wasSelected && this.selectedRangeIndicatorNode && this.selectedRangeIndicatorNode.isValid) {
                this.showSelectedRange();
            }
        }, 1.5);
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
        // 查找升级按钮节点
        this.upgradeButtonNode = this.node.getChildByName('UpgradeButton');
        
        // 查找移除按钮节点
        this.removeButtonNode = this.node.getChildByName('RemoveButton');
        
        // 查找外观展示节点
        this.appearanceNode = this.node.getChildByName('AppearanceNode');
    }
    
    /**
     * 检查是否在武器卡片容器中（用于跳过阴影等效果）
     * @returns 是否在卡片容器中
     */
    protected isInCardContainer(): boolean {
        let parent = this.node.parent;
        while (parent) {
            // 检查父节点是否有WeaponCard组件
            if (parent.getComponent('WeaponCard')) {
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
        
        // 显示或隐藏攻击范围
        if (selected) {
            this.showSelectedRange();
        } else {
            this.hideSelectedRange();
        }
    }
    
    /**
     * 显示选中时的攻击范围
     */
    private showSelectedRange() {
        // 如果已有选中范围指示器，先销毁
        if (this.selectedRangeIndicatorNode && this.selectedRangeIndicatorNode.isValid) {
            this.selectedRangeIndicatorNode.destroy();
            this.selectedRangeIndicatorNode = null;
        }
        
        if (!this.config) return;
        
        const currentRange = this.config.range;
        
        // 创建选中范围指示器节点
        this.selectedRangeIndicatorNode = new Node('SelectedRangeIndicator');
        this.selectedRangeIndicatorNode.setParent(this.node);
        
        // 设置为最下层（在武器外观之后）
        this.selectedRangeIndicatorNode.setSiblingIndex(0);
        
        // 添加 UITransform
        const transform = this.selectedRangeIndicatorNode.addComponent(UITransform);
        const size = currentRange * 2; // 直径 = 半径 * 2
        transform.setContentSize(size, size);
        transform.setAnchorPoint(0.5, 0.5);
        this.selectedRangeIndicatorNode.setPosition(0, 0, 0);
        
        // 添加 Graphics 组件并绘制圆圈
        const graphics = this.selectedRangeIndicatorNode.addComponent(Graphics);
        graphics.clear();
        
        // 使用半透明的绿色显示选中时的范围
        graphics.fillColor = new Color(0, 255, 0, 100); // 半透明绿色
        graphics.strokeColor = new Color(0, 255, 0, 180); // 稍微更深的绿色边框
        graphics.lineWidth = 2;
        
        const radius = size / 2;
        graphics.circle(0, 0, radius);
        graphics.fill();
        graphics.stroke();
    }
    
    /**
     * 隐藏选中时的攻击范围
     */
    private hideSelectedRange() {
        if (this.selectedRangeIndicatorNode && this.selectedRangeIndicatorNode.isValid) {
            this.selectedRangeIndicatorNode.destroy();
            this.selectedRangeIndicatorNode = null;
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
     * 组件销毁时清理事件监听
     */
    onDestroy() {
        // 清理范围指示器
        if (this.rangeIndicatorNode && this.rangeIndicatorNode.isValid) {
            this.rangeIndicatorNode.destroy();
            this.rangeIndicatorNode = null;
        }
        
        // 清理选中范围指示器
        if (this.selectedRangeIndicatorNode && this.selectedRangeIndicatorNode.isValid) {
            this.selectedRangeIndicatorNode.destroy();
            this.selectedRangeIndicatorNode = null;
        }
        
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

