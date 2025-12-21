import { _decorator } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 快速武器
 */
@ccclass('WeaponRapid')
export class WeaponRapid extends WeaponBase {
    
    start() {
        this.init(WeaponType.RAPID);
    }
}

