import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
const { ccclass } = _decorator;

/**
 * 激光武器子弹
 * 激光武器发射的子弹
 */
@ccclass('WeaponLaserBullet')
export class WeaponLaserBullet extends BulletBase {
    
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
        return BulletType.WEAPON_LASER;
    }

    /**
     * 重写子弹颜色
     * 激光武器子弹使用青色
     */
    protected getBulletColor(): Color {
        return Color.CYAN;
    }
    
    /**
     * 绘制激光子弹外观：细长的激光束
     */
    protected drawBullet(graphics: Graphics, size: number) {
        graphics.clear();
        const length = size * 1.5; // 激光束长度
        const width = size * 0.3;   // 激光束宽度
        
        // 绘制激光束主体（细长矩形）
        graphics.fillColor = Color.CYAN;
        graphics.rect(-length / 2, -width / 2, length, width);
        graphics.fill();
        
        // 绘制激光束中心（更亮的线）
        graphics.fillColor = Color.WHITE;
        graphics.rect(-length / 2, -width / 4, length, width / 2);
        graphics.fill();
        
        // 绘制前端亮点
        graphics.fillColor = Color.WHITE;
        graphics.circle(length / 2, 0, width / 2);
        graphics.fill();
    }
}

