import { _decorator, Color, Component, Graphics, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { WeaponType, getWeaponConfig, WeaponConfig } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 武器基类
 * 所有武器类型都继承此类
 * 武器没有移动速度，只能固定在位置上
 */
@ccclass('WeaponBase')
export class WeaponBase extends Component {
    
    protected attackSpeed: number = 0;
    protected attackTimer: number = 0;
    protected config: WeaponConfig | null = null;
    protected weaponType: WeaponType;

    /**
     * 初始化武器
     * @param type 武器类型
     */
    protected init(type: WeaponType) {
        this.weaponType = type;
        
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        if (!graphics || !transform) return;
        
        transform.setAnchorPoint(0, 0);
        
        // 所有武器大小相同
        const width = UiConfig.CELL_SIZE;
        const height = UiConfig.CELL_SIZE;
        transform.setContentSize(width, height);
        

        // 加载武器配置
        this.config = getWeaponConfig(type);
        this.attackSpeed = this.config.attackSpeed;

        // 根据类型设置颜色
        graphics.fillColor = this.getColorByType(type);
        graphics.rect(0, 0, width, height);
        graphics.fill();
    }

    /**
     * 根据武器类型获取颜色
     * 子类可以重写此方法自定义颜色
     */
    protected getColorByType(type: WeaponType): Color {
        switch (type) {
            case WeaponType.BASIC:
                return Color.RED;  // 洋红色
            case WeaponType.RAPID:
                return Color.CYAN;     // 青色
            case WeaponType.HEAVY:
                return new Color(255, 165, 0, 255);   // 橙色 (RGB: 255, 165, 0)
            case WeaponType.SNIPER:
                return new Color(128, 0, 128, 255);   // 紫色 (RGB: 128, 0, 128)
            default:
                return Color.MAGENTA;
        }
    }

    /**
     * 更新攻击逻辑
     * @param deltaTime 帧时间
     */
    updateAttack(deltaTime: number) {
        if (!this.config) return;
        
        this.attackTimer += deltaTime;
        if (this.attackTimer >= this.attackSpeed) {
            this.attackTimer = 0;
            this.performAttack();
        }
    }

    /**
     * 执行攻击
     * 子类可以重写此方法实现不同的攻击逻辑
     */
    protected performAttack() {
        // 默认攻击逻辑
        console.log(`Weapon ${this.weaponType} attacks with damage ${this.config?.damage}, range ${this.config?.range}`);
    }

    /**
     * 获取武器配置
     */
    getConfig(): WeaponConfig | null {
        return this.config;
    }

    /**
     * 获取武器类型
     */
    getWeaponType(): WeaponType {
        return this.weaponType;
    }

    /**
     * 设置攻击速度（覆盖配置）
     */
    setAttackSpeed(speed: number) {
        this.attackSpeed = speed;
    }

    /**
     * 获取攻击范围
     */
    getRange(): number {
        return this.config?.range || 0;
    }

    /**
     * 获取攻击力
     */
    getDamage(): number {
        return this.config?.damage || 0;
    }
}

