import { _decorator } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 重型坦克敌人
 */
@ccclass('EnemyHeavyTank')
export class EnemyHeavyTank extends EnemyBase {
    
    start() {
        this.init(EnemyType.HEAVY_TANK);
    }
}

