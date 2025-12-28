import { Node, Button, EventTouch } from 'cc';
import { WeaponUpgradeConfig, WeaponLevelConfig, getWeaponLevelConfig } from '../constants/Index';
import { UiConfig } from '../config/Index';
import { WeaponManager, GoldManager } from '../managers/Index';
import { WeaponButtonRenderer } from '../renderers/Index';

/**
 * 武器升级管理器
 * 负责处理武器的升级和移除逻辑
 */
export class WeaponUpgrade {
    private weaponNode: Node;
    private upgradeButtonNode: Node | null;
    private removeButtonNode: Node | null;
    private upgradeConfig: WeaponUpgradeConfig | null;
    private level: number = 1;
    private weaponManager: WeaponManager | null = null;
    private isSelected: boolean = false;
    private onUpgradeCallback: ((newLevel: number) => void) | null = null;
    private onRemoveCallback: (() => void) | null = null;

    constructor(
        weaponNode: Node,
        upgradeButtonNode: Node | null,
        removeButtonNode: Node | null,
        upgradeConfig: WeaponUpgradeConfig | null,
        level: number = 1
    ) {
        this.weaponNode = weaponNode;
        this.upgradeButtonNode = upgradeButtonNode;
        this.removeButtonNode = removeButtonNode;
        this.upgradeConfig = upgradeConfig;
        this.level = level;
    }

    /**
     * 设置武器管理器
     */
    setWeaponManager(weaponManager: WeaponManager | null) {
        this.weaponManager = weaponManager;
    }

    /**
     * 设置升级回调
     */
    setOnUpgradeCallback(callback: (newLevel: number) => void) {
        this.onUpgradeCallback = callback;
    }

    /**
     * 设置移除回调
     */
    setOnRemoveCallback(callback: () => void) {
        this.onRemoveCallback = callback;
    }

    /**
     * 初始化按钮事件和外观
     */
    initButtons() {
        const buttonSize = WeaponButtonRenderer.getRecommendedSize();
        const buttonWidth = WeaponButtonRenderer.getRecommendedWidth();
        // 武器大小现在是 0.6，按钮在武器上方
        const weaponHeight = UiConfig.CELL_SIZE * 0.6;
        const buttonOffsetY = (weaponHeight / 2) + buttonSize / 2 + 10; // 按钮在武器上方
        const buttonSpacing = buttonWidth + 10; // 按钮之间的间距

        if (!this.upgradeConfig) {
            console.error(`Upgrade config not found`);
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
    }

    /**
     * 升级按钮点击事件
     */
    private onUpgradeButtonClick(event?: EventTouch) {
        if (event) {
            event.propagationStopped = true;
        }
        this.onUpgrade();
    }

    /**
     * 移除按钮点击事件
     */
    private onRemoveButtonClick(event?: EventTouch) {
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
    updateButtonsVisibility() {
        // 只在被选中时显示按钮
        const shouldShow = this.isSelected;

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
    onUpgrade() {
        if (!this.upgradeConfig) return;

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

        // 更新按钮显示（升级成本会变化）
        this.updateButtonLabels();

        // 更新按钮可用状态
        this.updateButtonsVisibility();

        // 调用回调
        if (this.onUpgradeCallback) {
            this.onUpgradeCallback(this.level);
        }

        console.log(`Weapon upgraded to level ${this.level}`);
    }

    /**
     * 移除武器
     */
    onRemove() {
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

        // 调用回调
        if (this.onRemoveCallback) {
            this.onRemoveCallback();
        }
    }

    /**
     * 更新按钮标签（升级成本和出售价格）
     */
    updateButtonLabels() {
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
     * 设置等级
     */
    setLevel(level: number) {
        this.level = level;
    }

    /**
     * 清理事件监听
     */
    cleanup() {
        // 移除按钮事件监听（检查节点有效性，避免场景切换时的销毁错误）
        if (this.upgradeButtonNode && this.upgradeButtonNode.isValid) {
            const upgradeButton = this.upgradeButtonNode.getComponent(Button);
            if (upgradeButton && upgradeButton.node && upgradeButton.node.isValid) {
                upgradeButton.node.off(Button.EventType.CLICK, this.onUpgradeButtonClick, this);
            } else if (this.upgradeButtonNode.isValid) {
                this.upgradeButtonNode.off(Node.EventType.TOUCH_END, this.onUpgradeButtonClick, this);
            }
        }

        if (this.removeButtonNode && this.removeButtonNode.isValid) {
            const removeButton = this.removeButtonNode.getComponent(Button);
            if (removeButton && removeButton.node && removeButton.node.isValid) {
                removeButton.node.off(Button.EventType.CLICK, this.onRemoveButtonClick, this);
            } else if (this.removeButtonNode.isValid) {
                this.removeButtonNode.off(Node.EventType.TOUCH_END, this.onRemoveButtonClick, this);
            }
        }
    }
}

