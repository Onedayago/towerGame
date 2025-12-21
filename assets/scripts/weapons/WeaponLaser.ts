import { _decorator, Graphics } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType, getWeaponColor } from '../constants/Index';
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
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        const color = getWeaponColor(WeaponType.LASER);
        const halfWidth = width / 2;
        const radius = Math.min(width, height) * 0.35; // 底座半径
        
        graphics.clear();
        
        // 绘制六边形底座
        graphics.strokeColor = color;
        graphics.lineWidth = 2;
        const sides = 6;
        const angleStep = (Math.PI * 2) / sides;
        graphics.moveTo(radius, 0);
        for (let i = 1; i <= sides; i++) {
            const angle = i * angleStep;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            graphics.lineTo(x, y);
        }
        graphics.close();
        graphics.stroke();
        
        // 激光发射器（指向右侧）
        graphics.moveTo(radius * 0.8, 0);
        graphics.lineTo(halfWidth * 0.9, 0);
        graphics.stroke();
        
        // 激光发射器前端（更细）
        graphics.lineWidth = 1;
        graphics.moveTo(halfWidth * 0.9, -2);
        graphics.lineTo(halfWidth * 0.9, 2);
        graphics.stroke();
    }
}

