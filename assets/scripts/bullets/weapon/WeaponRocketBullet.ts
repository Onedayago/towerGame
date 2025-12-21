import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
const { ccclass } = _decorator;

/**
 * 火箭塔子弹
 * 火箭塔发射的子弹
 */
@ccclass('WeaponRocketBullet')
export class WeaponRocketBullet extends BulletBase {
    
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
        return BulletType.WEAPON_ROCKET;
    }

    /**
     * 重写子弹颜色
     * 火箭塔子弹使用橙色
     */
    protected getBulletColor(): Color {
        return new Color(255, 165, 0, 255); // 橙色
    }
    
    /**
     * 绘制火箭子弹外观：火箭形状（带尾翼）
     */
    protected drawBullet(graphics: Graphics, size: number) {
        graphics.clear();
        const rocketLength = size * 1.2;
        const rocketWidth = size * 0.6;
        const halfLength = rocketLength / 2;
        const halfWidth = rocketWidth / 2;
        
        // 绘制火箭主体（椭圆形）
        graphics.fillColor = new Color(255, 165, 0, 255); // 橙色
        graphics.ellipse(0, 0, halfLength, halfWidth);
        graphics.fill();
        
        // 绘制火箭头部（三角形）
        graphics.moveTo(halfLength, 0);
        graphics.lineTo(halfLength * 0.7, -halfWidth * 0.5);
        graphics.lineTo(halfLength * 0.7, halfWidth * 0.5);
        graphics.close();
        graphics.fill();
        
        // 绘制尾翼（左右各一个）
        graphics.fillColor = new Color(200, 100, 0, 255); // 深橙色
        // 左尾翼
        graphics.moveTo(-halfLength * 0.8, -halfWidth * 0.3);
        graphics.lineTo(-halfLength, -halfWidth);
        graphics.lineTo(-halfLength * 0.6, -halfWidth * 0.3);
        graphics.close();
        graphics.fill();
        // 右尾翼
        graphics.moveTo(-halfLength * 0.8, halfWidth * 0.3);
        graphics.lineTo(-halfLength, halfWidth);
        graphics.lineTo(-halfLength * 0.6, halfWidth * 0.3);
        graphics.close();
        graphics.fill();
    }
}

