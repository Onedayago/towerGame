import { _decorator, Graphics } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
import { WeaponLaserRenderer } from '../renderers/Index';
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
    
    /**
     * 绘制激光武器外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(width: number, height: number) {
        if (!this.appearanceNode) return;
        
        const graphics = this.appearanceNode.getComponent(Graphics);
        if (!graphics) return;
        
        WeaponLaserRenderer.render(graphics, width, height);
    }
}

