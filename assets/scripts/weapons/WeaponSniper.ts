import { _decorator } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 狙击武器
 */
@ccclass('WeaponSniper')
export class WeaponSniper extends WeaponBase {
    
    start() {
        this.init(WeaponType.SNIPER);
    }

    /**
     * 重写攻击方法，狙击武器有特殊攻击逻辑
     */
    protected performAttack() {
        console.log(`Sniper weapon attacks with high damage ${this.config?.damage} and long range ${this.config?.range}`);
        // 狙击武器特殊攻击逻辑
    }
}

