import { Node } from 'cc';
import { WeaponConfig } from '../constants/Index';
import { HealthBarHelper } from '../utils/Index';

/**
 * 武器生命值管理器
 * 负责处理武器的生命值、伤害和死亡逻辑
 */
export class WeaponHealth {
    private weaponNode: Node;
    private healthBarNode: Node | null;
    private config: WeaponConfig | null;
    private maxHealth: number = 0;
    private onDeathCallback: (() => void) | null = null;

    constructor(
        weaponNode: Node,
        healthBarNode: Node | null,
        config: WeaponConfig | null,
        maxHealth: number
    ) {
        this.weaponNode = weaponNode;
        this.healthBarNode = healthBarNode;
        this.config = config;
        this.maxHealth = maxHealth;
    }

    /**
     * 设置配置
     */
    setConfig(config: WeaponConfig | null) {
        this.config = config;
    }

    /**
     * 设置最大生命值
     */
    setMaxHealth(maxHealth: number) {
        this.maxHealth = maxHealth;
    }

    /**
     * 设置死亡回调
     */
    setOnDeathCallback(callback: () => void) {
        this.onDeathCallback = callback;
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
     * 更新血条显示
     */
    updateHealthBar() {
        if (!this.config || !this.healthBarNode) return;

        // 使用预制体中已有的血条节点
        HealthBarHelper.createOrUpdateHealthBar(
            this.weaponNode,
            this.config.health,
            this.maxHealth
        );

        // 确保血条节点不随父节点旋转
        if (this.healthBarNode) {
            const parentRotation = this.weaponNode.eulerAngles.z;
            this.healthBarNode.setRotationFromEuler(0, 0, -parentRotation);
        }
    }

    /**
     * 死亡处理
     */
    private onDeath() {
        // 移除血条
        HealthBarHelper.removeHealthBar(this.weaponNode);

        // 调用回调
        if (this.onDeathCallback) {
            this.onDeathCallback();
        }
    }

    /**
     * 获取当前生命值
     */
    getHealth(): number {
        return this.config?.health || 0;
    }

    /**
     * 获取最大生命值
     */
    getMaxHealth(): number {
        return this.maxHealth;
    }
}

