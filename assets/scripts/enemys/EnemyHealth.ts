import { Node, Prefab, instantiate } from 'cc';
import { EnemyConfig } from '../constants/Index';
import { HealthBarHelper } from '../utils/Index';
import { HitParticleEffect, ExplosionEffect } from '../effects/Index';
import { GoldManager } from '../managers/GoldManager';
import { AudioManager } from '../managers/AudioManager';

/**
 * 敌人生命值管理器
 * 负责处理敌人的生命值、血条、受伤和死亡逻辑
 */
export class EnemyHealth {
    private enemyNode: Node;
    private healthBarNode: Node | null = null;
    private config: EnemyConfig | null = null;
    private maxHealth: number = 0;
    private baseHealth: number = 0;
    private hitEffectPrefab: Prefab | null = null;
    private explosionEffectPrefab: Prefab | null = null;
    private onDeathCallback: (() => void) | null = null;

    constructor(
        enemyNode: Node,
        healthBarNode: Node | null,
        config: EnemyConfig | null,
        hitEffectPrefab: Prefab | null = null,
        explosionEffectPrefab: Prefab | null = null
    ) {
        this.enemyNode = enemyNode;
        this.healthBarNode = healthBarNode;
        this.config = config;
        this.hitEffectPrefab = hitEffectPrefab;
        this.explosionEffectPrefab = explosionEffectPrefab;

        if (config) {
            this.baseHealth = config.health;
            this.maxHealth = config.health;
        }
    }

    /**
     * 设置配置
     */
    setConfig(config: EnemyConfig) {
        this.config = config;
        if (this.baseHealth === 0) {
            this.baseHealth = config.health;
            this.maxHealth = config.health;
        }
    }

    /**
     * 设置死亡回调
     */
    setOnDeathCallback(callback: () => void) {
        this.onDeathCallback = callback;
    }

    /**
     * 设置血量加成
     */
    setHpBonus(hpBonus: number) {
        if (!this.config) return;

        // 确保 baseHealth 和 maxHealth 已初始化
        // 如果 baseHealth 为 0，说明还没有初始化，使用 config.health 作为基础血量
        if (this.baseHealth === 0) {
            // 如果 config.health 也为 0 或无效，说明配置有问题，直接返回
            if (this.config.health <= 0) {
                console.warn('EnemyHealth: config.health is invalid when setting hpBonus');
                return;
            }
            this.baseHealth = this.config.health;
            this.maxHealth = this.config.health;
        }

        // 如果 hpBonus <= 0，不需要应用加成，但需要确保血条已更新
        if (hpBonus <= 0) {
            // 确保当前血量不超过最大血量
            if (this.config.health > this.maxHealth) {
                this.config.health = this.maxHealth;
            }
            // 如果当前血量为 0，设置为满血
            if (this.config.health <= 0 && this.maxHealth > 0) {
                this.config.health = this.maxHealth;
            }
            this.updateHealthBar();
            return;
        }

        // 计算当前血量比例（在应用加成之前）
        // 重要：如果这是第一次应用加成（maxHealth 等于 baseHealth），说明敌人是满血状态
        // 否则，根据当前血量和最大血量计算比例
        let healthRatio = 1.0;
        if (this.maxHealth > 0 && this.maxHealth === this.baseHealth) {
            // 第一次应用加成，敌人应该是满血状态
            healthRatio = 1.0;
        } else if (this.maxHealth > 0 && this.config.health > 0) {
            // 已经应用过加成，保持当前血量比例
            healthRatio = Math.max(0, Math.min(1, this.config.health / this.maxHealth));
        } else {
            // 其他情况，使用满血
            healthRatio = 1.0;
        }

        // 计算新的最大血量
        const bonusMultiplier = 1 + hpBonus;
        const newMaxHealth = this.baseHealth * bonusMultiplier;

        // 更新最大血量和当前血量（保持血量比例）
        this.maxHealth = newMaxHealth;
        this.config.health = newMaxHealth * healthRatio;
        
        // 确保血量有效（至少为1，避免显示问题）
        if (this.config.health <= 0 && this.maxHealth > 0) {
            this.config.health = this.maxHealth;
        }

        this.updateHealthBar();
    }

    /**
     * 受到伤害
     */
    takeDamage(damage: number): boolean {
        if (!this.config) return false;

        this.createHitEffect();
        this.config.health -= damage;
        this.updateHealthBar();

        if (this.config.health <= 0) {
            this.onDeath();
            return true; // 已死亡
        }

        return false; // 未死亡
    }

    /**
     * 更新血条显示
     */
    updateHealthBar() {
        if (!this.config) return;

        // 确保血量值有效
        const currentHealth = Math.max(0, this.config.health);
        const maxHealth = Math.max(1, this.maxHealth); // 确保最大血量至少为1，避免除零错误

        HealthBarHelper.createOrUpdateHealthBar(
            this.enemyNode,
            currentHealth,
            maxHealth
        );

        // 确保血条节点不随父节点旋转
        if (this.healthBarNode) {
            const parentRotation = this.enemyNode.eulerAngles.z;
            this.healthBarNode.setRotationFromEuler(0, 0, -parentRotation);
        }
    }

    /**
     * 更新血条旋转，保持水平
     */
    updateHealthBarRotation() {
        if (!this.healthBarNode) return;
        this.healthBarNode.setRotationFromEuler(0, 0, 0);
    }

    /**
     * 死亡处理
     */
    private onDeath() {
        // 播放爆炸音效
        AudioManager.getInstance().playBoomSound();

        // 发放金币奖励
        this.giveReward();

        // 创建爆炸特效
        this.createExplosionEffect();

        // 移除血条
        HealthBarHelper.removeHealthBar(this.enemyNode);

        // 调用死亡回调
        if (this.onDeathCallback) {
            this.onDeathCallback();
        }
    }

    /**
     * 发放击败敌人的金币奖励
     */
    private giveReward() {
        if (!this.config) return;

        const reward = this.config.reward || 0;
        if (reward > 0) {
            const goldManager = GoldManager.getInstance();
            goldManager.addGold(reward);
        }
    }

    /**
     * 创建被攻击特效
     */
    private createHitEffect() {
        if (!this.hitEffectPrefab) return;

        const position = this.enemyNode.position;
        const effectNode = instantiate(this.hitEffectPrefab);
        effectNode.setParent(this.enemyNode.parent);
        effectNode.setPosition(position);

        const effectComponent = effectNode.getComponent(HitParticleEffect);
        if (effectComponent) {
            effectComponent.init(position);
        }
    }

    /**
     * 创建爆炸特效
     */
    private createExplosionEffect() {
        if (!this.explosionEffectPrefab) return;

        const position = this.enemyNode.position;
        const effectNode = instantiate(this.explosionEffectPrefab);
        effectNode.setParent(this.enemyNode.parent);
        effectNode.setPosition(position);

        const effectComponent = effectNode.getComponent(ExplosionEffect);
        if (effectComponent) {
            effectComponent.init(position);
        }
    }

    /**
     * 获取当前生命值
     */
    getHealth(): number {
        return this.config ? this.config.health : 0;
    }

    /**
     * 获取最大生命值
     */
    getMaxHealth(): number {
        return this.maxHealth;
    }
}

