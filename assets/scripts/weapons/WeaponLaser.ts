import { _decorator, Graphics, Node, Vec3, instantiate } from 'cc';
import { WeaponBase } from './WeaponBase';
import { WeaponType } from '../constants/Index';
import { WeaponLaserRenderer } from '../renderers/Index';
import { WeaponLaserBullet } from '../bullets/Index';
const { ccclass } = _decorator;

/**
 * 激光武器
 * 高频率攻击，中等伤害
 * 参考原游戏：发射持续存在的激光束，而不是移动的子弹
 */
@ccclass('WeaponLaser')
export class WeaponLaser extends WeaponBase {
    
    start() {
        this.init(WeaponType.LASER);
    }
    
    /**
     * 绘制激光武器外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(width: number, height: number) {
        if (!this.appearanceNode) return;
        
        const graphics = this.appearanceNode.getComponent(Graphics);
        if (!graphics) return;
        
        // 如果在卡片容器中，跳过阴影绘制
        const skipShadow = this.isInCardContainer();
        WeaponLaserRenderer.render(graphics, width, height, skipShadow);
    }
    
    /**
     * 重写执行攻击方法
     * 激光武器发射持续存在的激光束，而不是移动的子弹
     * @param targetEnemy 目标敌人
     */
    protected performAttack(targetEnemy: Node | null = null) {
        if (!targetEnemy || !this.bulletManager || !this.bulletPrefab || !this.config) {
            return;
        }
        
        // 创建激光束实例
        const beamNode = instantiate(this.bulletPrefab);
        if (!beamNode) return;
        
        // 获取武器中心位置（武器锚点为中心）
        const weaponPos = this.node.position;
        const startPos = new Vec3(weaponPos.x, weaponPos.y, 0);
        
        // 获取敌人中心位置（敌人锚点为中心）
        const enemyPos = targetEnemy.position;
        const endPos = new Vec3(enemyPos.x, enemyPos.y, 0);
        
        // 设置激光束节点位置（设置为起始位置）
        beamNode.setPosition(startPos);
        
        // 初始化激光束（使用 WeaponLaserBullet 的特殊初始化方法）
        const beamComponent = beamNode.getComponent(WeaponLaserBullet);
        if (beamComponent) {
            beamComponent.initBeam(this.config.damage, startPos, endPos, targetEnemy);
        }
        
        // 添加到子弹管理器（激光束也由子弹管理器管理）
        this.bulletManager.addBullet(beamNode);
    }
}

