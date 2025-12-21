import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
const { ccclass } = _decorator;

/**
 * 基础武器子弹
 * 基础武器发射的子弹
 */
@ccclass('WeaponBasicBullet')
export class WeaponBasicBullet extends BulletBase {
    
    start() {
        // 子弹在创建时通过 init() 方法初始化
        // 不需要在这里初始化
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

    /**
     * 重写子弹类型
     */
    protected getBulletType(): BulletType {
        return BulletType.WEAPON_BASIC;
    }

    /**
     * 重写子弹颜色
     * 基础武器子弹使用黄色
     */
    protected getBulletColor(): Color {
        return Color.YELLOW;
    }
    
    /**
     * 绘制基础武器子弹外观：实心圆形
     */
    protected drawBullet(graphics: Graphics, size: number) {
        graphics.clear();
        const radius = size / 2;
        
        // 绘制外圈（黄色）
        graphics.fillColor = Color.YELLOW;
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // 绘制内圈（更亮的黄色）
        graphics.fillColor = new Color(255, 255, 150, 255);
        graphics.circle(0, 0, radius * 0.6);
        graphics.fill();
    }
}

