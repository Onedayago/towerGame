import { _decorator, Color, Component, Graphics, UITransform, Vec3 } from 'cc';
import { UiConfig } from '../config/Index';
import { BulletType, getBulletConfig, BulletConfig, DEFAULT_BULLET_TYPE } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 子弹基类
 * 所有子弹类型都继承此类
 */
@ccclass('BulletBase')
export class BulletBase extends Component {
    
    protected bulletType: BulletType;      // 子弹类型
    protected config: BulletConfig | null = null; // 子弹配置
    protected speed: number = 0;           // 子弹速度（像素/秒）
    protected damage: number = 0;          // 子弹伤害
    protected direction: Vec3 = new Vec3(); // 子弹方向
    protected maxDistance: number = 0;      // 最大飞行距离
    protected traveledDistance: number = 0; // 已飞行距离

    /**
     * 获取子弹类型
     * 子类必须重写此方法返回对应的子弹类型
     */
    protected getBulletType(): BulletType {
        return DEFAULT_BULLET_TYPE; // 默认值，子类应该重写
    }
    
    /**
     * 公开方法：获取子弹类型（供外部调用）
     */
    getBulletTypePublic(): BulletType {
        return this.getBulletType();
    }

    /**
     * 初始化子弹
     * @param damage 子弹伤害（如果为0，则使用配置中的伤害）
     * @param direction 子弹方向（归一化的向量）
     * @param maxDistance 最大飞行距离（如果为0，则使用配置中的距离）
     */
    init(damage: number, direction: Vec3, maxDistance: number = 0) {
        // 获取子弹类型和配置
        this.bulletType = this.getBulletType();
        this.config = getBulletConfig(this.bulletType);
        
        // 从配置获取速度
        this.speed = this.config.speed;
        
        // 设置伤害（如果传入的伤害为0，则使用配置中的伤害）
        this.damage = damage > 0 ? damage : this.config.damage;
        
        // 归一化方向向量
        const normalized = new Vec3();
        Vec3.normalize(normalized, direction);
        this.direction = normalized;
        
        // 设置最大飞行距离（如果传入的距离为0，则使用配置中的距离）
        this.maxDistance = maxDistance > 0 ? maxDistance : this.config.maxDistance;
        this.traveledDistance = 0;

        // 初始化节点大小和外观
        this.initNode();
    }

    /**
     * 初始化节点
     */
    private initNode() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        if (!graphics || !transform) return;
        
        transform.setAnchorPoint(0.5, 0.5); // 中心锚点
        
        // 设置子弹大小（小方块）
        const size = UiConfig.CELL_SIZE * 0.3;
        transform.setContentSize(size, size);
        // 绘制子弹外观
        this.drawBullet(graphics, size);
    }

    /**
     * 绘制子弹
     * 子类可以重写此方法自定义外观
     */
    protected drawBullet(graphics: Graphics, size: number) {
        graphics.clear();
        graphics.fillColor = this.getBulletColor();
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.fill();
    }

    /**
     * 获取子弹颜色
     * 子类可以重写此方法自定义颜色
     */
    protected getBulletColor(): Color {
        return Color.WHITE;
    }

    /**
     * 更新子弹位置
     * @param deltaTime 帧时间
     */
    update(deltaTime: number) {
        if (!this.direction) return;

        // 计算移动距离
        const moveDistance = this.speed * deltaTime;
        
        // 计算新的位置
        const currentPos = this.node.position;
        const newPos = new Vec3(
            currentPos.x + this.direction.x * moveDistance,
            currentPos.y + this.direction.y * moveDistance,
            currentPos.z + this.direction.z * moveDistance
        );
        this.node.setPosition(newPos);
        
        // 更新已飞行距离
        this.traveledDistance += moveDistance;
        
        // 检查是否超过最大距离
        if (this.traveledDistance >= this.maxDistance) {
            this.onReachMaxDistance();
        }
    }

    /**
     * 达到最大距离时的处理
     */
    protected onReachMaxDistance() {
        this.node.destroy();
    }

    /**
     * 获取子弹伤害
     */
    getDamage(): number {
        return this.damage;
    }

    /**
     * 获取子弹速度
     */
    getSpeed(): number {
        return this.speed;
    }

    /**
     * 设置子弹方向
     */
    setDirection(direction: Vec3) {
        const normalized = new Vec3();
        Vec3.normalize(normalized, direction);
        this.direction = normalized;
    }
}

