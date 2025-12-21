import { _decorator } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
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
}

