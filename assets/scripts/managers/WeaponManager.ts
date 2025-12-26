import { Node, UITransform } from 'cc';
import { WeaponBase } from '../weapons/Index';
import { BulletManager } from './BulletManager';
import { EnemyManager } from './EnemyManager';
import { UiConfig } from '../config/Index';

/**
 * 武器管理器
 * 管理添加到 WarView 的所有武器
 */
export class WeaponManager {
    private containerNode: Node;
    private weapons: Node[] = [];
    private weaponGridPositions: Map<Node, { gridX: number; gridY: number }> = new Map(); // 武器网格坐标映射
    private bulletManager: BulletManager | null = null;
    private enemyManager: EnemyManager | null = null;
    private selectedWeapon: Node | null = null; // 当前选中的武器

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
     * 获取敌人管理器
     * @returns 敌人管理器实例，如果未设置则返回 null
     */
    getEnemyManager(): EnemyManager | null {
        return this.enemyManager;
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
    
        // 设置武器的武器管理器引用
        const weaponComponent = weaponNode.getComponent(WeaponBase);
        if (weaponComponent) {
            weaponComponent.setWeaponManager(this);
        }
    
        this.weapons.push(weaponNode);
        
        // 计算并存储武器的网格坐标
        const weaponPos = weaponNode.position;
        const gridX = Math.floor(weaponPos.x / UiConfig.CELL_SIZE);
        const gridY = Math.floor(weaponPos.y / UiConfig.CELL_SIZE);
        this.weaponGridPositions.set(weaponNode, { gridX, gridY });
    }

    /**
     * 移除武器
     * @param weaponNode 武器节点
     */
    removeWeapon(weaponNode: Node) {
        const index = this.weapons.indexOf(weaponNode);
        if (index !== -1) {
            this.weapons.splice(index, 1);
            // 移除武器的网格坐标
            this.weaponGridPositions.delete(weaponNode);
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
                // 同时清理网格坐标
                this.weaponGridPositions.delete(weapon);
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
        this.weaponGridPositions.clear();
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
    
    /**
     * 根据屏幕坐标获取武器（用于点击检测）
     * @param localPos 本地坐标（相对于容器节点）
     * @returns 武器节点，如果没有则返回 null
     */
    getWeaponAtLocalPosition(localPos: { x: number; y: number }): Node | null {
        for (const weapon of this.weapons) {
            if (!weapon || !weapon.isValid) continue;
            
            const weaponPos = weapon.position;
            
            // 计算距离
            const dx = localPos.x - weaponPos.x;
            const dy = localPos.y - weaponPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 如果点击位置在武器范围内（使用武器大小作为点击范围）
            const clickRange = 50; // 点击范围（像素）
            if (distance <= clickRange) {
                return weapon;
            }
        }
        return null;
    }
    
    /**
     * 选中武器
     * @param weaponNode 武器节点
     */
    selectWeapon(weaponNode: Node | null) {
        // 取消之前选中武器的按钮显示
        if (this.selectedWeapon && this.selectedWeapon.isValid) {
            const prevWeaponComponent = this.selectedWeapon.getComponent(WeaponBase);
            if (prevWeaponComponent) {
                prevWeaponComponent.setSelected(false);
            }
        }
        
        // 设置新的选中武器
        this.selectedWeapon = weaponNode;
        
        // 显示新选中武器的按钮
        if (this.selectedWeapon && this.selectedWeapon.isValid) {
            const weaponComponent = this.selectedWeapon.getComponent(WeaponBase);
            if (weaponComponent) {
                weaponComponent.setSelected(true);
            }
        }
    }
    
    /**
     * 取消选中武器
     */
    deselectWeapon() {
        this.selectWeapon(null);
    }
    
    /**
     * 获取当前选中的武器
     */
    getSelectedWeapon(): Node | null {
        return this.selectedWeapon;
    }
    
    /**
     * 获取所有武器的网格坐标集合（用于寻路）
     * @returns 网格坐标集合，格式为 Set<string>，每个字符串为 "gridX,gridY"
     */
    getWeaponGridPositions(): Set<string> {
        const gridSet = new Set<string>();
        
        // 清理无效的武器引用
        for (const [weapon, gridPos] of this.weaponGridPositions.entries()) {
            if (!weapon || !weapon.isValid) {
                this.weaponGridPositions.delete(weapon);
                continue;
            }
            gridSet.add(`${gridPos.gridX},${gridPos.gridY}`);
        }
        
        return gridSet;
    }
}

