import { Node, UITransform } from 'cc';
import { WeaponBase } from '../weapons/Index';
import { BulletManager } from './BulletManager';
import { EnemyManager } from './EnemyManager';

/**
 * 武器管理器
 * 管理添加到 WarView 的所有武器
 */
export class WeaponManager {
    private containerNode: Node;
    private weapons: Node[] = [];
    private bulletManager: BulletManager | null = null;
    private enemyManager: EnemyManager | null = null;

    constructor(containerNode: Node) {
        this.containerNode = containerNode;
    }
    
    /**
     * 设置子弹管理器
     * @param bulletManager 子弹管理器
     */
    setBulletManager(bulletManager: BulletManager) {
        this.bulletManager = bulletManager;
    }
    
    /**
     * 设置敌人管理器
     * @param enemyManager 敌人管理器
     */
    setEnemyManager(enemyManager: EnemyManager) {
        this.enemyManager = enemyManager;
    }

    /**
     * 添加武器
     * @param weaponNode 武器节点
     */
    addWeapon(weaponNode: Node) {
        if (!weaponNode || !weaponNode.isValid) return;
        
        // 确保武器节点是容器的子节点
        if (weaponNode.parent !== this.containerNode) {
            weaponNode.setParent(this.containerNode);
        }
    
        this.weapons.push(weaponNode);
    }

    /**
     * 移除武器
     * @param weaponNode 武器节点
     */
    removeWeapon(weaponNode: Node) {
        const index = this.weapons.indexOf(weaponNode);
        if (index !== -1) {
            this.weapons.splice(index, 1);
        }
    }

    /**
     * 更新所有武器
     * @param deltaTime 帧时间
     */
    update(deltaTime: number) {
        // 获取所有敌人
        const enemies = this.enemyManager ? this.enemyManager.getAllEnemies() : [];
        
        for (let i = this.weapons.length - 1; i >= 0; i--) {
            const weapon = this.weapons[i];
            
            // 检查武器节点是否有效
            if (!weapon || !weapon.isValid) {
                this.weapons.splice(i, 1);
                continue;
            }

            // 更新武器的攻击逻辑
            const weaponComponent = weapon.getComponent(WeaponBase);
            if (weaponComponent) {
                weaponComponent.updateAttack(deltaTime, enemies, this.bulletManager);
            }
        }
    }

    /**
     * 清理所有武器
     */
    clearAll() {
        this.weapons.forEach(weapon => {
            if (weapon && weapon.isValid) {
                weapon.destroy();
            }
        });
        this.weapons = [];
    }

    /**
     * 获取武器数量
     */
    getWeaponCount(): number {
        return this.weapons.length;
    }

    /**
     * 获取所有武器节点
     */
    getAllWeapons(): Node[] {
        return this.weapons.slice(); // 返回副本，避免外部修改
    }

    /**
     * 根据位置获取武器
     * @param x X坐标（网格对齐后的位置）
     * @param y Y坐标（网格对齐后的位置）
     * @returns 武器节点，如果没有则返回 null
     */
    getWeaponAtPosition(x: number, y: number): Node | null {
        // 由于武器是对齐到网格的，直接比较位置是否相同（允许小的误差）
        const epsilon = 0.1; // 允许的误差范围
        
        for (const weapon of this.weapons) {
            if (!weapon || !weapon.isValid) continue;
            
            const weaponPos = weapon.position;
            
            // 检查位置是否相同（考虑浮点数误差）
            if (Math.abs(weaponPos.x - x) < epsilon && Math.abs(weaponPos.y - y) < epsilon) {
                return weapon;
            }
        }
        return null;
    }
}

