import { _decorator, Color, Component, Graphics, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType, getEnemyConfig, EnemyConfig } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 敌人基类
 * 所有敌人类型都继承此类
 */
@ccclass('EnemyBase')
export class EnemyBase extends Component {
    
    protected moveSpeed: number = 0;
    protected attackSpeed: number = 0;
    protected attackTimer: number = 0;
    protected config: EnemyConfig | null = null;
    protected enemyType: EnemyType;

    /**
     * 初始化敌人
     * @param type 敌人类型
     */
    protected init(type: EnemyType) {
        this.enemyType = type;
        
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        if (!graphics || !transform) return;
        
        transform.setAnchorPoint(0, 0);
        
        // 所有敌人大小相同
        const width = UiConfig.CELL_SIZE;
        const height = UiConfig.CELL_SIZE;
        transform.setContentSize(width, height);

        // 加载敌人配置
        this.config = getEnemyConfig(type);
        this.moveSpeed = this.config.moveSpeed;
        this.attackSpeed = this.config.attackSpeed;

        // 根据类型设置颜色
        graphics.fillColor = this.getColorByType(type);
        graphics.rect(0, 0, width, height);
        graphics.fill();
    }

    /**
     * 根据敌人类型获取颜色
     * 子类可以重写此方法自定义颜色
     */
    protected getColorByType(type: EnemyType): Color {
        switch (type) {
            case EnemyType.TANK:
                return Color.YELLOW;
            case EnemyType.FAST_TANK:
                return Color.GREEN;
            case EnemyType.HEAVY_TANK:
                return Color.BLUE;
            case EnemyType.BOSS:
                return Color.RED;
            default:
                return Color.YELLOW;
        }
    }

    /**
     * 更新敌人位置（由 EnemyManager 调用）
     * @param deltaTime 帧时间
     * @param boundaryWidth 右边界宽度（容器宽度）
     */
    updatePosition(deltaTime: number, boundaryWidth: number) {
        const currentPos = this.node.position;
        const newX = currentPos.x + this.moveSpeed * deltaTime;
        
        // 允许移动到边界位置，超出边界的敌人由 EnemyUpdateHandler 移除
        // 敌人会一直移动，直到左边缘达到或超过容器宽度
        this.node.setPosition(newX, currentPos.y, 0);
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
        console.log(`Enemy ${this.enemyType} attacks with damage ${this.config?.damage}`);
    }

    /**
     * 获取敌人配置
     */
    getConfig(): EnemyConfig | null {
        return this.config;
    }

    /**
     * 获取敌人类型
     */
    getEnemyType(): EnemyType {
        return this.enemyType;
    }

    /**
     * 设置移动速度（覆盖配置）
     */
    setMoveSpeed(speed: number) {
        this.moveSpeed = speed;
    }

    /**
     * 设置攻击速度（覆盖配置）
     */
    setAttackSpeed(speed: number) {
        this.attackSpeed = speed;
    }

    /**
     * 受到伤害
     * @param damage 伤害值
     */
    takeDamage(damage: number) {
        if (!this.config) return;
        
        this.config.health -= damage;
        if (this.config.health <= 0) {
            this.onDeath();
        }
    }

    /**
     * 死亡处理
     * 子类可以重写此方法实现不同的死亡效果
     */
    protected onDeath() {
        this.node.destroy();
    }
}

