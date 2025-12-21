import { Node, UITransform } from 'cc';
import { WeaponBase } from '../weapons/Index';

/**
 * 武器管理器
 * 管理添加到 WarView 的所有武器
 */
export class WeaponManager {
    private containerNode: Node;
    private weapons: Node[] = [];

    constructor(containerNode: Node) {
        this.containerNode = containerNode;
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
                weaponComponent.updateAttack(deltaTime);
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
     * @param x X坐标
     * @param y Y坐标
     * @returns 武器节点，如果没有则返回 null
     */
    getWeaponAtPosition(x: number, y: number): Node | null {
        for (const weapon of this.weapons) {
            if (!weapon || !weapon.isValid) continue;
            
            const transform = weapon.getComponent(UITransform);
            if (!transform) continue;
            
            const weaponPos = weapon.position;
            const weaponWidth = transform.width;
            const weaponHeight = transform.height;
            
            // 检查位置是否在武器范围内（考虑锚点）
            const anchorPoint = transform.anchorPoint;
            const left = weaponPos.x - anchorPoint.x * weaponWidth;
            const right = weaponPos.x + (1 - anchorPoint.x) * weaponWidth;
            const bottom = weaponPos.y - anchorPoint.y * weaponHeight;
            const top = weaponPos.y + (1 - anchorPoint.y) * weaponHeight;
            
            if (x >= left && x <= right && y >= bottom && y <= top) {
                return weapon;
            }
        }
        return null;
    }
}

