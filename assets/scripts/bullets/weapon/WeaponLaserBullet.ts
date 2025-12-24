import { _decorator, Color, Graphics, Vec3, Node, UITransform } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
import { WeaponLaserBulletRenderer } from '../../renderers/Index';
import { EnemyBase } from '../../enemys/Index';
import { GameManager } from '../../managers/GameManager';
const { ccclass } = _decorator;

/**
 * 激光武器子弹（激光束）
 * 参考原游戏：激光束是持续存在的线段，从武器位置延伸到目标位置
 * 不是移动的子弹，而是即时到达的持续光束
 */
@ccclass('WeaponLaserBullet')
export class WeaponLaserBullet extends BulletBase {
    
    // 激光束持续时间（秒）
    private static readonly BEAM_DURATION = 0.15; // 150ms，参考原游戏
    
    private startPos: Vec3 = new Vec3(); // 起始位置（武器位置）
    private endPos: Vec3 = new Vec3();    // 结束位置（目标位置）
    private targetNode: Node | null = null; // 目标节点（用于跟踪）
    private duration: number = 0;          // 剩余持续时间
    private hasDealtDamage: boolean = false; // 是否已造成伤害
    
    /**
     * 初始化激光束
     * @param damage 伤害值
     * @param startPos 起始位置（武器位置）
     * @param endPos 结束位置（目标位置）
     * @param targetNode 目标节点（可选，用于跟踪目标移动）
     */
    initBeam(damage: number, startPos: Vec3, endPos: Vec3, targetNode: Node | null = null) {
        // 使用基类的 damage 属性
        this.damage = damage;
        this.startPos = startPos.clone();
        this.endPos = endPos.clone();
        this.targetNode = targetNode;
        this.duration = WeaponLaserBullet.BEAM_DURATION;
        this.hasDealtDamage = false;
        
        // 设置节点位置为起始位置
        this.node.setPosition(startPos);
        
        // 初始化节点大小和外观
        this.initBeamNode();
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
     * 初始化激光束节点
     */
    private initBeamNode() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        if (!graphics || !transform) return;
        
        transform.setAnchorPoint(0.5, 0.5);
        
        // 计算激光束长度
        const dx = this.endPos.x - this.startPos.x;
        const dy = this.endPos.y - this.startPos.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // 设置节点大小（以容纳整个激光束）
        const size = Math.max(length, 50); // 至少50像素
        transform.setContentSize(size, size);
    }
    
    /**
     * 更新激光束
     * 激光束不需要移动，只需要更新持续时间和跟踪目标
     */
    update(deltaTime: number) {
        // 检查游戏状态，如果游戏未开始或已暂停，不更新激光束
        const gameManager = GameManager.getInstance();
        if (!gameManager.canUpdate()) {
            return;
        }
        
        // 更新持续时间
        this.duration -= deltaTime;
        
        // 如果持续时间结束，销毁激光束
        if (this.duration <= 0) {
            this.node.destroy();
            return;
        }
        
        // 如果目标节点存在且有效，更新结束位置（跟踪目标）
        if (this.targetNode && this.targetNode.isValid) {
            const targetPos = this.targetNode.position;
            this.endPos = targetPos.clone();
        }
        
        // 在首次更新时造成伤害（只造成一次伤害）
        if (!this.hasDealtDamage && this.targetNode && this.targetNode.isValid) {
            this.dealDamage();
            this.hasDealtDamage = true;
        }
        
        // 重新绘制激光束（因为位置可能变化）
        this.drawBeam();
    }
    
    /**
     * 造成伤害
     */
    private dealDamage() {
        if (!this.targetNode || !this.targetNode.isValid) return;
        
        // 获取敌人的 EnemyBase 组件并造成伤害
        const enemyComponent = this.targetNode.getComponent(EnemyBase);
        if (enemyComponent) {
            enemyComponent.takeDamage(this.damage);
        }
    }
    
    /**
     * 绘制激光束
     */
    private drawBeam() {
        const graphics = this.node.getComponent(Graphics);
        if (!graphics) return;
        
        // 计算从起始位置到结束位置的向量
        const dx = this.endPos.x - this.startPos.x;
        const dy = this.endPos.y - this.startPos.y;
        
        // 使用渲染器绘制激光束
        WeaponLaserBulletRenderer.renderBeam(
            graphics,
            this.startPos.x - this.node.position.x,
            this.startPos.y - this.node.position.y,
            this.endPos.x - this.node.position.x,
            this.endPos.y - this.node.position.y
        );
    }
    
    /**
     * 重写基类的 init 方法（激光束不使用这个方法）
     * 激光束使用 initBeam 方法初始化
     */
    init(damage: number, direction: Vec3, maxDistance: number = 0) {
        // 激光束不使用基类的 init 方法
        // 使用 initBeam 方法代替
        console.warn('WeaponLaserBullet should use initBeam() instead of init()');
    }
    
    /**
     * 获取伤害值
     */
    getDamage(): number {
        return this.damage;
    }
    
    /**
     * 获取起始位置
     */
    getStartPos(): Vec3 {
        return this.startPos.clone();
    }
    
    /**
     * 获取结束位置
     */
    getEndPos(): Vec3 {
        return this.endPos.clone();
    }
}
