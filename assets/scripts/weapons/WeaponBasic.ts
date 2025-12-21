import { _decorator } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 基础武器
 */
@ccclass('WeaponBasic')
export class WeaponBasic extends WeaponBase {
    
    start() {
        this.init(WeaponType.BASIC);
    }
}

