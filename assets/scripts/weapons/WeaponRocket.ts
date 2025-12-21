import { _decorator, Graphics } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType, getWeaponColor } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 火箭塔
 * 低频率高伤害，范围攻击
 */
@ccclass('WeaponRocket')
export class WeaponRocket extends WeaponBase {
    
    start() {
        this.init(WeaponType.ROCKET);
    }

    /**
     * 重写攻击方法，火箭塔有特殊攻击逻辑（范围伤害）
     */
    protected performAttack() {
        console.log(`Rocket Tower attacks with high damage ${this.config?.damage} and range ${this.config?.range}`);
        // 火箭塔特殊攻击逻辑：范围伤害
    }
    
    /**
     * 绘制火箭塔外观
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        const color = getWeaponColor(WeaponType.ROCKET);
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const radius = Math.min(width, height) * 0.35; // 底座半径
        
        graphics.clear();
        
        // 方形底座
        graphics.strokeColor = color;
        graphics.lineWidth = 2;
        const baseSize = radius * 1.2;
        graphics.rect(-baseSize / 2, -baseSize / 2, baseSize, baseSize);
        graphics.stroke();
        
        // 火箭发射器（指向右侧）
        graphics.moveTo(baseSize / 2, 0);
        graphics.lineTo(halfWidth * 0.85, 0);
        graphics.stroke();
        
        // 火箭发射器前端（三角形）
        graphics.moveTo(halfWidth * 0.85, 0);
        graphics.lineTo(halfWidth * 0.7, -halfHeight * 0.15);
        graphics.lineTo(halfWidth * 0.7, halfHeight * 0.15);
        graphics.close();
        graphics.stroke();
        
        // 添加火箭细节
        graphics.moveTo(halfWidth * 0.75, -halfHeight * 0.1);
        graphics.lineTo(halfWidth * 0.75, halfHeight * 0.1);
        graphics.stroke();
    }
}

