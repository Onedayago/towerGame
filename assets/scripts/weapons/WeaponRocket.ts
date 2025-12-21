import { _decorator, Graphics } from 'cc';
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
     */
    protected performAttack() {
        console.log(`Rocket Tower attacks with high damage ${this.config?.damage} and range ${this.config?.range}`);
        // 火箭塔特殊攻击逻辑：范围伤害
    }
    
    /**
     * 绘制火箭塔外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        WeaponRocketRenderer.render(graphics, width, height);
    }
}

