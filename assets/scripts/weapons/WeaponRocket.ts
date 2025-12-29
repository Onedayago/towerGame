import { _decorator, Graphics, Node, Vec3, instantiate } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType, WEAPON_COMMON_CONFIG } from '../constants/Index';
import { WeaponRocketRenderer } from '../renderers/Index';
import { WeaponRocketBullet } from '../bullets/Index';
import { BulletBase } from '../bullets/Index';
const { ccclass } = _decorator;

/**
 * 火箭塔
 * 低频率高伤害，带追踪效果的火箭
 * 参考原游戏：发射追踪火箭，会平滑转向目标
 */
@ccclass('WeaponRocket')
export class WeaponRocket extends WeaponBase {
    
    start() {
        this.init(WeaponType.ROCKET);
    }

    /**
     * 重写攻击方法，火箭塔发射追踪火箭
     * @param targetEnemy 目标敌人节点
     */
    protected performAttack(targetEnemy: Node | null = null) {
        if (!targetEnemy || !this.bulletManager || !this.bulletPrefab || !this.config) {
            return;
        }
        
        // 创建火箭实例
        const rocketNode = instantiate(this.bulletPrefab);
        if (!rocketNode) return;
        
        // 获取武器中心位置（武器锚点为中心）
        const weaponPos = this.node.position;
        const weaponCenterX = weaponPos.x;
        const weaponCenterY = weaponPos.y;
        
        // 获取敌人中心位置（敌人锚点为中心）
        const enemyPos = targetEnemy.position;
        const enemyCenterX = enemyPos.x;
        const enemyCenterY = enemyPos.y;
        
        // 计算初始方向向量
        const direction = new Vec3(
            enemyCenterX - weaponCenterX,
            enemyCenterY - weaponCenterY,
            0
        );
        
        // 设置火箭初始位置（武器中心）
        rocketNode.setPosition(weaponCenterX, weaponCenterY, 0);
        
        // 初始化追踪火箭（使用 WeaponRocketBullet 的特殊初始化方法）
        const rocketComponent = rocketNode.getComponent(WeaponRocketBullet);
        if (rocketComponent) {
            // 最大飞行距离为攻击范围的倍数
            const maxDistance = this.config.range * WEAPON_COMMON_CONFIG.BULLET_MAX_DISTANCE_MULTIPLIER;
            // 传递目标节点和敌人列表
            rocketComponent.initHoming(this.config.damage, direction, maxDistance, targetEnemy, this.enemies);
        } else {
            // 如果没有 WeaponRocketBullet 组件，使用基类的初始化方法（兼容性）
            const bulletComponent = rocketNode.getComponent(BulletBase);
            if (bulletComponent) {
                const maxDistance = this.config.range * WEAPON_COMMON_CONFIG.BULLET_MAX_DISTANCE_MULTIPLIER;
                bulletComponent.init(this.config.damage, direction, maxDistance);
            }
        }
        
        // 添加到子弹管理器
        this.bulletManager.addBullet(rocketNode);
    }
    
    /**
     * 重写旋转方法，火箭塔攻击时不需要旋转
     * @param targetEnemy 目标敌人节点
     */
    protected rotateTowardsTarget(targetEnemy: Node) {
        // 火箭塔不需要旋转，保持原始方向
        return;
    }

    /**
     * 重写旋转检查，火箭塔攻击时不需要旋转
     */
    protected shouldRotateWhenAttacking(): boolean {
        return false;
    }
    
    /**
     * 绘制火箭塔外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(width: number, height: number) {
        if (!this.appearanceNode) return;
        
        const graphics = this.appearanceNode.getComponent(Graphics);
        if (!graphics) return;
        
        // 如果在卡片容器中，跳过阴影绘制
        const skipShadow = this.isInCardContainer();
        WeaponRocketRenderer.render(graphics, width, height, skipShadow);
    }
}

