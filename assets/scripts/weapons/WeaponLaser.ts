import { _decorator } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 激光武器
 * 高频率攻击，中等伤害
 */
@ccclass('WeaponLaser')
export class WeaponLaser extends WeaponBase {
    
    start() {
        this.init(WeaponType.LASER);
    }
}

