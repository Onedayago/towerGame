import { _decorator, Graphics, Node } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
import { WeaponRocketRenderer } from '../renderers/Index';
const { ccclass } = _decorator;

/**
 * 火箭塔
 * 低频率高伤害，范围攻击
 */
@ccclass('WeaponRocket')
export class WeaponRocket extends WeaponBase {
    
    start() {
        this.init(WeaponType.ROCKET);
    }

    /**
     * 重写攻击方法，火箭塔有特殊攻击逻辑（范围伤害）
     * 注意：需要调用父类方法以发射子弹
     */
    protected performAttack(targetEnemy: Node | null = null) {
        // 调用父类方法发射子弹
        super.performAttack(targetEnemy);
        // 火箭塔特殊攻击逻辑：范围伤害（可以在这里添加范围伤害效果）
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
     * 绘制火箭塔外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(width: number, height: number) {
        if (!this.appearanceNode) return;
        
        const graphics = this.appearanceNode.getComponent(Graphics);
        if (!graphics) return;
        
        WeaponRocketRenderer.render(graphics, width, height);
    }
}

