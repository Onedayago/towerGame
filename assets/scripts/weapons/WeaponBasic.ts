import { _decorator, Graphics, Node, Vec3 } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
import { WeaponBasicRenderer } from '../renderers/Index';
const { ccclass } = _decorator;

/**
 * 基础武器
 */
@ccclass('WeaponBasic')
export class WeaponBasic extends WeaponBase {
    
    start() {
        this.init(WeaponType.BASIC);
    }
    
    /**
     * 绘制基础武器外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(width: number, height: number) {
        
        if (!this.appearanceNode) return;
        
        const graphics = this.appearanceNode.getComponent(Graphics);
        if (!graphics) return;
        
        WeaponBasicRenderer.render(graphics, width, height);
    }
    
    /**
     * 重写旋转方法，考虑炮管默认向左（180度）
     * 需要将计算出的角度加上180度偏移
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
        let angleDeg = angleRad * (180 / Math.PI);
        
        // 由于炮管默认向左（180度），需要加上180度偏移
        angleDeg += 180;
        
        // 只旋转外观节点，不旋转根节点
        if (this.appearanceNode) {
            this.appearanceNode.setRotationFromEuler(0, 0, angleDeg);
        }
        
        // 更新血条旋转，保持水平
        this.updateHealthBarRotation();
    }
}

