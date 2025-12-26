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
        if (!this.config || hpBonus <= 0) return;

        if (this.baseHealth === 0) {
            this.baseHealth = this.config.health;
        }

        const bonusMultiplier = 1 + hpBonus;
        const newMaxHealth = this.baseHealth * bonusMultiplier;
        const healthRatio = this.maxHealth > 0 ? (this.config.health / this.maxHealth) : 1.0;

        this.maxHealth = newMaxHealth;
        this.config.health = newMaxHealth * healthRatio;

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

        HealthBarHelper.createOrUpdateHealthBar(
            this.enemyNode,
            this.config.health,
            this.maxHealth
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

