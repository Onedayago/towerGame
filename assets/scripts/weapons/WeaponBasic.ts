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
     * 重写旋转偏移方法，考虑炮管默认向左（180度）
     * 需要将计算出的角度加上180度偏移
     * @returns 旋转角度偏移（度）
     */
    protected getRotationOffset(): number {
        // 由于炮管默认向左（180度），需要加上180度偏移
        return 180;
    }
}

