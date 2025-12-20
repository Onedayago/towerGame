import { _decorator, Color, Component, Graphics, Node, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType, getEnemyConfig, EnemyConfig, DEFAULT_ENEMY_TYPE } from '../constants/Index';
const { ccclass, property } = _decorator;

@ccclass('EnemyTank')
export class EnemyTank extends Component {
    
    @property({ type: String, displayName: '敌人类型' })
    public enemyType: EnemyType = DEFAULT_ENEMY_TYPE;
    
    private moveSpeed: number = 0;
    private attackSpeed: number = 0;
    private attackTimer: number = 0;
    private config: EnemyConfig | null = null;

    start() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        
        const width = UiConfig.CELL_SIZE;
        const height = UiConfig.CELL_SIZE;
        transform.setContentSize(width, height);

        // 加载敌人配置
        this.config = getEnemyConfig(this.enemyType);
        this.moveSpeed = this.config.moveSpeed;
        this.attackSpeed = this.config.attackSpeed;

        // 根据类型设置颜色
        graphics.fillColor = this.getColorByType(this.enemyType);
        graphics.rect(0, 0, width, height);
        graphics.fill();
    }

    /**
     * 根据敌人类型获取颜色
     */
    private getColorByType(type: EnemyType): Color {
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
     * 更新坦克位置（由 EnemyManager 调用）
     * @param deltaTime 帧时间
     * @param boundaryWidth 右边界宽度
     */
    updatePosition(deltaTime: number, boundaryWidth: number) {
        const currentPos = this.node.position;
        const newX = currentPos.x + this.moveSpeed * deltaTime;
        
        if (newX <= boundaryWidth) {
            this.node.setPosition(newX, currentPos.y, 0);
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
     */
    private performAttack() {
        // TODO: 实现攻击逻辑
        console.log(`Enemy ${this.enemyType} attacks with damage ${this.config?.damage}`);
    }

    /**
     * 获取敌人配置
     */
    getConfig(): EnemyConfig | null {
        return this.config;
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
}

