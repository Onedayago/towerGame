import { UiConfig } from '../config/Index';
import { ObstacleManager } from '../managers/ObstacleManager';
import { WeaponManager } from '../managers/WeaponManager';
import { UITransform } from 'cc';

/**
 * PathFinder 工具方法
 * 提供坐标转换和可通行性检查
 */
export class PathFinderUtils {
    private obstacleManager: ObstacleManager | null = null;
    private weaponManager: WeaponManager | null = null;
    private containerWidth: number = 0;
    private containerHeight: number = 0;
    private cellSize: number = UiConfig.CELL_SIZE;

    /**
     * 初始化工具
     */
    init(obstacleManager: ObstacleManager, containerWidth: number, containerHeight: number, weaponManager?: WeaponManager) {
        this.obstacleManager = obstacleManager;
        this.weaponManager = weaponManager || null;
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
    }
    
    /**
     * 设置武器管理器
     */
    setWeaponManager(weaponManager: WeaponManager) {
        this.weaponManager = weaponManager;
    }

    /**
     * 将世界坐标转换为网格坐标
     * @param worldX 世界X坐标
     * @param worldY 世界Y坐标
     * @returns 网格坐标 {x, y}
     */
    worldToGrid(worldX: number, worldY: number): { x: number; y: number } {
        return {
            x: Math.floor(worldX / this.cellSize),
            y: Math.floor(worldY / this.cellSize)
        };
    }

    /**
     * 将网格坐标转换为世界坐标（格子中心）
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 世界坐标 {x, y}（格子中心）
     */
    gridToWorld(gridX: number, gridY: number): { x: number; y: number } {
        return {
            x: gridX * this.cellSize + this.cellSize / 2,
            y: gridY * this.cellSize + this.cellSize / 2
        };
    }

    /**
     * 检查网格坐标是否在边界内
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否在边界内
     */
    isValidGrid(gridX: number, gridY: number): boolean {
        const maxGridX = Math.floor(this.containerWidth / this.cellSize);
        const maxGridY = Math.floor(this.containerHeight / this.cellSize);
        return gridX >= 0 && gridX < maxGridX && gridY >= 0 && gridY < maxGridY;
    }

    /**
     * 检查是否已初始化
     */
    isInitialized(): boolean {
        return this.obstacleManager !== null;
    }

    /**
     * 检查网格位置是否有障碍物（包括障碍物和武器）
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否有障碍物
     */
    private hasObstacle(gridX: number, gridY: number): boolean {
        // 使用格子左下角坐标检查障碍物
        const checkX = gridX * this.cellSize;
        const checkY = gridY * this.cellSize;
        
        // 检查是否有障碍物
        if (this.obstacleManager && this.obstacleManager.hasObstacleAt(checkX, checkY)) {
            return true;
        }
        
        // 检查是否有武器（武器也是障碍物）
        // 使用存储的网格坐标进行快速查找
        if (this.weaponManager) {
            const weaponGridPositions = this.weaponManager.getWeaponGridPositions();
            const gridKey = `${gridX},${gridY}`;
            if (weaponGridPositions.has(gridKey)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 检查网格位置是否可通行
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否可通行
     */
    isWalkable(gridX: number, gridY: number): boolean {
        if (!this.isValidGrid(gridX, gridY)) {
            return false;
        }
        return !this.hasObstacle(gridX, gridY);
    }

    /**
     * 公开方法：检查网格位置是否可通行（供外部调用）
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否可通行
     */
    isWalkablePublic(gridX: number, gridY: number): boolean {
        return this.isWalkable(gridX, gridY);
    }
}

