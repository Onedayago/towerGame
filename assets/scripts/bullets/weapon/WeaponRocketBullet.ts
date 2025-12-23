import { _decorator, Color, Graphics, Vec3, Node, UITransform } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
import { WeaponRocketBulletRenderer } from '../../renderers/Index';
import { EnemyBase } from '../../enemys/Index';
import { UiConfig } from '../../config/Index';
const { ccclass } = _decorator;

/**
 * 火箭塔子弹（追踪火箭）
 * 参考原游戏：带追踪效果的火箭，会平滑转向目标
 */
@ccclass('WeaponRocketBullet')
export class WeaponRocketBullet extends BulletBase {
    
    // 追踪火箭配置常量
    private static readonly TURN_RATE = Math.PI * 2; // 转向速度（弧度/秒），参考原游戏
    private static readonly MAX_LIFETIME = 5.0; // 最大生命周期（秒），参考原游戏 5000ms
    private static readonly SIZE_SCALE = 1.5; // 火箭大小倍数（相对于基础子弹）
    private static readonly ENEMY_SIZE = UiConfig.CELL_SIZE * 0.8; // 敌人大小（用于碰撞检测）
    
    private targetNode: Node | null = null; // 目标节点
    private enemies: Node[] = []; // 敌人列表（用于寻找新目标）
    private angle: number = 0; // 当前飞行角度（弧度）
    private velocity: Vec3 = new Vec3(); // 当前速度向量
    private lifetime: number = 0; // 已存活时间
    private lastPosition: Vec3 = new Vec3(); // 上一帧位置（用于尾迹）
    
    /**
     * 初始化追踪火箭
     * @param damage 伤害值
     * @param direction 初始方向（归一化的向量）
     * @param maxDistance 最大飞行距离
     * @param targetNode 目标节点（可选）
     * @param enemies 敌人列表（用于寻找新目标，可选）
     */
    initHoming(damage: number, direction: Vec3, maxDistance: number = 0, targetNode: Node | null = null, enemies: Node[] = []) {
        // 调用基类初始化
        this.init(damage, direction, maxDistance);
        
        // 调整火箭大小（比基础子弹稍大）
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            const baseSize = UiConfig.CELL_SIZE * 0.2; // 基础子弹大小
            const rocketSize = baseSize * WeaponRocketBullet.SIZE_SCALE;
            transform.setContentSize(rocketSize, rocketSize);
            
            // 重新绘制（使用新的大小）
            const graphics = this.node.getComponent(Graphics);
            if (graphics) {
                graphics.clear();
                this.drawBullet(graphics, rocketSize);
            }
        }
        
        // 设置追踪相关属性
        this.targetNode = targetNode;
        this.enemies = enemies;
        this.lifetime = 0;
        
        // 计算初始角度
        this.angle = Math.atan2(direction.y, direction.x);
        
        // 初始化速度向量
        this.velocity = direction.clone();
        Vec3.multiplyScalar(this.velocity, this.velocity, this.speed);
        
        // 记录初始位置（用于尾迹）
        this.lastPosition = this.node.position.clone();
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
     * 更新追踪火箭
     */
    update(deltaTime: number) {
        // 更新生命周期
        this.lifetime += deltaTime;
        if (this.lifetime >= WeaponRocketBullet.MAX_LIFETIME) {
            this.node.destroy();
            return;
        }
        
        // 检查目标是否有效
        if (!this.targetNode || !this.targetNode.isValid) {
            // 寻找新目标
            this.targetNode = this.findNearestEnemy();
            if (!this.targetNode) {
                // 如果没有目标，继续按当前方向飞行
                this.updatePosition(deltaTime);
                return;
            }
        }
        
        // 检查是否到达目标
        if (this.checkCollision()) {
            this.onHitTarget();
            return;
        }
        
        // 平滑追踪目标
        this.updateHoming(deltaTime);
        
        // 更新位置
        this.updatePosition(deltaTime);
        
        // 更新旋转
        this.updateRotation();
        
        // 更新尾迹位置（在位置更新后）
        this.lastPosition = this.node.position.clone();
        
        // 重新绘制（包括尾迹）
        this.redraw();
    }
    
    /**
     * 重新绘制子弹（包括尾迹）
     */
    private redraw() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        if (!graphics || !transform) return;
        
        const size = transform.width;
        
        // 清除并重新绘制
        graphics.clear();
        
        // 绘制尾迹
        this.drawTrail(graphics, size);
        
        // 绘制火箭主体
        this.drawBullet(graphics, size);
    }
    
    /**
     * 平滑追踪目标
     */
    private updateHoming(deltaTime: number) {
        if (!this.targetNode || !this.targetNode.isValid) return;
        
        // 计算到目标的方向
        const targetPos = this.targetNode.position;
        const currentPos = this.node.position;
        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const targetAngle = Math.atan2(dy, dx);
        
        // 计算角度差（归一化到 -π 到 π）
        let angleDiff = targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        // 根据转向速度平滑转向
        const maxTurn = WeaponRocketBullet.TURN_RATE * deltaTime;
        if (Math.abs(angleDiff) > maxTurn) {
            // 如果角度差大于最大转向角度，则转向最大角度
            this.angle += Math.sign(angleDiff) * maxTurn;
        } else {
            // 否则直接转向目标角度
            this.angle = targetAngle;
        }
        
        // 根据当前角度更新速度向量
        this.velocity.x = Math.cos(this.angle) * this.speed;
        this.velocity.y = Math.sin(this.angle) * this.speed;
        
        // 更新方向向量（用于基类的旋转更新）
        this.direction.x = Math.cos(this.angle);
        this.direction.y = Math.sin(this.angle);
        this.direction.z = 0;
    }
    
    /**
     * 更新位置
     */
    private updatePosition(deltaTime: number) {
        const currentPos = this.node.position;
        const newPos = new Vec3(
            currentPos.x + this.velocity.x * deltaTime,
            currentPos.y + this.velocity.y * deltaTime,
            currentPos.z
        );
        this.node.setPosition(newPos);
        
        // 更新已飞行距离
        const moveDistance = this.speed * deltaTime;
        this.traveledDistance += moveDistance;
        
        // 检查是否超过最大距离
        if (this.traveledDistance >= this.maxDistance) {
            this.onReachMaxDistance();
        }
    }
    
    /**
     * 检查碰撞
     */
    private checkCollision(): boolean {
        if (!this.targetNode || !this.targetNode.isValid) return false;
        
        const targetPos = this.targetNode.position;
        const currentPos = this.node.position;
        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // 碰撞检测：火箭大小的一半 + 敌人大小的一半
        const transform = this.node.getComponent(UITransform);
        const rocketSize = transform ? transform.width : UiConfig.CELL_SIZE * 0.2 * WeaponRocketBullet.SIZE_SCALE;
        const collisionDist = (rocketSize / 2) + (WeaponRocketBullet.ENEMY_SIZE / 2);
        return dist < collisionDist;
    }
    
    /**
     * 击中目标
     */
    private onHitTarget() {
        if (!this.targetNode || !this.targetNode.isValid) return;
        
        // 对目标造成伤害
        const enemyComponent = this.targetNode.getComponent(EnemyBase);
        if (enemyComponent) {
            enemyComponent.takeDamage(this.damage);
        }
        
        // 销毁火箭
        this.node.destroy();
    }
    
    /**
     * 寻找最近的敌人
     */
    private findNearestEnemy(): Node | null {
        if (!this.enemies || this.enemies.length === 0) return null;
        
        let nearest: Node | null = null;
        let minDistSq = Infinity;
        const currentPos = this.node.position;
        
        for (const enemy of this.enemies) {
            if (!enemy || !enemy.isValid) continue;
            
            const enemyComponent = enemy.getComponent(EnemyBase);
            if (!enemyComponent) continue;
            
            const dx = enemy.position.x - currentPos.x;
            const dy = enemy.position.y - currentPos.y;
            const distSq = dx * dx + dy * dy; // 使用距离平方，避免sqrt
            
            if (distSq < minDistSq) {
                minDistSq = distSq;
                nearest = enemy;
            }
        }
        
        return nearest;
    }
    
    /**
     * 重写绘制方法，添加尾迹效果
     */
    protected drawBullet(graphics: Graphics, size: number) {
        // 绘制火箭主体
        WeaponRocketBulletRenderer.render(graphics, size);
    }
    
    /**
     * 在更新后绘制尾迹（需要在每帧更新时调用）
     */
    drawTrail(graphics: Graphics, size: number) {
        if (!graphics) return;
        
        // 计算上一帧位置相对于当前位置的偏移
        const dx = this.lastPosition.x - this.node.position.x;
        const dy = this.lastPosition.y - this.node.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // 如果距离足够，绘制尾迹
        if (dist > 0.1) {
            WeaponRocketBulletRenderer.renderTrail(
                graphics,
                dx,
                dy,
                0,
                0,
                size
            );
        }
    }
    
    /**
     * 获取上一帧位置（用于尾迹渲染）
     */
    getLastPosition(): Vec3 {
        return this.lastPosition.clone();
    }
}
