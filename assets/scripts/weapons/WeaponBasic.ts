import { _decorator, Graphics } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType, getWeaponColor } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 基础武器
 */
@ccclass('WeaponBasic')
export class WeaponBasic extends WeaponBase {
    
    start() {
        this.init(WeaponType.BASIC);
    }
    
    /**
     * 绘制基础武器外观
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        const color = getWeaponColor(WeaponType.BASIC);
        const halfWidth = width / 2;
        const radius = Math.min(width, height) * 0.35; // 底座半径
        
        graphics.clear();
        
        // 圆形底座
        graphics.strokeColor = color;
        graphics.lineWidth = 2;
        graphics.circle(0, 0, radius);
        graphics.stroke();
        
        // 炮管（指向右侧）
        graphics.moveTo(radius, 0);
        graphics.lineTo(halfWidth * 0.8, 0);
        graphics.stroke();
        
        // 炮管前端
        graphics.fillColor = color;
        graphics.circle(halfWidth * 0.8, 0, 3);
        graphics.fill();
    }
}

