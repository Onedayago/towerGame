import { _decorator, Graphics } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
import { WeaponBasicRenderer } from '../renderers/Index';
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
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        WeaponBasicRenderer.render(graphics, width, height);
    }
}

