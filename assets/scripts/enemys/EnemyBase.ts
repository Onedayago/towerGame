import { _decorator, Component, Graphics, UITransform, Prefab, Node } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType, getEnemyConfig, EnemyConfig } from '../constants/Index';
import { BulletManager } from '../managers/BulletManager';
import { WeaponManager } from '../managers/WeaponManager';
import { PathFinder } from '../utils/PathFinder';
import { EnemyPathfinding } from './EnemyPathfinding';
import { EnemyAttack } from './EnemyAttack';
import { EnemySpawnAnimation } from './EnemySpawnAnimation';
import { EnemyHealth } from './EnemyHealth';
import { Vec3 } from 'cc';
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
    protected config: EnemyConfig | null = null;
    protected enemyType: EnemyType;
    
    // 子节点引用（从预制体中获取）
    protected healthBarNode: Node | null = null; // 血条节点
    protected appearanceNode: Node | null = null; // 外观展示节点
    
    // 功能模块
    private pathfinding: EnemyPathfinding | null = null;
    private attack: EnemyAttack | null = null;
    private spawnAnimation: EnemySpawnAnimation | null = null;
    private health: EnemyHealth | null = null;
    
    /**
     * 设置血量加成（根据波次）
     * @param hpBonus 血量加成倍数（例如：1.5 表示增加 1.5 倍，即最终为 2.5 倍）
     */
    setHpBonus(hpBonus: number) {
        if (this.health) {
            this.health.setHpBonus(hpBonus);
        }
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

        // 加载敌人配置（创建副本，避免多个敌人共享同一个配置对象）
        const originalConfig = getEnemyConfig(type);
        this.config = {
            type: originalConfig.type,
            moveSpeed: originalConfig.moveSpeed,
            attackSpeed: originalConfig.attackSpeed,
            health: originalConfig.health,
            damage: originalConfig.damage,
            attackRange: originalConfig.attackRange,
            attackDuration: originalConfig.attackDuration,
            spawnInterval: originalConfig.spawnInterval,
            reward: originalConfig.reward
        };
        this.moveSpeed = this.config.moveSpeed;

        // 初始化功能模块
        this.initModules();

        // 绘制敌人外观（在外观节点上绘制）
        this.drawAppearance(width, height);
        
        // 初始化血条
        if (this.health) {
            this.health.updateHealthBar();
        }
    }

    /**
     * 初始化功能模块
     */
    private initModules() {
        if (!this.config) return;

        // 初始化寻路模块（传入外观节点，用于旋转）
        this.pathfinding = new EnemyPathfinding(this.node, this.moveSpeed, this.appearanceNode);

        // 初始化攻击模块
        this.attack = new EnemyAttack(this.node, this.appearanceNode, this.config, this.healthBarNode);
        this.attack.setBulletPrefab(this.bulletPrefab);

        // 初始化出现动画模块
        this.spawnAnimation = new EnemySpawnAnimation(this.node, this.healthBarNode);

        // 初始化生命值模块
        this.health = new EnemyHealth(
            this.node,
            this.healthBarNode,
            this.config,
            this.hitEffectPrefab,
            this.explosionEffectPrefab
        );
        this.health.setOnDeathCallback(() => {
            this.node.destroy();
        });
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
     * 设置寻路器和基地目标位置
     * @param pathFinder 寻路器
     * @param baseTarget 基地目标位置（世界坐标）
     */
    setPathfinding(pathFinder: PathFinder, baseTarget: Vec3) {
        if (this.pathfinding) {
            this.pathfinding.setPathfinding(pathFinder, baseTarget);
        }
    }

    /**
     * 更新敌人位置（由 EnemyManager 调用）
     * @param deltaTime 帧时间
     * @param boundaryWidth 右边界宽度（容器宽度）
     */
    updatePosition(deltaTime: number, boundaryWidth: number) {
        // 如果正在出现动画中，不移动
        if (this.spawnAnimation && this.spawnAnimation.isSpawningNow()) {
            return;
        }
        
        // 如果正在攻击或锁定了目标，停止移动
        if (this.attack && (this.attack.isAttackingNow() || this.attack.hasLockedTarget())) {
            return;
        }
        
        // 使用寻路模块移动
        if (this.pathfinding) {
            this.pathfinding.update(deltaTime);
        }
    }

    /**
     * 更新出现动画
     * @param deltaTime 帧时间
     */
    updateSpawnAnimation(deltaTime: number) {
        if (this.spawnAnimation) {
            this.spawnAnimation.update(deltaTime);
        }
    }

    /**
     * 更新攻击逻辑
     * @param deltaTime 帧时间
     */
    updateAttack(deltaTime: number) {
        if (this.attack) {
            const hasLockedTarget = this.attack.update(deltaTime);
            // 如果锁定了目标，停止移动（在 updatePosition 中处理）
        }
    }
    
    /**
     * 设置子弹管理器和武器管理器
     * @param bulletManager 子弹管理器
     * @param weaponManager 武器管理器
     */
    setManagers(bulletManager: BulletManager, weaponManager: WeaponManager) {
        if (this.attack) {
            this.attack.setManagers(bulletManager, weaponManager);
        }
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
        if (this.pathfinding) {
            this.pathfinding.setMoveSpeed(speed);
        }
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
     * 更新血条旋转，保持水平
     */
    protected updateHealthBarRotation() {
        if (this.health) {
            this.health.updateHealthBarRotation();
        }
    }
}
