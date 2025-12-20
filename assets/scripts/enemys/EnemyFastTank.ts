import { _decorator } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 快速坦克敌人
 */
@ccclass('EnemyFastTank')
export class EnemyFastTank extends EnemyBase {
    
    start() {
        this.init(EnemyType.FAST_TANK);
    }
}

