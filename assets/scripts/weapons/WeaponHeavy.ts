import { _decorator } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 重型武器
 */
@ccclass('WeaponHeavy')
export class WeaponHeavy extends WeaponBase {
    
    start() {
        this.init(WeaponType.HEAVY);
    }
}

